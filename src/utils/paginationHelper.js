const esclient   = require("../elastic/elasticConfig")
                   require("dotenv").config();

const defaultKeepAlive = parseInt(process.env.KEEP_ALIVE_ES_PAGINATION)
const defaultPageSize = parseInt(process.env.PAGE_SIZE_ES_PAGINATION)

esclient.p

async function getPaginationId(keepAliveMin) {
  const pitRes = await esclient.openPointInTime({
    index: index,
    keep_alive: keepAliveMin+"m"
  });
  return pitRes.id;
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

    const _offset = (offset && offset.length>0)?offset:undefined

    return {
        id: pitId,
        offset: _offset,
        total: total,
        results: results
    }
}

module.exports = {
    preparePagination,
    buildPage
}


