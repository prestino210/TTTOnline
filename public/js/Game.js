import Inputs from "./Inputs.js"
import Cell from "./Cell.js"

export default class Game {
    constructor(WIDTH, HEIGHT, gameID) {
        this.screenWidth = WIDTH;
        this.screenHeight = HEIGHT;
        this.gameID = gameID;
        this.gameStarted = false;
        this.socket = null;
        this.canJoin = true;
        this.playersRestarting = 0;
        this.restarting = false;

        this.isMobile = /Mobile/.test(navigator.userAgent);
        this.myPiece = 1;
        this.turn = 0;
        this.input = new Inputs(this);
        this.squareSize = 0;
        if(!this.isMobile) {
            this.squareSize = 180;
        } else if(this.isMobile) {
            this.squareSize = 110;
        }
        
        this.xWon = false; this.oWon = false; this.tie = false;

        this.cells = [];
        let cellIndex = 0;
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                let c = new Cell(this, ((col * (this.squareSize + this.squareSize/20) + this.screenWidth / 2 - (this.squareSize * 3 + 3 * this.squareSize/20)/2)),
                   ((row * (this.squareSize + this.squareSize/20) + this.screenHeight / 2 - (this.squareSize * 3 + 3 * this.squareSize/20)/2)));
                this.cells.push(c);
                c.cellIndex = cellIndex;
                cellIndex++;
            }
        }


    }

    getCells() {
        let cells = [];
        for(let i = 0; i < this.cells.length; i++) {
            cells.push(this.cells[i].piece);
        }

        return cells;
    }

    setCells(cells) {
        for(let i = 0; i < this.cells.length; i++) {
            this.cells[i].piece = cells[i];
        }

    }

    update() {
       

        if(this.playersRestarting == 2) {
            this.cells.forEach(c => {
                c.piece = "";
                c.filled = false;
                c.clicked = false;
            });
            this.xWon = false;
            this.oWon = false;
            this.tie = false;
            this.turn = 0;

            this.playersRestarting = 0;
            this.restarting = false;
        }

        if(this.gameStarted) {
            if(!(this.xWon || this.oWon || this.tie)) { 
                let filledCells = 0;
                this.cells.forEach(c => {
                    c.update();     
                    
                    if(c.filled) {
                        filledCells++;
                    }
                });
                
                let c = this.cells;
    
                if((c[0].piece=="X" && c[4].piece=="X" && c[8].piece=="X") || (c[0].piece=="X" && c[1].piece=="X" && c[2].piece=="X") || (c[0].piece=="X" && c[3].piece=="X" && c[6].piece=="X") || (c[2].piece=="X" && c[5].piece=="X" && c[8].piece=="X") || (c[1].piece=="X" && c[4].piece=="X" && c[7].piece=="X") || (c[2].piece=="X" && c[4].piece=="X" && c[6].piece=="X") || (c[6].piece=="X" && c[7].piece=="X" && c[8].piece=="X") || (c[3].piece=="X" && c[4].piece=="X" && c[5].piece=="X")) {
                    this.xWon = true;
                } else if((c[0].piece=="O" && c[4].piece=="O" && c[8].piece=="O") || (c[0].piece=="O" && c[1].piece=="O" && c[2].piece=="O") || (c[0].piece=="O" && c[3].piece=="O" && c[6].piece=="O") || (c[2].piece=="O" && c[5].piece=="O" && c[8].piece=="O") || (c[1].piece=="O" && c[4].piece=="O" && c[7].piece=="O") || (c[2].piece=="O" && c[4].piece=="O" && c[6].piece=="O") || (c[6].piece=="O" && c[7].piece=="O" && c[8].piece=="O") || (c[3].piece=="O" && c[4].piece=="O" && c[5].piece=="O")) {
                    this.oWon = true;
                } else if (!((c[0].piece=="O" && c[4].piece=="O" && c[8].piece=="O") || (c[0].piece=="O" && c[1].piece=="O" && c[2].piece=="O") || (c[0].piece=="O" && c[3].piece=="O" && c[6].piece=="O") || (c[2].piece=="O" && c[5].piece=="O" && c[8].piece=="O") || (c[1].piece=="O" && c[4].piece=="O" && c[7].piece=="O") || (c[2].piece=="O" && c[4].piece=="O" && c[6].piece=="O") || (c[6].piece=="O" && c[7].piece=="O" && c[8].piece=="O") || (c[3].piece=="O" && c[4].piece=="O" && c[5].piece=="O")) && !((c[0].piece=="X" && c[4].piece=="X" && c[8].piece=="X") || (c[0].piece=="X" && c[1].piece=="X" && c[2].piece=="X") || (c[0].piece=="X" && c[3].piece=="X" && c[6].piece=="X") || (c[2].piece=="X" && c[5].piece=="X" && c[8].piece=="X") || (c[1].piece=="X" && c[4].piece=="X" && c[7].piece=="X") || (c[2].piece=="X" && c[4].piece=="X" && c[6].piece=="X") || (c[6].piece=="X" && c[7].piece=="X" && c[8].piece=="X") || (c[3].piece=="X" && c[4].piece=="X" && c[5].piece=="X"))){
                    if(filledCells == 9) {
                        this.tie = true;
                    }
                }
            }
        }
    }

    draw(ctx, canv) {
        this.screenWidth = canv.width = (window.innerWidth * 0.75);
        this.screenHeight = canv.height = window.outerHeight;
        ctx.fillStyle = "rgb(50,50,50)"
        ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

        this.cells.forEach(c => {
            c.draw(ctx);
        });

        let txt = "Tic-Tac-Toe";
        ctx.fillStyle = "rgb(255,255,255)"
        let fontSize = 70 * (this.squareSize / 180);
        ctx.font = `Bold ${fontSize}px arial`
        let text = ctx.measureText(txt);
        let tWidth = text.width;
        let tHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
        ctx.fillText(txt, (this.screenWidth/2) - (tWidth/2), 
        ((this.screenHeight/2) + (tHeight/2)) - (340 * (this.squareSize / 180)));
        ctx.strokeStyle = "rgb(0,0,0)"
        ctx.lineWidth = 4 * (this.squareSize / 180);
        ctx.strokeText(txt, (this.screenWidth/2) - (tWidth/2), 
        ((this.screenHeight/2) + (tHeight/2)) - (340 * (this.squareSize / 180)));


        if(this.xWon || this.oWon || this.tie) {
            let txt;
            if(this.xWon) {txt = "X wins!"; ctx.fillStyle = "rgb(255,0,0)"}
            else if(this.oWon) {txt = "O wins!"; ctx.fillStyle = "rgb(0,0,255)"}
            else if(this.tie) {txt = "Tie!"; ctx.fillStyle = "rgb(255,255,255)"}
            let fontSize = 60 * (this.squareSize / 180);
            ctx.font = `Bold ${fontSize}px arial`
            let text = ctx.measureText(txt);
            let tWidth = text.width;
            let tHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
            ctx.fillText(txt, (this.screenWidth/2) - (tWidth/2), 
            (this.screenHeight/2) + (tHeight/2));
            ctx.strokeStyle = "rgb(0,0,0)"
            ctx.lineWidth = 4 * (this.squareSize / 180);
            ctx.strokeText(txt, (this.screenWidth/2) - (tWidth/2), 
            (this.screenHeight/2) + (tHeight/2));

            //if(!this.isMobile) {
                txt = "Click to restart " + this.playersRestarting + "/2"; //let
                ctx.fillStyle = "rgb(255,255,255)"
                ctx.font = "Bold 20px arial"
                ctx.lineWidth = 1;
                text = ctx.measureText(txt); //let
                tWidth = text.width; //let
                tHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent; //let
                ctx.fillText(txt, (this.screenWidth/2) - (tWidth/2), 
                ((this.screenHeight/2) + (tHeight/2)) + 45);
                ctx.strokeText(txt, (this.screenWidth/2) - (tWidth/2), 
                ((this.screenHeight/2) + (tHeight/2)) + 45);
                ctx.lineWidth = 1;
            //}
        }

        if(!this.canJoin) {
            let txt = "Spectating";
            ctx.fillStyle = "rgb(255,255,255)"
            let fontSize = 20 * (this.squareSize / 180);
            ctx.font = `Bold ${fontSize}px arial`
            let text = ctx.measureText(txt);
            let tWidth = text.width;
            let tHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
            ctx.fillText(txt, (this.screenWidth/2) - (tWidth/2), 
            ((this.screenHeight/2) + (tHeight/2)) + 90);
            ctx.strokeStyle = "rgb(0,0,0)"
            ctx.lineWidth = 1 * (this.squareSize / 180);
            ctx.strokeText(txt, (this.screenWidth/2) - (tWidth/2), 
            ((this.screenHeight/2) + (tHeight/2)) + 90);
        }

        if(!this.gameStarted && this.canJoin) {
            let txt = "Waiting for another player to join...";
            ctx.fillStyle = "rgb(255,255,255)"
            let fontSize = 20 * (this.squareSize / 180);
            ctx.font = `Bold ${fontSize}px arial`
            let text = ctx.measureText(txt);
            let tWidth = text.width;
            let tHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
            ctx.fillText(txt, (this.screenWidth/2) - (tWidth/2), 
            (this.screenHeight/2) + (tHeight/2));
            ctx.strokeStyle = "rgb(0,0,0)"
            ctx.lineWidth = 1 * (this.squareSize / 180);
            ctx.strokeText(txt, (this.screenWidth/2) - (tWidth/2), 
            (this.screenHeight/2) + (tHeight/2));
        }
    }
}