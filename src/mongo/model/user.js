const mongoose = require("../index")

Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, unique: true},
    telephone: {type: String, unique: true},
    password: {type: String},
    roles: {type: [String]},
    img: {
        data: Buffer,
        mimeType: String
    }
})


module.exports = new mongoose.model('User', userSchema, 'users');