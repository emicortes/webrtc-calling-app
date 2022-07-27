import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { filter, map, Subscription } from 'rxjs';
import {
  Call,
  IncomingICEMessage,
  IncomingSdpMessage,
  SdpMessageType,
} from '../../calls/services/call.models';
import { CallService } from '../services/call.service';
import { SignalingService } from '../../signaling/services/signaling.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit, OnDestroy, OnChanges {
  @Input() call!: Call;
  signalingSubscription: any;
  subscriptions: Subscription[] = [];

  constructor(
    private signalingService: SignalingService,
    private callService: CallService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['call'] && changes['call'].currentValue) {
      this.call.peerConnection.onconnectionstatechange = () => {
        switch (this.call.peerConnection.connectionState) {
          case 'disconnected':
          case 'closed':
          case 'failed':
            this.endCall();
            break;
        }
      };
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      ...[
        this.signalingService.receive$
          .pipe(
            filter((msg) => msg.type == SdpMessageType.VIDEO_ANSWER),
            map((msg) => msg as IncomingSdpMessage)
          )
          .subscribe((msg) => this.call.answerReceived(msg.sdp)),

        this.signalingService.receive$
          .pipe(
            filter((msg) => msg.type == SdpMessageType.NEW_ICE),
            map((msg) => msg as IncomingICEMessage)
          )
          .subscribe((msg) => this.call.candidateReceived(msg.candidate)),

        this.signalingService.receive$
          .pipe(filter((msg) => msg.type == SdpMessageType.END_CALL))
          .subscribe((msg) => {
            this.call.receivedEndCall();
            this.callService.endCall.next(null);
          }),
      ]
    );
  }

  endCall() {
    this.call.sendEndCall();
    this.callService.endCall.next(null);
  }
}
