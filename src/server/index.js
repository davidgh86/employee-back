const express      = require("express");
const cors         = require("cors");
const bodyParser   = require("body-parser");
const localities   = require("./routes/localities.js");
const categories   = require("./routes/categories.js");
const adverts      = require("./routes/adverts.js");
                     require("dotenv").config();

const app  = express();
const port = process.env.NODE_PORT || 3000;

/**
 * @function start
 * @returns {void}
 * @description Starts the HTTP Express server.
 */

function start() {
  let app_builder
  if (process.env.NODE_ENV==="development") {
    app_builder = app.use(cors())
  } else {
    app_builder = app
  }
  return  app_builder
             .use("/", express.static('dist'))
             .use(bodyParser.urlencoded({ extended: false }))
             .use(bodyParser.json())
             .use("/api/adverts", adverts)
             .use("/api/localities", localities)
             .use("/api/categories", categories)
             .use((_req, res) => res.status(404).json({ success: false,error: "Route not found" }))
             .listen(port, () => console.log(`Server ready on port ${port}`));

}

module.exports = {
  start
};