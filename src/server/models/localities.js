const localitiesParser = require("../../utils/localitiesParser")

const localities = localitiesParser("localities_es_ES.txt");
  
function getAllLocalities() {
    return localities
}

module.exports = {
    getAllLocalities
}