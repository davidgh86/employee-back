const { esclient, index } = require("../../elastic/model/advert");
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

async function findUserFavouriteAdverts(advertsId) {

  const query = {
    bool: {
      filter: {
        ids: {
          values: advertsId
        }
      }
    }
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

async function findUserAdverts(userId) {
  
  const query = {
    bool: {
      filter: [
        {
          term: {
            userId: userId
          }
        }
      ]
    }
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

async function findUserAdvertsTitles(userId) {
  
  const query = {
    bool: {
      filter: [
        {
          term: {
            userId: userId
          }
        }
      ]
    }
  }

  const sort = [
    {
      timestamp: "desc"
    }
  ]

  const results = await executeQuery(query, sort, "title")

  const result = {}

  const advertTitles = results.values
      .forEach((hit) => {
        const hitData = hit._source
        result[hit._id] = hitData.title
      })

  return result
}

async function executeQuery(query, sort, source) {

  let _sort = !!sort?sort:undefined

  let _source = !!source?source:undefined
  
  try {
    const { hits } = await esclient.search({
      index: index,
      query: query,
      sort: _sort,
      _source: _source
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
  insertAdvert,
  findUserAdverts,
  findUserFavouriteAdverts,
  findUserAdvertsTitles
}