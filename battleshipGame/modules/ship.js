const MINI_SZ = 10;

class Ship {
  constructor(grid, name, length, gridX, gridY, num){
    this.p = window.p5.instance;
    this.myGrid = grid;
    this.name = name;
    this.length = length;
    this.orientation = "horizontal";
    this.visible = false;;
    this.placed = false;
    this.x = gridX;
    this.y = gridY;
    this.num = num;
    this.w = length;
    this.h = 1;
    this.color = this.p.color('rgba(132,132,130,1)');
    this.curColor = this.color;
    this.choosingColor = this.p.color('rgba(132, 132, 130, 0.5)');
    this.health = length;
    this.dead = false;
    //add ship health -- shells?
  }

  die(){
    // alert(this.name + " was sunk!")
    this.dead = true;
  }

  loseHealth(){
    this.health --;

  }

  changeColor(){
    if(this.curColor === this.color){
      this.curColor = this.choosingColor;
    }
    else{
      this.curColor = this.color;
    }
  }

  setViz(newViz){
    this.visible = newViz;
    //if ship has not been initialized, set it at the top right of the grid
    if(this.x == null && this.y == null){
      this.x = 0;
      this.y = 0;
    }
  }
  changeOrient(){

    if(this.isInBounds(this.x, this.y, this.h, this.w)){
      if(this.orientation == "horizontal"){
        this.orientation = "vertical";
      }
      else {
        this.orientation = "horizontal";
      }
      let temp = this.w;
      this.w = this.h;
      this.h = temp;
    }
    else {
      console.log("Cannot flip without going out of bounds.")
    }

  }

  isInBounds(x,y,w,h){
    if(x >= 0){
      if((x + w) <= this.myGrid.gridSize){
        if(y >= 0){
          if((y + h) <= this.myGrid.gridSize){
            return true;
          }
        }
      }
    }
    return false;
  }

  place(){
    if(this.canPlace()){
      // this.myGrid.internalGridToConsole();
      this.curColor = this.color;
      this.placed = true;
    }
  }

  toCoords(){
    let coords = [];

    if(this.orientation == "horizontal"){
      for(let i = this.x; i < this.x + this.length; i ++){
        const coord = {x: i, y: this.y};
        coords.push(coord);
      }
    }
    else{
      for(let i = this.y; i < this.y + this.length; i++){
        const coord = {x: this.x, y: i};
        coords.push(coord);
      }
    }
    return coords;
  }

  canPlace(){
    return this.myGrid.tryToPlace(this.toCoords(), this.name);
  }

  move(x,y){
    if(this.isInBounds(x,y, this.w, this.h)){
      this.x = x;
      this.y = y;
    }
  }

  drawMini(){
    let miniXStart = this.myGrid.xStart + (this.num* this.myGrid.sqSize * 2)
    this.p.fill(this.curColor);
    this.p.stroke(0,0,0);
    for (let x = 0; x < this.length; x++){
      this.p.rect(miniXStart + x * (MINI_SZ), this.myGrid.minisYStart, MINI_SZ,MINI_SZ);
    }
    this.p.fill(0,0,0);
    this.p.noStroke();

    if(this.dead){
      this.p.stroke(255,0,0);
      this.p.strokeWeight(2);
      //draw red x
      let x1 = miniXStart;
      let y1 = this.myGrid.minisYStart;
      let x2 = x1 + (MINI_SZ * this.length);
      let y2 = y1 + MINI_SZ;
      this.p.line(x1, y1, x2, y2);
      this.p.line(x1, y2, x2, y1);

    }
  }

  renderShip(){

    if(this.dead){
      this.visible = true;
      this.curColor = this.p.color('rgba(163, 117, 112, 0.95)')
    }

    this.drawMini();

    if(this.visible === true){
      let xPlace = this.myGrid.xStart + (this.x * this.myGrid.sqSize);
      let yPlace = this.myGrid.yStart + (this.y * this.myGrid.sqSize);

      let w = this.w * this.myGrid.sqSize;
      let h = this.h * this.myGrid.sqSize;
      this.p.fill(this.curColor);
      this.p.stroke(0,0,0);
      this.p.rect(xPlace, yPlace, w, h);
      this.p.fill(0,0,0);
      this.p.noStroke();
    }
  }
}

export {Ship};
