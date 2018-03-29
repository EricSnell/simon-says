(() => {
  'use strict'
  // DOM elements
  const buttonsNodeList = document.getElementsByClassName('game__button');
  const $buttons = document.getElementById('game-btns');
  const $greenBtn = document.getElementById('green');
  const $redBtn = document.getElementById('red');
  const $yellowBtn = document.getElementById('yellow');
  const $blueBtn = document.getElementById('blue');
  const $startBtn = document.getElementById('start-btn');
  const $strictBtn = document.getElementById('strict-btn');
  const $counter = document.getElementById('counter');

  // For testing purposes
  const $log = document.getElementById('dev-log')

  // State
  let state = {
    pattern: [],  // holds the sequence of colors
    clicks: 0,    // number of clicks the user is on (use number as array index when comparing)
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
  ** generateRandomColor = choose random color out of array of colors and push that to state
  ** playSequence = set interval to cycle through sequence array, executing highlightButton on each
  ** playSound = plays sound that corresponds to color value
  ** highlightButton = adds active class on the element that corresponds to the array item,
      then remove class using setTimeout (time is ?half? of array sequence interval time)
  ** 
  */

  function newGame() {
    setInitialState();
    const newColor = [generateRandomColor()];
    updateState({ pattern: state.pattern.concat(newColor) });
    $log.innerHTML = state.pattern;
    playSequence(0);
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
      console.log('PATTERN FINISHED PLAYING - USERS TURN');
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

  function play() {
    console.log('user pushes button');
  }

  function updateState(props = {}) {
    state = Object.assign({}, state, props);
  }

  function setInitialState() {
    updateState();
  }

})();