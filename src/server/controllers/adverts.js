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

async function findAllAdverts(req, res) {
  
  try {

    const result = await model.findAllAdverts();
    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

async function addAdvert(req, res) {

  const body = {
    ...req.body,
    timestamp: Math.round(Date.now() / 1000)
  }

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
        id: result._id,
        ...body 
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
  addAdvert
};