const { query } = require("express")

function buildElasticSearch(queryFilter){
    const result = {
        bool:{}
    }
    if (queryFilter.text) {
        result.bool.must = [
            {
                multi_match : {
                    query: queryFilter.text,
                    fields: ["title", "description"]
                }
            }
        ]
    }

    if (queryFilter.localityCode) {
        const localityFilter = getLocalityFilter(queryFilter.localityCode)
        if (localityFilter) {
            if (!result.bool.must){
                result.bool.must=[]
            }
            result.bool.must.push({
                nested : {
                    path: "place",
                    query: {
                        bool:{
                            filter: localityFilter
                        }
                    }
                }
            })
        }
    }

    if (queryFilter.category) {
        const categoryFilter = getCategoryFilter(queryFilter.category)
        if (categoryFilter) {
            if (!result.bool.must){
                result.bool.must=[]
            }
            result.bool.must.push({
                nested : {
                    path: "category",
                    query: {
                        bool:{
                            filter: categoryFilter
                        }
                    }
                }
            })
        }
    }

    if (queryFilter.type) {
        result.bool.filter = {term: { type: queryFilter.type}}
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

function getCategoryFilter(categoryCodeString) {
    const result = []
    const codes = categoryCodeString.split(".").filter(cod => !!cod)
    for (let idx = 0; idx < codes.length; idx++){
        const term = {}
        term["category.level"+idx] = codes[idx]
        result.push({
            term: term
        })
    }
    return result
}

function advertHitToAdvert(hit) {
    const hitData = hit._source
    const image = hitData.image
    const dataSrc = `data:${image.mimetype};base64,${image.data}`

    delete hitData.image
    return {
        id: hit._id,
        ...hitData,
        img: dataSrc
    }
}

module.exports = {
    buildElasticSearch,
    advertHitToAdvert
};