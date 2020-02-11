import React from "react";

export const EndGame= props=>{
    const resultGame= props.resultGame;
    const players=props.players;
    return(
        <div className={"endGameModal"}>
            <div className={"close"} onClick={()=> props.returnToMainPage()}>close</div>
            <div className={"win"}>{resultGame} !!!</div>
            <div className={"allStatisticDetails"}>
            <div className={"titleStatisticsAll"}>Statistics:</div>

                {players.map(player=>
                    <div key={`${player.playerName} + ${player.score}`}>
                    <span> Name: {player.playerName}</span><br/>
                    <span> Turns: {player.statistics.amountOfTurns}</span><br/>
                    <span> Average time for turn: {player.statistics.averageMoveTime} </span><br/>
                    <span> Pull from the packet: {player.statistics.pullFromPacket}</span><br/>
                    <span> Score: {player.statistics.score} </span><br/>
                    <br/>
                </div>)}
                </div>
        </div>
    )
};