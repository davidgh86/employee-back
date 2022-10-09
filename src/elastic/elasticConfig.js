const { Client } = require("@elastic/elasticsearch");
                   require("dotenv").config();

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";

const esclient   = new Client({ node: elasticUrl });

module.exports = esclient