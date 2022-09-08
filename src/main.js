const elastic = require("./elastic");
const server  = require("./server");
                require("dotenv").config();


(async function main() {

  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {

    const elasticIndex = await elastic.esclient.indices.exists({index: elastic.index});

    if (!elasticIndex) {
      await elastic.createIndex(elastic.index);
    }
    await elastic.setAdvertMapping();
    if (process.env.NODE_END==="development" && process.env.BULK_DATA==="true"){
      await elastic.loadSampleData()
    }

    server.start();

  }

})();