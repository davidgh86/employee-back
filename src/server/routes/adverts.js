const express    = require("express");
const controller = require("../controllers/adverts");
const routes     = express.Router();

const authFilter = require("../middlewares/auth")

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

routes.route("/").get(controller.findAdverts);
routes.route("/all").get(controller.findAllAdverts);
routes.route("/my-adverts").get(authFilter, controller.findUserAdverts);
routes.route("/my-favourite").get(authFilter, controller.findUserFavouriteAdverts);
routes.route("/:id").get(controller.findAdvertById);
routes.route("/").post(authFilter, upload.single("img"), controller.addAdvert);


module.exports = routes;