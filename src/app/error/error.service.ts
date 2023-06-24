import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  message = signal('');
  constructor() { }
  newMessage(message: string) {
    this.message.set(message);
  }
}
