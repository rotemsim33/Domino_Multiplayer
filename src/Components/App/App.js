import React, {Component} from "react";
import {SignIn} from '../SignIn/SignIn';
import {MainPage} from '../MainPage/MainPage';
import {DominoGame} from '../Domino/DominoGame';
import '../SignIn/SignIn.css';

class App extends Component {
     constructor(props) {
        super(props);
        this.state = {
            logIn: false,
            currentUser:"",
            activePlayer:false,
            gameName:"",
            winnerGetOutParm:false,
        };
         this.getUser();
    }

    handleLogIn(isLogIn,userName){
        this.setState({logIn:isLogIn,currentUser:userName, winnerGetOutParm:false} );
    }

    handleActivePlayer(parm,gameName){
        this.setState({activePlayer:parm,gameName:gameName, winnerGetOutParm:false});
    }

    winnerGetOut(gameName){
        this.setState({gameName:gameName, winnerGetOutParm:true });
    }


   async getUser(){
       let response= await fetch('http://localhost:3001/checkIfUserExit', {method: 'GET', credentials: 'include'});
       let res = await response.json();
           if (res.result) {
               this.setState({
                   logIn: res.result.logIn,
                   currentUser: res.result.userName,
                   activePlayer: res.result.activePlayer,
                   gameName: res.result.gameName
               });
           }
   }

    render() {
        return (
            <div className={"all"}>
                {!this.state.logIn?<SignIn class={"signIn"} handleLogIn={(parm,userName)=>this.handleLogIn(parm,userName)}  />:null}
                {this.state.logIn && !this.state.activePlayer?< MainPage  handleLogIn={(parm,userName)=>this.handleLogIn(parm,userName)} handleActivePlayer={(parm,gameName,needToJoin)=>this.handleActivePlayer(parm,gameName,needToJoin)} currentUser={this.state.currentUser}  gameName={this.state.gameName} winnerGetOutParm={this.state.winnerGetOutParm}/> :null}
                {this.state.activePlayer? <DominoGame winnerGetOut={(gameName)=>this.winnerGetOut(gameName)} handleActivePlaye={(parm,gameName)=>this.handleActivePlayer(parm,gameName)} currentUser={this.state.currentUser}  gameName={this.state.gameName} />:null}


            </div>
        );
    }
};

export default App;