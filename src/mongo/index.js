const mongoose = require('mongoose');

require("dotenv").config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/femploy";

mongoose.connect(mongoUrl);  

module.exports = mongoose