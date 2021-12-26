import {getEnvironment} from '../env';

export function createCryptoFacilitiesConnection(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(getEnvironment().API_URL);

    socket.onopen = function () {
      resolve(socket);
    };

    socket.onerror = function (evt) {
      reject(evt);
    };
  });
}
