"use strict";

class Game {
  constructor(height = 6, width = 7, p1, p2) {
    this.width = width;
    this.height = height;
    this.currPlayer = p1; // active player: 1 or 2
    this.makeBoard(); // array of rows, each row is array of cells  (board[y][x])
    this.p1 = p1;
    this.p2 = p2;
    console.log(this.board);
    // (board[5][0] would be the bottom-left spot on the board)
    this.makeHtmlBoard();
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array.from({ length: this.width }).fill(null);
      this.board.push(emptyRow);
    }
  }

  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses this.width to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
   *    (return null if filled) */

  placeInTable(y, x) {
    console.log("this.currPlayer", this.currPlayer);
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    startGame();
  }

  #win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match this.currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  }

  checkForWin() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (this.#win(horiz) || this.#win(vert) || this.#win(diagDR) || this.#win(diagDL)) {
          return true;
        }
      }
    }
    return false;
  }

  handleClick = (evt) => {
    console.log("handleClick: ", this.currPlayer);
    // get x from ID of click:ed cell
    const x = Number(evt.target.id.slice("top-".length));

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie: if top row is filled, board is filled
    if (this.board[0].every((cell) => cell !== null)) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  };

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      console.log(y, x);
      if (this.board[y][x] === null) {
        console.log("found", y);
        return y;
      }
    }
    return null;
  }

  destroy() {
    document.getElementById("board").innerHTML = "";

    this.board = [];
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

let game;

function startGame() {
  console.log("startGame");
  if (game) {
    console.log("destroying game");
    game.destroy();
  }

  document.getElementById("start").style.display = "none";
  document.getElementById("restart").style.display = "block";

  const player1 = new Player("red");
  const player2 = new Player("blue");

  game = new Game(6, 7, player1, player2);
}
