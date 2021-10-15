const JWT_SECRET = require('../../config/index');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(!token) {
    return next({ message: 'token required' })
  }
  
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if(err) {
      return next({ message: 'token invalid' })
    }
    req.decodedToken = decodedToken
    return next()
  })
};
