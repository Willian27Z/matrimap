import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { BehaviorSubject } from 'rxjs';
import { Profile } from '../models/profile.model';
import { Discussion } from '../models/discussion.model';
import { Friends } from '../models/friends.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /******************************* */
  // MY INFORMATION
  /******************************** */
  // Scrapbook Messages state
  myMessages = new BehaviorSubject<Message[]>(null);
  
  // Friends list state
  myFriends = new BehaviorSubject<Friends[]>(null);
  
  // Friends activity state (how will backend respond?)
  friendsActivity = [];

  // Discussions list state
  discussions = new BehaviorSubject<Discussion[]>(null);

  // Messages from current discussion
  discussionMessages = new BehaviorSubject<{
    author: string, 
    message: string,
    date: Date,     
    seenBy: string[]
  }[]>([]);

  /******************************* */
  // FOR OTHER USERS
  /******************************** */
  // User in view
  userView = new BehaviorSubject<Profile>(null);

  // Scrapbook Messages state
  messages = new BehaviorSubject<Message[]>(null);

  // Friends list state
  friends = new BehaviorSubject<Friends[]>(null);

  // Their activity
  activity = [];

  constructor() { }

  clearAllInfo() {
    this.myMessages.next(null);
    this.myFriends.next(null);
    //this.friendsActivity.next(null);
    this.discussions.next(null);
    this.discussionMessages.next(null);

    this.userView.next(null);
    this.messages.next(null);
    this.friends.next(null);
    //this.activity.next(null);
  }

  restartScrapbook(){
    this.userView.next(null);
    this.messages.next(null);
    this.friends.next(null);
  }
}
