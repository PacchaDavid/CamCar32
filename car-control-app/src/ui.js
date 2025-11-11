import { configButton, configKeysUp, directionButtons, listenCarControls, sendCommand } from "./car-control.js";
import { 
  initCameraWebSocket,
  initCarInputWebSocket
} from "./init-web-sockets.js";

export const initUi = () => {

  const object = {
    key: 'value',
  } 

  console.log('object: ', object)
  console.log('object.key: ', object.key)
  console.log('object[\'key\']: ', object['key'])
  console.log('Object.values(object): ', Object.keys(object))

  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');
  const cameraImage = document.getElementById('camera-image');

  var wsCamera = initCameraWebSocket(cameraImage);
  console.log(wsCamera);
  var wsCarInput = initCarInputWebSocket();

  
  // Inicializar valor de slider de velocidad
  speedValue.textContent = `${speedSlider.value}%`;

  // Event Listeners para slider de velocidad
  speedSlider.addEventListener('input', () => {
    speedValue.textContent = `${Math.floor(Number(speedSlider.value) * 100 / 255)}%`;
    console.log('Speed:', speedSlider.value);
    sendCommand(wsCarInput, 'Speed', speedSlider.value)
  });

  for (buttonId in directionButtons) {
    const keyCar = 'MoveCar';
    document.getElementById(buttonId).addEventListener('mousedown', () => {
      sendCommand(wsCarInput, keyCar, directionButtons[buttonId]);
    });
    document.getElementById(buttonId).addEventListener('mouseup', () => {
      sendCommand(wsCarInput, keyCar, '0');
    });
    document.getElementById(buttonId).addEventListener('touchstart', () => {
      sendCommand(wsCarInput, keyCar, directionButtons[buttonId]);
    });
    document.getElementById(buttonId).addEventListener('touchend', () => {
      sendCommand(wsCarInput, keyCar, '0');
    });
  }

  configButton(wsCarInput);
  listenCarControls(wsCarInput);
  configKeysUp(wsCarInput);
};