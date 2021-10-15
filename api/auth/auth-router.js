const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig');
const jwt = require('jsonwebtoken');
const { missingCredentials, uniqueUsername, checkCredentials } = require('./auth-middleware');
const router = require('express').Router();
const JWT_SECRET = require('../../config/index');

router.post('/register', missingCredentials, uniqueUsername, async (req, res, next) => {
  let user = req.body;

  const rounds = 8;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;
  try {
    const id = await db('users').insert(user)
    res.status(201).json(await db('users').where('id', id).first())
  } catch (err) {
    next(err)
  }
});

router.post('/login', missingCredentials, checkCredentials, (req, res, next) => {
  let { password } = req.body;

  if(req.user && bcrypt.compareSync(password, req.user.password)) {
    const token = buildToken(req.user);
    res.status(200).json({
      message: `welcome, ${req.user.username}`,
      token
    })
  } else {
    next({ message: 'invalid credentials' })
  }
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  }
  const options = {
    expiresIn: '1d'
  }
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    options,
  )
  return token
}

module.exports = router;
