const mongoose = require("../index")

Schema = mongoose.Schema;

const messageSchema = new Schema({
    advertId: { type: String },
    from: { type: String },
    to: { type: String },
    message: { type: String },
    senderTelephone: { type: String },
    name: { type: String },
    read: { type: Boolean, default: false }
}, { timestamps: true })


module.exports = new mongoose.model('Message', messageSchema, 'messages');