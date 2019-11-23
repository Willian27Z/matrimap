import { Component, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';
import { Discussion } from 'src/app/models/discussion.model';
import { Subscription } from 'rxjs';

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
  discussions: Discussion[];
  discussions$: Subscription;
  discussionMessages: {
    author: string, 
    message: string,
    date: Date,     
    seenBy: string[]    // usernames from backend
}[];

  constructor(
    private breakpointService: BreakpointService,
    private storage: StorageService,
    private api: ApiService
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
    this.discussions$ = this.storage.discussions.subscribe(discussionList => {
      this.discussions = discussionList;
      if(this.discussions){
        this.loading = false
      } else {
        this.loading = true;
      }
    });

    // fetch friends
    //this.api.getDiscussions();
  }
}
