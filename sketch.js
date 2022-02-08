let w;
let columns;
let rows;
let board;
let next;

function setup() {
  createCanvas(854, 480); // change 854 , 480 to your resolution of liking
  radio = createRadio();
  radio.option('Input');
  radio.option('Simulate');
  radio.option('Random');
  radio.option('Reset');
  radio.style('width', '400px');
  slider = createSlider(1, 255, 100);
  slider.position(10, 10);
  slider.style('width', '80px');
  w = 10; // change this value to change the size of a single cell
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function draw() {
  clear();
  let val = radio.value();
  
  let val2 = slider.value();
  frameRate(val2);
  
  if(val == 'Simulate') {
    generate();
    for ( let i = 0; i < columns;i++) {
      for ( let j = 0; j < rows;j++) {
        if ((board[i][j] == 1)) fill(0);
        else fill(255);
        stroke(0);
        rect(i * w, j * w, w-1, w-1);
      }
    }
  }
  if(val == 'Random') {
    generate();
    for ( let i = 0; i < columns;i++) {
      for ( let j = 0; j < rows;j++) {
        if ((board[i][j] == 1)) fill(0);
        else fill(255);
        stroke(0);
        rect(i * w, j * w, w-1, w-1);
      }
    }
  }
  if(val == 'Input') {
    background(255);
    for ( let i = 0; i < columns;i++) {
      for ( let j = 0; j < rows;j++) {
        if ((board[i][j] == 1)) fill(0);
        else fill(255);
        stroke(0);
        rect(i * w, j * w, w-1, w-1);
      }
    }
  }
  
  if(val == 'Reset') {
    for ( let i = 0; i < columns;i++) {
      for ( let j = 0; j < rows;j++) {
        board[i][j] = 0;
      }
    }
    background(255);
    for ( let i = 0; i < columns;i++) {
      for ( let j = 0; j < rows;j++) {
        if ((board[i][j] == 1)) fill(0);
        else fill(255);
        stroke(0);
        rect(i * w, j * w, w-1, w-1);
      }
    }
  }
}

function mousePressed() {
  let val = radio.value();
  if(val == 'Random'){
    init();
  }
  if(val == 'Input') {
    stroke(0);
    board[parseInt(mouseX / w)][parseInt(mouseY / w)] = 1;
  }
}

// Fill board randomly
function init() {
  let val = radio.value();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 0;
      // Filling the rest randomly
      
      else {
        if(val == 'Random') {
          board[i][j] = floor(random(2));
        }
      }
      next[i][j] = 0;
    }
  }
}

// The process of creating the new generation
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      neighbors -= board[x][y];
      // Rules of Life
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
      else                                             next[x][y] = board[x][y]; // Stasis
    }
  }

  // Swap!
  let temp = board;
  board = next;
  next = temp;
}