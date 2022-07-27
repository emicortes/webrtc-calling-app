import { Component, OnInit } from '@angular/core';
import { Call } from '../../calls/services/call.models';
import { CallService } from '../../calls/services/call.service';
import { CameraService } from '../../video/services/camera.service';
import { SignalingService } from '../../signaling/services/signaling.service';
import { User } from '../services/users.models';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-directory',
  templateUrl: './user-directory.component.html',
  styleUrls: ['./user-directory.component.scss'],
})
export class UserDirectoryComponent implements OnInit {
  users$ = this.usersService.users$;
  camera$ = this.cameraService.camera$;

  constructor(
    private usersService: UsersService,
    private callService: CallService,
    private cameraService: CameraService,
    private signalingService: SignalingService
  ) {}

  ngOnInit(): void {}

  call(user: User, camera: MediaStream) {
    const call = new Call(user, camera, this.signalingService);
    this.callService.outgoingCall.next(call);
  }
}
