const cells = document.querySelectorAll(".cell");

const status = document.getElementById("status");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const resetButton =
    document.getElementById("resetButton");

const winPopup =
    document.getElementById("winPopup");

const winnerText =
    document.getElementById("winnerText");

const nextButton =
    document.getElementById("nextButton");


let currentPlayer = "X";

let gameActive = true;

let score = {
    X: 0,
    O: 0
};


const winPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


cells.forEach((cell,index1) => {

    cell.addEventListener("click", () => {

        if (
            cell.textContent !== "" ||
            !gameActive
        ) {
            return;
        }


        if (currentPlayer === "X") {

            cell.textContent = "❌";
            cell.classList.add("x");

        } else {

            cell.textContent = "⭕";
            cell.classList.add("o");

        }


        checkWinner();

    });

});


function checkWinner() {

    for (let pattern of winPatterns) {

        const a = cells[pattern[0]].textContent;
        const b = cells[pattern[1]].textContent;
        const c = cells[pattern[2]].textContent;


        if (
            a !== "" &&
            a === b &&
            b === c
        ) {

            gameActive = false;

            const winner =
                currentPlayer;


            score[winner]++;

            updateScore();

            showWinner(winner);

            return;
        }

    }


    const draw =
        [...cells].every(
            cell => cell.textContent !== ""
        );


    if (draw) {

        gameActive = false;

        status.textContent =
            " Yahh seri!";

        setTimeout(() => {

            winPopup.classList.add("show");

            winnerText.textContent =
                " HASILNYA SERI!";

        }, 400);

        return;
    }


    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    if (currentPlayer === "X") {

        status.textContent =
            "Giliran ❌";

    } else {

        status.textContent =
            "Giliran ⭕";

    }

}


function showWinner(winner) {

    status.textContent =
        `🎉 ${winner} MENANG!`;


    winnerText.textContent =
        winner === "X"
            ? "❌ Player X Menang!"
            : "⭕ Player O Menang!";


    setTimeout(() => {

        winPopup.classList.add("show");

    }, 500);

}


function updateScore() {

    scoreX.textContent =
        score.X;

    scoreO.textContent =
        score.O;

}


function resetGame() {

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o"
        );

    });


    currentPlayer = "X";

    gameActive = true;

    status.textContent =
        "Giliran ❌";

    winPopup.classList.remove(
        "show"
    );

}


resetButton.addEventListener(
    "click",
    resetGame
);


nextButton.addEventListener(
    "click",
    resetGame
);