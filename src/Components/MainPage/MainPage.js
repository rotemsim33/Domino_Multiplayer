import React, {Component} from "react";
import './MainPage.css';
import {Data} from './Data';
import {Players} from './Players';
import {Games} from './Games';
import {NewGame} from './NewGame';


export class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allGames: [],
            allPlayers: [],
        };

        this.update;
        this.isCreateNewGame = false;
    }

    async updateStates(){
        let response= await fetch('http://localhost:3001/states', {method: 'GET'});
        let res= await response.json();
        this.setState({allGames:res.games,allPlayers:res.users})
    }

    startUpdating() {
        this.update = setInterval(() => this.updateStates(), 2000);
    }

    componentWillMount() {
        this.startUpdating();
    }

    updateParamCreateNewGame(){
        this.isCreateNewGame=true;
        this.setState({});
    }

    logOutCurrentUser() {
        fetch('http://localhost:3001/logOut', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'userName': this.props.currentUser})
        })
            .then(async response => {
                let res = await response.json();
                if (res.success) {
                    clearInterval(this.update);
                    this.props.handleLogIn(false, "");
                }
            })
    }

    joinDominoGame(gameName) {
        let bodyObj = {
            userName: this.props.currentUser,
            gameName: gameName
        };
        fetch('http://localhost:3001/joinPlayer', {
                method: 'POST',
               credentials: 'include',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(bodyObj)
            }
        ).then(() => {
                clearInterval(this.update);
                this.props.handleActivePlayer(true, gameName);
        });
    }

    watchDominoGame(gameName) {
        let bodyObj = {
            userName: this.props.currentUser,
            gameName: gameName
        };
        fetch('http://localhost:3001/watchPlayer', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bodyObj)
            }
        ).then(() => {
            clearInterval(this.update);
            this.props.handleActivePlayer(true, gameName);
        });
    }

    createNewGame(gameItem){
        const newGame= {
            gameName: gameItem.gameName,
            userName: this.props.currentUser,
            amount_players: gameItem.numPlayers,
            amount_connected_players:0,
            name_players:[],
            name_watchers_players:[],
            isBegin: false,
            canWatch:true
        };

        fetch('http://localhost:3001/game', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newGame)
        })
            .then(async response => {
                let res= await response.json();
                if(res.success){
                    this.errMes="";
                    this.isCreateNewGame= false;
                    this.setState({});

                }else{
                    if(res.msg==="Equal") {
                        this.errMes = "Name game already exist, please try another one";
                        this.setState({});
                    }else{
                        this.errMes = "Please Enter Name";
                        this.setState({});
                    }
                }
            });
    }

    regretCreateGame(){
        this.isCreateNewGame=false;
        this.setState({});
    }

    deleteGame(gameName){
        fetch('http://localhost:3001/deleteGame', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"gameName": gameName})
        })
            .then(() => {
             console.log("gameDelete")
            });
    }

    render() {
        return (
            <div className={"mainLobby"}>
                <div className={"games_data_container"}>
                    <div className={"dataRender"}><Data updateParamCreateNewGame={()=>this.updateParamCreateNewGame()} logOutCurrentUser={()=>this.logOutCurrentUser()} currentUser={this.props.currentUser} /></div>
                    {this.isCreateNewGame?<div className={"newGameRender"}><NewGame errMes={this.errMes} regretCreateGame={()=>this.regretCreateGame()} createNewGame={(gameItem)=>this.createNewGame(gameItem)}/></div>:null}
                    <div className={"divider"}> </div>
                    <div className={"gamesRender"}><Games gameName={this.props.gameName} winnerGetOutParm={this.props.winnerGetOutParm} currentUser={this.props.currentUser} deleteGame={(gameName)=>this.deleteGame(gameName)} watchDominoGame={(gameName)=>this.watchDominoGame(gameName)}  allGames={this.state.allGames} joinDominoGame={(gameName)=>this.joinDominoGame(gameName)} /></div>
                </div>
                <div className={"playersRender"}><Players allPlayers={this.state.allPlayers} currentUser={this.props.currentUser}/></div>
            </div>
        );
    }
}














