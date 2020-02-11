import React from "react";

export const PlayerCards = props => {
    const durationPlayer="vertical";
    const playerCards = props.playerCards;
    const endGame= props.endGame;
    const isMyTurn=props.isMyTurn;
    const currentUser= props.currentUser;
    let canChoose=(card)=> !endGame && card.canChose==="true" && isMyTurn;

    return (
        <div className={"containerPlayerCards"}>
            <div className={"currentUserName"}> {currentUser}</div>
            <div className={"picPlayerCards"}> </div>
            {playerCards.map(card =>
                <div key={card.side1 + card.side2} className={`${durationPlayer} ${(card.canChose && card.canChose ==="true" && isMyTurn) ? "canChoose": " "}`} onClick={() => canChoose(card)? props.chosenCard(card): " "}>
                    <div className={durationPlayer + 'Side1'}
                         style={{backgroundImage: 'url(' + card.imgSide1 + ')'}}> </div>
                    <div className={durationPlayer + 'Side2'}
                         style={{backgroundImage: 'url(' + card.imgSide2 + ')'}}> </div>
                </div>
            )
            }
        </div>
    )
};