const model = require("../models/adverts");

const { buildElasticSearch } = require("../../mapper/elasticSearchQueryMapper")

async function findAdverts(req, res) {
  const query  = buildElasticSearch(req.query);

  if (!filterIsValid(query)) {
    res.status(422).json({
      error: true,
      data: "Search filter is not ok"
    });

    return;
  }

  try {

    const result = await model.findAdverts(req.query);
    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

async function findAdvertById(req, res) {
  try {
    const result = await model.findAdvertById(req.params.id);
    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

async function findAllAdverts(req, res) {
  
  try {

    const result = await model.findAllAdverts();
    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

async function findUserAdverts(req, res) {
  
  const userId = req.user.id

  try {
    const result = await model.findUserAdverts(userId);
    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

async function findUserFavouriteAdverts(req, res) {
  
  const favouriteAdverts = req.user.favouriteAdverts

  try {
    const result = await model.findUserFavouriteAdverts(favouriteAdverts);
    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

async function addAdvert(req, res) {

  const body = JSON.parse(req.body.advertData)

  const userId = req.user.id

  const mimetype = req.file.mimetype
  const bufferFileData = req.file.buffer

  const image = {
    data: bufferFileData.toString('base64'),
    mimetype: mimetype
  }

  // const a = await convert(bufferFileData)
  // console.log(a)

  if (!advertIsValid(body)) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s)"
    });

    return;
  }

  const advert = {
    ...body,
    userId,
    image, 
    timestamp: Math.round(Date.now() / 1000)
  }

  try {

    const result = await model.insertAdvert(advert);
    res.json({
        id: result._id
    });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

function filterIsValid(filter){
  return true;
}

function advertIsValid(advert){
  return true;
}

module.exports = {
  findAdverts,
  findAllAdverts,
  findAdvertById,
  findUserAdverts,
  findUserFavouriteAdverts,
  addAdvert
};