const mongoose = require("../index")

Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {type: String},
    telephone: {type: String, unique: true},
    passwordHash: {type: String},
    roles: {type: [String]},
    img: {
        data: Buffer,
        mimeType: String
    }
})

userSchema.virtual('email')
    .get(function() {
        return this._id;
    })
    .set(function(v) {
        this.set({_id: v})
    });

module.exports = new mongoose.model('User', userSchema, 'users');