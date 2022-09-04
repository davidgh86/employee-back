const express      = require("express");
const cors         = require("cors");
const bodyParser   = require("body-parser");
//const routes       = require("./routes");
const localities   = require("./routes/localities.js");
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

  return  app.use(cors())
             .use(bodyParser.urlencoded({ extended: false }))
             .use(bodyParser.json())
             .use("/api/adverts", adverts)
             .use("/api/localities", localities)
             .use((_req, res) => res.status(404).json({ success: false,error: "Route not found" }))
             .listen(port, () => console.log(`Server ready on port ${port}`));

}

module.exports = {
  start
};