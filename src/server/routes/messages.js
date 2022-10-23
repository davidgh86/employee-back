const express    = require("express");
const controller = require("../controllers/messages");
const routes     = express.Router();

const authFilter = require("../middlewares/auth")

routes.route("/message").post(controller.createMessage);
routes.route("/message-count").get(authFilter, controller.getCountUnreadMessages);

module.exports = routes;