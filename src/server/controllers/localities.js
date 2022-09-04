const model = require("../models/localities");

async function getAllLocalities(req, res) {

  try {
    const result = model.getAllLocalities()
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

module.exports = {
  getAllLocalities
};