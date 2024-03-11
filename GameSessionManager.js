exports.GameSessionManager = class {
    constructor(Game) {
        this.currentGames = [];
        this.Game = Game
    }

    addGame(gameID) {
        const Game = this.Game;
        this.currentGames.push(new Game(gameID));
    }

    getGame(gameID) {
        let game = null;
        this.currentGames.forEach((g) => {
            if(g.gameID == gameID) {
                game = g;
            }
        });

        return game;
    }
}

exports.Game = class {
    constructor(gameID) {
        this.gameID = gameID;
        this.cells = ["", "", "", "", "", "", "", "", ""];
        this.restarting = false;
        this.playersRestarting = 0;
        this.playerXID = null;
        this.playerOID = null;
        this.turn = 0;
        this.started = false;
    }

    getCells() {
        return this.cells;
    }

    setCells(cells) {
        this.cells = cells;
    }

    setCell(cellIndex, piece) {
        this.cells[cellIndex] = piece;
    }

    startGame() {
        this.started = true;
    }

    getStarted() {
        return this.started;
    }

    getPlayersRestarting() {
        return this.playersRestarting;
    }

    setPlayersRestarting(playersRestarting) {
        this.playersRestarting = playersRestarting;
    }

    getRestarting() {
        return this.restarting;
    }

    setRestarting(restarting) {
        this.restarting = restarting;
    }

    getTurn() {
        return this.turn;
    }

    setTurn(turn) {
        this.turn = turn;
    }
}

