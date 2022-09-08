function buildElasticSearch(queryFilter){
    let result = {}
    if (queryFilter.text) {
        result = {
            multi_match: {
                query: queryFilter.text,
                fields: ["title", "description"]
            }
        }
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