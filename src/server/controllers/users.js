const model = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
  const userData = JSON.parse(req.body.userData)

  if (req.file) {
    const mimeType = req.file.mimetype
    const bufferFileData = req.file.buffer

    const image = {
      data: bufferFileData,
      mimeType: mimeType
    }

    userData.img = image
  }

  const userWithPassword = await encryptPassword(userData);
  
  model.createUser(userWithPassword).then(data => {
    res.json({token: getToken(data.email)})
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
  
  const token = getToken(user.email)

  res.json({ token });

}

function getToken(email) {
  return jwt.sign({
    email: email,
    timestamp: Date.now()
  }, process.env.TOKEN_SECRET)
}

async function getUserPublicData(req, res) {
  const userId = req.params.userId

  const user = await model.getUserById(userId)

  res.json({
    id: user.id,
    email: user.email,
    telephone: user.telephone,
    img: user.img
  })
}

async function getUserData(req, res) {
  const userId = req.params.userId

  const user = await model.getUserById(userId)
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    telephone: user.telephone,
    img: user.img
  })
}

async function updateUserName(req, res) {

  const id = req.params.userId
  const name = req.body.name
  const user = req.user

  const updatedUser = await model.updateName(id, user.email, name)
  
  res.json({
    id: updatedUser.id,
    name: name,
    email: updatedUser.email,
    telephone: updatedUser.telephone,
    img: updatedUser.img
  })

}

async function getMe(req, res) {

  const user = req.user
  
  res.json({
    id: user.id,
    name: user.name,
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
  getUserPublicData,
  updateUserName,
  getUserData,
  updateUserName,
  getMe
};