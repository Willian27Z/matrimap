import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { faCoffee, faHome, faUserFriends, faCircle, faEnvelope, faComments, faBars } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  handset: boolean = false;
  private userSub: Subscription;  // variable to handle subscription to user in case of login/logout

  // Icons
  faCoffee = faCoffee;
  iHome = faHome;
  iFriends = faUserFriends;
  iRing = faCircle;
  iMessage = faEnvelope;
  iDiscussion = faComments;
  faBars = faBars;


  constructor(
    private authService: AuthService,
    breakpointObserver: BreakpointObserver
  ){
    breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });
  }
  
  ngOnInit(){
    this.userSub = this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  deconnexion(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
