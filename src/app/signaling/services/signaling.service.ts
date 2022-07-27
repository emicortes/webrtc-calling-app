import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs';
import {
  IncomingRTCMessage,
  OutgoingRTCMessage,
  SdpMessageType,
} from '../../calls/services/call.models';
import { IncomingMessage } from '../../comunications/services/comunications.models';
import { ComunicationsService } from '../../comunications/services/comunications.service';

@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  //receive signaling stream
  receive$ = this.comunicationsService.incomingMessage$.pipe(
    //take only the recognized message types
    filter(
      (msg: IncomingMessage) =>
        msg.type === SdpMessageType.VIDEO_OFFER ||
        msg.type === SdpMessageType.VIDEO_ANSWER ||
        msg.type === SdpMessageType.NEW_ICE ||
        msg.type === SdpMessageType.END_CALL
    ),
    //cast the message as an RTC message to access sdp/ice info
    map((msg: IncomingMessage) => msg as IncomingRTCMessage)
  );

  send(msg: OutgoingRTCMessage) {
    this.comunicationsService.sendMessage(msg);
  }

  constructor(
    private comunicationsService: ComunicationsService,
  ) {}
}
