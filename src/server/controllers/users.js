const model = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
  const userData = JSON.parse(req.body.userData)

  const mimeType = req.file.mimetype
  const bufferFileData = req.file.buffer

  const image = {
    data: bufferFileData,
    mimeType: mimeType
  }

  const user = {
    ...userData,
    img: image
  }

  const userWithPassword = await encryptPassword(user);
  
  model.createUser(userWithPassword).then(data => {
    res.json(data)
  }).catch(e => {
    console.log(e);
    res.status(400)
  })
  
}

async function login(req, res) {
  
  const user = await model.getUserByEmail(req.body.email);
  
  if (!user) return res.status(400).json({ error: 'Not found user' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Not valid user or password' })
  
  const token = jwt.sign({
    email: user.email
  }, process.env.TOKEN_SECRET)

  res.json({ token });

}

async function getUserData(req, res) {
  const userId = req.params.userId

  const user = await model.getUserById(userId)

  res.json({
    email: user.email,
    telephone: user.telephone,
    img: user.img
  })
}

async function getUserData(req, res) {
  const userId = req.params.userId

  const user = await model.getUserById(userId)
  
  res.json({
    email: user.email,
    telephone: user.telephone,
    img: user.img
  })
}

function encryptPassword(user){
  return new Promise((resolve, reject) => {
    if(user.password){
      bcrypt.hash(user.password, 10, function(err, hash) {
        if (err){
          reject(err)
          return
        } else {
          user["password"] = hash
          resolve(user)
        }
      });
    } else {
      resolve(user)
    }
  })
}

module.exports = {
  createUser,
  login,
  getUserData
};