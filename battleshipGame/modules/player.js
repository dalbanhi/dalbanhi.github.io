import {Grid} from './grid.js';

class Player {
  constructor(numPlayer, myGridXOffset, yOffset, mid){
    this.p = window.p5.instance;
    this.myGrid = new Grid(myGridXOffset, yOffset*2, true);
    this.number = numPlayer;
    this.xOff = myGridXOffset;
    this.yOff = yOffset;
    this.midX = mid;
  }

  renderPlayer(){
    //render player name
    this.p.text("Player " + this.number + "\'s turn", this.midX - this.myGrid.sqSize*2, this.yOff);
    //render player grid
    this.myGrid.renderGrid();
  }
}

export {Player};
