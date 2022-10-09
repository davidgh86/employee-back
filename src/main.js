const elastic = require("./elastic");
const server  = require("./server");
                require("dotenv").config();


(async function main() {
  
  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {
    elastic.init();
    server.start();
  }

})();