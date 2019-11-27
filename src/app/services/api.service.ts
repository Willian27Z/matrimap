import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { StorageService } from './storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Profile } from '../models/profile.model';
import { Friends } from '../models/friends.model';
import { AuthService } from './auth.service';
import { NotificationService, Notification } from './notification.service';
import { MyProfile } from '../models/myProfile.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private storageService: StorageService, 
    private http: HttpClient, 
    private authService: AuthService,
    private notificationService: NotificationService  
  ) { }

  // will GET all received messages in scrapbook from this user
  getMessages() {
    console.log("Requesting GET /api/messages for Monspace");
    this.http.get<Message[]>(environment.API + "/api/messages").subscribe(resData => {
      resData.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      console.log(resData);

      // will store messages with storage service
      this.storageService.myMessages.next(resData) // response from server
    }, error => {
      console.log(error);
    });
  }

  // will POST this message to the recipient's document in database (check if friend of author on backend, change stats)
  postMessage(message: any, scrapbook:boolean) {
    this.http.post<Notification>(environment.API + "/api/messages", message).subscribe(resData => {
      console.log("new message posted:");
      console.log(resData);
      //get current messages
      if(scrapbook){
        console.log("updating scrapbook")
        this.storageService.messages.next(null);
        this.getMemberScrapbook(message.recipient);
      } else {
        console.log("updating monspace")
        this.storageService.myMessages.next(null);
        this.getMessages();
      }
      this.notificationService.pushNotification(resData);
    }, error => {
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  postComment(body: any, scrapbook: boolean) {
    console.log("sending body:");
    console.log(body);
    this.http.post<Notification>(environment.API + "/api/messages/comment", body).subscribe(resData => {
      console.log("comment sent");
      // console.log(resData)
      if(scrapbook){
        this.storageService.messages.next(null);
        this.getMemberScrapbook(body.recipient);
      } else {
        this.storageService.myMessages.next(null);
        this.getMessages();
      }
      this.notificationService.pushNotification(resData);
    }, error => {
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  // will PATCH and existant message (check if author or recipient and change date as well)
  // updateMessage(message: Message) {
  // }

  // will DELETE an existant message from database (check if author or recipient)
  deleteMessage(message: Message, scrapbook:boolean) {
    this.http.post<Notification>(environment.API + "/api/messages/delete", message).subscribe(resData => {
      console.log("message deleted");
      //console.log(resData);
      if(scrapbook){
        this.getMemberScrapbook(message.recipient);
      } else {
        this.getMessages();
      }
      this.notificationService.pushNotification(resData);
    }, error => {
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  // Will GET profile info for the user
  getProfile(userID: string){
    console.log("Requesting GET /api/profile/" + userID);
    this.http.get<Profile>(environment.API + "/api/profile/" + userID).subscribe(resData => {
      console.log(resData);
      // will store user profile with storage service
      this.storageService.userView.next(resData)
    });
  }

  // Will GET My profile info for the user
  getMyProfile(){
    console.log("Requesting GET /api/profile");
    this.http.get<MyProfile>(environment.API + "/api/profile").subscribe(resData => {
      console.log("got my profile:");
      console.log(resData);
      // will store user profile with storage service
      this.storageService.myProfile.next(resData)
    });
  }

  updateProfile(profile){
    console.log("Requesting POST /api/profile");
    this.http.post<Notification>(environment.API + "/api/profile", profile).subscribe(resData => {
      
      this.notificationService.pushNotification(resData);
    }, err => {
      this.notificationService.pushNotification({message: "Un erreur s'est produit. Profil non actualisé", type: "error"});
    });
  }
  updatePrefs(prefs){
    console.log("Requesting POST /api/profile");
    this.http.post<Notification>(environment.API + "/api/prefs", prefs).subscribe(resData => {
      
      this.notificationService.pushNotification(resData);
    }, err => {
      this.notificationService.pushNotification({message: "Un erreur s'est produit. Préférences non actualisés", type: "error"});
    });
  }

  getRecommandations(id:string){
    return this.http.get(environment.API + "/api/recommend/" + id)
  }

  saveRecommends(body){
    console.log("Requesting POST /api/profile");
    console.log(body);
    this.http.post<Notification>(environment.API + "/api/recommend", body).subscribe(resData => {
      
      this.notificationService.pushNotification(resData);
    }, err => {
      console.log(err);
      this.notificationService.pushNotification({message: "Un erreur s'est produit. Préférences non actualisés", type: "error"});
    });
  }

  // Will GET the user's received messages
  getMemberScrapbook(userID: string){
    console.log("Requesting GET /api/messages/" + userID);
    this.http.get<Message[]>(environment.API + "/api/messages/" + userID).subscribe(resData => {
      resData.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      console.log(resData);
      
      // will store messages with storage service
      this.storageService.messages.next(resData)
    });
  }

  // Will GET the user's friend list
  getMyFriends(){
    const userID = this.authService.getUserID();
    console.log("Requesting GET /api/friends/" + userID);
    this.http.get<Friends[]>(environment.API + "/api/friends/" + userID).subscribe(resData => {
      console.log(resData);

      // will store friends with storage service
      this.storageService.myFriends.next(resData)
    });
  }

  // Will GET the user's friend list
  getFriends(userID: string){
    this.storageService.friends.next(null);
    console.log("Requesting GET /api/friends/" + userID);
    this.http.get<Friends[]>(environment.API + "/api/friends/" + userID).subscribe(resData => {
      console.log(resData);

      // will store friends with storage service
      this.storageService.friends.next(resData)
    });
  }

  inviteFriend(userID: string, from: string) {
    console.log("requesting GET /api/friends/invite/" + userID);
    this.http.get<Notification>(environment.API + "/api/friends/invite/" + userID).subscribe(resData => {
      console.log("message retrieved from friend invitation request:");
      console.log(resData);

      if(from === "scrapbook"){
        // will refresh profile
        this.storageService.userView.next(null);
        this.getProfile(userID);
      }
      if(from === "friends"){
        // will refresh friends
        this.storageService.myFriends.next(null);
        this.getMyFriends();
      }
      // send notification
      this.notificationService.pushNotification(resData);
      //this.getFriends(this.authService.getUserID());1
    }, error => {
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  acceptFriend(userID: string, from: string) {
    console.log("requesting GET /api/friends/accept/" + userID);
    this.http.get<Notification>(environment.API + "/api/friends/accept/" + userID).subscribe(resData => {
      console.log("message retrieved from friend acceptation request:");
      console.log(resData);

      if(from === "scrapbook"){
        // will refresh profile
        this.storageService.userView.next(null);
        this.getProfile(userID);
      }
      if(from === "friends"){
        // will refresh friends
        this.storageService.myFriends.next(null);
        this.getFriends(this.authService.getUserID());
      }
      // send notification
      this.notificationService.pushNotification(resData);
    }, error => {
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  unfriend(userID: string) {
    console.log("requesting GET /api/friends/unfriend/" + userID);
    this.http.get<Notification>(environment.API + "/api/friends/unfriend/" + userID).subscribe(resData => {
      console.log("message retrieved from unfriend request:");
      console.log(resData);

      // will refresh friends list
      this.storageService.myFriends.next(null);
      this.getFriends(this.authService.getUserID());
      // notify result
      this.notificationService.pushNotification(resData);
    }, error => {
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  recommendFriend(userID1: string, userID2: string){
    console.log("requesting GET /api/friends/recommend");
    console.log("member recommended: " + userID1);
    console.log("recommended to: " + userID2);
    // let params = new HttpParams();
    // params.set("recommend", userID1);
    // params.set("to", userID2);

    let params: any = {
      recommend: userID1,
      to: userID2
    }

    this.http.get<Notification>(environment.API + "/api/friends/recommend", {params: params}).subscribe(resData => {
      console.log("message retrieved from recommendation request:");
      console.log(resData);

      // will store friends with storage service
      // this.getFriends(this.authService.getUserID());
      // notify result
      this.notificationService.pushNotification(resData);
    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  ignoreRequest(userID: string){
    console.log("requesting GET /api/friends/ignore");

    this.http.get<Notification>(environment.API + "/api/friends/ignore/" + userID).subscribe(resData => {
      console.log("message retrieved from recommendation request:");
      console.log(resData);

      // will store friends with storage service
      this.storageService.myFriends.next(null);
      this.getMyFriends();
      // notify result
      this.notificationService.pushNotification(resData);
    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  getDiscussions(){
    console.log("requesting GET /api/discussions");

    this.http.get<any>(environment.API + "/api/discussions").subscribe(resData => {
      console.log("Reponse from discussion request:");
      console.log(resData);

      // will store discussion with storage service
      this.storageService.discussions.next(resData);
      
    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }
  
  newDiscussion(discussion: any){
    console.log("requesting POST /api/discussions");

    this.http.post<Notification>(environment.API + "/api/discussions", discussion).subscribe(resData => {
      
      // Display notification
      this.notificationService.pushNotification(resData);
      // refresh discussions
      this.storageService.discussions.next(null);
      this.getDiscussions();

    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  deleteDiscussion(id: string){
    console.log("requesting DELETE /api/discussions/" + id);

    this.http.delete<Notification>(environment.API + "/api/discussions/" + id).subscribe(resData => {
      
      // Display notification
      this.notificationService.pushNotification(resData);
      // refresh discussions
      this.storageService.discussions.next(null);
      this.getDiscussions();

    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  postToDiscussion(message: any, id: string){
    console.log("requesting POST /api/discussions/" + id);

    this.http.post<Notification>(environment.API + "/api/discussions/" + id, message).subscribe(resData => {
      
      // Display notification
      this.notificationService.pushNotification(resData);
      // refresh discussions
      this.storageService.discussions.next(null);
      this.getDiscussions();

    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  deleteMessageFromDiscussion(message: any, id: string){
    console.log("requesting POST /api/discussions/delete/" + id);

    this.http.post<Notification>(environment.API + "/api/discussions/delete/" + id, message).subscribe(resData => {
      
      // Display notification
      this.notificationService.pushNotification(resData);
      // refresh discussions
      this.storageService.discussions.next(null);
      this.getDiscussions();

    }, error => {
      console.log(error);
      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }
  
  lostPassword(email: string){

    this.http.get<Notification>(environment.API + "/user/lostpassword", {params: {email: email}}).subscribe(resData => {

      this.notificationService.pushNotification(resData);
    }, error => {

      this.notificationService.pushNotification({message: "Une erreur s'est produit", type:"error"});
    });
  }

  searchMember(name: string){
    console.log("search request for " + name);
    return this.http.get(environment.API + "/api/search", {params: {name: name}});
  }
}
