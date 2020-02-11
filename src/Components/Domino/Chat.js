import React, {Component} from "react";

export class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            chat:undefined,
            string:"",
        };

        this.handleUpdateChat=this.handleUpdateChat.bind(this);
        this.handleNewString = this.handleNewString.bind(this);
        this.chatIterval;
    }


    handleNewString(event){
        this.setState({string:event.target.value});
    }

    handleUpdateChat() {
        event.preventDefault();
        let string = this.state.string;
        console.log("handleUpdateChat", string);
        let dataToSend = {
            gameName: this.props.gameName,
            currentUser: this.props.currentUser,
            newLine:this.state.string
        };

        fetch('http://localhost:3001/addNewLineToChat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then(() => {
            this.setState({string:""});
            console.log("creatNewChatLine");
        });
    }

    renderChat(){
        let dataToSend = {
            gameName: this.props.gameName,
        };

        fetch('http://localhost:3001/renderChat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            }
        ).then(async response => {
            let res=await response.json();
            this.setState({chat:res.chat})
        });
    }

    setIntervalChat(){
        this.chatIterval = setInterval(() => this.renderChat(), 1000);
    }

    componentWillMount() {
      this.setIntervalChat();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("chek",this.props.resultGame, this.props.currentUser,this.props.endGame);
        this.props.endGame || this.props.isWatcher? clearInterval(this.chatIterval):null;
    }

    render() {
        return (
            <div className={"chat"}>
                <div className={`${(!(!this.props.endGame && this.props.resultGame!==this.props.currentUser) ||  (this.props.endGame || this.props.resultGame===this.props.currentUser))? "containerChatEndGame": "containerChat"}` }>
                    <div className={"titleChat"}><label>What on your mind? </label><input className={"insertLineChat"} value={this.state.string} onChange={this.handleNewString} /> </div>
                    <a className={"creatNewChatLine"} onClick={() => this.state.string!==""?this.handleUpdateChat():null}>Send</a>
                </div>
                {this.state.chat && this.state.chat.length>0 ?this.state.chat.map((string,index)=><div key={`${string} + ${index}`} className={"stringInChat"}>{string}</div>):null}
            </div>
        )
    }
}