const { esclient, index } = require("../../elastic");
const { buildElasticSearch, advertHitToAdvert } = require("../../mapper/elasticSearchQueryMapper")

async function findAdverts(queryParams) {

  const query = buildElasticSearch(queryParams)

  const results = await executeQuery(query)

  const adverts = results.values
      .map((hit) => advertHitToAdvert(hit))

  return adverts

}

async function executeQuery(query) {

  try {
    const { hits } = await esclient.search({
      index: index,
      query: query
    });

    const results = hits.total.value;
    const values  = hits.hits

    return {
      results,
      values
    } 
  } catch (error) {
    console.log(error.message)
    throw error
  }

}

async function insertAdvert(data) {
  return esclient.index({
    index,
    document: data
  })
}

module.exports = {
  executeQuery,
  findAdverts,
  insertAdvert
}