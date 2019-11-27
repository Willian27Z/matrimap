import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog, CommentDialog } from '../../partials/dialogs/dialogs.component';
import { User } from 'src/app/models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.scss']
})
export class MyspaceComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  handset: boolean = false;
  search = new FormControl();
  // form = new FormGroup({});
  // model: any;
  // fields: FormlyFieldConfig[] = [{
  //   key: "search",
  //   type: "input",
  //   templateOptions: {
  //     type: "text",
  //     label: "Rechercher",
  //     hint: "Par pseudo, nom ou prénom",
  //     required: true
  // }
  // }]
  searchMaker: Observable<any[]>;
  searchResult: any;
  myMessages: Message[] = [];
  myMessages$: Subscription;

  constructor(
    private breakpointService: BreakpointService,
    private api: ApiService,
    private storage: StorageService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.search.valueChanges.subscribe(value => {
      if(value){
        this.api.searchMember(value).subscribe(results => {
          console.log(results);
          this.searchResult = results
        })
      }
    });

    this.breakpointService.currentBreakpoint.subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });

    // Observe messages
    this.myMessages$ = this.storage.myMessages.subscribe(messagesReceived => {
      this.myMessages = messagesReceived;
      if(this.myMessages){
        this.loading = false
      } else {
        this.loading = true;
      }
    });

    // fetch messages
    this.api.getMessages();
  }

  deleteMessage(message: Message){
    this.api.deleteMessage(message, false);
  }

  newMessageDialog(): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      width: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
      // take action here
      if(result){
        this.authService.currentUser.subscribe((user: User)=>{
          // second argument is false so it will reload myMessage automatically
          this.api.postMessage({
            author: user.id,
            recipient: user.id,
            message: result
          }, false);
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
            recipient: user.id,
            message: message,
            newComment: result
          }, false);
        })
      }
    });
  }

  ngOnDestroy(){
    this.myMessages$.unsubscribe();
  }
}
