const model = require("../models/adverts");


async function getAdverts(req, res) {
  const query  = req.query;

  if (!query.text) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter: text"
    });

    return;
  }

  try {

    const result = await model.getAdverts(req.query);
    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function addAdvert(req, res) {

  const body = req.body;

  if (!advertIsValid(body)) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s)"
    });

    return;
  }

  try {

    const result = await model.insertAdvert(body);
    res.json({ 
      success: true, 
      data: {
        id:     result._id,
        ...body
      } 
    });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }

}

function advertIsValid(advert){
  // TODO
  return true;
}

module.exports = {
  getAdverts,
  addAdvert
};