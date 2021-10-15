const db = require('../../data/dbConfig')

async function uniqueUsername(req, res, next) {
    try {
        const maybeUser = await db('users').where("username", req.body.username)
        if(maybeUser.length < 1) {
            next()
        } else {
            next({ message: "username taken" })
        }
    } catch (err) {
        next(err)
    }
}

function missingCredentials(req, res, next) {
    if(!req.body.username || 
        typeof req.body.username !== "string" ||
        req.body.username.trim() === "" || 
        !req.body.password ||
        typeof req.body.password !== "string" || 
        req.body.password.trim() === "") {
        next({ message: "username and password required" })
    } else {
        next()
    }
}

async function checkCredentials(req, res, next) {
    try{
        const maybeUser = await db('users').where("username", req.body.username)
        if(maybeUser.length > 0) {
            next()
        } else {
            next({ message: "invalid credentials"})
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    uniqueUsername,
    missingCredentials,
    checkCredentials,
}
