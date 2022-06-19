export const environment = {
  production: true,
  socketio: {
    url: 'https://webrtc-signaling-server-dl.herokuapp.com',
    options: {},
  },
  peerConfig: {
    iceServers: [
      {
        urls: 'stun:45-79-32-107.ip.linodeusercontent.com:3478',
      },
      {
        urls: 'turn:45-79-32-107.ip.linodeusercontent.com:3478',
        username: 'ecortes',
        credential: '123456',
      },
      {
        urls: 'stun:openrelay.metered.ca:80',
      },
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
    ],
  },
};
