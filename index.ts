const HEIGHT = 300;
const WIDTH = 300;
const X_COLOUR = 'red';
const O_COLOUR = 'blue';
const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.height = HEIGHT;
canvas.width = WIDTH;

// Play management
canvas.addEventListener('click', (event) => {
  const cellWidth = WIDTH / 3;
  const cellHeight = HEIGHT / 3;

  const c = Math.floor(event.offsetX / cellWidth);
  const r = Math.floor(event.offsetY / cellHeight);

  if (board[r][c] !== '.') {
    return;
  }

  board[r][c] = currentPlayer;
  renderCurrentState(ctx, board);
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (isGameOver(board)) {
    if (winner) {
      alert(`Game Over, ${winner} won`);
      currentPlayer = winner;
      winner = null;
    } else {
      alert('Game Over...');
      currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
    }
    // ctx.clearRect(0, 0, WIDTH, HEIGHT);
    initNewBoard(ctx, board);
  }
});

// Game state
type player = 'X' | 'O';
type cellState = player | '.';
type board = cellState[][];
type winner = player | null;

let board: board = new Array(3).fill(null).map(() => new Array(3).fill('.'));
let currentPlayer: player = 'X';
let winner: winner = null;

initNewBoard(ctx, board);
function renderCurrentState(ctx: CanvasRenderingContext2D, board: board): void {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === '.') {
        continue;
      }
      console.log(r, c, board[r][c]);
      const startX = (c * WIDTH) / 3;
      const startY = (r * HEIGHT) / 3;

      ctx.fillStyle = board[r][c] === 'X' ? X_COLOUR : O_COLOUR;
      ctx.fillRect(startX, startY, WIDTH / 3, HEIGHT / 3);

      board[r][c] === 'X' ? drawXOnBoard(ctx, r, c) : drawOOnBoard(ctx, r, c);
    }
  }
}

function initNewBoard(ctx: CanvasRenderingContext2D, board: board): void {
  board.forEach((row) => row.fill('.'));
  // Board init
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(0, HEIGHT / 3);
  ctx.lineTo(WIDTH, HEIGHT / 3);

  ctx.moveTo(0, (2 * HEIGHT) / 3);
  ctx.lineTo(WIDTH, (2 * HEIGHT) / 3);

  ctx.moveTo(WIDTH / 3, 0);
  ctx.lineTo(WIDTH / 3, HEIGHT);

  ctx.moveTo((2 * WIDTH) / 3, 0);
  ctx.lineTo((2 * WIDTH) / 3, HEIGHT);

  ctx.stroke();
}

function resetTheBoard(ctx: CanvasRenderingContext2D, board: board): void {
  board = new Array(3).fill(null).map(() => new Array(3).fill('.'));
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const startX = (c * WIDTH) / 3;
      const startY = (r * HEIGHT) / 3;

      ctx.fillStyle = 'green';
      ctx.fillRect(startX, startY, WIDTH / 3, HEIGHT / 3);
    }
  }
}

function drawXOnBoard(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number
): void {
  const cellWidth = WIDTH / 3;
  const cellHeight = HEIGHT / 3;

  const xPadding = cellWidth / 3;
  const yPadding = cellHeight / 3;

  const x0 = col * cellWidth;
  const y0 = row * cellHeight;

  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(x0 + xPadding, y0 + yPadding);
  ctx.lineTo(x0 + 2 * xPadding, y0 + 2 * yPadding);

  ctx.moveTo(x0 + 2 * xPadding, y0 + yPadding);
  ctx.lineTo(x0 + xPadding, y0 + 2 * yPadding);

  ctx.stroke();
}

function drawOOnBoard(ctx: CanvasRenderingContext2D, row: number, col: number) {
  const cellWidth = WIDTH / 3;
  const cellHeight = HEIGHT / 3;

  const x0 = col * cellWidth + cellWidth / 2;
  const y0 = row * cellHeight + cellHeight / 2;

  const radius = (cellWidth + cellHeight) / 12;

  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function isGameOver(board: board): boolean {
  // check if any row is same
  for (let r = 0; r < 3; r++) {
    if (
      board[r][0] !== '.' &&
      board[r][0] === board[r][1] &&
      board[r][0] === board[r][2]
    ) {
      winner = board[r][0] as player;
      drawLineBetweenCells(r,0,r,2)
      return true;
    }
  }

  // check if any col is same
  for (let c = 0; c < 3; c++) {
    if (
      board[0][c] !== '.' &&
      board[0][c] === board[1][c] &&
      board[0][c] === board[2][c]
    ) {
      winner = board[0][c] as player;
      drawLineBetweenCells(0,c,2,c)
      return true;
    }
  }

  // check if any diagonals match
  if (
    board[0][0] !== '.' &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    winner = board[0][0] as player;
    drawLineBetweenCells(0,0,2,2)
    return true;
  }

  if (
    board[0][2] !== '.' &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    winner = board[0][2] as player;
    drawLineBetweenCells(0,2,2,0)
    return true;
  }

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === '.') {
        return false;
      }
    }
  }
  winner = null;

  return true;
}

function drawLineBetweenCells(startR, startC, endR, endC) {
  const cellWidth = WIDTH / 3;
  const cellHeight = HEIGHT / 3;

  const x0 = startC * cellWidth + cellWidth / 2;
  const y0 = startR * cellHeight + cellHeight / 2;

  const x1 = endC * cellWidth + cellWidth / 2;
  const y1 = endR * cellHeight + cellHeight / 2;

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#000"
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}
 