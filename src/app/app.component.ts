import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'matrimap';
  
  constructor(private authService: AuthService, private socketService: WebsocketService){}

  ngOnInit(){
    this.socketService.initSocket();
    this.authService.autoLogin();
  }
}
