const User = require("../../mongo/model/user")

async function getUserById(userId) {
    return await User.findById(userId)
}

async function getUserByEmail(email) {
    return await User.findOne({email: email})
}

async function createUser({
    email,
    telephone,
    password,
    roles,
    img}) {
    
    return await User.create({
        email,
        telephone,
        password,
        roles,
        img})
}

async function updateUser({
    email,
    telephone,
    password,
    roles,
    img}) {
    return await User.findOneAndUpdate(
        {
            email: email
        },
        {
            email,
            telephone,
            password,
            roles,
            img
        }
    )
}

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser
}