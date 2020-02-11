import React from "react";
import _cloneDeep from 'lodash/cloneDeep';


const Row = props => {
    const indexRow= props.ch;
    const cells = props.cells;
    const endGame=props.endGame;
    const isMyTurn=props.isMyTurn;
    const indexOfChoseCard=props.indexOfChoseCard;

    console.log("indexOfChoseCard",indexOfChoseCard);

    const isIndexExist = (indexRow, indexCell) =>  props.optionalMove && props.optionalMove.find(item=> item.row===indexRow && item.col===indexCell && item.able==="true" );
    let item=(indexRow, indexCell)=> props.optionalMove.find(item=> item.row===indexRow && item.col===indexCell && item.able==="true" );
    let canPutCardOnBoard=()=>!endGame && indexOfChoseCard>=0 && isMyTurn;

    return <ul className={"row"}>
        {cells.map((cell,indexCell) => (<li  className={"row"+ indexCell} key={`${indexRow}, ${indexCell}`}>
            {(isIndexExist(indexRow, indexCell)&& isMyTurn)? (<div className= {item(indexRow, indexCell).side ==="up" || item(indexRow, indexCell).side==="down"? "verticalEmptyPlace": "empty"} onClick={() => canPutCardOnBoard()? props.putNewCardOnBoard(indexRow, indexCell): null}> </div>) :null}
            {(cell && cell.duration=== "vertical" || cell && cell.duration=== "horizontal") ?  (
                <div className={cell.duration}>
                    <div className={cell.duration + 'Side1'}
                         style={{backgroundImage: 'url(' + cell.imgSide1 + ')'}}>
                    </div>
                    <div className={cell.duration + 'Side2'}
                         style={{backgroundImage: 'url(' + cell.imgSide2 + ')'}}>
                    </div>
                </div>) : null}
            { cell===null && !isIndexExist(indexRow,indexCell)? <div className={"undefined"}> </div>: null}
        </li>))
        }

    </ul>
};



export const Board = props => {
    const putNewCardOnBoard=props.putNewCardOnBoard;
    const endGame= props.endGame;
    const board = props.board;
    const optionalMove=props.optionalMove;
    const indexOfChoseCard=props.indexOfChoseCard;
    const isMyTurn= props.isMyTurn;
    const currentPLayerName=props.playerName;
    const players=props.players;
    const isWatcher=props.isWatcher;
    let length=players.length;
    let copyArrayPlayers= _cloneDeep(players);

    let findIndex= players.findIndex(player=>player.playerName===currentPLayerName);
    findIndex >-1? copyArrayPlayers.splice(findIndex,1):null;

    console.log("isWatcher",isWatcher);
    findIndex= copyArrayPlayers.findIndex(player=>player.watcher);
    if(findIndex >-1 || isWatcher){
        copyArrayPlayers.splice(findIndex,1);
        length--;
    }

    return (
        <div className={"allGrid"}>
            <div className={"arivelUp"}>{copyArrayPlayers[0].playerName}</div>
            {length>2? <div className={"arivelSide"}>{copyArrayPlayers[1].playerName} </div>:<div className={"nonePlayer"}> </div>}
            <ul className={`${(length===2)? "grid": "grid3"}`}>
                {board.map((row,indexRow) => <li key={indexRow}><Row cells={row} ch={indexRow} endGame={endGame} optionalMove={optionalMove} putNewCardOnBoard={putNewCardOnBoard} indexOfChoseCard={indexOfChoseCard} isMyTurn={isMyTurn}/></li>)}
            </ul>
        </div>
    )
};
