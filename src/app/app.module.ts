import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { StreamPlayerComponent } from './stream-player/stream-player.component';
import { LoginComponent } from './login/login.component';
import { UserDirectoryComponent } from './user-directory/user-directory.component';
import { CallComponent } from './call/call.component';
import { environment } from 'src/environments/environment';

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
