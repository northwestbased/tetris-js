var Tetris = function(parentElement){
  var createShape = function(){
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
  var rotateShape = function(shape){
    var newShape = {locations:[], color:shape.color, name: shape.name, leftCorner: shape.leftCorner};
    if (shape.name === 'I')
      for(var i = 0; i < shape.locations.length; ++i){
        newShape.locations[i] = (shape.locations[i] * 4 + 3) % 17;
      }
    else if (shape.name !== 'O')
      for(var i = 0; i < shape.locations.length; ++i){
        newShape.locations[i] = (shape.locations[i] * 3 + 2) % 10;
      }
    else if(shape.name == 'O')
      newShape = shape;
    return newShape;
  }
  var isValid = function(shape){
    if (shape.name === 'I')
      for (var i = 0; i < shape.locations.length; ++i){
       var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 4);
       var x = shape.leftCorner.x + shape.locations[i] % 4;
       if (y >= 0 && !(boardState[y] && boardState[y][x] && !boardState[y][x].occupied))
         return false;
      }
    else
      for (var i = 0; i < shape.locations.length; ++i){
       var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 3);
       var x = shape.leftCorner.x + shape.locations[i] % 3;
       if (y >= 0 && !(boardState[y] && boardState[y][x] && !boardState[y][x].occupied))
         return false;
      }
    return true;
  }
  var clearRows = function(){
    var scoreToAdd = 10;
    for (var y = 0; y < 20; ++ y) {
      var flag = true;
      for (var x = 0; x < 10; ++ x) {
        if(boardState[y][x].occupied == false)
          flag = false;
      }
      if (flag) {
        boardState.splice(y,1);
        boardState.unshift([])
        for (var j = 0; j < 10; ++j) {
          boardState[0][j] = {'occupied':false, 'color':'white'};
        }
        score += scoreToAdd;
        scoreToAdd += 10;
        if (interval > 80) {
          delay -= 5;
          clearInterval(interval);
          interval = setInterval(tick.bind(this), delay);
        }
      }
    }
  }
  var moveLeft = function(){
    shape.leftCorner.x -= 1;
    if (isValid(shape))
      render();
    else
      shape.leftCorner.x += 1;
  }
  var moveRight = function(){
    shape.leftCorner.x += 1;
    if (isValid(shape))
      render();
    else
      shape.leftCorner.x -= 1;
  }
  var rotate = function() {
    var tempShape = rotateShape(shape);
    if (isValid(tempShape)){
      shape = tempShape;
    }
    render();
  }
  var render = function(){
    context.clearRect(0,0, board.width, board.height);
    context.lineWidth = "5";
    for (var y = 0; y < boardState.length; ++y){
      for (var x = 0; x < boardState[y].length; ++x){
        if(boardState[y][x].color !== "white")
        context.beginPath();
        if(boardState[y][x].color !== "white")
        context.fillStyle = boardState[y][x].color;
        if(boardState[y][x].color !== "white")
        context.fillRect(x*40, y*40, 40, 40);
        if(boardState[y][x].color !== "white")
        context.rect(x*40, y*40, 40, 40);
        if(boardState[y][x].color !== "white")
          context.stroke();
      }
    }
    if (shape.name === 'I')
      for (var i = 0; i < shape.locations.length; ++i){
        var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 4);
        var x = shape.leftCorner.x + shape.locations[i] % 4;
        if(y >= 0) {
          context.beginPath();
          context.fillStyle = shape.color;
          context.fillRect(x*40, y*40, 40, 40);
          context.rect(x*40, y*40, 40, 40);
          context.stroke();
       }
     }
    else
      for (var i = 0; i < shape.locations.length; ++i){
        var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 3);
        var x = shape.leftCorner.x + shape.locations[i] % 3;
        if (y >= 0) {
          context.beginPath();
          context.fillStyle = shape.color;
          context.fillRect(x*40, y*40, 40, 40);
          context.rect(x*40, y*40, 40, 40);
          context.stroke();
        }
      }
      scoreTag.innerHTML = score;
  }
  var saveShape = function(){
    if (shape.name === 'I')
      for (var i = 0; i < shape.locations.length; ++i){
       var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 4);
       var x = shape.leftCorner.x + shape.locations[i] % 4;
       boardState[y][x].color = shape.color;
       boardState[y][x].occupied = true;
      }
    else
      for (var i = 0; i < shape.locations.length; ++i){
       var y = shape.leftCorner.y + Math.floor(shape.locations[i] / 3);
       var x = shape.leftCorner.x + shape.locations[i] % 3;
       boardState[y][x].color = shape.color;
       boardState[y][x].occupied = true;
      }
  }
  var tick = function(){
    shape.leftCorner.y += 1;
    if(!isValid(shape)){
      shape.leftCorner.y -= 1;
      if (shape.leftCorner.y < -1){
        score += ", game over!";
        clearInterval(interval);
      }
      else {
        saveShape();
        shape = createShape();
      };
    }
    clearRows();
    render();
  }
  var board = parentElement;
  var scoreTag = document.getElementById("score");

  window.onkeydown = function (e){
    var code = e.keyCode ? e.keyCode : e.which;
     switch (code){
       case 37:
         moveLeft();
         break;
       case 38:
         rotate();
         break;
       case 39:
         moveRight();
         break;
       case 40:
         tick();
     }
  }
  var score,
      shape,
      delay,
      interval,
      context;
  
  return { 
    start :function () {
    boardState = [];
      if (interval)
        clearInterval(interval);
      for (var i = 0; i < 20; ++i){
        boardState[i] = [];
        for (var j = 0; j < 10; ++j)
          boardState[i][j] = {'occupied':false, 'color':'white'};
      }
      score = 0;
      shape = createShape();
      delay = 300; 
      interval = setInterval(tick.bind(this), delay);
      board.width = 400;
      board.height = 800;
      context = board.getContext("2d");
      render();
    }
  }
};

var tetris = Tetris(document.getElementById("tetrisCanvas"));
tetris.start();
var restart = document.getElementById("restart");

restart.onclick = function(){
  tetris.start()
}
