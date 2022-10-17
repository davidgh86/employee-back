const User = require("../../mongo/model/user")

async function getUserById(userId) {
    return await User.findById(userId)
}

async function getUserByEmail(email) {
    return await User.findOne({email: email})
}

async function updateName(id, email, name) {
    return await User.findOneAndUpdate({id: id, email: email}, {name: name})
}

async function createUser({
    name,
    email,
    telephone,
    password,
    roles,
    img}) {
    
    return await User.create({
        name,
        email,
        telephone,
        password,
        roles,
        img})
}

async function updateUser({
    name,
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
            name,
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
    updateUser,
    updateName
}