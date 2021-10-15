function uniqueUsername(req, res, next) {

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
