const Message = require("../../mongo/model/message")

// async function getMessagesBetweenUsers(userId, secondUserId) {
//     return await Message.find({ $or: [{ from: userId }, { to: secondUserId }, { from: secondUserId }, { to: userId }] })
// }

async function getMessagesCountByAdvertsId(advertsId, userMail){

    let totalCount = 0
    const result = {}
    const messages = await Message.find({ advertId: { $in: advertsId }})

    messages.forEach(msg => {
        if (!result[msg.advertId]){
            result[msg.advertId] = {
                count: 0,
                countUnread: 0,
                senders:{}
            }
        }

        const contact = msg.from===userMail?msg.to:msg.from

        if (!result[msg.advertId].senders[contact]) {
            result[msg.advertId].senders[contact] = {
                count: 0,
                countUnread: 0
            }
        }
        result[msg.advertId].count = result[msg.advertId].count + 1
        result[msg.advertId].senders[contact].count = result[msg.advertId].senders[contact].count + 1

        if (!msg.read && msg.to===userMail) {
            totalCount += 1
            result[msg.advertId].countUnread = result[msg.advertId].countUnread + 1
            result[msg.advertId].senders[contact].countUnread = result[msg.advertId].senders[contact].countUnread + 1
        }
    })
    return  {
        unreadMessages: totalCount,
        advertUnreadMessages: result
    }
}

async function getMessagesByAdvertsIdAndUserAndContact(userMail, contactEmail, advertId) {
    return await Message.find({$and: [{advertId: advertId}, {$or: [{from: userMail, to: contactEmail }, {from: contactEmail, to: userMail }]}]}).sort('-createdAt')
}

async function createMessage(message) {
    return await Message.create(message);
}

async function markConversationAsRead(userMail, contactEmail, advertId) {
    return await Message.updateMany({$and: [{advertId: advertId}, {$or: [{from: userMail, to: contactEmail }, {from: contactEmail, to: userMail }]}, {read: false}]}, {$set:{read: true}})
}

module.exports = {
    createMessage,
    getMessagesCountByAdvertsId,
    getMessagesByAdvertsIdAndUserAndContact,
    markConversationAsRead
}