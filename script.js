const board = document.getElementById('board');
const message = document.getElementById('message');
const retryButton = document.getElementById('retry');
let cells = ['', '', '', '', '', '', '', '', ''];
const player = 'X';
const ai = 'O';

function createBoard() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', playerMove);
        board.appendChild(cellElement);
    });
}

function playerMove(e) {
    const index = e.target.dataset.index;
    if (!cells[index]) {
        cells[index] = player;
        updateBoard();
        if (checkWin(player)) {
            endGame('You are the one who defeated Villain!');
        } else if (cells.every(cell => cell)) {
            endGame('It\'s a draw!', true);
        } else {
            aiMove();
        }
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move;
    cells.forEach((cell, index) => {
        if (!cell) {
            cells[index] = ai;
            let score = minimax(cells, 0, false);
            cells[index] = '';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    cells[move] = ai;
    updateBoard();
    if (checkWin(ai)) {
        endGame('Villain wins! Better luck next time!', true);
    } else if (cells.every(cell => cell)) {
        endGame('It\'s a draw!', true);
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(player)) return -10;
    if (checkWin(ai)) return 10;
    if (board.every(cell => cell)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (!cell) {
                board[index] = ai;
                let score = minimax(board, depth + 1, false);
                board[index] = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (!cell) {
                board[index] = player;
                let score = minimax(board, depth + 1, true);
                board[index] = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWin(currentPlayer) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => cells[index] === currentPlayer)
    );
}

function updateBoard() {
    cells.forEach((cell, index) => {
        const cellElement = board.children[index];
        cellElement.textContent = cell;
        if (cell) cellElement.classList.add('taken');
    });
}

function endGame(text, showRetry = true) {
    message.textContent = text;
    Array.from(board.children).forEach(cell =>
        cell.removeEventListener('click', playerMove)
    );
    if (showRetry) retryButton.style.display = 'inline-block';
}

function resetGame() {
    cells = ['', '', '', '', '', '', '', '', ''];
    message.textContent = '';
    retryButton.style.display = 'none';
    createBoard();
}

createBoard();
