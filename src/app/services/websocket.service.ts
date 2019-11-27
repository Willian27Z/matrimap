import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as socketIo from 'socket.io-client';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ChatMessage } from '../models/chatMessage.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private notification: NotificationService) {}

  private socket;
  // public chatRoom = new BehaviorSubject<string>(null);
  public invitation = new BehaviorSubject<{id: string, username: string}>(null);
  public waiting = new BehaviorSubject<{id: string, username: string}>(null);
  public inContact = new BehaviorSubject<{id: string, username: string}>(null);
  public currentMessages = new BehaviorSubject<ChatMessage[]>(null);
  public liveStats = new BehaviorSubject<{messages: number, onlineUsers: number}>(null);
  private messages = [];
  private user$: Subscription;
  private myUsername: string;
  private myId: string

  public getChatRoom(){
    // return this.chatRoom;
  }

  public initSocket(/*id: string, username: string*/): void {
    this.socket = socketIo(environment.API);
    // this.socket.on('chatRoomEntered', (data: any) => {
    //   this.chatRoom.next(data);
    //   this.notification.pushNotification({message: "Quelqu'un vous a invité à chatter", type:"neutral"});
    // });

    this.socket.on('stats', data => {this.liveStats.next(data)});

    this.socket.on('chat-invitation', (data: {id: string, username: string}) => {
      this.invitation.next(data);
      this.notification.pushNotification({message: data.username + " vous a invité à chatter", type:"neutral"});
    });

    this.socket.on('in-contact', (data: {id: string, username: string}) => {
      this.inContact.next(data);
      this.notification.pushNotification({message: "Connecté à " + data.username, type:"success"});
    });

    this.socket.on('chat-message', (data: ChatMessage) => {
      this.messages.unshift(data);
      this.currentMessages.next(this.messages);
    });

    this.socket.on('close-contact', (data) => {
      this.invitation.next(null);
      this.waiting.next(null);
      this.currentMessages.next(null);
      this.messages = [];
      this.inContact.next(null);
      this.notification.pushNotification({message: "Déconnecté du chat!", type:"success"});
    })

    this.socket.on('user-busy', ()=> {
      this.notification.pushNotification({message: "Votre amis est occupé", type:"error"});
    })

    // this.myId = id;
    // this.myUsername = username;
  }

  public send(message: string): void {
    this.socket.emit('chat-message', {
      //roomID: roomID,
      author: {id: this.myId, username: this.myUsername},
      message: message,
      date: new Date()
    });
  }

  public identify(id: string, username: string, email: string){
    this.socket.emit('identify', {id: id, username: username, email: email});
    this.myId = id;
    this.myUsername = username;
  }

  public checkFriend(id: string){
    this.socket.emit('check-friend', {id: id});
  }

  public inviteChat(user){
    // this.socket.emit('start-chat', {userA: this.myId, userB: user.userID});
    this.socket.emit('invite-chat', {userA: this.myId, userB: user.userID});
    // console.log("invitation envoyé à:");
    // console.log({id: user.userID, username: user.pseudo});
    this.waiting.next({id: user.userID, username: user.pseudo});
  }

  public joinChat(user){
    //this.socket.emit('join-chat', data);
    this.socket.emit('accept-chat', {userA: this.myId, userB: user.userID});
  }

  public onMessage(): Observable<ChatMessage> {
    return new Observable<ChatMessage>(observer => {
        this.socket.on('chat-message', (data: ChatMessage) => observer.next(data));
    });
  }

  public onEvent(event: string): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on(event, (data:any) => observer.next(data));
    });
  }

  public endChat(){
    this.socket.emit("end-chat", this.myId);
  }

  public disconnect(){
    this.user$.unsubscribe();
    this.socket.close();
  }
}
