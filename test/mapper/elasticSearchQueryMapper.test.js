const { buildElasticSearch, advertHitToAdvert } = require('../../src/mapper/elasticSearchQueryMapper');

test('build request query to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({text: "text3"})
  expect(result).toEqual({
    multi_match: {
      query: "text3",
      fields: ["title", "description"]
    }
  });
});


test('advert hit to advert', () => {

  const advertHit = JSON.parse(`
  {
    "_index": "adverts",
    "_id": "aqu-HYMB_W-3hn7UqHVs",
    "_score": 0.6931471,
    "_source": {
      "title": "titulo2",
      "type": "apply",
      "place": {
        "level0": 6,
        "level1": 7,
        "level2": 8
      },
      "description": "description2",
      "category": {
        "level0": "employ",
        "level1": "desing",
        "level2": "web"
      }
    }
  }
  `);

  const expected = JSON.parse(`
  {
    "id": "aqu-HYMB_W-3hn7UqHVs",
    "title": "titulo2",
    "type": "apply",
    "place": {
      "level0": 6,
      "level1": 7,
      "level2": 8
    },
    "description": "description2",
    "category": {
      "level0": "employ",
      "level1": "desing",
      "level2": "web"
    }
  }
  `)

  const result = advertHitToAdvert(advertHit)
  expect(result).toEqual(expected);
});