(() => {
  'use strict'
  // DOM elements
  const buttons = document.getElementById('game-btns');
  const greenBtn = document.getElementById('green');
  const redBtn = document.getElementById('red');
  const yellowBtn = document.getElementById('yellow');
  const blueBtn = document.getElementById('blue');
  const startBtn = document.getElementById('start-btn');
  const strictBtn = document.getElementById('strict-btn');
  const counter = document.getElementById('counter');

  let patternInterval; // will store pattern interval function (named so we can clear later)

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
  startBtn.addEventListener('click', newGame);
  strictBtn.addEventListener('click', toggleStrictMode);
  buttons.addEventListener('click', play);

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
    console.log(state.pattern);
    playSequence();
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

  function playSequence() {
    let counter = 0;
    while (counter < state.pattern.length) {
      patternInterval = setInterval(() => {
        console.log(state.pattern[color]);
      }, 1000);
      counter += 1;
    }
    clearInterval(patternInterval);
  }




  function updateState(props = {}) {
    state = Object.assign({}, state, props);
  }

  function setInitialState() {
    updateState();
  }

})();