const db = require('../../data/dbConfig')

async function uniqueUsername(req, res, next) {
    const maybeUser = await db('users').where("username", req.body.username)
    if(maybeUser.length < 1) {
        next()
    } else {
        next({ message: "username taken" })
    }
}

function missingCredentials(req, res, next) {
    if(!req.body.username || !req.body.password) {
        next({ message: "username and password required" })
    } else {
        next()
    }
}

function checkIfUsernameExists(req, res, next) {

}

module.exports = {
    uniqueUsername,
    missingCredentials,
    checkIfUsernameExists,
}
