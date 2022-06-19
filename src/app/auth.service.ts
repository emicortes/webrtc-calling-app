import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, tap } from 'rxjs';
import { Nullable } from './common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedAs = new BehaviorSubject<Nullable<string>>(null);

  public user$ = this.loggedAs.asObservable().pipe(tap((userName) => {
    if(userName !== null) {
      this.socket.emit('login', userName);
    }
  }));

  constructor(private socket: Socket) {
    this.user$.subscribe();
  }

  async login(userName: string) {
    this.loggedAs.next(userName);
  }
}
