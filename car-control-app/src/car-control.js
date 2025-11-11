
const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;

export const sendCommand = (ws, key, value) => {
  const data = `${key},${value}`;
  ws.send(data);
}

export const directionButtons = {
  forwardButton: 'UP',
  reverseButton: 'DOWN',
  leftButton: 'LEFT',
  rightButton: 'RIGHT'
};

let lightsActive = false;

const directions = Object.keys(directionButtons);

const key = 'MoveCar';
const activeButtonClass = 'active-key-press';

const pressedKeys = {};
export const listenCarControls = (ws) => {
  function sendCommandAndActivateButton(direction, buttonId) {
    sendCommand(ws, key, direction);
    document.getElementById(buttonId).classList.add(activeButtonClass);
  }

  document.addEventListener('keydown', (event) => {

    if (!pressedKeys[event.code]) {
      pressedKeys[event.code] = true;
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          sendCommandAndActivateButton(UP, directions[0]);
          break;
        case 's':
        case 'ArrowDown':
          sendCommandAndActivateButton(DOWN, directions[1]);
          break;
        case 'a':
        case 'ArrowLeft':
          sendCommandAndActivateButton(LEFT, directions[2]);
          break;
        case 'd':
        case 'ArrowRight':
          sendCommandAndActivateButton(RIGHT, directions[3]);
          break;
        case 'l':
          sendCommand(ws, 'Light', (lightsActive) ? '0' : '100');
          lightsActive = !lightsActive;
          document.getElementById('headlightsButton').classList.toggle('active');
          break;
        case ' ':
          const speedSlider = document.getElementById('speedSlider');
          if (speedSlider.value < 255) {
            speedSlider.value = Number(speedSlider.value) + (25 * 255 / 100);
            document.getElementById('speedValue').textContent = Math.floor(Number(speedSlider.value * 100 / 255)) + '%';
          } else {
            speedSlider.value = 0;
            document.getElementById('speedValue').textContent = '0%';
          }
          sendCommand(ws, 'Speed', speedSlider.value);
          break;
        default:
          break;
      }
    }
  });
}

export const configKeysUp = (ws) => {
  document.addEventListener('keyup', (event) => {

    function deactivateButton(buttonId) {
      document.getElementById(buttonId).classList.remove(activeButtonClass);
    }

    pressedKeys[event.code] = false;
    const key = 'MoveCar';
    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        deactivateButton(directions[0]);
      case 's':
      case 'ArrowDown':
        deactivateButton(directions[1]);
      case 'a':
      case 'ArrowLeft':
        deactivateButton(directions[2]);
      case 'd':
      case 'ArrowRight':
        deactivateButton(directions[3]);
        sendCommand(ws, key, '0');
      default:
        break;
    }
  });
}

export const configButton = (wsCarInput) => {
  const headlightsButton = document.getElementById('headlightsButton');
  headlightsButton.addEventListener('click', () => {
    headlightsButton.classList.toggle('active');
    const isActive = headlightsButton.classList.contains('active');
    console.log('Headlights:', isActive ? 'ON' : 'OFF');
    sendCommand(wsCarInput, 'Light', (lightsActive) ? '0' : '100');
    lightsActive = !lightsActive;
  });
}
