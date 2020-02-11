import React from "react";
import _cloneDeep from "lodash/cloneDeep";

export const AllPlayersCards = props => {
    const durationPlayer="vertical";
    const allPlayers = props.allPlayers;
    let lastIndex=allPlayers.length-1;
    let copyArrayPlayers=_cloneDeep(allPlayers);
    let findIndex=allPlayers.findIndex(player=>player.watcher);
    if(findIndex!==-1){
        copyArrayPlayers.splice(findIndex,1);
        lastIndex--;
    }

    return (
        <div className={"containerPlayerCards"}>
            <div className={"currentUserName"}> {copyArrayPlayers[lastIndex].playerName}</div>
            <div className={"picPlayerCards"}> </div>
            {copyArrayPlayers.map((player,index) =>
                <div key={index} className={!props.endGame? copyArrayPlayers.length===3 ?'player'+index:'play'+index:null}>
                    {
                        player.playerCard.map(card =>
                            <div className={durationPlayer} key={card.side1 + card.side2}>
                                <div className={durationPlayer + 'Side1'}
                                     style={{backgroundImage: 'url(' + card.imgSide1 + ')'}}> </div>
                                <div className={durationPlayer + 'Side2'}
                                     style={{backgroundImage: 'url(' + card.imgSide2 + ')'}}> </div>
                            </div>
                        )
                    }
                    </div>
               )
            }
        </div>
    )
};