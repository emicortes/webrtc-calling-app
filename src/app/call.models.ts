import { IncomingMessage, OutgoingMessage } from './comunications.models';
import { User } from './users.models';
import { SignalingService } from './signaling.service';
import { environment } from 'src/environments/environment';

export interface IncomingRTCMessage extends IncomingMessage {}

export interface OutgoingRTCMessage extends OutgoingMessage {}

export interface IncomingSdpMessage extends IncomingRTCMessage {
  sdp: RTCSessionDescriptionInit;
}

export interface OutgoingSdpMessage extends OutgoingRTCMessage {
  sdp: RTCSessionDescriptionInit;
}

export interface IncomingICEMessage extends IncomingRTCMessage {
  candidate: RTCIceCandidateInit;
}

export interface OutgoingICEMessage extends OutgoingRTCMessage {
  candidate: RTCIceCandidateInit;
}

export enum SdpMessageType {
  VIDEO_OFFER = 'video-offer',
  VIDEO_ANSWER = 'video-answer',
  NEW_ICE = 'new-ice-candidate',
  END_CALL = 'end-call',
}

export class Call {
  peerConnection: RTCPeerConnection;
  remoteStream?: MediaStream;
  /**
   *
   */
  constructor(
    private user: User,
    camera: MediaStream,
    private signaling: SignalingService
  ) {
    this.peerConnection = new RTCPeerConnection(environment.peerConfig);

    //setup local stream
    camera
      .getTracks()
      .forEach((track) => this.peerConnection.addTrack(track, camera));

    //setup remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Track received');
      this.remoteStream = this.remoteStream || new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track);
      });
      console.log('Track attached');
    };

    //setup ice candidate handling
    this.peerConnection.onicecandidate = (candidate) => {
      console.log('ICE candidate sended', candidate);
      if (candidate.candidate) {
        this.signaling.send({
          target: this.user.id,
          type: SdpMessageType.NEW_ICE,
          candidate: candidate.candidate?.toJSON(),
        } as OutgoingICEMessage);
      }
    };
  }

  async candidateReceived(candidate: RTCIceCandidateInit) {
    console.log('ICE candidate received');
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async sendCall() {
    const offer =
      (await this.peerConnection.createOffer()) as RTCSessionDescription;
    await this.peerConnection.setLocalDescription(offer);
    this.signaling.send({
      target: this.user.id,
      sdp: offer,
      type: SdpMessageType.VIDEO_OFFER,
    } as OutgoingSdpMessage);
    console.log('Offer sended');
  }

  async offerReceived(offerSdp: RTCSessionDescriptionInit) {
    console.log('Offer received');
    await this.peerConnection.setRemoteDescription(offerSdp);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.signaling.send({
      target: this.user.id,
      sdp: answer,
      type: SdpMessageType.VIDEO_ANSWER,
    } as OutgoingSdpMessage);
    console.log('Answer sended');
  }

  async answerReceived(answerSdp: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(answerSdp);
    console.log('Answer received');
  }

  receivedEndCall() {
    this.peerConnection.close();
  }

  sendEndCall() {
    this.signaling.send({
      target: this.user.id,
      type: SdpMessageType.END_CALL,
    });
  }
}
