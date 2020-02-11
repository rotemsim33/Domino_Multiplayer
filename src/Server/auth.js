 let userList = {};

function isNameEmpty(userName){
    return userName==="";
}

function isNameExists(userName) {
    let checkName=false;
    Object.keys(userList).forEach(key=>{
        userList[key].userName===userName? checkName=true :null;
    });

    return checkName;
}

function addUser(req,userName){
    userList[req.session.id]= {
            userName: userName,
            logIn: true,
            activePlayer: false,
            gameName: ""
        };
}

function updateUserInListToPlayer(req,gameName){
    let sessionOb=userList[req.session.id];
    sessionOb.activePlayer=true;
    sessionOb.gameName=gameName;
}

function getUserList(){
    return userList;
}

function removeUser(userName){
    let sessionOb= Object.keys(userList).find(key=>userList[key].userName===userName);
    delete  userList[sessionOb];
}

function checkIfUserExists(req){
    const user = getUser(req.session.id);
    if (user !== undefined) {
       return user;
    }
    return false;
}

function getUser(sessionOb){
    return userList[sessionOb];
}

module.exports = {isNameEmpty,updateUserInListToPlayer,checkIfUserExists,isNameExists, addUser,getUserList,userList,removeUser};
