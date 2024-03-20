import Game from "./Game.js"

let socket = io();
let gameID = (window.location.href).split("/")[4];
let messageContainer = document.querySelector('#message-container');
let inputText = document.querySelector('#input-text');
let sendButton = document.querySelector('#send-button');
let messageForm = document.querySelector('#message-form');
let playerIndex = 1;

messageForm.addEventListener("submit", sendMessage);
sendButton.addEventListener("click", sendMessage);
sendButton.addEventListener("touch", sendMessage);

function sendMessage(e) { 
    e.preventDefault();
    socket.emit('message', 'Player ' + playerIndex + ' says: ' + inputText.value);
    inputText.value = "";
}

socket.on('append message', (message) => {
    let p = document.createElement('p');
    p.setAttribute('id', 'chat-message');
    p.innerText = message;
    messageContainer.appendChild(p);
});

socket.emit("join game", gameID);


socket.on('game full', (players) => {
    game.canJoin = false;
    game.gameStarted = true;
    playerIndex = players;
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

socket.on('set player', (players, chat) => {
    playerIndex = 2;
    chat.forEach((m) => { 
        let msg = document.createElement("p");
        msg.setAttribute('id', 'chat-message');
        msg.innerText = m;
        messageContainer.appendChild(msg);
    });
});

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

    socket.emit('save game', game.getCells(), game.restarting, game.playersRestarting, game.turn);
});

socket.on('restart game', () => {
    game.playersRestarting++;
    socket.emit('save game', game.getCells(), game.restarting, game.playersRestarting, game.turn); 
});

socket.on('load game', (currentGame, chat) => {
    game.setCells(currentGame.cells);
    game.playersRestarting = currentGame.playersRestarting;
    game.restarting = currentGame.restarting;
    game.turn = currentGame.turn;
    chat.forEach((m) => { 
        let msg = document.createElement("p");
        msg.setAttribute('id', 'chat-message');
        msg.innerText = m;
        messageContainer.appendChild(msg);
    });
});

const canv = document.querySelector("canvas");
const WIDTH = canv.width = (window.innerWidth * 0.75);
const HEIGHT = canv.height = window.outerHeight;
const ctx = canv.getContext("2d");
const game = new Game(WIDTH, HEIGHT, gameID);

function loop() {

    game.update();
    game.draw(ctx, canv);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
