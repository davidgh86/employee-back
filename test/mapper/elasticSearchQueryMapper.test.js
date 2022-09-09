const { buildElasticSearch, advertHitToAdvert } = require('../../src/mapper/elasticSearchQueryMapper');

test('build request query by locality code to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({
    text:"titulo2",
  })
  expect(result).toEqual(
    {
      bool: {
        must: [
          {
            multi_match: {
              query: "titulo2",
              fields: ["title", "description"]
            }
          }
        ]
      }
    }
  );
});


test('build request query by locality code to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({
	  localityCode:"12,36",
  })
  expect(result).toEqual(
    {
      bool: {
          must: [
              {
                  nested : {
                      path: "place",
                      query: {
                          bool:{
                              filter: [
                                  { term : {"place.level0": 12}},
                                  { term : {"place.level1": 36}}
                              ]
                          }
                      }
                  }
              }
          ]
      }
    }
  );
});


test('build request query by locality code to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({
    category:"employ.sales"
  })
  expect(result).toEqual(
    {
      bool: {
          must: [
              {
                  nested : {
                      path: "category",
                      query: {
                          bool:{
                              filter: [
                                  { term : {"category.level0": "employ"}},
                                  { term : {"category.level1": "sales"}}
                              ]
                          }
                      }
                  }
              },
          ]
      }
    }
  );
});


test('build request query by locality code to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({
    type:"offer"
  })
  expect(result).toEqual(
    {
      bool: {
          filter: {
              term: { type: "offer"}
          }
      }
    }
  );
});


test('build request query by locality code to elasticSearchAdvert query', () => {

  const result = buildElasticSearch({
    text:"titulo2",
	  localityCode:"12,36",
    category:"employ.sales",
    type:"offer",
    dateLimit:"2d"
  })
  expect(result).toEqual(
    {
      bool: {
          must: [
              {
                  multi_match: {
                      query: "titulo2",
                      fields: ["title", "description"]
                  }
              },
              {
                  nested : {
                      path: "place",
                      query: {
                          bool:{
                              filter: [
                                  { term : {"place.level0": 12}},
                                  { term : {"place.level1": 36}}
                              ]
                          }
                      }
                  }
              },
              {
                  nested : {
                      path: "category",
                      query: {
                          bool:{
                              filter: [
                                  { term : {"category.level0": "employ"}},
                                  { term : {"category.level1": "sales"}}
                              ]
                          }
                      }
                  }
              },
          ],
          filter: {
              term: { type: "offer"}
          }
      }
    }
  );
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