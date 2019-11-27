import { Component, OnInit, OnDestroy, Inject, ViewChild, NgZone } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { StorageService } from 'src/app/services/storage.service';
import { Message } from 'src/app/models/message.model';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Friends } from 'src/app/models/friends.model';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDialog, CommentDialog } from 'src/app/partials/dialogs/dialogs.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { IOEvent } from 'src/app/models/chatMessage.model';
import { HttpParams } from '@angular/common/http';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-scrapbook',
  templateUrl: './scrapbook.component.html',
  styleUrls: ['./scrapbook.component.scss']
})
export class ScrapbookComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  admin: boolean = false;
  handset: boolean = false;
  messages: Message[];
  profile: Profile;
  isOnline: boolean = false;
  recommandations: any;
  currentInvitation: any;
  accessChat: boolean = false;
  friends: Friends[];
  messages$: Subscription;
  profile$: Subscription;
  friends$: Subscription;
  messageToSend: string;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private storage: StorageService,
    private breakpointService: BreakpointService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private socketService: WebsocketService
  ) { }

  ngOnInit() {

    this.breakpointService.currentBreakpoint.subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });

    // Observe messages
    this.messages$ = this.storage.messages.subscribe(messagesReceived => {
      this.messages = messagesReceived;
      if(this.messages){
        this.loading = false
      } else {
        this.loading = true;
      }
    });
    // Observe Profile
    this.profile$ = this.storage.userView.subscribe(profileReceived => {
      this.profile = profileReceived;
      if(this.profile){
        this.loading = false;
        this.socketService.checkFriend(this.profile.userID);
        if(this.currentInvitation && this.currentInvitation.id === profileReceived.userID){
          this.accessChat = true;
        }
      } else {
        this.loading = true;
      }
    });
    // Observe Friends
    this.friends$ = this.storage.friends.subscribe(friends => {
      this.friends = friends;
      if(this.friends){
        this.loading = false
      } else {
        this.loading = true;
      }
    });

    // check if user is admin
    this.admin = this.authService.isAdmin();

    // fetch messages and check if friend is online
    this.route.params.subscribe((params: Params) => {
      let user = this.authService.getUserID();
      if(user === params.id){
        this.router.navigate(["/monspace"]);
      } else {
        // if it is a different profile than the one charged, restart it
        if(this.profile && this.profile.userID !== params.id){
          this.storage.restartScrapbook();
        }
        console.log("get member info: " + params.id);
        this.api.getMemberScrapbook(params.id);
        this.api.getProfile(params.id);
        this.api.getFriends(params.id);
        this.api.getRecommandations(params.id).subscribe(data => {
          console.log("recommandations:");
          console.log(data);
          this.recommandations = data;
        }, err => {
          console.log(err);
        })
      }
    });

    this.socketService.onEvent(IOEvent.FRIEND).subscribe(data => {
      console.log(data);
      if(this.profile && data.id === this.profile.userID){
        if(data.connected){
          console.log("friend connected!");
          this.isOnline = true;
        } else {
          console.log("friend disconnected!");
          this.isOnline = false;
        }
      }
    });

    this.socketService.invitation.subscribe(data => {
      this.currentInvitation = data;
      if(this.profile && data.id === this.profile.userID){
        this.accessChat = true;
      }
    });
  }

  deleteMessage(message: Message){
    this.api.deleteMessage(message, true);
  }

  inviteFriend(userID: string){
    this.api.inviteFriend(userID, "scrapbook");
  }

  inviteChat(profile: Profile){
    this.socketService.inviteChat(profile);
    this.router.navigate(["/chat"]);
  }

  acceptChat(profile: Profile){
    this.socketService.joinChat(profile);
    this.router.navigate(["/chat"]);
  }

  ngOnDestroy(){
    this.messages$.unsubscribe();
    this.profile$.unsubscribe();
    this.friends$.unsubscribe();
  }

  newMessageDialog(): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      width: '80%',
      data: {recipient: this.profile.pseudo}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
      // take action here
      if(result){
        this.authService.currentUser.subscribe((user: User)=>{
          // second argument is true so will auto reload this member messages after
          this.api.postMessage({
            author: user.id,
            recipient: this.profile.userID,
            message: result
          }, true);
        })
      }
    });
  }
  newCommentDialog(message: Message): void {
    const dialogRef = this.dialog.open(CommentDialog, {
      width: '80%',
      data: {recipient: message.userName, message: message.message}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
      // take action here
      if(result){
        this.authService.currentUser.subscribe((user: User)=>{
          this.api.postComment({
            author: user.id,
            recipient: this.profile.userID,
            message: message,
            newComment: result
          }, true);
        })
      }
    });
  }
}

