const model = require("../models/categories");

async function getAllCategories(req, res) {

  try {
    const result = model.getAllCategories()
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

module.exports = {
  getAllCategories
};