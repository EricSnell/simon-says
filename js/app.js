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

  // DOM elements
  const buttonsNodeList = document.getElementsByTagName('button');
  const $buttons = document.getElementById('game-btns');
  const $startBtn = document.getElementById('start-btn');
  const $strictBtn = document.getElementById('strict-btn');
  const $counter = document.getElementById('counter');

  let state;

  // Add Event Listeners
  $startBtn.addEventListener('click', newGame);
  $strictBtn.addEventListener('click', toggleStrictMode);
  $buttons.addEventListener('mousedown', playSound);
  $buttons.addEventListener('mouseup', stopSound);

  setInitialState();

  function newGame() {
    setInitialState();
    toggleInteractive();
    setCounterDisplay();
    playSequence(0);
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

  function errorSound() {
    sounds.error.play();
    setTimeout(() => {
      sounds.error.stop()
    }, 500);
  }

  // Adds color to pattern sequence
  function addColor() {
    const newColor = [generateRandomColor()];
    updateState({ pattern: state.pattern.concat(newColor) });
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

  // Cycles through sequence recursively, passing it the current index of the pattern
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

  // Highlights and plays sound associated with button
  function activateButton(color) {
    const btn = document.getElementById(color);
    btn.classList.add('active');
    sounds[color].play();
    setTimeout(() => {
      btn.classList.remove('active');
      sounds[color].stop();
    }, state.intervalSpeed / 2);
  }

  // Toggles interactivity with the game while sequence and toggles back on when users turn
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

  // When player interacts with a button
  function play(e) {
    const btn = e.target.value;
    const isCorrect = (btn === state.pattern[state.counter]);
    const lastLevel = (state.pattern.length === 20);
    let patternFinished;
    if (isCorrect) {
      increaseCounter();
      patternFinished = (state.counter >= state.pattern.length);
      if (patternFinished && lastLevel) {
        gameWon();
      } else if (patternFinished) {
        setNextLevel();
      }
    } else if (state.strict) {
      errorSound();
      newGame();
    } else {
      errorSound();
      updateState({ counter: 0 });
      playSequence(0);
    }
  }

  function gameWon() {
    console.log('you win!');
  }

  // Runs once user has successfully clicked through current pattern sequence
  function setNextLevel() {
    updateState({ counter: 0 });
    addColor();
    setCounterDisplay();
    setSpeed();
    playSequence(0);
  }

  function increaseCounter() {
    const addToCounter = state.counter + 1;
    updateState({ counter: addToCounter });
  }

  // Determines the speed at which the sequence is played back (faster over time)
  function setSpeed() {
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

  function setCounterDisplay() {
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