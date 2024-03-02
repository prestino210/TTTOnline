const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)

const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;
const crypto = require('crypto');

const GSM = require("GameSessionManager");

let currentGameIDs = [];

app.use('/game', express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.redirect('/game/' + crypto.randomUUID());
});

app.get("/game/:id", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket => {
    socket.on('join game', async gameID => {

        for(let room of socket.rooms) {
            socket.leave(room);
        }

        socket.join(gameID);
        const sockets = await io.in(gameID).fetchSockets();

        let game = GSM.getGame(gameID);

        if(game == null) {
            GSM.addGame(gameID);
            game = GSM.getGame(gameID);
        } else if(game != null) {
            


        }

        if(game != null && !game.getStarted()) {
            if(sockets.length == 1) {
                currentGameIDs.push(gameID+"_1");
                let xID = crypto.randomUUID();
                socket.to(gameID).emit("start x", xID);
                

                console.log("a user has joined game: " + gameID + " as the 1st user.");
            } else if(sockets.length == 2) {
                currentGameIDs.splice(currentGameIDs.indexOf(gameID+"_1"));
                currentGameIDs.push(gameID+"_2");
                socket.emit('start game', gameID);
                let oID = crypto.randomUUID();
                socket.to(gameID).emit("start host");
                socket.to(gameID).emit("start o", oID);
                game.startGame();
                

                console.log("a user has joined game: " + gameID + " as the 2nd user.");
            } else if (sockets.length > 2) {
                let currentGame = GSM.getGame(gameID);
                socket.emit('game full', gameID);
                socket.emit('load game', currentGame);

                console.log("a user has joined game: " + gameID + " as a spectator.");
            }
        } 
    });

    socket.on('next turn', (index) => {
        const [gameID] = socket.rooms; 
        socket.to(gameID).emit('next turn', index);
    });

    socket.on('save game', (cells, restarting, playersRestarting, turn) => { 
        const [gameID] = socket.rooms;
        const game = GSM.getGame(gameID);

        game.setCells(cells);
        game.setRestarting(restarting);
        game.setPlayersRestarting(playersRestarting);
        game.setTurn(turn);

    });

    socket.on('restart game', (gameID) => {
        socket.to(gameID).emit('restart game');
    });
    
});

server.listen(port, ( ) => {
    console.log(`Server listening on localhost:${port}. NODE:`);
});
