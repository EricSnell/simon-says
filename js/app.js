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

  // Add Event Listeners
  startBtn.addEventListener('click', newGame);
  strictBtn.addEventListener('click', toggleStrictMode);
  buttons.addEventListener('click', play);

  /* STATE
  ** Array that will hold the sequence of colors
  ** Strict mode (boolean)
  ** Number of clicks the user is on (use number as array index when comparing)
  ** Counter (value will be length of button sequence array);
  ** Speed of interval between each button sequence (milliseconds)
  ** Players turn indicator (boolean)
  */

  /* FUNCTIONS
  ** newGame = reset all state values and execute game
  ** generateRandomColor = choose random color out of array of colors and push that to state
  ** playSequence = set interval to cycle through sequence array, executing highlightButton on each
  ** highlightButton = play sound & add active class on the element that corresponds to the array item,
      then remove class using setTimeout (time is ?half? of array sequence interval time)
  ** 
  */
})();