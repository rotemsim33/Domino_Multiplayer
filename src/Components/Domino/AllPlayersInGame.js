import React from "react";

export const AllPlayersInGame= props=>{
    const watchers= props.watchers;
    const players= props.players;
    const turnCurrentPlayer=props.turnCurrentPlayer;
    const nameOfPlayerToPlay=players[turnCurrentPlayer].playerName;
    const gameName=props.gameName;


    return(
        <div>
            <div className={"titleDetailsGame"}>Game {gameName}</div>
            <div className={"turnOf"}>It's The turn of: {nameOfPlayerToPlay} </div>
            <ul>Players Names:
            {players.map(player=><li className={"list"} key={player.playerName}>{!player.watcher? player.playerName:null}  </li>
            )}
            </ul>
            {watchers.length > 0 ? <div>
                <ul>Watchers players:
                {watchers.map(name => <li className={"list"} key={name}>{name}  </li>
                )}
                </ul>
            </div> : <div>
                <li>There are no watchers yet</li>

            </div>
            }

        </div>
    )
};