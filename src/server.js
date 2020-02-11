const express = require('express');
const cors = require('cors');
const app = express();
const auth = require('./Server/auth');
const game = require('./Server/game');
const domino = require('./Server/activeDominoGames');
const bodyParser = require('body-parser');
const session= require('express-session');

const port = 3001;


app.use( cors({
    credentials: true,
    origin: 'http://localhost:63342'
}) );
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: Date.now() + (1000 * 60 * 60 * 24),
        httpOnly: false
    }
}));

app.post('/renderChat',(req, res) => {
    let gameName=req.body.gameName;
    let chat= domino.getChat(gameName);
    res.send({chat:chat});
});

app.post('/renderState',(req, res) => {
    let gameName=req.body.gameName;
    let result= domino.searchDominoGame(gameName);
    res.send({dominoOb:result});
});

app.post('/winnerWantToGetOut',(req, res) => {
    let gameName=req.body.gameName;
    let playerName=req.body.playerName;
    domino.getOutTheWinnerPlayer(gameName,playerName);
    res.send({success: true})
});

app.post('/winnerWantToStay',(req, res) => {
    let gameName=req.body.gameName;
    let playerName=req.body.playerName;
    domino.convertPlayerToWatcher(gameName,playerName);
    res.send({success: true})
});

app.post('/leaveTheGame',(req, res) => {
    let gameName=req.body.gameName;
    let playerName=req.body.playerName;
    game.removePlayerFromGame(gameName,playerName);
    res.send({success: true})
});

app.post('/watcherWantToGetOut',(req, res) => {
    let gameName=req.body.gameName;
    let playerName=req.body.playerName;
    domino.watcherGetOut(gameName,playerName);
    res.send({success: true})
});

app.post('/returnToMainPage',(req, res) => {
    let gameName=req.body.gameName;
    let userName=req.body.userName;
    domino.returnToMainPage(gameName,userName);
    res.send({success: true})
});

app.post('/updateIndexOfChosenCard',(req, res) => {
    let indexOfChoseCard= Number(req.body.indexOfChoseCard);
    let gameName=req.body.gameName;
    domino.updateIndexOfChosenCard(indexOfChoseCard,gameName);
    res.send({success: true})
});

app.post('/putNewCardOnBoard',(req, res) => {
    let indexCurrentPlayerInArray= Number(req.body.indexCurrentPlayerInPlayersArray);
    let gameName=req.body.gameName;
    let timeForTurn=req.body.timeForTurn;
    let row=Number(req.body.row);
    let col=Number(req.body.col);
    domino.updateDominoStetsAfterMoveOnBoard(indexCurrentPlayerInArray,gameName,timeForTurn,row,col);

    res.send({success: true})
});

app.post('/takeFromPacket',(req, res) => {
    const indexCurrentPlayerInArray= Number(req.body.indexCurrentPlayerInPlayersArray);
    const gameName=req.body.gameName;
    let timeForTurn=req.body.timeForTurn;
    domino.updateDominoStetsAfterTakeCard(indexCurrentPlayerInArray,gameName,timeForTurn);
    res.send({success: true})
});

app.post('/logOut',(req, res) => {
    let userName=req.body.userName;
    auth.removeUser(userName);
    res.send({success: true})

});

app.post('/joinPlayer',(req, res) => {
    let userName=req.body.userName;
    let gameName=req.body.gameName;
    game.joinGame(gameName,userName);
    auth.updateUserInListToPlayer(req,gameName);
    domino.createNewDominoGame(gameName);
    res.send({success: true})
});

app.post('/addNewLineToChat',(req, res) => {
    let currentUser=req.body.currentUser;
    let gameName=req.body.gameName;
    let newString=req.body.newLine;
     domino.addNewChatLine(currentUser,gameName,newString);
    res.send({success: true})
});


app.post('/watchPlayer',(req, res) => {
    let userName=req.body.userName;
    let gameName=req.body.gameName;
    game.watchGame(gameName,userName);
    auth.updateUserInListToPlayer(req,gameName);
    let result= domino.searchDominoGame(gameName);
    result? domino.addWatcherPlayer(gameName,userName):null;
    res.send({success: true})
});

app.post('/checkIfGameBegin',(req, res) => {
    let gameName=req.body.gameName;
    let result= domino.searchDominoGame(gameName);
    let howMany=game.howManyPlayersNeedToJoin(gameName);
    let body={
        dominoOb:result,
        howMany:howMany
    };
    res.send(body);
});

app.post('/renderState',(req, res) => {
    let gameName=req.body.gameName;
    let result= domino.searchDominoGame(gameName);
    res.send({dominoOb:result});
});

app.post('/deleteGame',(req, res) => {
    let gameName=req.body.gameName;
    game.deleteGame(gameName);
    res.send({success: true});
});

app.post('/users',(req, res) => {
    let userName=req.body.userName;
    let userExists= auth.isNameEmpty(userName);
    if(userExists){
        res.send({
            success: false,
            msg:"Empty"})
    }else{
        userExists = auth.isNameExists(userName);
        if (!userExists) {
            auth.addUser(req,userName);
            res.send({success: true})
        }else{
            res.send({
                success: false,
                msg:"Equal"})
        }

    }
});


app.get('/checkIfUserExit',function(req, res) {
    let result= auth.checkIfUserExists(req);
    res.send({result: result})
});

app.post('/game',(req, res) => {
    let itemGame= {
        gameName:req.body.gameName,
        userName:req.body.userName,
        amount_players:Number(req.body.amount_players),
        amount_connected_players: Number(req.body.amount_connected_players),
        name_players:req.body.name_players,
        name_watchers_players:req.body.name_watchers_players,
        isBegin: req.body.isBegin,
        canWatch: req.body.canWatch
    };
    let gameExists=game.isNameEmpty(itemGame.gameName);
    if(gameExists){
        res.send({
            success: false,
            msg:"Empty"
        })
    }else{
        gameExists = game.isGameInData(itemGame.gameName);
        if (!gameExists) {
            game.addGame(itemGame);
            res.send({success: true})
        }else{
            res.send({
                success: false,
                msg:"Equal"
            })
        }
    }
});

app.get('/states',(req, res) => {
   let games= game.getGamesList();
   let users=auth.getUserList();
   res.send({games:games,
             users:users
         });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(3001, console.log('Example app listening on port 3000!'));




