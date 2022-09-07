const { esclient, index } = require("../../elastic");

async function findAdverts(queryParams) {

  const query = buildSearchQuery(queryParams)

  const { hits } = await esclient.search({
    index: index,
    query: query
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
  findAdverts,
  insertAdvert
}