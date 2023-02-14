import {Player} from './player.js';
import {Grid} from './grid.js'


const GAME_WIDTH = 1080;
const HALF_WIDTH = GAME_WIDTH/2;
const GAME_HEIGHT = 720;
const TITLE_FONT_SZ = 32;
const TEXT_FONT_SZ = 16;
const INSTRUCT_FONT_SZ = 12;
const INSTRUCT_X_START = 100;
const INSTRUCT_Y_START = 100;
const INSTRUCT_BOX_W = 400;
const INSTRUCT_BOX_H = 400;
const GAME_X_OFFSET = 50;
const GAME_Y_OFFSET = GAME_X_OFFSET * 2;
const SPACE_KEY_CODE = 32;
const INVALID_SHOT = 'shoot again';

class Game {
  constructor(game_width, game_height) {
    this.p = window.p5.instance;
    this.gameStage = "CHOOSE GAME MODE";
    this.gameMode;
    this.gameStarted = false;

    this.p1 = null;
    this.p2 = null;
    this.turn = 1;
    this.activelyPlacingShip = null;

    this.shootableGrid = null;

    this.gameOver = false;
    this.winningPlayer = null;

  }

  moveAndPlaceShip(keyCode){
    if (keyCode === SPACE_KEY_CODE){
      this.activelyPlacingShip.changeOrient();
    }
    else if(keyCode === LEFT_ARROW){
      this.activelyPlacingShip.move(this.activelyPlacingShip.x - 1, this.activelyPlacingShip.y);
    }
    else if(keyCode === RIGHT_ARROW){
      this.activelyPlacingShip.move(this.activelyPlacingShip.x + 1, this.activelyPlacingShip.y);
    }
    else if(keyCode === UP_ARROW){
      this.activelyPlacingShip.move(this.activelyPlacingShip.x, this.activelyPlacingShip.y - 1);
    }
    else if(keyCode === DOWN_ARROW){
      this.activelyPlacingShip.move(this.activelyPlacingShip.x, this.activelyPlacingShip.y + 1);
    }
    else if(keyCode === ENTER){
      this.activelyPlacingShip.place();
    }
  }
  
  handleKeyPress(keyCode){
    if(this.gameStage === "PLACING SHIPS"){
      this.moveAndPlaceShip(keyCode);
    }
  }
  //TODO: change all constants to consts ? 
  getActivePlayer(){
    if(this.turn === 1){
      return this.p1
    }
    else{
      return this.p2;
    }
  }

  handleMousePress(mouseX, mouseY){
    if(this.gameStage === "SHOOTING STAGE"){
      if(this.shootableGrid.mouseInRange(mouseX, mouseY)){
        //gets whether the game is over based on the shot
        this.gameOver = this.shootableGrid.shot(mouseX, mouseY);
        if(this.gameOver !== INVALID_SHOT){
          if(this.gameOver){
            this.gameStage = "GAME OVER";
            this.winningPlayer = this.getActivePlayer();
          }
          else{
            this.changeTurn();
          } 
        }
      }
    }
  }


  changeTurn(){
    if(this.turn === 1){
      this.turn = 2;
      this.p2.myGrid.setShootable(false);
      this.p1.myGrid.setShootable(true);
      this.shootableGrid = this.p1.myGrid;
    }
    else{
      this.turn = 1;
      this.p1.myGrid.setShootable(false);
      this.p2.myGrid.setShootable(true);
      this.shootableGrid = this.p2.myGrid;
    }
  }

  setActivePlayer(num){
    if(num === 1){
      this.turn = 1;
    }
    else{
      this.turn = 2;
    }
  }

  resetBackground(){
    this.p.fill(255,255,255);
    this.p.rect(0,0,GAME_WIDTH, GAME_HEIGHT);
    this.p.fill(0,0,0);
  }

  drawHeader() {
    this.resetBackground()
    //draw battleship title
    this.p.fill(0);
    this.p.textSize(TITLE_FONT_SZ);
    let titleWidth = 12 * (TITLE_FONT_SZ/2)
    this.p.text("BATTLESHIP", (GAME_WIDTH- titleWidth)/2, TITLE_FONT_SZ + 10);
    this.p.textSize(TEXT_FONT_SZ);
  }

  //show instructions at a given x,y
  showInstructions(instructions, x, y){
    this.p.textSize(INSTRUCT_FONT_SZ);
    this.p.text(instructions, x, y, INSTRUCT_BOX_W, INSTRUCT_BOX_H);
    this.p.textSize(TEXT_FONT_SZ);
  }

  //method to run actively choosing of ships
  activePlayerChooseShips(){
    //choose ship to be placed
    for(let curShip of this.getActivePlayer().myGrid.myShips){
      //get first ship not yet placed
      if(!curShip.placed){
        this.activelyPlacingShip = curShip;
        break;
      }
    }
    this.showInstructions("Placing " + this.activelyPlacingShip.name + "...", INSTRUCT_X_START, INSTRUCT_Y_START + TEXT_FONT_SZ*4)
    this.activelyPlacingShip.setViz(true);
  }

  twoPlayerChooseShipPlacement(){
    this.showInstructions("Use arrow keys to move ship, spacebar to switch orientation, enter to confirm placement.", INSTRUCT_X_START, INSTRUCT_Y_START);

    if(!this.p1 && !this.p2){
      //initialize players
      this.p1 = new Player("1", GAME_X_OFFSET,  GAME_Y_OFFSET, HALF_WIDTH);
      this.p2 = new Player("2", GAME_X_OFFSET+ HALF_WIDTH, GAME_Y_OFFSET, HALF_WIDTH)

    }

    if(!this.p1.myGrid.allShipsArePlaced()){
      //set current player to 1
      this.setActivePlayer(1);
      this.activePlayerChooseShips();
    }
    else if(!this.p2.myGrid.allShipsArePlaced()){
      this.setActivePlayer(2);
      this.activePlayerChooseShips();
    }
    else{
      //advance to shooting stage
      this.gameStage = "SHOOTING STAGE";
      this.activelyPlacingShip = null;
      //hide ships
      this.p1.myGrid.changeShipsViz(false);
      this.p2.myGrid.changeShipsViz(false);
      this.changeTurn();
    }
  }

  gameModeSelect(choice){
    this.gameMode = choice;
    this.gameStage = "PLACING SHIPS";
    this.p.removeElements();
  }

  renderGameModeChoice(){
    this.p.textSize(TEXT_FONT_SZ);
    let twoPlayerBtn = this.p.createButton('(Local) 2 Player Mode');
    let computerBtn = this.p.createButton('Computer Mode');
    let btnWidth = INSTRUCT_FONT_SZ * (TEXT_FONT_SZ/2)

    twoPlayerBtn.position(((GAME_WIDTH - btnWidth)/2) - btnWidth, GAME_Y_OFFSET);
    twoPlayerBtn.mousePressed(this.gameModeSelect.bind(this, "2PLAYER"));
    computerBtn.position(((GAME_WIDTH - btnWidth)/2) + btnWidth, GAME_Y_OFFSET);
    computerBtn.mousePressed(this.gameModeSelect.bind(this, "1PLAYER"));
  }

  backBtnHandle(){
    this.gameMode = null;
    this.p.removeElements();
    this.renderGameModeChoice();
  }

  renderGame(){
    this.drawHeader();
    if (this.gameStage === "CHOOSE GAME MODE" && !this.gameStarted){
      this.renderGameModeChoice();
      this.gameStarted = true;
    }
    else if (this.gameStage == "PLACING SHIPS"){
      if(this.gameMode == "1PLAYER"){
        this.p.text("NOT IMPLEMENTED YET", HALF_WIDTH, GAME_Y_OFFSET);
        let backBtn = this.p.createButton('Back');
        let btnWidth = INSTRUCT_FONT_SZ * (TEXT_FONT_SZ/2)
        backBtn.position(((GAME_WIDTH - btnWidth)/2) + btnWidth, GAME_Y_OFFSET);
        backBtn.mousePressed(this.backBtnHandle.bind(this));
        //fill in later
      }
      else if(this.gameMode == "2PLAYER"){
        this.twoPlayerChooseShipPlacement();
        if(this.activelyPlacingShip){
          this.activelyPlacingShip.changeColor();
        }
        this.getActivePlayer().renderPlayer();
      }
    }
    else if(this.gameStage =="SHOOTING STAGE"){
      this.showInstructions("Use mouse to fire. Rules are one shot.", INSTRUCT_X_START, INSTRUCT_Y_START);
      this.getActivePlayer().renderPlayer();
      this.shootableGrid.renderGrid();

      if(this.shootableGrid.mouseInRange(mouseX, mouseY)){
        this.p.cursor(CROSS);
      }
      else{
        this.p.cursor(ARROW);
      }
      
    }
    else if(this.gameStage == "GAME OVER"){
      console.log("game over")
      this.showInstructions("GAME OVER! " + "Player "+ this.winningPlayer.number + " wins!", INSTRUCT_X_START, INSTRUCT_Y_START)
      //make both grids visible
      this.p1.myGrid.setShootable(false);
      this.p1.myGrid.changeShipsViz(true);
      this.p2.myGrid.setShootable(false);
      this.p2.myGrid.changeShipsViz(true);
      this.p1.myGrid.renderGrid();
      this.p2.myGrid.renderGrid();
    }

  }
}

export {Game};
