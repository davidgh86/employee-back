const { Client } = require("@elastic/elasticsearch");
                   require("dotenv").config();

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";

const connection = {
    node: elasticUrl
}

if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
    connection.auth = {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    }
}

const esclient   = new Client(connection);

module.exports = esclient