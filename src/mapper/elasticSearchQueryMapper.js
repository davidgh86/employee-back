function buildElasticSearch(queryFilter){
    const result = {
        bool:{}
    }
    if (queryFilter.text) {
        result.bool.must = {
            multi_match : {
                query: queryFilter.text,
                fields: ["title", "description"]
            }
        }
    }

    if (queryFilter.localityCode) {
        const localityFilter = getLocalityFilter(queryFilter.localityCode)
        if (localityFilter) {
            result.bool.filter = localityFilter
        }
    }

    return result
}

function getLocalityFilter(localityCodeString) {
    const result = []
    const codes = localityCodeString.split(",").filter(cod => !!cod)
    for (let idx = 0; idx < codes.length; idx++){
        const term = {}
        term["place.level"+idx] = parseInt(codes[idx])
        result.push({
            term: term
        })
    }
    return result
}

function advertHitToAdvert(hit) {
    return {
        id: hit._id,
        ...hit._source
    }
}

module.exports = {
    buildElasticSearch,
    advertHitToAdvert
};