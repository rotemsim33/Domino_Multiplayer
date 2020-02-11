import React from "react";

export const WinnerPlayer= props=>{

    return(
        <div className={"winnerPlayer"}>
          <div className={"congraMsg"}>Congratulations you are the winner</div>
            <div className={"askQWinner"}>Wish to stay in the game and watch? <button className={"yesButton"} onClick={()=>props.winnerWantToStay()}>YES, Show me those losers</button> <button className={"noButton"} onClick={()=>props.winnerWantToGetOut()}>NO, Back to games page</button></div>
        </div>
    )
};