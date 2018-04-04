(() => {
  'use strict'

  const soundA = createSound(200);
  const soundB = createSound(225);
  const soundC = createSound(250);
  const soundD = createSound(275);
  const error = createSound(125);

  const sounds = {
    red: soundA,
    green: soundB,
    blue: soundC,
    yellow: soundD,
    error
  }

  function createSound(num) {
    return new Pizzicato.Sound({
      source: 'wave',
      options: {
        frequency: num,
        attack: 0,
        release: 0.3,
        volume: 0.2
      }
    });
  }

  function playSound(e) {
    const color = e.target.value;
    sounds[color].play();
  }

  function stopSound(e) {
    const color = e.target.value;
    sounds[color].stop();
  }

  // DOM elements
  const buttonsNodeList = document.getElementsByClassName('game__button');
  const $buttons = document.getElementById('game-btns');
  const $startBtn = document.getElementById('start-btn');
  const $strictBtn = document.getElementById('strict-btn');
  const $counter = document.getElementById('counter');

  // For testing purposes
  const $log = document.getElementById('dev-log');

  let state;

  // Add Event Listeners
  $startBtn.addEventListener('click', newGame);
  $strictBtn.addEventListener('click', toggleStrictMode);
  $buttons.addEventListener('mousedown', playSound);
  $buttons.addEventListener('mouseup', stopSound);

  function newGame() {
    setInitialState();
    toggleInteractive();
    resetCounterDisplay();
    playSequence(0);
  }

  function addColor() {
    const newColor = [generateRandomColor()];
    updateState({ pattern: state.pattern.concat(newColor) });
    $log.innerHTML = state.pattern;
  }

  function toggleStrictMode() {
    const toggle = !state.strict;
    updateState({ strict: toggle });
  }

  function generateRandomColor() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  }

  function playSequence(index) {
    if (index < state.pattern.length) {
      updateState({ userTurn: false });
      toggleInteractive();
      setTimeout(() => {
        const color = state.pattern[index];
        activateButton(color);
        playSequence(index + 1);
      }, state.intervalSpeed);
    } else {
      updateState({ userTurn: true });
      toggleInteractive();
    }
  }

  function activateButton(color) {
    const btn = document.getElementById(color);
    btn.classList.add('active');
    sounds[color].play();
    setTimeout(() => {
      btn.classList.remove('active');
      sounds[color].stop();
    }, state.intervalSpeed / 2);
  }

  function alertIncorrect() {
    sounds.error.play();
    setTimeout(() => {
      sounds.error.stop()
    }, 500);
  }

  function toggleInteractive() {
    if (state.userTurn) {
      $buttons.addEventListener('click', play);
      Array.prototype.forEach.call(buttonsNodeList, (btn) => {
        btn.disabled = false;
      });
    } else {
      $buttons.removeEventListener('click', play);
      Array.prototype.forEach.call(buttonsNodeList, (btn) => {
        btn.disabled = true;
      });
    }
  }

  function play(e) {
    const btn = e.target.value;
    const isCorrect = btn === state.pattern[state.counter];
    if (isCorrect) {
      const addToCounter = state.counter + 1;
      updateState({ counter: addToCounter });
      if (state.counter >= state.pattern.length) {
        updateState({ counter: 0 });
        addColor();
        $counter.innerHTML = state.pattern.length;
        increaseSpeed();
        playSequence(0);
      }
    } else if (state.strict) {
      alertIncorrect();
      newGame();
    } else {
      alertIncorrect();
      updateState({ counter: 0 });
      playSequence(0);
    }
  }

  function increaseSpeed() {
    const pattern = state.pattern.length;
    switch (true) {
      case pattern >= 15:
        updateState({ intervalSpeed: 250 });
        break;
      case pattern >= 10:
        updateState({ intervalSpeed: 500 });
        break;
      case pattern >= 5:
        updateState({ intervalSpeed: 750 });
        break;
      default:
        break;
    };
  }

  function resetCounterDisplay() {
    $counter.innerHTML = state.pattern.length;
  }

  function setInitialState() {
    updateState({
      pattern: [generateRandomColor()],
      counter: 0,
      intervalSpeed: 1000,
      userTurn: false
    });
  }

  function updateState(props = {}) {
    state = Object.assign({}, state, props);
  }

})();