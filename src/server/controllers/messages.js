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

async function getConversation(req, res) {
  const contactEmail = req.params.contact
  const userMail = req.user.email
  const advertId = req.params.advertId

  const messages = await model.getMessagesByAdvertsIdAndUserAndContact(userMail, contactEmail, advertId)

  const resultMessages = []
  let senderTelephone = undefined
  let name = undefined

  messages.forEach(msg => {
    if(!senderTelephone) {
      if (msg.from === contactEmail && msg.fromTelephone) {
        senderTelephone = msg.fromTelephone
      }
    }
    if(!name) {
      if (msg.from === contactEmail && msg.name) {
        name = msg.name
      }
    }
    resultMessages.push({
      advertId: advertId,
      from: msg.from,
      to: msg.to,
      message: msg.message,
      read: msg.read,
      createdAt: msg.createdAt
    })
  })

  const result = {
    senderTelephone: senderTelephone,
    contactName: name,
    contactMail: contactEmail,
    messages: resultMessages
  }

  res.json(result)
}

async function markConversationAsRead(req, res) {
  const contactEmail = req.params.contact
  const userMail = req.user.email
  const advertId = req.params.advertId

  await model.markConversationAsRead(userMail, contactEmail, advertId)

  getCountUnreadMessages(req, res)
}

module.exports = {
  createMessage,
  getCountUnreadMessages,
  getConversation,
  markConversationAsRead
};