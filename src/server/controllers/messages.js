const model = require("../models/messages");

const advertModel = require("../models/adverts")

async function createMessage(req, res) {

  const message = req.body

  model.createMessage(message).then(data => {
    res.json({
      id: data.id,
      advertId: data.advertId,
      from: data.from,
      to: data.to,
      name: data.name,
      message: data.message,
      createdAt: data.createdAt
    })
  }).catch(e => {
    console.log(e);
    res.status(400)
  })
  
}

async function getCountUnreadMessages(req, res) {
  
  const userId = req.user.id
  const userMail = req.user.email
  
  const advertTitles = await advertModel.findUserAdvertsTitles(userId)
  
  const count = await model.getMessagesCountByAdvertsId(Object.keys(advertTitles), userMail)

  Object.entries(advertTitles).forEach(([key, value]) => {
    count.advertUnreadMessages[key].title = value
  })

  res.json(count)
}

module.exports = {
  createMessage,
  getCountUnreadMessages
};