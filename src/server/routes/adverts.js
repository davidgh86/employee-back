const express    = require("express");
const controller = require("../controllers/adverts");
const routes     = express.Router();

routes.route("/").get(controller.findAdverts);
routes.route("/").post(controller.addAdvert);

module.exports = routes;