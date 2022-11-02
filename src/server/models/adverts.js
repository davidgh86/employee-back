const { esclient, index } = require("../../elastic/model/advert");
const { buildElasticSearch, advertHitToAdvert } = require("../../mapper/elasticSearchQueryMapper")
const { preparePagination, buildPage } = require("../../utils/paginationHelper")

async function findAdverts(queryParams, pagination) {
 
  const _pagination = await preparePagination(pagination, index)

  const query = buildElasticSearch(queryParams)

  const sort = [
    {
      _score: "desc"
    }
  ]

  const results = await executeQuery(query, sort, undefined, _pagination)

  const adverts = results.values
      .map((hit) => advertHitToAdvert(hit))
  
  return buildPage(adverts, _pagination.pitId, results.offset, results.results)

}

async function findAdvertById(id) {
  const result = await esclient.get({
    index,
    id:id
  })

  return advertHitToAdvert(result)

}

async function findAllAdverts(paginationData) {

  const query = {
    match_all: {}
  }

  const sort = [
    {
      timestamp: {order: "desc", format: "strict_date_optional_time_nanos", numeric_type : "date_nanos" }
    }
  ]

  const _pagination = await preparePagination(paginationData, index)

  const results = await executeQuery(query, sort, undefined, _pagination)

  const adverts = results.values
      .map((hit) => advertHitToAdvert(hit))
  
  return buildPage(adverts, _pagination.pitId, results.offset, results.results)

}

async function findUserFavouriteAdverts(advertsId, paginationData) {

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

  const _pagination = await preparePagination(paginationData, index)
  
  const results = await executeQuery(query, sort, undefined, _pagination)
  const adverts = results.values
    .map((hit) => advertHitToAdvert(hit))

    return buildPage(adverts, _pagination.pitId, results.offset, results.results)

}

async function findUserAdverts(userId, paginationData) {
  
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
      timestamp: {order: "desc", format: "strict_date_optional_time_nanos", numeric_type : "date_nanos" }
    }
  ]

  const _pagination = await preparePagination(paginationData, index)

  const results = await executeQuery(query, sort, undefined, _pagination)

  const adverts = results.values
      .map((hit) => advertHitToAdvert(hit))

  return buildPage(adverts, _pagination.pitId, results.offset, results.results)
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

  results.values
      .forEach((hit) => {
        const hitData = hit._source
        result[hit._id] = hitData.title
      })

  return result
}

async function executeQuery(query, sort, source, pagination) {

  let _sort = sort||undefined

  let _source = source||undefined

  let _size

  let _pit

  let _offset

  if (!pagination || !pagination.size || !pagination.pitId || !pagination.keepAliveMin){
    _size = undefined
    _pit = undefined
  } else {
    _size = pagination.size
    _pit = {
      id: pagination.pitId,
      keep_alive: pagination.keepAliveMin+"m"
    }
    if (pagination.offset) {
      _offset = pagination.offset
    }
  }
  
  try {
    const { hits } = await esclient.search({
      index: _pit?undefined:index,
      query: query,
      sort: _sort,
      _source: _source,
      size: _size,
      pit: _pit,
      search_after: _offset
    });

    const results = hits.total.value;
    const values  = hits.hits

    let offset
    
    if (values && values.length>0) {
      const lastValue = values[values.length - 1]
      if (lastValue.sort && lastValue.sort.length>0) {
        offset = lastValue.sort
      }
    }

    return {
      results,
      values,
      offset
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