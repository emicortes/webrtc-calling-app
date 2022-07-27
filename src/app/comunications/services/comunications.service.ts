import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IncomingMessage, OutgoingMessage } from './comunications.models';

@Injectable({
  providedIn: 'root',
})
export class ComunicationsService {
  incomingMessage$ = this.socket.fromEvent<IncomingMessage>('message');

  constructor(private socket: Socket) {}

  sendMessage(msg: OutgoingMessage) {
    this.socket.emit('sendMessage', msg);
  }
}
