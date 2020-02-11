import React from "react";

 export const Data=props=>{
    const currentUser= props.currentUser;
    return(
        <div className={"dataContainer"}>
            <div className={"logout_name"}>
                <a className={"logout"} onClick={()=> props.logOutCurrentUser()}>. </a>
                <div className={"nameUser"}>Hey {currentUser}</div>
            </div>
            <a className={"newGame"} onClick={()=>props.updateParamCreateNewGame()}>New Game</a>
        </div>
    )
};