import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { StreamPlayerComponent } from './video/stream-player/stream-player.component';
import { LoginComponent } from './auth/login/login.component';
import { CallComponent } from './calls/call/call.component';
import { environment } from 'src/environments/environment';
import { UserDirectoryComponent } from './users/user-directory/user-directory.component';

const config: SocketIoConfig = environment.socketio;

@NgModule({
  declarations: [
    AppComponent,
    StreamPlayerComponent,
    LoginComponent,
    UserDirectoryComponent,
    CallComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
