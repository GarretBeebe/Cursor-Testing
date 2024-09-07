const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

class Minesweeper {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.board = this.createBoard();
    this.placeMines();
  }

  createBoard() {
    return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (this.board[row][col] !== -1) {
        this.board[row][col] = -1;
        minesPlaced++;
      }
    }
    this.calculateNumbers();
  }

  calculateNumbers() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] !== -1) {
          this.board[row][col] = this.countAdjacentMines(row, col);
        }
      }
    }
  }

  countAdjacentMines(row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r;
        const newCol = col + c;
        if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
          if (this.board[newRow][newCol] === -1) count++;
        }
      }
    }
    return count;
  }

  revealCell(row, col) {
    if (this.board[row][col] === -1) {
      return { gameOver: true, board: this.board };
    }
    return { gameOver: false, value: this.board[row][col] };
  }
}

let game;

app.post('/new-game', (req, res) => {
  const { rows, cols, mines } = req.body;
  game = new Minesweeper(rows, cols, mines);
  res.json({ message: 'New game started' });
});

app.post('/reveal', (req, res) => {
  const { row, col } = req.body;
  const result = game.revealCell(row, col);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Minesweeper microservice listening at http://localhost:${port}`);
});