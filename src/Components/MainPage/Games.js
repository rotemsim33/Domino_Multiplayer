import React from "react";

export const Games=props=>{
    const gamesList= props.allGames;
    const currentUser=props.currentUser;
    let checkDeleteButton= game=> !game.isBegin && game.name_players.length===0 &&  game.name_watchers_players.length===0 && game.userName===currentUser;
    let checkIfWatcherExists=game=>game.name_watchers_players && game.name_watchers_players.length>0;

    return(
        <div className={"gameAllContainer"}>
            <div className={"gamesTitleContainer"}>
                <div className={"gamesTitle"}>Games</div>
                <div className={"dividerTitle"}> </div>
            </div>
            <div className={"gameContainer"}>
                {gamesList.map(game =>
                    <div className={"game"} key={`${game.gameName}`}>
                        <div> Game Name: {game.gameName} </div>
                        {checkDeleteButton(game)? <a className={"deleteButton"} onClick={()=>props.deleteGame(game.gameName)}> </a>: <a className={"noneDiv"}> </a>}
                        <div className={"adminGame"}> The Admin: {game.userName}  </div>
                        <div className={"iconPlayers"}>
                            <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"> </path>
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"> </path>
                            </svg>
                            <div className={"numPlayers"}>{game.amount_connected_players}/{game.amount_players}</div>
                        </div>
                        <div className={"iconWatcher"}>
                            <div className={"watcherPlayer"}> {checkIfWatcherExists(game)? game.name_watchers_players.length: 0} </div>
                        </div>
                        {!game.isBegin ?
                            <a className={"joinButton"} onClick={() => props.joinDominoGame(game.gameName)}> </a> : <div className={"gameBeginMsg"}>Game Begin</div>}
                        <div className={"startWatchButton"} onClick={()=>game.canWatch && (!props.winnerGetOutParm || !game.isBegin || props.gameName!==game.gameName) ? props.watchDominoGame(game.gameName):null}> </div>
                        <div className={"divider"}> </div>

                    </div>
                )
                }
            </div>
        </div>
    )
};