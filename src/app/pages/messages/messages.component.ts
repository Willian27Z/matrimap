import { Component, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';
import { Discussion } from 'src/app/models/discussion.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewDiscussionDialog, ConfirmationDialog } from 'src/app/partials/dialogs/dialogs.component';
import { AuthService } from 'src/app/services/auth.service';
import { Friends } from 'src/app/models/friends.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  loading: boolean = true;
  admin: boolean = false;
  search: string;
  handset: boolean = false;
  sidenav: boolean = false;
  discussions: Discussion[];
  discussions$: Subscription;
  friends: Friends[];
  friends$: Subscription;
  messageCtrl = new FormControl();
  selectedDiscussion: Discussion = null;
  messageToSend: string;
  discussionMessages: {
    author: string, 
    message: string,
    date: Date,     
    seenBy: string[]    // usernames from backend
}[];

  constructor(
    private breakpointService: BreakpointService,
    private storage: StorageService,
    private api: ApiService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.breakpointService.currentBreakpoint.subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });

    // Observe discussions
    this.discussions$ = this.storage.discussions.subscribe(discussionList => {
      this.discussions = discussionList;
      if(this.discussions){
        this.loading = false;
        this.select(this.discussions[0].id);
      } else {
        this.loading = true;
      }
    });

    // Observe friends
    this.friends$ = this.storage.myFriends.subscribe(friendsList => {
      this.friends = friendsList;
      if(this.friends){
        this.loading = false
      } else {
        this.loading = true;
        // fetch friends
        this.api.getMyFriends();
      }
    });


    // fetch discussions
    this.api.getDiscussions();
  }

  sidenavToggle(){
    console.log(this.sidenav);
    this.sidenav = !this.sidenav;
  }

  newDiscussionDialog(){
    let newDiscussionDialog = this.dialog.open(NewDiscussionDialog, {
      data: { 
        friendOptions: this.friends.filter(e => e.status === "confirmed"),
        subject: "",
        messageInitial: ""
      },
    });

    newDiscussionDialog.afterClosed().subscribe(result => {
      console.log("new discussion dialog result");
      console.log(result);
      if(result){
        // send to api
        this.api.newDiscussion(result);
      }
    })
  }

  select(id: string){
    this.selectedDiscussion = this.discussions.find(e => e.id === id);
    this.selectedDiscussion.messages.sort(function (a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  sendMessage(){
    const messageToSend = {
      author: this.authService.getUserID(),
      message: this.messageToSend
    }
    this.api.postToDiscussion(messageToSend, this.selectedDiscussion.id);
    this.messageCtrl.setValue(null);
  }

  deleteMessage(message: any){
    this.api.deleteMessageFromDiscussion(message, this.selectedDiscussion.id);
  }

  deleteDiscussion() {
    let confirmationDialog = this.dialog.open(ConfirmationDialog, {
      data: { 
        title: "Supprimer Discussion?",
        description: "Tout les messages seront supprimés. Cette action est irreversible."
      },
    });

    confirmationDialog.afterClosed().subscribe(result => {
      if(result){
        this.api.deleteDiscussion(this.selectedDiscussion.id);
      }
    })
  }
}
