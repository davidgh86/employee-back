const express    = require("express");
const controller = require("../controllers/users");
const routes     = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

routes.route("/").post(upload.single("img"), controller.createUser);

module.exports = routes;