import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  liveStats = {messages: 0, onlineUsers: 0};

  constructor(private socketService: WebsocketService) { }

  ngOnInit() {
    this.socketService.liveStats.subscribe(stats => {
      this.liveStats = stats;
    })
  }

}
