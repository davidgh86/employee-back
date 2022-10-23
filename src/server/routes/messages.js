const express    = require("express");
const controller = require("../controllers/messages");
const routes     = express.Router();

const authFilter = require("../middlewares/auth")

routes.route("/message").post(controller.createMessage);
routes.route("/message-count").get(authFilter, controller.getCountUnreadMessages);
routes.route("/message/:advertId/:contact").get(authFilter, controller.getConversation);
routes.route("/message/:advertId/:contact").delete(authFilter, controller.markConversationAsRead);

module.exports = routes;