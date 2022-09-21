const { Client } = require("@elastic/elasticsearch");
                   require("dotenv").config();

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";

const esclient   = new Client({ node: elasticUrl });
const index      = "adverts";

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

async function createIndex(index) {
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
      image: {
        type: "nested",
        enabled: false,
        properties:{
          data: {
            type: "binary"
          },
          mymetype: {
            type: "keyword"
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

/**
 * @function checkConnection
 * @returns {Promise<Boolean>}
 * @description Checks if the client is connected to ElasticSearch
 */

function checkConnection() {
  return new Promise(async (resolve) => {

    console.log("Checking connection to ElasticSearch...");
    
    let isConnected = false;

    while (!isConnected) {
      try {

        await esclient.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;

      // eslint-disable-next-line no-empty
      } catch (_) {

      }
    }

    resolve(true);

  });
}

async function loadSampleData(){
  const sampleAdverts = require('../src/data/sample/adverts.json');

  const operations = sampleAdverts.flatMap(doc => [{ index: { _index: index } }, doc])

  await esclient.bulk({ refresh: true, operations })
}

module.exports = {
  esclient,
  setAdvertMapping,
  checkConnection,
  createIndex,
  loadSampleData,
  index,
};