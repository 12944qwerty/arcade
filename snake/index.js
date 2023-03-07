const SIZE = 500;
const GRIDSIZE = 20;
const SQUARESIZE = SIZE / GRIDSIZE;

let SNAKE = [184, 183, 182];
let direction = 'right';
let plannedDirection = 'right';
let apples = 3;
let APPLE = Math.floor(Math.random() * GRIDSIZE ** 2);
let started = false;
let paused = false;

function restart() {
    SNAKE = [184, 183, 182];
    direction = 'right';
    plannedDirection = 'right';
    apples = 3;
    APPLE = Math.floor(Math.random() * GRIDSIZE ** 2);

    while (SNAKE.includes(APPLE)) {
        APPLE = Math.floor(Math.random() * GRIDSIZE ** 2);
    }
}

function init(restart_=false) {
    if (restart_) {
        restart();
    }

    let board = document.getElementsByClassName('board')[0];
    const length = board.children.length;
    for (let i = 0; i < length; i++) {
        board.removeChild(board.children[0]);
    }

    for (let i = 0; i < GRIDSIZE ** 2; i++) {
        let elem = document.createElement('div');
        elem.classList.add('grid');
        elem.dataset.id = i;
        elem.style = `--col: ${i % GRIDSIZE}; --row: ${Math.floor(i / GRIDSIZE)}`;

        board.appendChild(elem);
    }

    document.addEventListener('keyup', (e) => {
        if (!started || paused) return;

        if (['ArrowUp', 'w'].includes(e.key) && direction != 'down') {
            plannedDirection = 'up'
        }
        if (['ArrowDown', 's'].includes(e.key) && direction != 'up') {
            plannedDirection = 'down'
        }
        if (['ArrowRight', 'd'].includes(e.key) && direction != 'left') {
            plannedDirection = 'right'
        }
        if (['ArrowLeft', 'a'].includes(e.key) && direction != 'right') {
            plannedDirection = 'left'
        }
    });

    tick(true);
}

function tick(init_=false) {
    if ((!started || paused) && !init_) return;

    let board = document.getElementsByClassName('board')[0];
    for (let coord of SNAKE.slice(1, -1)) {
        board.children[coord].dataset.body = false;
    }

    board.children[SNAKE[0]].dataset.head = false;
    board.children[SNAKE.at(-1)].dataset.tail = false;
    board.children[APPLE].dataset.apple = false;

    if (apples > SNAKE.length) {
        SNAKE.push(SNAKE.at(-1));
    }

    for (let i=SNAKE.length-1;i>0;i--) {
        SNAKE[i] = SNAKE[i-1];
    }

    direction = plannedDirection;

    if (direction == 'right') {
        if (SNAKE[0] % GRIDSIZE == GRIDSIZE - 1) {
            SNAKE[0] -= GRIDSIZE - 1
        } else {
            SNAKE[0]++;
        }
    }
    if (direction == 'left') {
        if (SNAKE[0] % GRIDSIZE == 0) {
            SNAKE[0] += GRIDSIZE-1
        } else {
            SNAKE[0]--;
        }
    }
    if (direction == 'up') {
        if (SNAKE[0] / GRIDSIZE < 1) {
            SNAKE[0] += GRIDSIZE * (GRIDSIZE-1)
        } else {
            SNAKE[0] -= GRIDSIZE;
        }
    }
    if (direction == 'down') {
        if (SNAKE[0] / GRIDSIZE >= GRIDSIZE - 1) {
            SNAKE[0] = SNAKE[0] % GRIDSIZE
        } else {
            SNAKE[0] += GRIDSIZE;
        }
    }

    for (let coord of SNAKE.slice(1, -1)) {
        board.children[coord].dataset.body = true;
    }
    if (SNAKE.includes(APPLE)) {
        apples++;

        while (SNAKE.includes(APPLE)) {
            APPLE = Math.floor(Math.random() * GRIDSIZE ** 2);
        }
    }

    board.children[SNAKE[0]].dataset.head = true;
    board.children[SNAKE[0]].dataset.direction = direction;
    board.children[SNAKE.at(-1)].dataset.tail = true;

    board.children[APPLE].dataset.apple = true;

    updateScreen();
}

function updateScreen() {
    const starter = document.getElementById('starter');
    const stopper = document.getElementById('stopper');
    const pauser = document.getElementById('pauser');

    if (!started) {
        stopper.disabled = true;
        pauser.style.display = 'none';
    } else if (paused) {
        stopper.disabled = false;
        pauser.style.display = 'initial';
    } else {
        stopper.disabled = false;
        pauser.style.display = 'initial';
    }
    pauser.innerText = paused ? 'unpause' : 'pause';
    starter.innerText = started ? 'restart' : 'start';

    const score = document.getElementById('score');
    score.innerText = apples - 3;
}

let interval;

function start() {
    init(true);
    clearInterval(interval);
    interval = setInterval(tick, 100);

    started = true;
    paused = false;
    updateScreen();
}

function stop() {
    clearInterval(interval);
    started = false;
    updateScreen();
}

function pause() {
    paused = !paused;
    updateScreen();
}