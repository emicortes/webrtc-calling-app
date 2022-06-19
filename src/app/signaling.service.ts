import { Injectable } from '@angular/core';
import { combineLatest, filter, map, Subject, tap } from 'rxjs';
import {
  Call,
  IncomingICEMessage,
  IncomingRTCMessage,
  IncomingSdpMessage,
  OutgoingRTCMessage,
  SdpMessageType,
} from './call.models';
import { CameraService } from './camera.service';
import { IncomingMessage } from './comunications.models';
import { ComunicationsService } from './comunications.service';

@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  receive$ = this.comunicationsService.incomingMessage$.pipe(
    filter(
      (msg: IncomingMessage) =>
        msg.type === SdpMessageType.VIDEO_OFFER ||
        msg.type === SdpMessageType.VIDEO_ANSWER ||
        msg.type === SdpMessageType.NEW_ICE ||
        msg.type === SdpMessageType.END_CALL
    ),
    map((msg: IncomingMessage) => msg as IncomingRTCMessage)
  );

  send(msg: OutgoingRTCMessage) {
    this.comunicationsService.sendMessage(msg);
  }

  constructor(
    private comunicationsService: ComunicationsService,
  ) {}
}
