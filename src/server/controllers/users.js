const model = require("../models/users");

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

  model.createUser(user).then(data => {
    res.json(data)
  }).catch(e => {
    console.log(e);
    res.status(400)
  })
}

module.exports = {
  createUser
};