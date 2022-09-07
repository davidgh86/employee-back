const categoriesJSON = require("../../data/categories/categories_es_ES.json")
  
function getAllCategories() {
    return categoriesJSON;
}

module.exports = {
    getAllCategories
}