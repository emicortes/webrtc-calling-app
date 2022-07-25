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

  outgoing: boolean = false;
  /**
   *
   */
  constructor(
    public user: User,
    media: MediaStream,
    private signaling: SignalingService
  ) {
    this.peerConnection = new RTCPeerConnection(environment.peerConfig);

    //setup local stream
    media
      .getTracks()
      .forEach((track) => this.peerConnection.addTrack(track, media));

    //setup remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Track received');
      //init the remote stream object
      this.remoteStream = this.remoteStream || new MediaStream();
      //add each track received to the remote stream object
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track);
      });
      console.log('Track attached');
    };

    //setup ice candidate handling
    this.peerConnection.onicecandidate = (candidate) => {
      console.log('ICE candidate sended', candidate);
      if (candidate.candidate) {
        //send the candidate through the signaling server
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
    // add the ICE candidate to the peer connection
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  async sendCall() {
    this.outgoing = true;
    //create the offer
    const offer =
      (await this.peerConnection.createOffer()) as RTCSessionDescription;
    //set the SDP offer as a local description of peer connection
    await this.peerConnection.setLocalDescription(offer);
    //send the offer through the signaling server
    this.signaling.send({
      target: this.user.id,
      sdp: offer,
      type: SdpMessageType.VIDEO_OFFER,
    } as OutgoingSdpMessage);
    console.log('Offer sended');
  }

  async acceptOffer(offerSdp: RTCSessionDescriptionInit) {
    console.log('Offer received');
    //set the received offer sdp as a remote description
    await this.peerConnection.setRemoteDescription(offerSdp);
    //create the sdp answer
    const answer = await this.peerConnection.createAnswer();
    //set the sdp answer as local description
    await this.peerConnection.setLocalDescription(answer);
    //send sdp answer through signaling server
    this.signaling.send({
      target: this.user.id,
      sdp: answer,
      type: SdpMessageType.VIDEO_ANSWER,
    } as OutgoingSdpMessage);
    console.log('Answer sended');
  }

  async answerReceived(answerSdp: RTCSessionDescriptionInit) {
    //just set the answer sdp as remote description
    await this.peerConnection.setRemoteDescription(answerSdp);
    console.log('Answer received');
  }

  receivedEndCall() {
    // closing the peer connection
    this.peerConnection.close();
  }

  sendEndCall() {
    // send the end call signal to the peer
    this.signaling.send({
      target: this.user.id,
      type: SdpMessageType.END_CALL,
    });
    // closing the peer connection
    this.peerConnection.close();
  }
}
