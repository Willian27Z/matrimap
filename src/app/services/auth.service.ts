import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
//import {  }

import { User } from '../models/user.model';    //The model to store the information
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

//The expected response format from the server when authenticating a user
export interface AuthResponseData {
    success: boolean,
    message: string,
    type: string,
    token: string,
    expiresIn: number,
    id: string,
    username: string,
    email: string,
    admin: boolean
}

// This makes the service available globally in the application
@Injectable({providedIn:"root"})

export class AuthService {

    // This will allow for components to subscribe to the user(the subject) when there's a change
    // Whenever we have a new user (login/signUp), we need to "next" this user
    currentUser = new BehaviorSubject<User>(null);
    private logoutTimer: any;
    private userID: string;
    private username: string;
    private admin: boolean;

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private storage: StorageService,
        private notification: NotificationService
    ){}

    // For signin-up
    signup(newUser: any){
        // Send http request here
        return this.http.post<AuthResponseData>(environment.API + "/user/register", newUser)
        .pipe(tap(resData => {
            //console.log(resData);
            if(resData.success){
                this.handleAuthentication(resData.email, resData.username, resData.id, resData.admin, resData.token, resData.expiresIn);
            }
            this.notification.pushNotification({message: resData.message, type: resData.type})
        }));
    }

    // For login-in
    login(email: string, password: string){
        const httpOptions = {
            headers: new HttpHeaders({
                "content-type": "application/json"
            })
        };

        // Send http request here
        return this.http.post<AuthResponseData>(environment.API + "/user/login", {email: email, password: password}, httpOptions)
        .pipe(tap(resData => {
            if(resData.success){
                this.handleAuthentication(resData.email, resData.username, resData.id, resData.admin, resData.token, resData.expiresIn);
            }
            this.notification.pushNotification({message: resData.message, type: resData.type})
        }));
    }

    // Checks at app loading if the user has a valid token in local storage to log in
    async autoLogin() {
        // retrieving data
        const userData: {
            email: string,
            id: string,
            username: string,
            admin: boolean,
            _token: string,
            _expiresIn: string
        } = JSON.parse(localStorage.getItem("userData"));
        if(!userData) {
            return;
        }
        
        // creating new User
        const loadedUser = new User(userData.email, userData.id, userData.username, userData.admin, userData._token, new Date(userData._expiresIn));

        // Check if valid token
        if(loadedUser.token){
            this.currentUser.next(loadedUser);
            const expirationDuration = new Date(userData._expiresIn).getTime() - new Date().getTime();
            this.autoLougout(expirationDuration);
            
            // Applying to local variable for easy access
            this.userID = loadedUser.id;
            this.username = loadedUser.username;
            this.admin = loadedUser.admin;

            // check if admin
            this.http.get<{admin: boolean}>(environment.API + "/user/admin/" + loadedUser.id).subscribe(resData => {
                console.log("Is user admin? : " + resData.admin);
                loadedUser.admin = resData.admin
                localStorage.setItem("userData", JSON.stringify(loadedUser));
                this.currentUser.next(loadedUser);
            })
            
            if(this.route.snapshot.url.find(element => element.path === "connexion" || element.path === "inscription")){
                this.router.navigate(["/monspace"]);
            }
        }
    }

    logout(){
        this.router.navigate(["/connexion"]);
        this.currentUser.next(null);
        localStorage.removeItem("userData");
        this.storage.clearAllInfo();
        if(this.logoutTimer){
            clearTimeout(this.logoutTimer);
        }
        this.notification.pushNotification({message: "Vous êtes deconnecté(e). A bientôt!", type: "success"});
    }

    autoLougout(timeToExpiration: number){
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, timeToExpiration);
        this.notification.pushNotification({message: "Votre session a expiré, veuillez vous connecter à nouveau", type: "warning"});
    }

    private handleAuthentication (email: string, username: string, id: string, admin: boolean, token: string, expiration: number){
        // setting up token expiration date
        const expirationDate = new Date(new Date().getTime() + expiration * 1000);
        // Storing user data using model
        const newUser = new User(email, id, username, admin, token, expirationDate);
        // Applying user data - Subscriptions will react to this change
        this.currentUser.next(newUser);
        // Saving user to local storage so browser will remember user
        localStorage.setItem("userData", JSON.stringify(newUser));
        // Applying to local variable for easy access
        this.userID = id;
        this.username = username;
        this.admin = admin;
        // start autologout counter
        this.autoLougout(expiration * 1000);
        this.router.navigate(["/monspace"]);
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = "Unknown error occurred! Oh no!";
        console.log(errorRes.status);
        console.log(errorRes.message);
    }

    getUserID(){
        return this.userID;
    }

    isAdmin(){
        return this.admin;
    }
}