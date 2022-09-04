const csv = require('csv-parser');
const fs = require('fs');

function createReadStream(path) {
  return new Promise((resolve, reject) => {
    const result = []
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        result.push(row)
      })
      .on('end', () => {
        resolve(result)
      });
  })
}

function joinAutonomiasAndLocalities(provinces, localities){
  localitiesDict = {}
  autonomiesDict = {}

  for (let province of provinces) {
      localitiesDict[province.codProvincia] = province
      const codAutonomia = province.codAutonomia
      if (autonomiesDict[codAutonomia] === undefined && province.isCiudadAutonoma==="N"){
        autonomiesDict[codAutonomia] = province.descripcion
      }
  }
  
  for (const locality of localities) {
    const provinceCode = ''+parseInt(locality.codProvincia)
    let codAutonomia = localitiesDict[provinceCode].codAutonomia
    if (codAutonomia.length == 1){
      codAutonomia = "0"+codAutonomia
    }
    locality.codAutonomia = codAutonomia
    locality.descripcion = standarizeLocalityDescription(locality.descripcion)
  }
  
  for (const province of provinces){
    if (province.isCiudadAutonoma==="N") {
      const codProvince = province.codProvincia.length==1?'0'+province.codProvincia:province.codProvincia
      const codAutonomia = province.codAutonomia.length==1?'0'+province.codAutonomia:province.codAutonomia
      localities.push({
        codProvincia: codProvince,
        codigoPoblacion:"000",
        descripcion: standarizeLocalityDescription(province.descripcionProvincia) + " (Provincia)",
        codAutonomia: codAutonomia
      })
    }
  }
  localities.push({
    codProvincia: "000",
    codigoPoblacion:"000",
    descripcion: "Toda España",
    codAutonomia: "00"
  })

  for (const autonomieCode in autonomiesDict) {
    localities.push({
      codProvincia: "000",
      codigoPoblacion:"000",
      descripcion: "Todo "+standarizeLocalityDescription(autonomiesDict[autonomieCode]),
      codAutonomia: autonomieCode.length==1?"0"+autonomieCode:autonomieCode
    })
  }

  return localities
}

function standarizeLocalityDescription(localityDescripcion) {
  if (localityDescripcion.includes(",")){
    const splitted = localityDescripcion.split(",")
    return splitted[1].trim()+" "+splitted[0].trim()
  }else{
    return localityDescripcion
  }
}

createReadStream("autonomias.csv").then(autonomies => {
  createReadStream("localidade.csv").then(localities => {
    const processedLocalities = joinAutonomiasAndLocalities(autonomies, localities)
    fs.appendFileSync('localities_es_ES.txt',"sep=;\n", "utf-8");
    for (locality of processedLocalities){
      fs.appendFileSync('localities_es_ES.txt', locality.codAutonomia+","+locality.codProvincia+","+locality.codigoPoblacion+";"+locality.descripcion+"\n", "utf-8");
    }
  })
})


