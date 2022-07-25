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
  //end call events
  endCall = new Subject();

  //outgoing calls subject
  outgoingCall = new Subject<Call>();
  
  //incoming call flow from signaling service
  incomingCall$ = combineLatest({
    //incoming offers stream
    incomingOffer: this.signalingService.receive$.pipe(
      //filter only video offers
      filter((msg) => msg.type == SdpMessageType.VIDEO_OFFER),
      //cast as incoming sdp message
      map((msg) => msg as IncomingSdpMessage)
    ),
    //camera stream
    camera: this.cameraService.camera$,
  }).pipe(
    filter((resources) => {
      //call accept filter using a simple confirm dialog
      const accept = confirm(`Call from ${resources.incomingOffer.from.name}`);
      if(!accept) {
        //send an end call when the call is rejected
        this.signalingService.send({
          type: SdpMessageType.END_CALL,
          target: resources.incomingOffer.from.id
        });
      }
      return accept;
    }),
    // add the call to the stream
    map((resources) => ({
      ...resources,
      call: new Call(
        resources.incomingOffer.from,
        resources.camera,
        this.signalingService
      ),
    })),
    // invoke the call accept flow, with the received sdp
    tap((resources) => resources.call.acceptOffer(resources.incomingOffer.sdp)),
    // return the call as result of the stream
    map((resources) => resources.call),
    share()
  );

  // current call stream
  currentCall$ = merge(
    this.outgoingCall.asObservable().pipe(
      // invoke the send flow to outgoing calls
      tap((outCall) => outCall.sendCall()),
      share()
    ),
    this.incomingCall$,
    // map each end call event as a null current call
    this.endCall.asObservable().pipe(map(() => null))
  ).pipe(
    tap((call) =>
      // notify the server the current call status
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
