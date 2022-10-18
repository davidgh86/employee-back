const express    = require("express");
const controller = require("../controllers/users");
const routes     = express.Router();
const authFilter = require("../middlewares/auth")

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

routes.route("/register").post(upload.single("img"), controller.createUser);
routes.route("/login").post(controller.login);
routes.route("/me").get(authFilter, controller.getMe);sendMailRestorePassword
routes.route("/restorePassword").post(controller.restorePassword);
routes.route("/restorePasswordByMail").post(controller.sendMailRestorePassword);
routes.route("/:userId/name").patch(authFilter, controller.updateUserName);
routes.route("/:userId").post(controller.getUserData);

module.exports = routes;