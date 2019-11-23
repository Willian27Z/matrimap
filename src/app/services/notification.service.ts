import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string,
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification = new Subject<Notification>();

  constructor() { }

  pushNotification(notif: Notification){
    this.notification.next(notif);
  }
}
