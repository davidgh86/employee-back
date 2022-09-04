const { esclient, index } = require("../../elastic");

async function getAdverts(req) {

  const query = {
    query: {
      match: {
        quote: {
          query: req.text,
        }
      }
    }
  }

  const { hits } = await esclient.search({
    index: index,
    query: {
      match: {
        quote: req.text
      }
    }
  });

  const results = hits.total.value;
  const values  = hits.hits.map((hit) => {
    return {
      id:     hit._id,
      data:  hit._source.data,
      score:  hit._score
    }
  });

  return {
    results,
    values
  }

}

async function insertAdvert(data) {
  return esclient.index({
    index,
    document: data
  })
}

module.exports = {
  getAdverts,
  insertAdvert
}