(() => {
  'use strict'
  // DOM elements
  const buttonsNodeList = document.getElementsByTagName('button');
  const $buttons = document.getElementById('game-btns');
  const $startBtn = document.getElementById('start-btn');
  const $strictBtn = document.getElementById('strict-btn');
  const $counter = document.getElementById('counter');
  const $feedback = document.getElementById('feedback');

  let state;

  const sounds = {
    red: createSound(200),
    green: createSound(225),
    blue: createSound(250),
    yellow: createSound(275),
    error: createSound(145)
  }

  // Add Event Listeners
  $startBtn.addEventListener('click', newGame);
  $strictBtn.addEventListener('click', toggleStrictMode);
  $buttons.addEventListener('mousedown', playSound);
  $buttons.addEventListener('mouseup', stopSound);

  setInitialState();


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

  function newGame() {
    setInitialState();
    setInitialDisplay();
    toggleInteractive();
    computerPlays();
  }

  // Adds color to pattern sequence
  function addColor() {
    const newColor = [generateRandomColor()];
    updateState({ pattern: state.pattern.concat(newColor) });
  }

  function toggleStrictMode() {
    const toggle = !state.strict;
    updateState({ strict: toggle });
    if (state.strict) {
      $strictBtn.classList.add('active');
    } else {
      $strictBtn.classList.remove('active');
    }
  }

  function generateRandomColor() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  }

  // Recursive operation that cycles through the sequence pattern, activating each button
  function playSequence(index = 0) {
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

  function computerPlays() {
    updateState({ userTurn: false });
    toggleInteractive();
    playSequence()
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

  // Toggles interactivity with the game board
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

  // Runs when user clicks a pattern button
  function play(e) {
    const btn = e.target.value;
    const isCorrect = (btn === state.pattern[state.counter]);
    const lastLevel = (state.pattern.length === 20);
    let patternFinished;
    if (isCorrect) {
      increaseCounter();
      patternFinished = (state.counter >= state.pattern.length);
      if (patternFinished && lastLevel) {
        updateFeedback('You Win!');
      } else if (patternFinished) {
        setNextLevel();
      }
    } else if (state.strict) {
      errorSound();
      newGame();
    } else {
      errorSound();
      updateState({ counter: 0 });
      computerPlays();
    }
  }

  // Runs once user has successfully clicked through current pattern sequence
  function setNextLevel() {
    updateState({ counter: 0 });
    addColor();
    setCounterDisplay();
    setSpeed();
    computerPlays();
  }

  // Increases the counter by one
  function increaseCounter() {
    const addToCounter = state.counter + 1;
    updateState({ counter: addToCounter });
  }

  // Determines the speed at which the sequence is played back (gets faster as sequence grows)
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

  function updateFeedback(text) {
    $feedback.innerHTML = text;
  }

  function setCounterDisplay() {
    $counter.innerHTML = state.pattern.length;
  }

  function setInitialDisplay() {
    setCounterDisplay();
    $startBtn.classList.remove('btn--glow');
    updateFeedback('');
  }

})();