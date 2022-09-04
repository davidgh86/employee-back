const express    = require("express");
const controller = require("../controllers/adverts");
const routes     = express.Router();

routes.route("/").get(controller.getAdverts);
routes.route("/new").post(controller.addAdvert);

module.exports = routes;