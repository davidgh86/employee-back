const esclient   = require("../elasticConfig")
const index      = "adverts";

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

async function createIndex() {
  try {
    
    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);

  } catch (err) {

    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);

  }
}

async function setAdvertMapping () {
  try {
    const schema = {
      title: {
        type: "text" 
      },
      type: {
        type: "keyword"
      },
      place: {
        type: "nested",
        properties: {
          level0: {
            type: "integer"
          },
          level1: {
            type: "integer"
          },
          level2: {
            type: "integer"
          },
          level3: {
            type: "integer"
          }
        },
      },
      description: {
        type: "text"
      },
      category: {
        type: "nested",
        properties: {
          level0: {
            type: "keyword"
          },
          level1: {
            type: "keyword"
          },
          level2: {
            type: "keyword"
          },
          level3: {
            type: "keyword"
          }
        },
      },
      userId: {
        type: "keyword"
      },
      image: {
        type: "nested",
        enabled: false,
        properties:{
          data: {
            type: "binary"
          },
          mimetype: {
            type: "text"
          }
        }
      },
      timestamp: {
        type: "date",
        format: "epoch_second"
      }
    };
  
    await esclient.indices.putMapping({ 
      index,
      properties: schema
    })
    
    console.log("Adverts mapping created successfully");
  
  } catch (err) {
    console.error("An error occurred while setting the adverts mapping:");
    console.error(err);
  }
}

async function existIndex(){
  return await esclient.indices.exists({index: index});
}

async function loadSampleData(){
  const sampleAdverts = require('../../data/sample/adverts.json');

  const operations = sampleAdverts.flatMap(doc => [{ index: { _index: index } }, doc])

  await esclient.bulk({ refresh: true, operations })
}

async function init() {
  const elasticIndex = await existIndex();

  if (!elasticIndex) {
    await createIndex();
  }
  await setAdvertMapping();
  if (process.env.NODE_ENV==="development" && process.env.BULK_DATA==="true"){
    await this.loadSampleData()
  }
}

module.exports = {
  setAdvertMapping,
  createIndex,
  loadSampleData,
  init,
  esclient,
  index
};