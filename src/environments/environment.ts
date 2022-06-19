// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
