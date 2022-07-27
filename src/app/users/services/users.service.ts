import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, shareReplay } from 'rxjs';
import { User, UserStatus } from './users.models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users$: Observable<User[]>;

  constructor(private socket: Socket) {
    this.users$ = this.socket.fromEvent<User[]>('users').pipe(shareReplay());
  }

  updateStatus(status: UserStatus) {
    this.socket.emit('status', status);
  } 
}


