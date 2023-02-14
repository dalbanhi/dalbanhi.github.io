import {Ship} from './ship.js'
import {Shell} from './shell.js'

const OCEAN = 'O';
const HIT_SHIP_PART = 'X';
const HIT_OCEAN = 'L';
const AIRCRAFT_CARRIER_SYM = 'A';
const BATTLESHIP_SYM = 'B';
const DESTROYER_SYM = 'D';
const SUBMARINE_SYM = 'S';
const PATROL_BOAT_SYM = 'P';
const RED = 'rgba(255,0,0,0.75)';
const WHITE = 'rgba(255,255,255,0.75)';
const INVALID_SHOT = 'shoot again';

class Grid {
  constructor(x, y, shipsVisible) {
    this.p = window.p5.instance;
    this.xStart = x;
    this.yStart = y;
    this.shipsVisible = shipsVisible;
    this.shootable = false;
    this.sqSize = 40;
    this.gridSize = 10;
    this.myGrid = [...Array(this.gridSize)].map(e => Array(this.gridSize).fill(OCEAN));
    this.color = {r: 9, g: 129, b: 209}
    //make ships
    this.myShips = [];
    this.myShips.push(new Ship(this, "Aircraft Carrier", 5, null, null,0));
    this.myShips.push(new Ship(this, "Battleship", 4, null, null,1));
    this.myShips.push(new Ship(this, "Destroyer", 3, null, null,2));
    this.myShips.push(new Ship(this, "Submarine", 3, null, null,3));
    this.myShips.push(new Ship(this, "Patrol Boat", 2, null, null,4));

    this.minisYStart = this.yStart + (this.sqSize * this.gridSize) + this.sqSize;
    //empty shells list
    this.myShells = [];
  }

  mouseInRange(x, y){
    let rightEdge = this.xStart + (this.sqSize * this. gridSize);
    let bottomEdge = this.yStart + (this.sqSize * this. gridSize);
    if(this.shootable){
      if(x >= this.xStart && x <= rightEdge){
        if(y >= this.yStart && y <= bottomEdge){
          return true;
        }
      }
    }
    return false;
  }

  //method to get the grid coord from the raw mouseX/mouseY vars
  getCoordFromRaw(rawX,rawY){
    let coord = {x: parseInt((rawX - this.xStart)/this.sqSize), y: parseInt((rawY-this.yStart)/this.sqSize)};
    // console.log("coord: " + JSON.stringify(coord));
    return coord;
  }

  checkFleetHealth(){
    let gameOver = false;
    for(let ship of this.myShips){
      //if any ship is still alive, game continues
      if(!ship.dead){
        return gameOver;
      }
    }
    gameOver = true;
    return gameOver;
  }

  //switch statement (can be expanded with more ships?)
  getShipFromSym(sym){
    let s;
    switch(sym){
      case AIRCRAFT_CARRIER_SYM:
        s = this.myShips[0];
        break;
      case BATTLESHIP_SYM:
        s = this.myShips[1];
        break;
      case DESTROYER_SYM:
        s = this.myShips[2];
        break;
      case SUBMARINE_SYM:
        s = this.myShips[3];
        break;
      case PATROL_BOAT_SYM:
        s = this.myShips[4];
        break;
    }
    return s;
  }

  //called if a ship is hit
  updateShips(shipSym){
    //get the correct ship
    let ship = this.getShipFromSym(shipSym);
    ship.loseHealth();
    if(ship.health === 0){
      ship.die();
    }
    return this.checkFleetHealth();
  }

  shot(rawX,rawY){
    let gameOver = false;
    let coord = this.getCoordFromRaw(rawX, rawY);
    //get current coord being hit
    let coordToHit = this.myGrid[coord.x][coord.y];
    //if not already shot
    if(coordToHit !== HIT_SHIP_PART && coordToHit !== HIT_OCEAN){
      //valid hit
      if(coordToHit === OCEAN){
        this.myGrid[coord.x][coord.y] = HIT_OCEAN;
        //add a shell of color white
        let white = this.p.color(WHITE);
        this.myShells.push(new Shell(this, coord.x, coord.y, white));
      }
      else{
        let hitShipSym = this.myGrid[coord.x][coord.y];
        // check if game over and update ships
        gameOver = this.updateShips(hitShipSym);
        this.myGrid[coord.x][coord.y] = HIT_SHIP_PART;
        //add a shell of color red
        let red = this.p.color(RED);
        this.myShells.push(new Shell(this, coord.x, coord.y, red));
      }
    }
    else{
      return INVALID_SHOT;
    }
    return gameOver;
  }

  setShootable(shootable){
    this.shootable = shootable;
  }
  setXStart(newXStart){
    this.xStart = newXStart;
  }

  changeShipsViz(newViz){
    this.shipsVisible = newViz;
    for(let ship of this.myShips){
      ship.setViz(newViz)
    }
  }

  //called by the grid's ships. Tries to place in the grid
  tryToPlace(shipCoords, name){
    for(let c of shipCoords){
      if(this.myGrid[c.x][c.y] !== OCEAN){
        return false;
      }
    }
    //if currently unoccupied, place
    for (let c of shipCoords){
      this.myGrid[c.x][c.y] = name[0];
    }
    return true;
  }

  //for debugging only
  //make private?
  internalGridToConsole(){
    for(let i = 0; i < this.myGrid.length; i++){
      let rowStr = '';
      for(let col of this.myGrid){
        rowStr += col[i] + " ";
      }
      console.log(rowStr);
    }
  }

  allShipsArePlaced(){
    for (let ship of this.myShips){
      if(!ship.placed){
        return false;
      }
    }
    return true;
  }

  drawShells(){
    for(let shell of this.myShells){
        shell.renderShell();
    }
  }

  drawShips(){
    for(let ship of this.myShips){
        ship.renderShip();
    }
  }

  drawSquares() {
    this.p.stroke(this.color.r,this.color.g,this.color.b);
    this.p.fill(255,255,255);
    for(let row = 0; row < 10; row++){
      for(let col = 0; col < 10; col++){
        this.p.rect(this.xStart + (this.sqSize*row), this.yStart + (this.sqSize*col), this.sqSize, this.sqSize);
      }
    }
    //if grid is shootable, add blue border around it
    if(this.shootable){
      this.p.noFill();
      this.p.stroke(0,0,255);
      this.p.strokeWeight(5);
      this.p.rect(this.xStart, this.yStart,this.sqSize * this.gridSize, this.sqSize*this.gridSize);
    }
    this.p.noStroke();
    this.p.fill(0);
    this.p.strokeWeight(1);
  }

  renderGrid(){
    this.drawSquares();
    this.drawShips();
    this.drawShells();
  }
}

export {Grid};
