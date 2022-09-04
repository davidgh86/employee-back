const express    = require("express");
const controller = require("../controllers/localities");
const routes     = express.Router();

routes.route("/").get(controller.getAllLocalities);

module.exports = routes;