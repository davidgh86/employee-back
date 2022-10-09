const User = require("../../mongo/model/user")

async function getUserByEmail(email) {
    return await User.findById(email)
}

async function createUser({
    email,
    telephone,
    passwordHash,
    roles,
    img}) {
    
    return await User.create({
        email,
        telephone,
        passwordHash,
        roles,
        img})
}

async function updateUser({
    email,
    telephone,
    passwordHash,
    roles,
    img}) {
    return await User.findOneAndUpdate(
        {
            email: email
        },
        {
            email,
            telephone,
            passwordHash,
            roles,
            img
        }
    )
}

module.exports = {
    getUserByEmail,
    createUser,
    updateUser
}