const boardDiv = document.getElementById('board');
const statusP = document.getElementById('status');

let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let gameOver = false;

function drawBoard() {
    boardDiv.innerHTML = '';
    board.forEach((cell, i) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell === ' ' ? '' : cell;
        if (!gameOver && cell === ' ') {
            cellDiv.addEventListener('click', () => playerMove(i));
        }
        boardDiv.appendChild(cellDiv);
    });
}

function playerMove(pos) {
    if (board[pos] !== ' ' || gameOver) return;

    board[pos] = 'X';
    drawBoard();

    if (checkWinner('X')) {
        statusP.textContent = 'You win!';
        gameOver = true;
        return;
    }

    if (isFull()) {
        statusP.textContent = "It's a draw!";
        gameOver = true;
        return;
    }

    // Call backend for AI move
    fetch('/ai-move', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ board: board })
    })
    .then(res => res.json())
    .then(data => {
        const aiMoveIndex = data.move;
        board[aiMoveIndex] = 'O';
        drawBoard();

        if (checkWinner('O')) {
            statusP.textContent = 'AI wins!';
            gameOver = true;
            return;
        }

        if (isFull()) {
            statusP.textContent = "It's a draw!";
            gameOver = true;
            return;
        }
    })
    .catch(err => {
        console.error('Error getting AI move:', err);
    });
}

// Win and full check helper functions

function checkWinner(player) {
    const winConditions = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winConditions.some(cond =>
        cond.every(i => board[i] === player)
    );
}

function isFull() {
    return board.every(cell => cell !== ' ');
}

// Reset game

function resetGame() {
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    gameOver = false;
    statusP.textContent = '';
    drawBoard();
}

window.resetGame = resetGame;  // for button access

// Initial draw
drawBoard();
