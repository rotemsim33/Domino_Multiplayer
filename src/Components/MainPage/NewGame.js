import React, {Component} from "react";

export class NewGame extends Component{
    constructor(props) {
        super(props);
        this.state = {
            gameName:"",
            numPlayers:"2",
        };

        this.handleChangeGameName = this.handleChangeGameName.bind(this);
        this.handleChangNumPlayers = this.handleChangNumPlayers.bind(this);
    }

    handleChangeGameName(event){
        this.setState({gameName:event.target.value});
    }

    handleChangNumPlayers(event){
        this.setState({numPlayers:event.target.value});
    }

    render() {
        return (
            <div className={"newGameContainer"}>
                <div className={"modal-background"}> </div>
                <div className={"dialogGame"}>
                    <div className={"closeNewGame"} onClick={()=> this.props.regretCreateGame()}> </div>
                    <h4 className={"titleNewGame"}>New Game</h4>
                    <h6 className={"subTitleNewGame"}>Choose your flavour.</h6>
                    <div className={"containerDataNewGame"}>
                        <label>Name For The Game:</label><input className={"inputNewGame"} value={this.state.gameName} onChange={this.handleChangeGameName}/>
                        <p>Players:</p>
                        <div className="radio1">
                            <label>
                                <input type="radio" value="2"
                                       checked={this.state.numPlayers === "2"}
                                       onChange={this.handleChangNumPlayers} />  2
                            </label>
                        </div>
                        <div className="radio2">
                            <label>
                                <input type="radio" value="3"
                                       checked={this.state.numPlayers === "3"}
                                       onChange={this.handleChangNumPlayers} />  3
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className={"creatNewGame"} onClick={() => this.props.createNewGame(this.state)}>Create</div>
                    </div>
                    {this.props.errMes ? <div className={"errGameName"}>{this.props.errMes}</div> : null}
                </div>
            </div>
        )
    }
};