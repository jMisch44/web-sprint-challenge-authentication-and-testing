const JWT_SECRET = 'shh';
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(!token) {
    return next({ message: "token required" })
  }
  
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if(err) {
      return next({ message: "token invalid" })
    }
    req.decodedToken = decodedToken
    return next()
  })
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
