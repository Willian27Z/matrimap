import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointService } from '../../services/breakpoint.service';
import { ApiService } from '../../services/api.service';
import { StorageService } from '../../services/storage.service';
import { Friends } from 'src/app/models/friends.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialog, RecommandationDialog } from 'src/app/partials/dialogs/dialogs.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  handset: boolean = false;
  search: string;
  friends: Friends[] = [];
  friends$: Subscription;

  constructor(
    private breakpointService: BreakpointService,
    private api: ApiService,
    private storage: StorageService,
    private authService: AuthService,
    // private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.breakpointService.currentBreakpoint.subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });

    // Observe friends
    this.friends$ = this.storage.myFriends.subscribe(friendsList => {
      this.friends = friendsList;
      if(this.friends){
        this.loading = false
      } else {
        this.loading = true;
      }
    });

    // fetch friends
    this.api.getMyFriends();
  }

  askConfirmationUnfriend(userID: string, username: string){
    let confirmationDialog = this.dialog.open(ConfirmationDialog, {
      data: { 
        title: "Retirer amis?",
        description: "Vous ne serez plus amis avec " + username + ". Cette action est irreversible."
      },
    });

    confirmationDialog.afterClosed().subscribe(result => {
      if(result){
        this.api.unfriend(userID);
      }
    })
  }

  recommendFriend(friend: Friends, pseudo: string){
    let recommendationDialog = this.dialog.open(RecommandationDialog, {
      data: {
        friends: this.friends,
        exception: friend,
        pseudo: pseudo
      }
    });

    recommendationDialog.afterClosed().subscribe(result => {
      if(result){
        this.api.recommendFriend(friend.id, result);
      }
    })
  }

  inviteFriend(userID: string){
    this.api.inviteFriend(userID, "friends");
  }

  acceptFriend(userID: string){
    this.api.acceptFriend(userID, "friends")
  }

  ignore(userID: string){
    this.api.ignoreRequest(userID);
  }

  ngOnDestroy() {
    this.friends$.unsubscribe();
  }

  testNotif(){
    this.api.testNotif();
  }
}
