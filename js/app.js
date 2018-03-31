(() => {
  'use strict'
  // DOM elements
  const buttonsNodeList = document.getElementsByClassName('game__button');
  const $buttons = document.getElementById('game-btns');
  const $startBtn = document.getElementById('start-btn');
  const $strictBtn = document.getElementById('strict-btn');
  const $counter = document.getElementById('counter');

  // For testing purposes
  const $log = document.getElementById('dev-log')

  // State
  let state = {
    pattern: [],  // holds the sequence of colors
    correct: 1,    // number of clicks the user is on (use number as array index when comparing)
    strict: false,
    counter: 0,   // set to length of pattern
    intervalSpeed: 1000, // 1 second between sequence
    userTurn: false
  }

  // Add Event Listeners
  $startBtn.addEventListener('click', newGame);
  $strictBtn.addEventListener('click', toggleStrictMode);
  $buttons.addEventListener('click', play);

  /* FUNCTIONS
  ** newGame = reset all state values and execute game
  ** playSound = plays sound that corresponds to color value
  */

  function newGame() {
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
        highlightButton(color);
        playSequence(count + 1);
      }, state.intervalSpeed);
    } else {
      console.log('********USERS TURN********');
      updateState({ userTurn: true });
      toggleInteractive();
    }
  }

  function highlightButton(color) {
    const btn = document.getElementById(color);
    btn.classList.add('active');
    setTimeout(() => {
      btn.classList.remove('active');
    }, state.intervalSpeed / 2);
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
        console.log('*******COMPUTERS TURN*********');
        updateState({ counter: 0 });
        addColor();
        $counter.innerHTML = state.pattern.length;
        playSequence(0);
      } else {
        console.log('Keep going...');
      }
    } else if (state.strict) {
      console.log('strict>>>WRONG!!! RESET');
      newGame();
    } else {
      console.log('WRONG!!!!');
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
      correct: 1,
      counter: 0,
      intervalSpeed: 1000,
      userTurn: false
    });
  }

  function updateState(props = {}) {
    state = Object.assign({}, state, props);
  }

})();