import { configKeysUp, listenCarControls, sendCommand } from "./car-control.js";

export const domain = '192.168.4.1:80';

export const initCameraWebSocket = (cameraImageDOMObject) => {
  const wsCamera = new WebSocket(`ws://${domain}/Camera`);
  wsCamera.binaryType = 'blob';
  wsCamera.onopen = () => {};
  wsCamera.onmessage = (evt) => {
    const imageSrc = URL.createObjectURL(evt.data);
    cameraImageDOMObject.src = imageSrc;
  }
  wsCamera.onclose = () => setInterval(initCameraWebSocket, 5000);
  return wsCamera;
}

export const initCarInputWebSocket = () => {
  const wsCarInput = new WebSocket(`ws://${domain}/CarInput`);
  wsCarInput.onopen = () => {
    listenCarControls(wsCarInput);
    configKeysUp(wsCarInput);
    sendCommand(wsCarInput, 'MoveCar', '0');
    sendCommand(wsCarInput, 'Light', '0');
  }
  wsCarInput.onmessage = e => console.log(e);
  wsCarInput.onclose = () => setInterval(initCarInputWebSocket, 5000);
  return wsCarInput;

}
