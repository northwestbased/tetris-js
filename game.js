var Tetris = function(parentElement){
  this.createShape = function(){
    var shapes = [
      {name:'I', locations:[8,9,10,11], leftCorner:{y:-2, x:3}, color: 'red'},
      {name:'J', locations:[3,4,5,8], leftCorner:{y:-2, x:3}, color: 'green'},
      {name:'L', locations:[3,4,5,6], leftCorner:{y:-2, x:3}, color: 'blue'},
      {name:'O', locations:[3,4,6,7], leftCorner:{y:-2, x:3}, color: 'purple'},
      {name:'S', locations:[4,5,6,7], leftCorner:{y:-2, x:3}, color: 'magenta'},
      {name:'T', locations:[3,4,5,7], leftCorner:{y:-2, x:3}, color: 'orange'},
      {name:'Z', locations:[3,4,7,8], leftCorner:{y:-2, x:3}, color: 'cyan'}
    ];
    return shapes[Math.floor(Math.random()*shapes.length)];
  };
  this.rotateShape = function(shape){
    var newShape = {locations:[], color:shape.color, name: shape.name, leftCorner: shape.leftCorner};
    if (shape.name === 'I')
      for(var i = 0; i < shape.locations.length; ++i){
        newShape.locations[i] = (shape.locations[i] * 4 + 3) % 17;
      }
    else if (shape.name !== 'O')
      for(var i = 0; i < shape.locations.length; ++i){
        newShape.locations[i] = (shape.locations[i] * 3 + 2) % 10;
      }
    else if(shape.name == '0')
      newShape = shape;
    return newShape;
  }
  this.isValid = function(shape){
    if (shape.name === 'I')
      for (var i = 0; i < shape.locations.length; ++i){
       var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 4);
       var x = shape.leftCorner.x + shape.locations[i] % 4;
       if (y >= 0 && !(this.boardState[y] && this.boardState[y][x] && !this.boardState[y][x].occupied))
         return false;
      }
    else
      for (var i = 0; i < shape.locations.length; ++i){
       var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 3);
       var x = shape.leftCorner.x + shape.locations[i] % 3;
       if (!(this.boardState[y] && this.boardState[y][x] && !this.boardState[y][x].occupied))
         return false;
      }
    return true;
  }
  this.clearRows = function(){
    var scoreToAdd = 10;
    for (var y = 0; y < 20; ++ y) {
      var flag = true;
      for (var x = 0; x < 10; ++ x) {
        if(this.boardState[y][x].occupied == false)
          flag = false;
      }
      if (flag) {
        this.boardState.splice(y,1);
        this.boardState.unshift([])
        for (var j = 0; j < 10; ++j) {
          this.boardState[0][j] = {'occupied':false, 'color':'white'};
        }
        this.score += scoreToAdd;
        scoreToAdd += 10;
        if (this.interval > 80) {
          this.delay -= 5;
          clearInterval(this.interval);
          this.interval = setInterval(this.tick.bind(this), this.delay);
        }
      }
    }
  }
  this.moveLeft = function(){
    this.shape.leftCorner.x -= 1;
    if (this.isValid(this.shape))
      this.render();
    else
      this.shape.leftCorner.x += 1;
  }
  this.moveRight = function(){
    this.shape.leftCorner.x += 1;
    if (this.isValid(this.shape))
      this.render();
    else
      this.shape.leftCorner.x -= 1;
  }
  this.rotate = function() {
    var tempShape = this.rotateShape(this.shape);
    if (this.isValid(tempShape)){
      this.shape = tempShape;
    }
    this.render();
  }
  this.render = function(){
    for (var y = 0; y < this.boardState.length; ++y){
      for (var x = 0; x < this.boardState[y].length; ++x){
        this.board.children[y].children[x].className = this.boardState[y][x].color;
      }
    }
    if (this.shape.name === 'I')
      for (var i = 0; i < this.shape.locations.length; ++i){
       var y = this.shape.leftCorner.y + Math.floor(this.shape.locations[i] / 4);
       var x = this.shape.leftCorner.x + this.shape.locations[i] % 4;
       if(y >= 0)
         this.board.children[y].children[x].className = this.shape.color;
      }
    else
      for (var i = 0; i < this.shape.locations.length; ++i){
       var y = this.shape.leftCorner.y + Math.floor(this.shape.locations[i] / 3);
       var x = this.shape.leftCorner.x + this.shape.locations[i] % 3;
       if(y >= 0)
         this.board.children[y].children[x].className = this.shape.color;
      }
      this.scoreTag.innerHTML = this.score;
  }
  this.saveShape = function(){
    if (this.shape.name === 'I')
      for (var i = 0; i < this.shape.locations.length; ++i){
       var y = this.shape.leftCorner.y + Math.floor(this.shape.locations[i] / 4);
       var x = this.shape.leftCorner.x + this.shape.locations[i] % 4;
       this.boardState[y][x].color = this.shape.color;
       this.boardState[y][x].occupied = true;
      }
    else
      for (var i = 0; i < this.shape.locations.length; ++i){
       var y = this.shape.leftCorner.y + Math.floor(this.shape.locations[i] / 3);
       var x = this.shape.leftCorner.x + this.shape.locations[i] % 3;
       this.boardState[y][x].color = this.shape.color;
       this.boardState[y][x].occupied = true;
      }
  }
  this.tick = function(){
    this.shape.leftCorner.y += 1;
    if(!this.isValid(this.shape)){
      this.shape.leftCorner.y -= 1;
      if (this.shape.leftCorner.y == -2){
        this.score += ", game over!";
        clearInterval(this.interval);
      }
      if(this.shape.leftCorner.y == -1){
        this.score += ", game over!";
        clearInterval(this.interval);
      }
      this.saveShape();
      this.shape = this.createShape();
    }
    this.clearRows();
    this.render();
  }
  this.board = parentElement;
  this.scoreTag = document.getElementById("score");

  window.onkeydown = function (e){
    var code = e.keyCode ? e.keyCode : e.which;
     switch (code){
       case 37:
         tetris.moveLeft();
         break;
       case 38:
         tetris.rotate();
         break;
       case 39:
         tetris.moveRight();
         break;
       case 40:
         tetris.tick();
     }
  }
  this.start = function interval() {
    this.boardState = [];
    if (this.interval)
      clearInterval(this.interval);
    for (var i = 0; i < 20; ++i){
      this.boardState[i] = [];
      for (var j = 0; j < 10; ++j)
        this.boardState[i][j] = {'occupied':false, 'color':'white'};
    }
    this.score = 0;
    this.shape = this.createShape();
    this.delay = 300; 
    this.render();
    this.interval = setInterval(this.tick.bind(this), this.delay);
  }
};

var tetris = new Tetris(document.getElementsByTagName('tbody')[0]);
tetris.start();
var restart = document.getElementById("restart");

restart.onclick = function(){
  tetris.start()
}
