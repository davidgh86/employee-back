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

test('find advert executing find advert with locality code', async () => {
    const query = {
        localityCode:"5,6,7"
    }
    const result = await advertService.findAdverts(query);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe("titlewithdescription")
});

