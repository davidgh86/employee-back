const fs = require('fs');

function parse(fileName) {

    const allFileContent = fs.readFileSync("src/data/localities/"+fileName, 'utf-8')
    
    return allFileContent.split(/\r?\n/)
        .flatMap(line => getLocalitiesFromLine(line))
        .sort(
            function(a, b) {
              if (a.description.toLowerCase() < b.description.toLowerCase()) return -1;
              if (a.description.toLowerCase() > b.description.toLowerCase()) return 1;
              return 0;
            }
          )

}

function getLocalitiesFromLine(line) {
    const result = [];
    if (line === "sep=;" || line.trim() === ""){
        return result;
    }
    const codeAndDescription = line.split(";")
    const descriptions = codeAndDescription[1].split("/");
    const codes = codeAndDescription[0].split(",").map(cod => parseInt(cod))
    const code = {}
    for (let i=0; i<codes.length; i++) {
        code["level"+i] = codes[i]
    }

    for (const description of descriptions){
        const locality = {}
        locality.description = description
        locality.code = code
        result.push(locality)
    }
    return result
}

module.exports = parse


