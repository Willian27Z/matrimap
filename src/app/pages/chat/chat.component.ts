import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ChatMessage } from 'src/app/models/chatMessage.model';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  // roomID: any;
  // roomID$: Subscription;
  // connected: boolean = false;
  me = {
    id: this.authService.getUserID(),
    username: this.authService.getUsername(),
    status: "Online"
  };
  other = {
    id: "",
    username: "",
    status: "Pas d'invité"
  };
  messages: ChatMessage[] = [];
  messages$: Subscription;
  input: string;

  constructor(
    // private route: ActivatedRoute,
    // private api: ApiService,
    // private storage: StorageService,
    private breakpointService: BreakpointService,
    private authService: AuthService,
    // private router: Router,
    // public dialog: MatDialog,
    private socketService: WebsocketService
  ) { }

  ngOnInit() {
    this.messages$ = this.socketService.currentMessages.subscribe(data => {
      this.messages = data;
    });

    // this.socketService.messages.subscribe(data => {
    //   if(data){
    //     this.messages = data;
    //   }
    // });

    this.socketService.waiting.subscribe(data => {
      if(data){
        this.other.id = data.id;
        this.other.username = data.username;
        this.other.status = "En attente"
      }
    });
    this.socketService.invitation.subscribe(data => {
      if(data){
        this.other.id = data.id;
        this.other.username = data.username;
        this.other.status = "Rejoindre"
      }
    });

    this.socketService.inContact.subscribe(data => {
      if(data){
        this.other.id = data.id;
        this.other.username = data.username;
        this.other.status = "Connecté";
      } else {
        this.other.status = "Déconnecté";
      }
    })
  }

  sendMessage(){
    this.socketService.send(this.input);
    this.input = "";
  }

  joinChat(){
    if(this.other.id){
      this.socketService.joinChat({userID: this.other.id});
    }
  }

  endChat(){
    this.socketService.endChat();
    this.messages = [];
  }

  ngOnDestroy(){
    this.messages$.unsubscribe();
    // sauvegarder message tant que connecté
    // if(this.other.status === "Connecté"){
    //   this.socketService.messages.next(this.messages);
    // }
  }
}
