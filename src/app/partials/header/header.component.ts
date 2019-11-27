import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

//import { faCoffee, faHome, faUserFriends, faCircle, faEnvelope, faComments, faBars } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../services/auth.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  handset: boolean = false;
  userName: string;
  private userSub: Subscription;  // variable to handle subscription to user in case of login/logout
  private notification$: Subscription;

  constructor(
    private authService: AuthService,
    private breakpointService: BreakpointService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ){ }
  
  ngOnInit(){
    this.userSub = this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
      if(user){
        this.userName = user.username;
      } else {
        this.userName = null;
      }
    });
    
    this.breakpointService.currentBreakpoint.subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });

    this.notification$ = this.notificationService.notification.subscribe(notif => {
      //console.log(notif);
      let snackBarRef = this._snackBar.open(notif.message, "OK", {
        panelClass: "notif-" + notif.type,
        duration: 5000
      })
    })
  }

  deconnexion(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.notification$.unsubscribe();
  }
}
