var canvas;
var ctx;
const handleChange = () => {
  var cod = document.getElementById("vel").value;
  fps = cod;
  console.log(fps);
};
var fps = 3;
// canvas
var canvasX = 500;
var canvasY = 500;
var tileX, tileY;
// board to matriz logic
var board;
var rows = 40;
var columns = 40;
//colors
var white = "white";
var black = "black";

var stop2 = false;

//matriz of array
const array2D = (rows, columns) => {
  var arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(columns);
  }
  return arr;
};

// this is the pixel that above the logic
class celda {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.nextState = this.state;

    this.vecinos = [];
  }

  addVecinos() {
    var xVecino, yVecino;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        xVecino = (this.x + j + columns) % columns;
        yVecino = (this.y + i + rows) % rows;

        if (i != 0 || j != 0) {
          this.vecinos.push(board[yVecino][xVecino]);
        }
      }
    }
  }
  /*
        [(-1,-1),(0,-1),(1,-1)]
        [(-1,0),(0,0),(1,0)]
        [(1,1),(0,1),(1,1)]
    */
  draw() {
    var color;
    if (this.state == 1) {
      color = white;
    } else {
      color = black;
    }

    ctx.fillStyle = color;
    ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
  }

  //leyes de conway
  nuevoCiclo() {
    var sum = 0;
    // console.log(this.nextState);

    //cantidad de vecinos vivos
    for (let i = 0; i < this.vecinos.length; i++) {
      sum += this.vecinos[i].state;
    }

    //normas
    this.nextState = this.state;

    //Muerte: tiene menos de 2 o mas de 3
    if (sum < 2 || sum > 3) {
      this.nextState = 0;
    }

    //Vida reproduccion: tiene exactamente 3 vecinos
    if (sum === 3) {
      this.nextState = 1;
    }
  }

  mutacion() {
    this.state = this.nextState;
  }
}

const start = () => {
  //canvas dom element
  canvas = document.getElementById("canvas");
  //contexto
  ctx = canvas.getContext("2d");
  // size of canvas
  canvas.width = canvasX;
  canvas.height = canvasY;
  //size tiles or celdas
  tileX = Math.round(canvasX / rows);
  tileY = Math.round(canvasY / columns);
  //crate a board matriz
  board = array2D(rows, columns);
  //START THE celdas states and board logic
  startBoard(board);
};

const startBtn = () => {
  stop2 = true;
  setInterval(() => {
    if (stop2) {
      //main
      main();
    }
  }, 1000 / fps);
};

const stopBtn = () => (stop2 = false);

const startBoard = (obj) => {
  var state;
  // generate automatic states of celdas of the board
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      state = Math.floor(Math.random() * 2);
      obj[i][j] = new celda(i, j, state);
    }
  }

  // find the vecinos of each celda
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      obj[i][j].addVecinos();
    }
  }
};

const drawBoard = (obj) => {
  // draw celdas
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      obj[i][j].draw();
    }
  }
  //cal next cicle
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      obj[i][j].nuevoCiclo();
    }
  }
  //apply mutation
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      obj[i][j].mutacion();
    }
  }
};

// this clean the canvas
const deleteCanvas = () => {
  // resize of canvas
  canvas.width = canvasX;
  canvas.height = canvasY;
};

const main = () => {
  deleteCanvas();
  drawBoard(board);
};
