import Game from "./Game.js"

let socket = io();
let gameID = (window.location.href).split("/")[4];

socket.emit("join game", gameID);


socket.on('game full', () => {
    game.canJoin = false;
    game.gameStarted = true;
});

socket.on('start game', (startingGameID) => {
    if(startingGameID == gameID) {
        game.gameStarted = true;
    }
});

socket.on('start host', () => {
    game.gameStarted = true;
    game.canJoin = true;
    game.socket = socket;
});

socket.on('start o', (oID) => {
    localStorage.setItem("oID", oID);
})

socket.on('start x', (xID) => {
    game.myPiece = 0;
    localStorage.setItem("xID", xID);
});

socket.on('next turn', (index) => {
    if(game.turn == 0) {
        game.cells[index].piece = "X";
        game.turn++;
    } else if(game.turn == 1) {
        game.cells[index].piece = "O";
        game.turn = 0;
    }
});

socket.on('restart game', () => {
    game.playersRestarting++;
});

socket.on('load game', (currentGame) => { 
    game.cells = currentGame.getCells();
    game.playersRestarting = currentGame.getPlayersRestarting();
    game.restarting = currentGame.getRestarting();
    game.turn = currentGame.getTurn();
});

const canv = document.querySelector("canvas");
const WIDTH = canv.width = window.innerWidth;
const HEIGHT = canv.height = window.innerHeight;
const ctx = canv.getContext("2d");
const game = new Game(WIDTH, HEIGHT, gameID);

function loop() {
    ctx.fillStyle = "rgb(50,50,50)"
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    game.update();
    game.draw(ctx);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
