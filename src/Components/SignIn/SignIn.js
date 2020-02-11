import React, {Component} from "react";
import ReactDOM from 'react-dom';
import './SignIn.css';


export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            errMes: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event) {
        event.preventDefault();
        const userName = this.state.userName;

        fetch('http://localhost:3001/users', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'userName': userName})
        })
            .then(async response => {
                let res = await response.json();
                if (res.success) {
                    this.setState({errMes: "The signIn succeed"}, () => this.props.handleLogIn(true, userName));

                } else {
                    if(res.msg==="Equal") {
                        this.setState({
                            errMes: "User name already exist, please try another one",
                            userName: ""
                        } ,() => this.props.handleLogIn(false, ""));
                    }else{
                        this.setState({
                            errMes: "Please Enter Name",
                            userName: ""
                        } ,() => this.props.handleLogIn(false, ""));

                    }
                }
            });
    }

    handleChange(event) {
        this.setState({userName: event.target.value});
    }

    render() {
        return (
            <div className={"signin-container"}>
                <div className={"modal-background"}> </div>
                <div className={"popup"}>
                    <div className={"form"}>
                        <div className={"headline"}>
                            <div className={"text"}>
                                <div className={"hello"}>Welcome</div>
                                <div className={"letsPlay"}>Lets Play Dominoes</div>
                            </div>
                            <div className={"icon"}> </div>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className={"partTwo"}>
                                <label>
                                    NickName:
                                    <input className={"signInput"} type="text" value={this.state.userName}
                                           onChange={this.handleChange}/>
                                </label>
                                <div>
                                    <input className={"submit"} type="submit" value="Submit"/>
                                </div>
                            </div>
                        </form>
                        {this.state.errMes!=="" ? <div className={"message"}>{this.state.errMes}</div> : null}
                    </div>
                </div>
            </div>
        );
    }
};

