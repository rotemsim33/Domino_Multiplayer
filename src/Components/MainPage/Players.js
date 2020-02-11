import React from "react";

export const Players=props=>{
    const playersList= props.allPlayers;
    const currentUser=props.currentUser;

    return(
        <div className={"playersContainer"}>
            <br/>
            <h3 className={"playersTitle"}>ACTIVE PLAYERS</h3>
            {Object.keys(playersList).map(key=> playersList[key].userName!== currentUser?
                <div key={playersList[key].userName} className={"userActive"}>
                    <div className={"greenPoint"}> </div>
                    <div className={"nameActiveUser"}> {playersList[key].userName} </div>

                </div>:null
            )}

        </div>
    )
};
