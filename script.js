document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const scoreDisplay = document.getElementById("score");
    const restartButton = document.getElementById("restart");
    let grid = Array(4).fill().map(() => Array(4).fill(0));
    let score = 0;

    function initGame() {
        score = 0;
        scoreDisplay.textContent = score;
        grid = Array(4).fill().map(() => Array(4).fill(0));
        spawnTile();
        spawnTile();
        updateBoard();
    }

    function spawnTile() {
        let emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (grid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[r][c] = Math.random() > 0.9 ? 4 : 2;
        }
    }

    function updateBoard() {
        board.innerHTML = "";
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                if (grid[r][c] !== 0) {
                    cell.textContent = grid[r][c];
                    cell.dataset.value = grid[r][c];
                }
                board.appendChild(cell);
            }
        }
    }

    function move(direction) {
        let moved = false;
        let newGrid = Array(4).fill().map(() => Array(4).fill(0));

        for (let i = 0; i < 4; i++) {
            let row = (direction === "up" || direction === "down") 
                ? [grid[0][i], grid[1][i], grid[2][i], grid[3][i]] 
                : [...grid[i]];

            if (direction === "right" || direction === "down") row.reverse();

            let merged = [false, false, false, false];
            let newRow = row.filter(v => v !== 0);

            for (let j = 0; j < newRow.length - 1; j++) {
                if (newRow[j] === newRow[j + 1] && !merged[j] && !merged[j + 1]) {
                    newRow[j] *= 2;
                    score += newRow[j];
                    newRow.splice(j + 1, 1);
                    newRow.push(0);
                    merged[j] = true;
                }
            }

            newRow = newRow.filter(v => v !== 0);
            while (newRow.length < 4) newRow.push(0);
            if (direction === "right" || direction === "down") newRow.reverse();

            if (direction === "up" || direction === "down") {
                for (let r = 0; r < 4; r++) {
                    if (grid[r][i] !== newRow[r]) moved = true;
                    newGrid[r][i] = newRow[r];
                }
            } else {
                if (grid[i].toString() !== newRow.toString()) moved = true;
                newGrid[i] = newRow;
            }
        }

        if (moved) {
            grid = newGrid;
            spawnTile();
            updateBoard();
            scoreDisplay.textContent = score;
            checkGameOver();
        }
    }

    function checkGameOver() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (grid[r][c] === 0) return;
                if (c < 3 && grid[r][c] === grid[r][c + 1]) return;
                if (r < 3 && grid[r][c] === grid[r + 1][c]) return;
            }
        }
        alert("遊戲結束！你的分數是：" + score);
    }

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp": move("up"); break;
            case "ArrowDown": move("down"); break;
            case "ArrowLeft": move("left"); break;
            case "ArrowRight": move("right"); break;
        }
    });

    restartButton.addEventListener("click", initGame);

    initGame();
});
