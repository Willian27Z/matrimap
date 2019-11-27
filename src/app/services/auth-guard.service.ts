import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.authService.currentUser.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;  // transforms truish in true and falsich in false
                if(isAuth){
                    return true;
                }

                return this.router.createUrlTree(["/connexion"]);
            })
        )
    }

}

@Injectable({providedIn: "root"})
export class NonAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.authService.currentUser.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;  // transforms truish in true and falsich in false
                if(isAuth){
                    return this.router.createUrlTree(["/monspace"]);
                }
                return true;

            })
        )
    }

}