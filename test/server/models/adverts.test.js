const advertService = require('../../../src/server/models/adverts')

test('find a simple advert executing raw query', async () => {
    const query = {
        match: {
            title: "titulo2"
        }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(result.values[0]._source.title).toBe("titulo2")
});


test('find a simple advert executing raw query', async () => {
    const query = {
        bool:{
            must: {
              multi_match: {
                query: "titulo2",
                fields: ["title", "description"]
              }
            }
          }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(result.values[0]._source.title).toBe("titulo2")
});

test('find a simple advert executing raw query', async () => {
    
    const query = {
        nested : {
            path: "place",
            query: {
                bool:{
                    filter: [
                      { term : {"place.level0": 7}},
                      { term : {"place.level1": 5}},
                      { term : {"place.level2": 80}}
                    ]
                  }
            }
        }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(result.values[0]._source.title).toBe("titulo")
});


test('find a simple advert executing raw query', async () => {
    
    const query = {
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
                                    { term : {"place.level0": 10}},
                                    { term : {"place.level1": 3}}
                                ]
                            }
                        }
                    }
                }
            ]
        }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(!!result.values[0]._score).toBe(true)
    expect(result.values[0]._source.title).toBe("titulo2")
});

test('find a simple advert executing raw query', async () => {
    
    const query = {
        bool: {
            must: [
                {
                    multi_match: {
                        query: "titulo2",
                        fields: ["title", "description"]
                    }
                }
            ],
            filter: {
                term: { type: "apply"}
            }
        }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(!!result.values[0]._score).toBe(true)
    expect(result.values[0]._source.title).toBe("titulo2")
});


test('find a simple advert executing raw query', async () => {
    
    const query = {
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
                        path: "category",
                        query: {
                            bool:{
                                filter: [
                                    { term : {"category.level0": "employ"}},
                                    { term : {"category.level1": "desing"}}
                                ]
                            }
                        }
                    }
                },
            ]
        }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(!!result.values[0]._score).toBe(true)
    expect(result.values[0]._source.title).toBe("titulo2")
});


test('find a simple advert executing raw query', async () => {
    const query = {
        bool:{
            must: {
              multi_match: {
                query: "description",
                fields: ["title", "description"]
              }
            }
        }
    }
    const result = await advertService.executeQuery(query);
    expect(result.results).toBe(1);
    expect(result.values[0]._source.title).toBe("titulo")
});


test('find advert executing find advert with text in title', async () => {
    const query = {
        text:"titulo2"
    }
    const result = await advertService.findAdverts(query);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("titulo2")
});

test('find advert executing find advert with text in description', async () => {
    const query = {
        text:"description"
    }
    const result = await advertService.findAdverts(query);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe("description")
});

test('find advert executing find advert with text in description and title', async () => {
    const query = {
        text:"titlewithdescription"
    }
    const result = await advertService.findAdverts(query);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe("titlewithdescription")
    expect(result[0].title).toBe("titlewithdescription")
});

test('find advert executing find advert with text in description and title', async () => {
    const query = {
        text:"titlewithdescription"
    }
    const result = await advertService.findAdverts(query);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe("titlewithdescription")
    expect(result[0].title).toBe("titlewithdescription")

    const byId = await advertService.findAdvertById(result[0].id)
    expect(result[0]).toEqual(byId)
});


