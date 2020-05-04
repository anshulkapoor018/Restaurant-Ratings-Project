const userDataModule = require("../users.js")

async function getUserData(id) {
    let userData = {};
    userData = userDataModule.users.find(user => user._id === id)
    return userData;
}

async function getUserId(username) {    
    let userData = {};
    userData = userDataModule.users.find(user => user.username === username)
    return userData._id;
}

module.exports = {getUserData, getUserId}