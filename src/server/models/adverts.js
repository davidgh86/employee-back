const { esclient, index } = require("../../elastic/model/advert");
const { buildElasticSearch, advertHitToAdvert } = require("../../mapper/elasticSearchQueryMapper")
        require("dotenv").config();

const defaultKeepAlive = parseInt(process.env.KEEP_ALIVE_ES_PAGINATION)
const defaultPageSize = parseInt(process.env.PAGE_SIZE_ES_PAGINATION)

async function getPaginationId(keepAliveMin) {
  const pitRes = await esclient.openPointInTime({
    index: index,
    keep_alive: keepAliveMin+"m"
  });
  return pitRes.body.id;
}

async function preparePagination(pagination) {
  // TODO check que pasa cuando caduca el keepAlive
  const _pagination = pagination||{}

  if (!_pagination.pitId){
    _pagination.pitId = await getPaginationId(defaultKeepAlive)
    _pagination.offset = undefined
  }

  if (!_pagination.keepAliveMin) {
    _pagination.keepAliveMin = defaultKeepAlive
  }

  if (!_pagination.size) {
    _pagination.size = defaultPageSize
  }

  return _pagination
}

function buildPage(results, pitId, offset, total) {
  return {
    id: pitId,
    offset: [
      offset.score,
      offset.hit
    ],
    total: total,
    results: results
  }
}


async function findAdverts(queryParams, pagination) {
 
  const _pagination = preparePagination(pagination)

  const query = buildElasticSearch(queryParams)

  const results = await executeQuery(query, undefined, undefined, _pagination)

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

  results.values
      .forEach((hit) => {
        const hitData = hit._source
        result[hit._id] = hitData.title
      })

  return result
}

async function executeQuery(query, sort, source, pagination) {

  let _sort = !!sort?sort:undefined

  let _source = !!source?source:undefined

  let _size

  let _pit

  let _offset

  if (!pagination || !pagination.size || !pagination.pitId || !pagination.keepAliveMin){
    _size = undefined
    _pit = undefined
  } else {
    _size = pagination.size
    _pit = {
      id: pitId,
      keep_alive: keepAliveMin+"m"
    }
    if (pagination.offset && pagination.offset.score && pagination.offset.hit) {
      _offset = [
        pagination.offset.score,
        pagination.offset.hit
      ]
    }
  }
  
  try {
    const { hits } = await esclient.search({
      index: index,
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
      if (lastValue.sort && lastValue.sort.length==2) {
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