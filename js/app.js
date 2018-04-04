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

  // State
  let state = {
    pattern: [],
    strict: false,
    counter: 0,   // set to length of pattern
    intervalSpeed: 1000,
    userTurn: false
  }

  // Add Event Listeners
  $startBtn.addEventListener('click', newGame);
  $strictBtn.addEventListener('click', toggleStrictMode);

  function newGame() {
    $buttons.addEventListener('click', play);
    $buttons.addEventListener('mousedown', playSound);
    $buttons.addEventListener('mouseup', stopSound);
    setInitialState();
    resetDisplay();
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

  function playSequence(count) {
    if (count < state.pattern.length) {
      updateState({ userTurn: false });
      toggleInteractive();
      setTimeout(() => {
        const color = state.pattern[count];
        activateButton(color);
        playSequence(count + 1);
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
        playSequence(0);
      } else {
        console.log('Keep going...');
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

  function resetDisplay() {
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