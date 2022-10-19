const model = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../../utils/mailSender')
      require("dotenv").config();

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

async function sendMailRestorePassword(req, res) {

  const email = req.body.email

  const uuid = uuidv4()

  await model.updateRecoveryPasswordCode(email, uuid)
  
  sendMail(
    email, 
    `Restore femploy password`,
    `To recover password click this ${process.env.BACKEND_URL}/recoverpassword/${uuid}`
  ).then(() => {
    res.status(200).json({successful: true})
  }).catch((error) => {
    console.log(JSON.stringify(error))
    res.status(400).json({successful: false})
  })
}

async function restorePassword(req, res) {

  const email = req.body.email

  const uuid = req.body.uuid

  const password = req.body.password

  if (!email || !password) {
    res.status(401).json({successful: true})
    return
  }

  const encPwd = await encryptString(password)
  const updatedUser = await model.updatePassword(email, uuid, encPwd)
  
  res.json({
    id: updatedUser.id,
    name: updatedUser.name,
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
      encryptString(user.password).then(hash => {
        user["password"] = hash
        resolve(user)
      }).catch(error => reject(error))
    } else {
      resolve(user)
    }
  })
}

function encryptString(str) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(str, 10, function(err, hash) {
      if (err){
        reject(err)
      } else {
        resolve(hash)
      }
    });
  })
}

module.exports = {
  createUser,
  login,
  getUserPublicData,
  updateUserName,
  getUserData,
  updateUserName,
  getMe,
  sendMailRestorePassword,
  restorePassword
};