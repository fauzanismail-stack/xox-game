const cells =
    document.querySelectorAll(".cell");

const status =
    document.getElementById("status");

const scoreX =
    document.getElementById("scoreX");

const scoreO =
    document.getElementById("scoreO");

const resetButton =
    document.getElementById("resetButton");

const soundButton =
    document.getElementById("soundButton");

const winPopup =
    document.getElementById("winPopup");

const winnerText =
    document.getElementById("winnerText");

const popupMessage =
    document.getElementById("popupMessage");

const nextButton =
    document.getElementById("nextButton");

const playerMode =
    document.getElementById("playerMode");

const aiMode =
    document.getElementById("aiMode");

const nameO =
    document.getElementById("nameO");

const leaderX =
    document.getElementById("leaderX");

const leaderO =
    document.getElementById("leaderO");

const clearLeaderboard =
    document.getElementById("clearLeaderboard");


let currentPlayer = "X";

let gameActive = true;

let vsAI = false;

let soundOn = true;


let score = {
    X: 0,
    O: 0
};


// ========================
// LEADERBOARD
// ========================

let leaderboard =
    JSON.parse(
        localStorage.getItem(
            "xoxLeaderboard"
        )
    ) || {
        X: 0,
        O: 0
    };


function updateLeaderboard() {

    leaderX.textContent =
        leaderboard.X;

    leaderO.textContent =
        leaderboard.O;

}


updateLeaderboard();


// ========================
// SOUND
// ========================

const audioContext =
    new (
        window.AudioContext ||
        window.webkitAudioContext
    )();


function playSound(
    frequency,
    duration = 0.12
) {

    if (!soundOn) return;

    if (
        audioContext.state ===
        "suspended"
    ) {
        audioContext.resume();
    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.frequency.value =
        frequency;

    oscillator.type =
        "sine";


    gain.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime +
        duration
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime +
        duration
    );

}


function winSound() {

    playSound(600,.12);

    setTimeout(
        () => playSound(800,.12),
        120
    );

    setTimeout(
        () => playSound(1000,.2),
        240
    );

}


// ========================
// WIN PATTERN
// ========================

const winPatterns = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]

];


// ========================
// PLAYER MOVE
// ========================

cells.forEach(
    (cell,index) => {

    cell.addEventListener(
        "click",
        () => {

            if (
                !gameActive ||
                cell.textContent !== ""
            ) {
                return;
            }


            if (
                vsAI &&
                currentPlayer === "O"
            ) {
                return;
            }


            makeMove(
                index,
                currentPlayer
            );


            if (
                gameActive &&
                vsAI &&
                currentPlayer === "O"
            ) {

                setTimeout(
                    aiMove,
                    400
                );

            }

        }
    );

});


// ========================
// MAKE MOVE
// ========================

function makeMove(
    index,
    player
) {

    const cell =
        cells[index];


    if (
        cell.textContent !== ""
    ) {
        return;
    }


    if (player === "X") {

        cell.textContent = "❌";

        cell.classList.add("x");

    } else {

        cell.textContent = "⭕";

        cell.classList.add("o");

    }


    playSound(
        player === "X"
            ? 500
            : 700
    );


    checkWinner(player);

}


// ========================
// CHECK WINNER
// ========================

function checkWinner(
    player
) {

    for (
        const pattern
        of winPatterns
    ) {

        const [
            a,
            b,
            c
        ] = pattern;


        if (

            cells[a].textContent !== "" &&

            cells[a].textContent ===
            cells[b].textContent &&

            cells[b].textContent ===
            cells[c].textContent

        ) {

            gameActive = false;


            score[player]++;


            if (player === "X") {

                scoreX.textContent =
                    score.X;

            } else {

                scoreO.textContent =
                    score.O;

            }


            leaderboard[player]++;


            localStorage.setItem(
                "xoxLeaderboard",
                JSON.stringify(
                    leaderboard
                )
            );


            updateLeaderboard();


            winSound();


            showWinner(player);


            return true;
        }

    }


    const draw =
        [...cells].every(
            cell =>
                cell.textContent !== ""
        );


    if (draw) {

        gameActive = false;

        status.textContent =
            "🤝 HASILNYA SERI!";

        playSound(300,.3);


        setTimeout(
            () => {

                winnerText.textContent =
                    "🤝 HASILNYA SERI!";

                popupMessage.textContent =
                    "GG! Kalian sama kuat 🔥";

                winPopup.classList.add(
                    "show"
                );

            },
            400
        );


        return true;
    }


    currentPlayer =
        player === "X"
            ? "O"
            : "X";


    if (
        currentPlayer === "X"
    ) {

        status.textContent =
            "Giliran ❌";

    } else {

        status.textContent =
            vsAI
                ? "🤖 AI sedang berpikir..."
                : "Giliran ⭕";

    }


    return false;
}


// ========================
// 🤖 AI
// ========================

function aiMove() {

    if (
        !gameActive ||
        !vsAI
    ) {
        return;
    }


    let emptyCells = [];


    cells.forEach(
        (cell,index) => {

        if (
            cell.textContent === ""
        ) {

            emptyCells.push(index);

        }

    });


    if (
        emptyCells.length === 0
    ) {
        return;
    }


    // AI coba menang

    for (
        let index
        of emptyCells
    ) {

        if (
            canWin(index,"⭕")
        ) {

            makeMove(
                index,
                "O"
            );

            return;
        }

    }


    // AI blok player

    for (
        let index
        of emptyCells
    ) {

        if (
            canWin(index,"❌")
        ) {

            makeMove(
                index,
                "O"
            );

            return;
        }

    }


    // Ambil tengah

    if (
        cells[4].textContent === ""
    ) {

        makeMove(
            4,
            "O"
        );

        return;
    }


    // Random

    const randomIndex =
        emptyCells[
            Math.floor(
                Math.random() *
                emptyCells.length
            )
        ];


    makeMove(
        randomIndex,
        "O"
    );

}


// ========================
// AI CHECK
// ========================

function canWin(
    index,
    symbol
) {

    const old =
        cells[index].textContent;


    cells[index].textContent =
        symbol;


    const win =
        winPatterns.some(
            pattern => {

                const [
                    a,
                    b,
                    c
                ] = pattern;


                return (

                    cells[a].textContent ===
                    symbol &&

                    cells[b].textContent ===
                    symbol &&

                    cells[c].textContent ===
                    symbol

                );

            }
        );


    cells[index].textContent =
        old;


    return win;
}


// ========================
// POPUP
// ========================

function showWinner(
    winner
) {

    status.textContent =
        `🎉 ${winner} MENANG!`;


    winnerText.textContent =
        winner === "X"
            ? "❌ PLAYER X MENANG!"
            : vsAI
                ? "🤖 AI MENANG!"
                : "⭕ PLAYER O MENANG!";


    popupMessage.textContent =
        winner === "X"
            ? "GOKIL! Lu menang 🔥"
            : vsAI
                ? "WADUH AI MENANG 😭"
                : "GG! Player O menang 🔥";


    setTimeout(
        () => {

            winPopup.classList.add(
                "show"
            );

        },
        500
    );

}


// ========================
// RESET
// ========================

function resetGame() {

    cells.forEach(
        cell => {

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


    playSound(
        400,
        .15
    );

}


// ========================
// MODE
// ========================

playerMode.addEventListener(
    "click",
    () => {

        vsAI = false;

        playerMode.classList.add(
            "active"
        );

        aiMode.classList.remove(
            "active"
        );

        nameO.textContent =
            "Player O";

        resetGame();

    }
);


aiMode.addEventListener(
    "click",
    () => {

        vsAI = true;

        aiMode.classList.add(
            "active"
        );

        playerMode.classList.remove(
            "active"
        );

        nameO.textContent =
            "🤖 AI";

        resetGame();

    }
);


// ========================
// BUTTON
// ========================

resetButton.addEventListener(
    "click",
    resetGame
);


nextButton.addEventListener(
    "click",
    resetGame
);


soundButton.addEventListener(
    "click",
    () => {

        soundOn =
            !soundOn;


        soundButton.textContent =
            soundOn
                ? "🔊 Sound ON"
                : "🔇 Sound OFF";

    }
);


clearLeaderboard.addEventListener(
    "click",
    () => {

        leaderboard = {
            X: 0,
            O: 0
        };


        localStorage.setItem(
            "xoxLeaderboard",
            JSON.stringify(
                leaderboard
            )
        );


        updateLeaderboard();

        playSound(
            300
        );

    }
);
