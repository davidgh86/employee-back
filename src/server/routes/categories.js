const express    = require("express");
const controller = require("../controllers/categories");
const routes     = express.Router();

routes.route("/").get(controller.getAllCategories);

module.exports = routes;