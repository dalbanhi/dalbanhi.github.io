
class Shell {
  constructor(grid,gridX, gridY, color){
    this.p = window.p5.instance;
    this.myGrid = grid;
    this.x = gridX;
    this.y = gridY;
    this.color = color;
  }

  renderShell(){

      let xPlace = this.myGrid.xStart + (this.x * this.myGrid.sqSize) + this.myGrid.sqSize/2;
      let yPlace = this.myGrid.yStart + (this.y * this.myGrid.sqSize) + this.myGrid.sqSize/2;

      this.p.fill(this.color);
      this.p.stroke(0,0,0);
      this.p.circle(xPlace, yPlace, this.myGrid.sqSize*(2/3));
      this.p.fill(0,0,0);
      this.p.noStroke();
  }
}

export {Shell};
