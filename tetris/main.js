'use strict';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = canvas.width / COLS;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  switch (type) {
    case 'I':
      return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ];
    case 'J':
      return [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
      ];
    case 'L':
      return [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
      ];
    case 'O':
      return [
        [4, 4],
        [4, 4],
      ];
    case 'S':
      return [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
      ];
    case 'T':
      return [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
      ];
    case 'Z':
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
  }
}

const colors = [
  null,
  '#00f0f0',
  '#0000f0',
  '#f0a000',
  '#f0f000',
  '#00f000',
  '#a000f0',
  '#f00000',
];

const arena = createMatrix(COLS, ROWS);
let dropCounter = 0;
const dropInterval = 1000;
let lastTime = 0;

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
};

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (
        m[y][x] !== 0 &&
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerHardDrop() {
  while (!collide(arena, player)) {
    player.pos.y++;
  }
  player.pos.y--;
  merge(arena, player);
  playerReset();
  arenaSweep();
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function arenaSweep() {
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
  }
}

function playerReset() {
  const pieces = 'IJLOSTZ';
  player.matrix = createPiece(
    pieces[(pieces.length * Math.random()) | 0]
  );
  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) -
    ((player.matrix[0].length / 2) | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, COLS, ROWS);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    playerMove(-1);
  } else if (event.key === 'ArrowRight') {
    playerMove(1);
  } else if (event.key === ' ' || event.code === 'Space') {
    playerRotate(1);
  } else if (event.key === 'Enter') {
    playerHardDrop();
  } else if (event.key.toLowerCase() === 'r') {
    resetGame();
  }
});

function resetGame() {
  arena.forEach(row => row.fill(0));
  playerReset();
  lastTime = 0;
  dropCounter = 0;
}

playerReset();
update();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(reg => console.log('ServiceWorker registered', reg))
      .catch(err => console.error('ServiceWorker registration failed', err));
  });
}

// Mobile touch controls
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  playerRotate(1);
});

const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');
const resetBtn = document.getElementById('reset-btn');

if (leftBtn) {
  leftBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    playerMove(-1);
  });
}
if (rightBtn) {
  rightBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    playerMove(1);
  });
}
if (downBtn) {
  downBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    playerHardDrop();
  });
}
if (resetBtn) {
  resetBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    resetGame();
  });
}
