import React, {Component} from "react";
import './domino.css';
import {Board} from './Board';
import {PlayerCards} from './PlayerCards';
import {Packet} from './Packet';
import {EndGame} from './EndGame';
import {Statistics} from './Statis';
import {Timer} from './Timer';
import {AllPlayersInGame} from './AllPlayersInGame'
import {AllPlayersCards} from './AllPlayersCards'
import {WinnerPlayer } from './WinnerPlayer'
import {Chat} from './Chat'

const MIDDLE_ROW=3;
const MIDDLE_COL=4;

export class DominoGame extends Component {

    constructor(props) {
        super(props);
        this.state= {
            dominoOb:undefined,
        timer: {
                timerAllGame: {
                    timerElem: 0,
                    seconds: 0,
                    minuets: 0,
                    stopTime: '',
                },

                timerForTurn: {
                    seconds: 0,
                    minuets: 0,
                }
            },
        };

        this.clockGame="";
        this.clockTurnGame="";
        this.rendergame="";
        this.check="" ;
        this.indexCurrentPlayerInPlayersArray= -1;
        this.indexCurrentPlayerInWatchersArray=-1;
        this.startTurnClock=false;
        this.isMyTurn=false;
        this.masPacketIsEmpty=false;
        this.removeLightBoxWinner=true;
        this.needToJoin="";
        this.lightBoxEnd = true;
        this.playerState="playerState";
    }

    addTick() {
        let minAll = this.state.timer.timerAllGame.minuets;
        let secAll =  this.state.timer.timerAllGame.seconds;

        secAll++;
        if (secAll >= 60) {
            secAll = 0;
            minAll++;
        }

        this.state.timer.timerAllGame.minuets=minAll;
        this.state.timer.timerAllGame.seconds=secAll;
    }

    setIntervalStartClockGame() {
        this.clockGame = setInterval(() => this.addTick(), 1000);
    }

    addTurnTick() {
        let minTurn = this.state.timer.timerForTurn.minuets;
        let secTurn =  this.state.timer.timerForTurn.seconds;

        secTurn++;
        if (secTurn >= 60) {
            secTurn = 0;
            minTurn++;
        }
        this.state.timer.timerForTurn.minuets = minTurn;
        this.state.timer.timerForTurn.seconds = secTurn;
    }

    setIntervalStartTurnClock() {
        this.clockTurnGame = setInterval(() => this.addTurnTick(), 1000);
    }

    renderState() {
        fetch('http://localhost:3001/renderState', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'gameName': this.props.gameName})
            }
        ).then(async response => {
            let res = await response.json();
            if(res.dominoOb.watcherPlayers && res.dominoOb.watcherPlayers.length>0){
                this.indexCurrentPlayerInWatchersArray=res.dominoOb.watcherPlayers.findIndex(watcher=>watcher===this.props.currentUser);

            }
            this.indexCurrentPlayerInPlayersArray = res.dominoOb.players.findIndex(player => player.playerName === this.props.currentUser); //change only once
            this.indexCurrentPlayerInPlayersArray === res.dominoOb.nextPlayerToPlay ? this.isMyTurn = true : this.isMyTurn = false;
            this.indexCurrentPlayerInPlayersArray!==-1 && res.dominoOb.players[this.indexCurrentPlayerInPlayersArray].packetEndMes? this.masPacketIsEmpty=true:this.masPacketIsEmpty=false;
            this.setState({dominoOb: res.dominoOb}, ()=>this.checkEndGame())
        })
    }

    setIntervalToRender() {
        this.rendergame = setInterval(() => this.renderState(), 1000);
    }

    checkIfGameExit() {
        fetch('http://localhost:3001/checkIfGameBegin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'gameName': this.props.gameName})
            }
        ).then(async response => {
            let res = await response.json();
            if (res.dominoOb !== undefined) {
                clearInterval(this.check);
                this.setIntervalStartClockGame();
                this.setIntervalToRender();
            }else{
                this.needToJoin=res.howMany;
                this.setState({});
            }
        })
    }

    setIntervalCheckIfGameExit() {
        this.check = setInterval(() => this.checkIfGameExit(), 1000);
    }

    checkEndGame(){
        if(this.state.dominoOb.endGame){
            this.clearIntervalFunctions();

        }else{
            if(this.isMyTurn && !this.startTurnClock){
                if(this.indexCurrentPlayerInWatchersArray === -1) {
                    this.setIntervalStartTurnClock();
                    this.startTurnClock = true;
                }
            }
        }
    }

    initTurn(){ //no in the chosen card
        clearInterval(this.clockTurnGame);
        this.startTurnClock=false;
        this.state.dominoOb.resultGame? this.removeLightBoxWinner=false:null; //remove the winner div
    }

    chosenCard(chosenCard) {
        let dataToSEnd={
            indexOfChoseCard:this.state.dominoOb.players[this.indexCurrentPlayerInPlayersArray].playerCard.findIndex(card => card.side1 === chosenCard.side1 && card.side2 === chosenCard.side2),
            gameName:this.props.gameName,
        };
        fetch('http://localhost:3001/updateIndexOfChosenCard', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSEnd)
            }
        ).then( () => {
            this.state.dominoOb.board[MIDDLE_ROW][MIDDLE_COL] === null ? this.putNewCardOnBoard() : "";
        });
        
    }

    putNewCardOnBoard(row,col){
        this.initTurn(); //finish move
        let dataToSEnd={
            indexCurrentPlayerInPlayersArray: this.indexCurrentPlayerInPlayersArray,
            gameName:this.props.gameName,
            timeForTurn:this.state.timer.timerForTurn,
            row:row? row : "",
            col:col? col : ""
        };

        fetch('http://localhost:3001/putNewCardOnBoard', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSEnd)
            }
        ).then( () => {
            console.log("updateStatesAfterMove");
        });
    }

    takeFromPacket() {
        this.initTurn(); //finish move
            const dataToSEnd = {
                indexCurrentPlayerInPlayersArray: this.indexCurrentPlayerInPlayersArray,
                gameName: this.props.gameName,
                timeForTurn:this.state.timer.timerForTurn,
            };
            fetch('http://localhost:3001/takeFromPacket', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(dataToSEnd)
                }
            ).then( () => {
                console.log("updateStatesAfterTake");
            });
    }

    returnToMainPage() {
        let dataToSend={
            gameName: this.props.gameName,
            userName:this.props.currentUser
        };
        fetch('http://localhost:3001/returnToMainPage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then( () => {
            this.lightBoxEnd=false;
            this.setState({}, ()=> this.props.handleActivePlaye(false,""));
        });
    }

    componentDidMount() {
        this.checkIfGameExit();
        this.setIntervalCheckIfGameExit();
    }

    leaveBeforeGameBegin(){
        let dataToSend= {
            gameName: this.props.gameName,
            playerName: this.props.currentUser
        };

        fetch('http://localhost:3001/leaveTheGame', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then( () => {
            clearInterval(this.check);
           this.props.handleActivePlaye(false,"");

        });
    }

    winnerWantToStay(){
        this.removeLightBoxWinner=false;
        let dataToSend={
            gameName: this.props.gameName,
            playerName: this.props.currentUser
        };
        fetch('http://localhost:3001/winnerWantToStay', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then( () => {
            console.log("winnerWantToStay");
            this.props.winnerGetOut(this.state.dominoOb.gameName);
        });
    }

    winnerWantToGetOut(){
        this.removeLightBoxWinner=false;
        let dataToSend={
            gameName: this.props.gameName,
            playerName: this.props.currentUser
        };
        fetch('http://localhost:3001/winnerWantToGetOut', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then( () => {
            this.clearIntervalFunctions();
            this.props.handleActivePlaye(false,"");
            this.props.winnerGetOut(this.state.dominoOb.gameName);

        });
    }

    watcherWantToGetOut(){
        let dataToSend= {
            gameName: this.props.gameName,
            playerName: this.props.currentUser
        };

        fetch('http://localhost:3001/watcherWantToGetOut', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then( () => {
            this.clearIntervalFunctions();
           this.props.handleActivePlaye(false,"");
           this.state.dominoOb.resultGame===this.props.currentUser?  this.props.winnerGetOut(this.state.dominoOb.gameName):null;

        });
    }

    clearIntervalFunctions(){
        clearInterval(this.rendergame);
        clearInterval(this.clockGame);
        clearInterval(this.clockTurnGame);
    }

    render() {
        return (
            <div className="starts">
                {this.state.dominoOb!==undefined && this.indexCurrentPlayerInWatchersArray===-1?
                    <div>
                        <div className={"board"}><Board board={this.state.dominoOb.board} endGame={this.state.dominoOb.endGame}
                                                optionalMove={this.state.dominoOb.optionalMove}
                                                putNewCardOnBoard={(row, col) => this.putNewCardOnBoard(row, col)}
                                                        indexOfChoseCard={this.state.dominoOb.indexOfChoseCard}
                                                        isMyTurn={this.isMyTurn}
                                                        players={this.state.dominoOb.players}
                                                        playerName={this.props.currentUser}
                                                        isWatcher={this.state.dominoOb.players[this.indexCurrentPlayerInPlayersArray].watcher}/>
                             <div className={"allPacket"}><Packet playerCards={this.state.dominoOb.players[ this.indexCurrentPlayerInPlayersArray].playerCard}  isMyTurn={this.isMyTurn} Packet={this.state.dominoOb.packetCards} endGame={this.state.dominoOb.endGame} takeFromPacket={() => this.takeFromPacket()} /></div>
                            {this.state.dominoOb.resultGame===this.props.currentUser && this.removeLightBoxWinner && !this.state.dominoOb.endGame?<WinnerPlayer winnerWantToStay={()=>this.winnerWantToStay()} winnerWantToGetOut={()=>this.winnerWantToGetOut()}  />:null}
                            {this.state.dominoOb.resultGame && this.state.dominoOb.resultGame!==this.props.currentUser && this.removeLightBoxWinner && !this.state.dominoOb.endGame?<div className={"announcmentWinner"}>{this.state.dominoOb.resultGame} is the winner,continue to play at your turn</div>:null}
                            {this.state.dominoOb.endGame && this.lightBoxEnd ? <div><EndGame players={this.state.dominoOb.players} resultGame={this.state.dominoOb.resultGame} returnToMainPage={() => this.returnToMainPage()}/> </div> : null}
                        </div>
                        <div className={"playerCardsRender"}><PlayerCards currentUser={this.props.currentUser} playerCards={this.state.dominoOb.players[ this.indexCurrentPlayerInPlayersArray].playerCard} endGame={this.state.dominoOb.endGame} chosenCard={(card) => this.chosenCard(card)} isMyTurn={this.isMyTurn}/></div>
                        <Timer timer={this.state.timer}/>
                        <div className={"chatBox"}> <Chat resultGame={this.state.dominoOb.resultGame} currentUser={this.props.currentUser} gameName={this.props.gameName} endGame={this.state.dominoOb.endGame} isWatcher={this.state.dominoOb.players[this.indexCurrentPlayerInPlayersArray].watcher}/></div>

                        <div className={"allDetails"}>

                            <div className={"static"}><Statistics currentUserName={this.props.currentUser} playerStatistics={this.state.dominoOb.players[ this.indexCurrentPlayerInPlayersArray].statistics}/></div>
                            <br/>
                            <AllPlayersInGame nameClassState={this.playerState} gameName={this.props.gameName} watchers={this.state.dominoOb.watcherPlayers} players={this.state.dominoOb.players} turnCurrentPlayer={this.state.dominoOb.nextPlayerToPlay} />
                            {this.state.dominoOb.playerTakeCardFromPacket? <div className={"msgTakeCard"}>{this.state.dominoOb.players[this.state.dominoOb.nextPlayerToPlay].playerName} take card from packet</div>:null}
                            {this.masPacketIsEmpty? <div className={"packetEmptyMsg"}>The packet is empty the turn pass to the next player</div>:null}
                        </div>
                    </div> :null}

                {this.state.dominoOb===undefined?
                    <div className={"dialogWaitingContainer"}>
                        <div className={"modal-background"}> </div>
                        <div className={"dialogWait"}>
                            <div className={"msgBeforePlay"}>We are Waiting for {this.needToJoin} Players to Join</div>
                            <div className="lds-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <a className={"leaveGame"} onClick={()=>this.leaveBeforeGameBegin()}> </a>
                        </div>\
                    </div>:null}

                {this.state.dominoOb !== undefined &&  this.indexCurrentPlayerInWatchersArray> -1?
                    <div className={"watchState"}>
                        <div className={"board"}><Board board={this.state.dominoOb.board} endGame={this.state.dominoOb.endGame}
                                                        optionalMove={this.state.dominoOb.optionalMove}
                                                        putNewCardOnBoard={(row, col) => this.putNewCardOnBoard(row, col)}
                                                        indexOfChoseCard={this.state.dominoOb.indexOfChoseCard}
                                                        isMyTurn={this.isMyTurn}
                                                        players={this.state.dominoOb.players}
                                                        playerName={this.props.currentUser}
                                                        isWatcher={this.indexCurrentPlayerInPlayersArray!==-1?this.state.dominoOb.players[this.indexCurrentPlayerInPlayersArray].watcher:false}/>
                            <div className={"allPacket"}><Packet Packet={this.state.dominoOb.packetCards} endGame={this.state.dominoOb.endGame} takeFromPacket={() => this.takeFromPacket()} /></div>
                            {this.state.dominoOb.resultGame && this.state.dominoOb.resultGame!==this.props.currentUser && this.removeLightBoxWinner && !this.state.dominoOb.endGame?<div className={"announcmentWinner"}>{this.state.dominoOb.resultGame} is the winner</div>:null}
                            {this.state.dominoOb.endGame && this.lightBoxEnd ? <div><EndGame players={this.state.dominoOb.players} resultGame={this.state.dominoOb.resultGame} returnToMainPage={() => this.returnToMainPage()}/> </div> : null}
                        </div>
                        <div className={"playerCardsRender"}><AllPlayersCards endGame={this.state.dominoOb.endGame && this.lightBoxEnd} allPlayers={this.state.dominoOb.players}/> </div>
                        <div className={"watcherStateForStatistics"}>
                            <AllPlayersInGame  gameName={this.props.gameName} watchers={this.state.dominoOb.watcherPlayers} players={this.state.dominoOb.players} turnCurrentPlayer={this.state.dominoOb.nextPlayerToPlay} />
                            {this.state.dominoOb.playerTakeCardFromPacket? <div className={"msgTakeCard"}>{this.state.dominoOb.players[this.state.dominoOb.nextPlayerToPlay].playerName} take card from packet</div>:null}
                        </div>
                        <a className={"backToMainPage"} onClick={()=>this.watcherWantToGetOut()}> .</a>
                    </div>
             :null}
            </div>
        )
    }
}
































