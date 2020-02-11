const game = require('./game');
const gamesList=game.gamesList;
const SIZE_GRID_COL=9;
const SIZE_GRID_ROW=7;
const AMOUNT_CARD_OF_PLAYER=6;
const AMOUNT_CARDS=6;
const MIDDLE_ROW=3;
const MIDDLE_COL=4;

let activeDominoGames=[{}];
let currentDominoGame={};
let indexCurrentPlayerInArray={};


function createBoardCards (){
    let board = new Array(SIZE_GRID_ROW);
    for (let i = 0; i < SIZE_GRID_ROW; i++) {
        board[i] = new Array(SIZE_GRID_COL);
        board[i].fill(null);
    }
    return board;
}

function createPlayerCards(packetCards){
    let playerCards=[];
    for (let i = 0; i < AMOUNT_CARD_OF_PLAYER; i++) {
        const randomIndex = Math.floor(Math.random() * packetCards.length);
        playerCards = playerCards.concat(packetCards.splice(randomIndex, 1));
    }
    return playerCards;
}

function createPacketGame() {
    let cards = [];
    for (let i = 0; i <= AMOUNT_CARDS; i++) {
        for (let j = i; j <= AMOUNT_CARDS; j++) {
            const card = {
                side1: i.toString(),
                side2: j.toString(),
                imgSide1: `images/${i}.png`,//'images/' + i + '.png'
                imgSide2: `images/${j}.png`,//images/' + j + '.png'
                duration: "horizontal",
                canChose: "true"
            };
            cards.push(card);
        }
    }
    return cards;
}

function calculatePlayerScore(playerCards){
    let score = 0;
    playerCards.forEach(item=>score += Number(item.side1) + Number(item.side2));
    return score;
}

function createNewDominoGame(gameName){
    let findGameInTheList= gamesList.find(item=>item.gameName===gameName);
    if(findGameInTheList.isBegin){
        let newDominoGameOb = {
            nextPlayerToPlay: 0,
            active: true,
            gameName: gameName,
            board: [],
            packetCards: [],
            players: [],
            timerForTurn: {
                seconds: 0,
                minuets: 0,
            },

            watcherPlayers:[],
            optionalMove: [],
            chat:[],
            resultGame: "",
            endGame: false,
            take: 0,
            playerTakeCardFromPacket:false,
            indexOfChoseCard:-1
    };

        newDominoGameOb.packetCards=createPacketGame();
        newDominoGameOb.board=createBoardCards();

        findGameInTheList.name_players.forEach(name=>{
            let newPlayer={
                playerName: name,
                playerCard: [],
                statistics: {
                    amountOfTurns: 0,
                    averageMoveTime: 0,
                    amountTimeInSec: 0,
                    pullFromPacket: 0,
                    score: 0
                },
                packetEndMes: false,
                watcher: false
            };
            newPlayer.playerCard=createPlayerCards( newDominoGameOb.packetCards);
            newPlayer.statistics.score= calculatePlayerScore(newPlayer.playerCard);
            newDominoGameOb.players.push(newPlayer);
        });

        if(findGameInTheList.name_watchers_players && findGameInTheList.name_watchers_players.length>0) {
            findGameInTheList.name_watchers_players.forEach(name => {
                newDominoGameOb.watcherPlayers.push(name);
            });
        }
        activeDominoGames.push(newDominoGameOb);
    }
}

function searchDominoGame(gameName){
    return activeDominoGames.find(item=>item.gameName===gameName);
}

function updateIndexOfChosenCard(indexCard,gameName){
    currentDominoGame= activeDominoGames.find(item=>item.gameName===gameName);
    currentDominoGame.playerTakeCardFromPacket=false;
    currentDominoGame.indexOfChoseCard=indexCard;
    currentDominoGame.players.forEach(player=>{
        player.packetEndMes=false;
    })
}

function updateDominoStetsAfterMoveOnBoard(currentPlayer,gameName,timerTurn,row,col){
    indexCurrentPlayerInArray=currentPlayer;
    currentDominoGame= activeDominoGames.find(item=>item.gameName===gameName);
    currentDominoGame.timerForTurn=timerTurn;
    renderAllStates(row,col);
}


function findTheNextPlayerToPlay(){
    let returnToTheSamePlayer=false;
    let check=true;
    updateTurn2(indexCurrentPlayerInArray);

    while(!returnToTheSamePlayer && check){
        indexCurrentPlayerInArray===currentDominoGame.nextPlayerToPlay? returnToTheSamePlayer=true :returnToTheSamePlayer=false;
        if(!returnToTheSamePlayer) {
            checkIfPlayerWatcher() ? updateTurn2(currentDominoGame.nextPlayerToPlay) : null;
        }

        indexCurrentPlayerInArray===currentDominoGame.nextPlayerToPlay? returnToTheSamePlayer=true :returnToTheSamePlayer=false;

        if(!returnToTheSamePlayer) {
            checkIfPlayerCanPlay() ? check = false : updateTurn2(currentDominoGame.nextPlayerToPlay);
        }
    }

    if(returnToTheSamePlayer){ //check if the game is end beacuse no one else can play
        checkEndGame(currentDominoGame.players[indexCurrentPlayerInArray].playerCard,currentDominoGame.packetCards);
    }

    checkMoveOnBoard(currentDominoGame.players[currentDominoGame.nextPlayerToPlay].playerCard,currentDominoGame.board); //for optionalmove
}


function updateTurn2(indexCurrentPlayer){
    let index=indexCurrentPlayer;
    if(currentDominoGame.players.length===3) {
        indexCurrentPlayer===2?   currentDominoGame.nextPlayerToPlay=0: currentDominoGame.nextPlayerToPlay= index+1;
    }
    if(currentDominoGame.players.length===2) {
        indexCurrentPlayer===1?   currentDominoGame.nextPlayerToPlay=0: currentDominoGame.nextPlayerToPlay= index+1;
    }
}


function checkIfPlayerWatcher(){
    return currentDominoGame.players[currentDominoGame.nextPlayerToPlay].watcher;
}


function checkIfPlayerCanPlay(){
    let checkCardsToPlay = currentDominoGame.players[currentDominoGame.nextPlayerToPlay].playerCard.find(card => card.canChose === "true");
    if(checkCardsToPlay === undefined  && currentDominoGame.packetCards.length===0) {
        currentDominoGame.players[currentDominoGame.nextPlayerToPlay].packetEndMes = true;
        return false; //return to check this player from the begining
    }
    return true;
}


function renderAllStates(row, col) {
    let checkBoard = putNewCardOnBoard(row, col);
    if (currentDominoGame.indexOfChoseCard >= 0 && checkBoard) { // 1-if you choose a card 2-if you choose a match card
        currentDominoGame.players[indexCurrentPlayerInArray].playerCard = getStatusPLayerCard(currentDominoGame.board);
        currentDominoGame.players[indexCurrentPlayerInArray].statistics = updateStatistics(currentDominoGame.players[indexCurrentPlayerInArray].playerCard);
        initAllPlayersCards();
        checkEndGame(currentDominoGame.players[indexCurrentPlayerInArray].playerCard,currentDominoGame.packetCards);
        findTheNextPlayerToPlay();
        currentDominoGame.indexOfChoseCard = -1;
    }
}

function putFirstCardOnBoard(board, chooseCard) {
    board[MIDDLE_ROW][MIDDLE_COL] = chooseCard;
    pushNewItemToOptionalMoveArray(MIDDLE_ROW, MIDDLE_COL-1, "left", board[MIDDLE_ROW][MIDDLE_COL].side1, board[MIDDLE_ROW][MIDDLE_COL].duration);
    pushNewItemToOptionalMoveArray(MIDDLE_ROW, MIDDLE_COL+1, "right", board[MIDDLE_ROW][MIDDLE_COL].side2, board[MIDDLE_ROW][MIDDLE_COL].duration);

    if (board[MIDDLE_ROW][MIDDLE_COL].side1 === board[MIDDLE_ROW][MIDDLE_COL].side2) {
        pushNewItemToOptionalMoveArray(MIDDLE_ROW-1, MIDDLE_COL, "up", board[MIDDLE_ROW][MIDDLE_COL].side1,board[MIDDLE_ROW][MIDDLE_COL].duration);
        pushNewItemToOptionalMoveArray(MIDDLE_ROW+1, MIDDLE_COL, "down", board[MIDDLE_ROW][MIDDLE_COL].side2, board[MIDDLE_ROW][MIDDLE_COL].duration);
    }
    return board;
}

function putCardOnleft(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace) {
    chooseCard.side1 === num ? replaceImagesSides(chooseCard) : "";
    if (chooseCard.side1 === chooseCard.side2) {
        if (currentDominoGame.board[rowOfEmptyPlace][colOFEmptyPlace + 1].duration === durationOfCardNextToMe) {
            durationOfCardNextToMe === "vertical" ? chooseCard.duration = "horizontal" : chooseCard.duration = "vertical";
        } else {
            chooseCard.duration = durationOfCardNextToMe;
        }
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace - 1, colOFEmptyPlace, "up", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace + 1, colOFEmptyPlace, "down", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace - 1, "left", chooseCard.side1, chooseCard.duration);
    } else {
        chooseCard.duration = "horizontal";
        if (colOFEmptyPlace - 1 < 0) {
            if (rowOfEmptyPlace + 1 > SIZE_GRID_ROW - 1) {
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace - 1, colOFEmptyPlace, "up", chooseCard.side1, "vertical")
            } else {
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace + 1, colOFEmptyPlace, "down", chooseCard.side1, "vertical")
            }
        } else {
            pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace - 1, "left", chooseCard.side1, chooseCard.duration);
        }
    }
    currentDominoGame.optionalMove.splice(indexOfOptionalArray, 1);
}

function putCardOnRight(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace) {
    chooseCard.side2 === num ? replaceImagesSides(chooseCard) : "";

    if (chooseCard.side1 === chooseCard.side2) {
        if (currentDominoGame.board[rowOfEmptyPlace][colOFEmptyPlace - 1].duration === durationOfCardNextToMe) {
            durationOfCardNextToMe === "vertical" ? chooseCard.duration = "horizontal" : chooseCard.duration = "vertical";
        } else {
            chooseCard.duration = durationOfCardNextToMe;
        }
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace - 1, colOFEmptyPlace, "up", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace + 1, colOFEmptyPlace, "down", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace + 1, "right", chooseCard.side1, chooseCard.duration);
    } else {

        if (colOFEmptyPlace + 1 > SIZE_GRID_COL - 1) {
            if (rowOfEmptyPlace + 1 > SIZE_GRID_ROW - 1) {
                chooseCard.duration = "horizontal";
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace - 1, colOFEmptyPlace, "up", chooseCard.side2, "vertical")

            } else {
                chooseCard.duration = "horizontal";
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace + 1, colOFEmptyPlace, "down", chooseCard.side2, "vertical")
            }

        } else {
            chooseCard.duration = "horizontal";
            pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace + 1, "right", chooseCard.side2, chooseCard.duration);
        }
    }
    currentDominoGame.optionalMove.splice(indexOfOptionalArray, 1)
}

function putCardOnUp(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace) {
    chooseCard.side1 === num ? replaceImagesSides(chooseCard) : "";

    if (chooseCard.side1 === chooseCard.side2) {
        if (currentDominoGame.board[rowOfEmptyPlace + 1][colOFEmptyPlace].duration === durationOfCardNextToMe) {
            durationOfCardNextToMe === "vertical" ? chooseCard.duration = "horizontal" : chooseCard.duration = "vertical";
        } else {
            chooseCard.duration = durationOfCardNextToMe;
        }
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace - 1, colOFEmptyPlace, "up", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace - 1, "left", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace + 1, "right", chooseCard.side1, chooseCard.duration);

    } else {

        if (rowOfEmptyPlace - 1 < 0) {
            if (colOFEmptyPlace + 1 > SIZE_GRID_COL - 1) {
                chooseCard.duration = "vertical";
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace - 1, "left", chooseCard.side1, "horizontal");

            } else {
                chooseCard.duration = "vertical";
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace + 1, "right", chooseCard.side1, "horizontal");
            }
        } else {
            chooseCard.duration = "vertical";
            pushNewItemToOptionalMoveArray(rowOfEmptyPlace - 1, colOFEmptyPlace, "up", chooseCard.side1, chooseCard.duration);
        }
    }
    currentDominoGame.optionalMove.splice(indexOfOptionalArray, 1);
}

function putCardOnDown(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace) {
    chooseCard.side2 === num ? replaceImagesSides(chooseCard) : "";

    if (chooseCard.side1 === chooseCard.side2) {
        if (currentDominoGame.board[rowOfEmptyPlace - 1][colOFEmptyPlace].duration === durationOfCardNextToMe) {
            durationOfCardNextToMe === "vertical" ? chooseCard.duration = "horizontal" : chooseCard.duration = "vertical";
        } else {
            chooseCard.duration = durationOfCardNextToMe;
        }
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace + 1, colOFEmptyPlace, "down", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace - 1, "left", chooseCard.side1, chooseCard.duration);
        pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace + 1, "right", chooseCard.side1, chooseCard.duration);
    } else {
        if (rowOfEmptyPlace + 1 > SIZE_GRID_ROW - 1) {
            if (colOFEmptyPlace + 1 > SIZE_GRID_COL - 1) {
                chooseCard.duration = "vertical";
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace - 1, "left", chooseCard.side2, "horizontal");

            } else {
                chooseCard.duration = "vertical";
                pushNewItemToOptionalMoveArray(rowOfEmptyPlace, colOFEmptyPlace + 1, "right", chooseCard.side2, "horizontal");
            }
        } else {
            chooseCard.duration = "vertical";
            pushNewItemToOptionalMoveArray(rowOfEmptyPlace + 1, colOFEmptyPlace, "down", chooseCard.side2, chooseCard.duration);
        }
    }
    currentDominoGame.optionalMove.splice(indexOfOptionalArray, 1);
}

function pushNewItemToOptionalMoveArray(row, col, side, num, duration) {
    if (row >= 0 && row <= SIZE_GRID_ROW - 1 && col >= 0 && col <= SIZE_GRID_COL - 1) {
        currentDominoGame.optionalMove.push({
            row: row,
            col: col,
            side: side,
            num: num,
            duration: duration
        });
    }
}

function replaceImagesSides(playerCard) {
    let temp = playerCard.side1;
    playerCard.side1 = playerCard.side2;
    playerCard.side2 = temp;
    temp = playerCard.imgSide1;
    playerCard.imgSide1 = playerCard.imgSide2;
    playerCard.imgSide2 = temp;
}

function putNewCardOnBoard(row, col) {
    if (currentDominoGame.indexOfChoseCard >= 0) {
        let board =currentDominoGame.board;
        let chooseCard = currentDominoGame.players[indexCurrentPlayerInArray].playerCard[currentDominoGame.indexOfChoseCard];
        if (chooseCard.side1 === chooseCard.side2) {
            chooseCard.duration === "vertical" ? chooseCard.duration = "horizontal" : chooseCard.duration = "vertical";
        }

        if (board[MIDDLE_ROW][MIDDLE_COL] === null) {
            return putFirstCardOnBoard(board, chooseCard);
        }

        if (row !== undefined && col !== undefined) {
            let indexOfOptionalArray = currentDominoGame.optionalMove.findIndex(item => item.col === col && item.row === row && item.able==="true");
            let objectEmptyPlaceForCard = currentDominoGame.optionalMove[indexOfOptionalArray];
            let durationOfCardNextToMe = objectEmptyPlaceForCard.duration;
            let chosenSideByPlayer = objectEmptyPlaceForCard.side;
            let rowOfEmptyPlace = objectEmptyPlaceForCard.row;
            let colOFEmptyPlace = objectEmptyPlaceForCard.col;
            let num = objectEmptyPlaceForCard.num;

            if (num === chooseCard.side1 || num === chooseCard.side2) {

                if (chosenSideByPlayer === "left") {
                    putCardOnleft(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace);
                }

                if (chosenSideByPlayer === "right") {
                    putCardOnRight(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace);
                }

                if (chosenSideByPlayer === "up") {
                    putCardOnUp(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace);
                }

                if (chosenSideByPlayer === "down") {
                    putCardOnDown(chooseCard, num, durationOfCardNextToMe, indexOfOptionalArray, colOFEmptyPlace, rowOfEmptyPlace);
                }
                board[row][col] = chooseCard;
            }else{
                return false;
            }

        }
        return board
    }
    return currentDominoGame.board;
}

function getStatusPLayerCard() {
    let currentPlayerCard =currentDominoGame.players[indexCurrentPlayerInArray].playerCard;
    currentPlayerCard.splice(currentDominoGame.indexOfChoseCard, 1);
    return currentPlayerCard;
}

function initPLayerCard(playerCards) {
    playerCards.forEach(item => {
        item.canChose = "false";
    })
}

function checkMoveOnBoard(playerCards, board) {
    currentDominoGame.optionalMove.forEach(item => {
        let check = true;
        playerCards.forEach(card => {
            if ((item.num === card.side1 || item.num === card.side2) && board[item.row][item.col] === null) {
                check = false;
                item.able = "true";
                card.canChose = "true";
            }
        });
        check === true ? item.able = "false" : null;
    });
}

function initAllPlayersCards(){
    currentDominoGame.players.forEach(player=>{
        initPLayerCard(player.playerCard);
        checkMoveOnBoard(player.playerCard,currentDominoGame.board);
    });
}

function checkEndGame(playerCards,packetCards) {
    let checkCardsToPlay=undefined;
    if (currentDominoGame.players.length === 2) { // 2 player game
        if (playerCards.length === 0) {
            currentDominoGame.resultGame = "The winner is "+ currentDominoGame.players[indexCurrentPlayerInArray].playerName;
            currentDominoGame.endGame = true;
            currentDominoGame.players.sort((player1, player2) => player1.statistics.score - player2.statistics.score);

        } else {
            if (packetCards.length === 0) {
                currentDominoGame.players.forEach(player=>{
                    if(checkCardsToPlay===undefined) {
                        checkCardsToPlay = player.playerCard.find(card => card.canChose === "true");
                    }
                });
                if(checkCardsToPlay === undefined) {
                    currentDominoGame.players.sort((player1, player2) => player1.statistics.score - player2.statistics.score);
                    currentDominoGame.resultGame = "The player with the least score is " + currentDominoGame.players[0].playerName;
                    currentDominoGame.endGame = true;
                }
            }
        }

    } else { // 3 player game
        if (playerCards.length === 0 && !currentDominoGame.players[indexCurrentPlayerInArray].watcher) {
            if (currentDominoGame.resultGame === "") { //continue to play
                currentDominoGame.resultGame = currentDominoGame.players[indexCurrentPlayerInArray].playerName;
                currentDominoGame.players[indexCurrentPlayerInArray].watcher=true;

            } else { // 2 players out of cards
                currentDominoGame.resultGame = "Second Place is "+ currentDominoGame.players[indexCurrentPlayerInArray].playerName;
                currentDominoGame.endGame = true;
                currentDominoGame.players.sort((player1, player2) => player1.statistics.score - player2.statistics.score);
            }
        } else {
            if (packetCards.length === 0) {
                    currentDominoGame.players.forEach(player => {
                        if(checkCardsToPlay===undefined) {
                            checkCardsToPlay = player.playerCard.find(card => card.canChose === "true");
                        }
                    });
                    if (checkCardsToPlay===undefined) {
                        currentDominoGame.players.sort((player1, player2) => player1.statistics.score - player2.statistics.score);
                        currentDominoGame.resultGame = "The player with the least score is " + currentDominoGame.players[0].playerName;
                        currentDominoGame.endGame = true;
                    }
            }
        }
    }
}

function updateStatistics(playerCards) {
    let statistics =currentDominoGame.players[indexCurrentPlayerInArray].statistics;
    statistics.amountOfTurns++;
    statistics.pullFromPacket += currentDominoGame.take;
    calculateScore(statistics, playerCards);
    calculateAvgTimeForTurn(statistics);
    return statistics;
}

function calculateScore(statistics, playerCards) {
    statistics.score = 0;
    playerCards.forEach(card => {
        statistics.score += Number(card.side1) + Number(card.side2);
    })
}

function calculateAvgTimeForTurn(statistics) {
    statistics.amountTimeInSec = currentDominoGame.timerForTurn.seconds + (currentDominoGame.timerForTurn.minuets * 60); //in the client side we save all the time from the beginning
    let avgPlayTime = (statistics.amountTimeInSec / statistics.amountOfTurns);
    let m = Math.floor(avgPlayTime % 3600 / 60);
    let s = Math.floor(avgPlayTime % 3600 % 60);
    statistics.averageMoveTime = ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function updateDominoStetsAfterTakeCard(currentPlayer,gameName,timerTurn){
    indexCurrentPlayerInArray=currentPlayer;
    currentDominoGame= activeDominoGames.find(item=>item.gameName===gameName);
    currentDominoGame.timerForTurn=timerTurn;

        currentDominoGame.take++;
        let playerCards = currentDominoGame.players[indexCurrentPlayerInArray].playerCard;
        let packetCards = currentDominoGame.packetCards;
        const randomIndex = Math.floor(Math.random() * packetCards.length);
        packetCards[randomIndex].canChose = "false";
        playerCards = playerCards.concat(packetCards.splice(randomIndex, 1));

        initPLayerCard(playerCards);
        checkMoveOnBoard(playerCards, currentDominoGame.board);
        currentDominoGame.players[indexCurrentPlayerInArray].playerCard = playerCards;
        currentDominoGame.players[indexCurrentPlayerInArray].statistics = updateStatistics(playerCards);

        currentDominoGame.playerTakeCardFromPacket = true;
        currentDominoGame.take = 0;

    if(currentDominoGame.packetCards.length===0){
        let checkCardsToPlay =playerCards.find(card => card.canChose === "true");

        if(checkCardsToPlay===undefined){
            initAllPlayersCards();
            checkEndGame(playerCards, packetCards);
            findTheNextPlayerToPlay();
            currentDominoGame.players[indexCurrentPlayerInArray].packetEndMes=true;
        }
    }
    currentDominoGame.players[indexCurrentPlayerInArray].packetEndMes=false;
}

function returnToMainPage(gameName,userName) {
    let findGame = gamesList.find(item => item.gameName === gameName);
    let findIndex=findGame.name_watchers_players.findIndex(name=> name===userName);
    findIndex===-1?findGame.amount_connected_players-- :  findGame.name_watchers_players.splice(findIndex,1);

    findGame.canWatch=false;

    if(findGame.amount_connected_players===0 && findGame.name_watchers_players.length===0) {
        let index = activeDominoGames.findIndex(item => item.gameName === gameName);
        activeDominoGames.splice(index, 1);
        findGame.name_players = [];
        findGame.isBegin = false;
        findGame.canWatch=true;
    }
}

function convertPlayerToWatcher(gameName, playerName) {
    currentDominoGame = activeDominoGames.find(item => item.gameName === gameName);
    let player = currentDominoGame.players.find(player => player.playerName === playerName);
    player.watcher = true;
    currentDominoGame.watcherPlayers.push(player.playerName);

    let findGame = gamesList.find(item => item.gameName === gameName);
    let indexInNameArray= findGame.name_players.findIndex(name=>name===playerName);
    findGame.name_players.splice(indexInNameArray,1);
    findGame.amount_connected_players--;
    findGame.name_watchers_players.push(playerName);
}

function getOutTheWinnerPlayer(gameName, playerName){
    currentDominoGame = activeDominoGames.find(item => item.gameName === gameName);
    let player = currentDominoGame.players.find(player => player.playerName === playerName);
    player.watcher = true;
    let findGame = gamesList.find(item => item.gameName === gameName);
    findGame.amount_connected_players--;
}

function watcherGetOut(gameName,playerName){
    let findGame = gamesList.find(item => item.gameName === gameName);
    let indexFindName=findGame.name_watchers_players.findIndex(name=>name=== playerName);
    findGame.name_watchers_players.splice(indexFindName,1);

    currentDominoGame = activeDominoGames.find(item => item.gameName === gameName);
    let index = currentDominoGame.watcherPlayers.findIndex(name => name === playerName);
    currentDominoGame.watcherPlayers.splice(index,1);

}

function addWatcherPlayer(gameName,playerName){
    currentDominoGame = activeDominoGames.find(item => item.gameName === gameName);
    currentDominoGame.watcherPlayers.push(playerName);
}

function addNewChatLine(userName,gameName,newString){
    currentDominoGame = activeDominoGames.find(item => item.gameName === gameName);
    currentDominoGame.chat.push(`${userName}: ${newString}`);
}

function getChat(gameName){
    currentDominoGame = activeDominoGames.find(item => item.gameName === gameName);
    return currentDominoGame.chat;
}

module.exports = {getChat,addNewChatLine,addWatcherPlayer,createNewDominoGame,activeDominoGames,searchDominoGame,updateDominoStetsAfterMoveOnBoard,updateDominoStetsAfterTakeCard,returnToMainPage,convertPlayerToWatcher,getOutTheWinnerPlayer,updateIndexOfChosenCard,watcherGetOut};
