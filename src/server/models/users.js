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

async function updateFavourites(id, favouriteAdverts) {
    return await User.findByIdAndUpdate(id, {favouriteAdverts: favouriteAdverts})
}

async function updateRecoveryPasswordCode(email, uuid) {
    return await User.updateOne({email: email}, {restorePasswordUUID: uuid})
}

async function updatePassword(email, uuid, password) {
    return await User.findOneAndUpdate({email: email, restorePasswordUUID: uuid}, {password: password, restorePasswordUUID: undefined})
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
    updateName,
    updateRecoveryPasswordCode,
    updatePassword,
    updateFavourites
}