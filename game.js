/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/
const applicationState = {
  isGameOver: false,
  currentUser: null,
  highScore: {
    user: null,
    score: null,
    date: null,
  },
  gameHistory: [
    // `{ user: "Chloe", score: 21, date: "Thu Oct 01 2019 15:11:51 GMT-6000" },
    // { user: "Duc", score: 19, date: "Thu Sep 03 2019 15:11:51 GMT+0700" },
    // { user: "Huy", score: 18, date: "Thu Oct 03 2019 15:11:51 GMT+0700" }`
  ]
};

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let setIntervalId; // timer will be assign to this variable
let startTime = Date.now();
const SECONDS_PER_ROUND = 10;
let elapsedTime = 0;

function loadImages() { // iff want to add more charactor, can use here 
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/15388/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}
/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width/4;
let heroY = canvas.height/4;

let monsterX = 200;
let monsterY = 200;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}
let score = 0; // khanh add
let historyForUser = []; // khanh add
historyForUser = historyForUser.push(score) + historyForUser.push(score);

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  // if((SECONDS_PER_ROUND - elapsedTime) <= 0) {
  //   return;
  // } 
  if (38 in keysDown) { // Player is holding up key
    heroY -= 10;
    if (heroY < 0) { // khanh changed
      heroY = canvas.height;
    }
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 10;
    if (heroY > canvas.height) { // khanh changed (top to bottom)
      heroY = 0;
    }
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 10;
    if (heroX < 0) { // khanh changed
      heroX = canvas.width;
    }
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 10;
    if (heroX > canvas.width) { // khanh changed (left to right)
      heroX = 0;
    }
  }
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    // monsterX = monsterX + 50;
    // monsterY = monsterY + 70;
    monsterX =  Math.random()*(canvas.width-32); // Khanh check to see random monsterX
    monsterY =  Math.random()*(canvas.height-32); // Khanh check to see random monsterY
    score = score + 1;
    
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () { // draw the image whenever we 
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
  
  
  const scoreMessage = `your score is: ${score}`;
  let scoreForUser =document.getElementById("scoreForUser");
  scoreForUser.innerHTML = scoreMessage;
  
  let historyForUser = document.getElementById("historyForUser");
  //const historyMessage = `your history is: ${historyForUser}`; //khanh add to check history
  historyForUser.innerHTML = scoreMessage;

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update(); 
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main); // call main again;
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages(); // bring the image
setupKeyboardListeners(); // setup the keyboar listener
main(); // main part of the game;





