const express    = require("express");
const controller = require("../controllers/adverts");
const routes     = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

routes.route("/").get(controller.findAdverts);
routes.route("/all").get(controller.findAllAdverts);
routes.route("/:id").get(controller.findAdvertById);
routes.route("/").post(upload.single("img"), controller.addAdvert);

module.exports = routes;