import { Injectable } from '@angular/core';
import { combineLatest, filter, map, merge, share, Subject, tap } from 'rxjs';
import { Call, IncomingSdpMessage, SdpMessageType } from './call.models';
import { CameraService } from './camera.service';
import { SignalingService } from './signaling.service';
import { UserStatus } from './users.models';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  endCall = new Subject();
  outgoingCall = new Subject<Call>();
  incomingCall$ = combineLatest({
    incomingOffer: this.signalingService.receive$.pipe(
      filter((msg) => msg.type == SdpMessageType.VIDEO_OFFER),
      map((msg) => msg as IncomingSdpMessage)
    ),
    camera: this.cameraService.camera$,
  }).pipe(
    filter((resources) => {
      const accept = confirm(`Call from ${resources.incomingOffer.from.name}`);
      if(!accept) {
        this.signalingService.send({
          type: SdpMessageType.END_CALL,
          target: resources.incomingOffer.from.id
        });
      }
      return accept;
    }),
    map((resources) => ({
      ...resources,
      call: new Call(
        resources.incomingOffer.from,
        resources.camera,
        this.signalingService
      ),
    })),
    tap((resources) => resources.call.acceptOffer(resources.incomingOffer.sdp)),
    map((resources) => resources.call),
    share()
  );

  currentCall$ = merge(
    this.outgoingCall.asObservable().pipe(
      tap((outCall) => outCall.sendCall()),
      share()
    ),
    this.incomingCall$,
    this.endCall.asObservable().pipe(map(() => null))
  ).pipe(
    tap((call) =>
      this.usersService.updateStatus(
        call ? UserStatus.ON_CALL : UserStatus.ONLINE
      )
    )
  );

  constructor(
    private signalingService: SignalingService,
    private cameraService: CameraService,
    private usersService: UsersService
  ) {}
}
