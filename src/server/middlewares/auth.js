const jwt = require('jsonwebtoken');
const { getUserByEmail } = require("../models/users")

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, userData) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    const email = userData.email

    // TODO add cache ??
    getUserByEmail(email).then(user => {
        req.user = user
        next()
    }).catch(e => {
        console.log(e)
        res.sendStatus(500)
    })
    
  })
}

module.exports = authenticateToken