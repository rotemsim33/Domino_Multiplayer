import React from "react";

export const Packet = props => {
    let playerCard;
    let card=true;

    const packet = props.Packet;
    const endGame= props.endGame;
    const isMyTurn=props.isMyTurn;

    props.playerCards? playerCard=props.playerCards:null;
    playerCard? card = playerCard.find(card => card.canChose === "true"):null;

    let firstPicturePacket=()=>!card && isMyTurn && !endGame && packet.length===1;
    let secondPicturePacket=()=>!card && isMyTurn &&!endGame && packet.length===2;
    let thirdPicturePacket=()=>!card && isMyTurn &&!endGame && packet.length>2;


    return (
        <div className={(packet.length>0)? "under": "nonePacket"} onClick={()=> firstPicturePacket()? props.takeFromPacket():null} > Packet
            <div className={(packet.length>1)? "under": "nonePacket"} onClick={()=> secondPicturePacket()? props.takeFromPacket():null} > Packet
                <div className={(packet.length>2)? "under": "nonePacket"} onClick={()=>thirdPicturePacket()? props.takeFromPacket():null} > Packet </div>
            </div>
        </div>

    )
};
