const createPlayer = (name, marker, color) => {
    return { name, marker, color };
};

const gameBoard = (function() {
    const board = [
        "","","",
        "","","",
        "","",""
    ];

    function create() {
        const documentMain = document.querySelector("main");
            const gameGrid = document.createElement("div");
            gameGrid.classList.add("gameboard-grid");
            documentMain.appendChild(gameGrid);

            for (let i = 0; i < 9; i++) {
                let cell = document.createElement("button");
                cell.classList.add("cell");
                cell.setAttribute("data-cellnum", i);

                let cellText = document.createElement("span");
                cellText.classList.add("cell-text")

                gameGrid.appendChild(cell);
                cell.appendChild(cellText);
            }

            const turnMessage = document.createElement("p");
            turnMessage.classList.add("game-text");
            turnMessage.textContent = `${game.getActivePlayer().name}, your turn!`;
            documentMain.appendChild(turnMessage);

            const resetButton = document.createElement("button");
            resetButton.setAttribute("type", "button");
            resetButton.classList.add("reset");
            resetButton.textContent = "Reset";
            documentMain.appendChild(resetButton);
    }

    function clear() {
            board.forEach((cell, i) => {
                if (cell) board[i] = "";
            });

            gameBoard.render();

            const cells = document.querySelectorAll(".cell");
    
            cells.forEach((cell) => {
                if (cell.className === "cell checked") {
                    cell.classList.remove("checked");
                }
            });
    }

    return {
        render: function() {
            const cellText = document.querySelectorAll(".cell-text");
    
            cellText.forEach((cell, marker) => {
                cell.textContent = board[marker];
            });
        },

        getBoard: function() {
            return board;
        },

        clickHandler: function() {
            window.addEventListener("click", function(event) {
                if (event.target.className === "play-button") {
                    event.target.parentNode.replaceChildren();
                    create();
                    game.start();
                }
                if (event.target.className === "reset") {
                    clear();
                    game.reset();
                }
                if (event.target.className === "cell") {
                    if (event.target.className !== "cell checked") {
                        const currentPlayer = game.getActivePlayer();

                        event.target.style.color = currentPlayer.color;

                        let selectedCell = event.target.dataset.cellnum;
                        board.splice(selectedCell, 1, currentPlayer.marker);

                        game.playRound(selectedCell);
                    }
                    event.target.classList.add("checked");
                }
            });
        }
    };
})();

gameBoard.clickHandler();

const game = (function() {
    const player1 = createPlayer("Player 1", "X", "red");
    const player2 = createPlayer("Player 2", "O", "green");
    let activePlayer = player1;
    let gameState = 0;

    const board = gameBoard.getBoard();

    function gameStateController(reset) {
        checkWin();
        const gbtext = document.querySelector(".game-text");

        if (gameState === 1 && !reset) {
            if (activePlayer === player1) activePlayer = player2;
            else activePlayer = player1;

            gbtext.textContent = `${activePlayer.name}, your turn!`;

        } else if (gameState === 1 && reset) {
            activePlayer = player1;

            gbtext.textContent = `${activePlayer.name}, your turn!`;   
        } 

        if (gameState === -1) {
            const cells = document.querySelectorAll(".cell");

            cells.forEach((cell) => {
                if (cell.className !== "cell checked") {
                    cell.classList.add("checked");
                }
            });

            gbtext.textContent = `${activePlayer.name} wins!`;
        }

        if (gameState === -2) {
            gbtext.textContent = `It's a tie!`;
        }
}
    
    function checkWin() {
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let won = winningConditions.some(winner => winner.every(cell => board[cell] === activePlayer.marker));
        let tie = board.every(cell => cell && !won);

        if (won) gameState = -1;
        if (tie) gameState = -2;
    }

    return {
        getActivePlayer: function() {
            return activePlayer;
        },

        playRound: function() {
            gameStateController();
            gameBoard.render();
        },

        start: function() {
            if (gameState === 0) gameState = 1;
        },

        reset: function() {
            gameState = 1;

            gameStateController("reset");
        }
    };
})();




