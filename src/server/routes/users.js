const express    = require("express");
const controller = require("../controllers/users");
const routes     = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

routes.route("/register").post(upload.single("img"), controller.createUser);
routes.route("/login").post(controller.login);
routes.route("/:userId").post(controller.getUserData);

module.exports = routes;