const { buildElasticSearch, advertHitToAdvert } = require('../../src/mapper/elasticSearchQueryMapper');

test('build request query test to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({text: "text3"})
  expect(result).toEqual({
    bool:{
      must: {
        multi_match: {
          query: "text3",
          fields: ["title", "description"]
        }
      }
    }
  });
});

test('build request query by locality code to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({localityCode: "1,2,3"})
  expect(result).toEqual({
    bool:{
      filter: [
        { term : {"place.level0": 1}},
        { term : {"place.level1": 2}},
        { term : {"place.level2": 3}}
      ]
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