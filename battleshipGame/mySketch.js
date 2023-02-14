import {Game} from './modules/game.js'

let myGame;
const GAME_WIDTH = 1080;
const GAME_HEIGHT = 720;


window.mousePressed = function(){
  myGame.handleMousePress(mouseX, mouseY);
}

window.keyPressed = function(){
  myGame.handleKeyPress(keyCode);
}

window.setup = function() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  myGame = new Game(GAME_WIDTH, GAME_HEIGHT);
}

window.draw = function() {
  //TODO: how to pass down/export constants

  myGame.renderGame(GAME_WIDTH, GAME_HEIGHT);
}
