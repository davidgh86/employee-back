const express    = require("express");
const controller = require("../controllers/adverts");
const routes     = express.Router();

routes.route("/").get(controller.findAdverts);
routes.route("/:id").get(controller.findAdvertById);
routes.route("/all").get(controller.findAllAdverts);
routes.route("/").post(controller.addAdvert);

module.exports = routes;