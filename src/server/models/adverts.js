const { esclient, index } = require("../../elastic");
const { buildElasticSearch, advertHitToAdvert } = require("../../mapper/elasticSearchQueryMapper")

async function findAdverts(queryParams) {

  const query = buildElasticSearch(queryParams)

  const results = await executeQuery(query)

  const adverts = results.values
      .map((hit) => advertHitToAdvert(hit))

  return adverts

}

async function findAdvertById(id) {
  const result = await esclient.get({
    index,
    id:id
  })

  return advertHitToAdvert(result)

}

async function findAllAdverts() {

  const query = {
    match_all: {}
  }

  const sort = [
    {
      timestamp: "desc"
    }
  ]

  const results = await executeQuery(query, sort)

  const adverts = results.values
      .map((hit) => advertHitToAdvert(hit))

  return adverts

}

async function executeQuery(query, sort) {

  let _sort = !!sort?sort:undefined
  
  try {
    const { hits } = await esclient.search({
      index: index,
      query: query,
      sort: _sort
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
  findAdvertById,
  findAdverts,
  findAllAdverts,
  insertAdvert
}