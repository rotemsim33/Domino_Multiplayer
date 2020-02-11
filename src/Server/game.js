let gamesList=[];

 function getGamesList(){
     return gamesList;
 }

 function isGameInData(gameName){
     let find= gamesList.find(item=> item.gameName===gameName);
    return !!find;
 }

 function isNameEmpty(gameName){
    return gameName==="";
 }

 function addGame(game){
     gamesList.push(game);
 }

 function watchGame(gameName,userName){
     let findGameInTheList= gamesList.find(item=> item.gameName===gameName);
     findGameInTheList.name_watchers_players.push(userName);
 }

 function joinGame(gameName,userName){
     let findGameInTheList= gamesList.find(item=> item.gameName===gameName);
     findGameInTheList.amount_connected_players++;
     findGameInTheList.name_players.push(userName);
     findGameInTheList.amount_connected_players=== findGameInTheList.amount_players? findGameInTheList.isBegin=true :findGameInTheList.isBegin=false;
 }

 function removePlayerFromGame(gameName,playerName){
     let findGame=gamesList.find(game=> game.gameName===gameName);
     let index=findGame.name_players.findIndex(name=>name===playerName); //player leave
     if(index!==-1){
         findGame.amount_connected_players--;
         findGame.name_players.splice(index,1);
     }else{
         index=findGame.name_watchers_players.findIndex(name=>name===playerName); //watcher leave
         findGame.name_watchers_players.splice(index,1);

     }
 }

 function deleteGame(gameName){
     let index=gamesList.findIndex(game=> game.gameName===gameName);
     gamesList.splice(index,1);
 }

 function howManyPlayersNeedToJoin(gameName){
     let findGame=gamesList.find(game=> game.gameName===gameName);
     return findGame.amount_players-findGame.amount_connected_players;
 }

module.exports = {isNameEmpty,getGamesList,isGameInData,addGame,gamesList,joinGame,removePlayerFromGame,deleteGame,howManyPlayersNeedToJoin,watchGame};
