export default class Inputs {
    constructor(game) {
        this.game = game;
        this.mouseX;
        this.mouseY;
        this.mouseDown;

        if(!this.game.isMobile) {
            document.addEventListener("mousemove", e => {
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            });
    
            document.addEventListener("mousedown", e => {
                if(e.button == 0) {
                    
                    if(!(this.game.xWon || this.game.oWon || this.game.tie)) {
                        this.mouseX = e.pageX;
                        this.mouseY = e.pageY;
                        this.mouseDown = true;
                    } else if((this.game.xWon || this.game.oWon || this.game.tie) && this.game.canJoin && !this.game.restarting) {
                        this.game.socket.emit('restart game', this.game.gameID);
                        this.game.playersRestarting++;
                        this.game.socket.emit('save game', this.game.cells, this.game.restarting, this.game.playersRestarting, this.game.turn);
                        this.game.restarting = true;
                    } 
                }
            });
    
            document.addEventListener("mouseup", e => {
                if(e.button == 0) {
                    this.mouseDown = false;
                }
            });
        }
        

        if(this.game.isMobile) { 
            document.addEventListener("touchstart", e => { 
                this.mouseDown = true;
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            });

            document.addEventListener("touchend", e => {
                this.mouseDown = false;
            });
        }
    }
}