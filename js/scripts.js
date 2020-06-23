document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.getElementById('start-btn');
    const width = 10;
    let timerId;
    let nextRandom = 0;
    let score = 0;
    let flag = false;
    const colors = [
        'orange',
        'red',
        'purple',
        'green'
    ];

    //tetromineos
    const lTetromino = [
        [1, width+1, width*2 + 1, 2],
        [width, width + 1, width + 2, width*2 + 2],
        [1, width + 1, width*2 + 1, width*2],
        [width, width*2, width*2 + 1, width *2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width*2 + 1],
        [width + 1, width + 2, width*2, width*2 + 1],
        [0, width, width + 1, width*2 + 1],
        [width + 1, width + 2, width*2, width*2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width*2 +1],
        [width, width + 1, width + 2, width *2 + 1],
        [1, width, width + 1, width*2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width + 1, width*2 + 1, width*3 + 1],
        [width, width + 1, width + 2, width + 2],
        [1, width + 1, width*2 + 1, width*3 +1],
        [width, width + 1, width + 2, width + 3]
    ];

    const tetromiones = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino
    ];


    let currentPosition = 4;
    let currentRotation = 0;

    let random = Math.floor(Math.random()*tetromiones.length);
    let current = tetromiones[random][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));

            random = nextRandom;
            nextRandom = Math.floor(Math.random() * tetromiones.length);

            current = tetromiones[random][currentRotation];

            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            endGame();
        }
    }

    // moving tetris blockes

    function control(e) {
        if (e.key === 'ArrowLeft' && flag) {
            moveLeft();
        } else if (e.key === 'ArrowUp' && flag) {
            rotate();
        } else if (e.key === 'ArrowRight' && flag) {
            moveRight();
        } else if (e.key === 'ArrowDown' && flag) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control)

    function moveLeft() {
        undraw();

        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    function moveRight() {
        undraw();

        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) {
            currentPosition += 1;
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }

    function rotate() {
        undraw();

        currentRotation ++;

        if (currentRotation === current.length) {
            currentRotation = 0;
        }

        current = tetromiones[random][currentRotation];

        draw();
    }

    // display next block

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth*2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth*2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth*2 + 1, displayWidth*3 + 1]
    ];

    function displayShape() {

        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });

        console.log(nextRandom);
        console.log(upNextTetrominoes[nextRandom]);

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    // start/pause game
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            flag = false;
        } else {
            flag = true;
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*tetromiones.length);
            displayShape();
        }
    })

    // score

    function addScore() {
        for (let i=0; i < 199; i +=width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });

                const  squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => {
                    grid.appendChild(cell);
                })
            }
        }
    }

    // end game

    function endGame() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId);
            flag = false;
        }
    }

    moveDown();






})
