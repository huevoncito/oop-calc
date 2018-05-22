const csv = require('csv-parser');
const _   = require('underscore');
const fs  = require('fs');

//Take an object where all properties are strings and return a properly typed version
function setDataTypes(obj) {
  for ( var key in obj ) {
    let val = obj[key];
    if ( !val || val === '' ) {
      obj[key] = null;
    } else if ( !isNaN( parseFloat(val) ) ) {
      obj[key] = parseFloat(val);
    } else if ( val === 'y' ) {
      obj[key] = true;
    } else if ( val === 'n' ) {
      obj[key] = false;
    }
  }

  return obj;
}

//Read data from a CSV, set types, and return clean array
function parseData(path) {
  let cleanData = [];
  return new Promise( (resolve, reject) => {
    fs.createReadStream( path )
      .pipe( csv({}) )
      .on('data', data => {
          let cleanObject = setDataTypes(data);
          cleanData.push( cleanObject );
      })
      .on('error', error => {
        console.log('error!!', error);
      }).on('end', () => {
        return resolve(cleanData);
      });
  });
}

//get the data and return it
module.exports = async function getData () {
    const personaData = await parseData(`${__dirname}/../data/persona-data.csv`);
    const provData = await parseData(`${__dirname}/../data/province-data.csv`);

    return {
      personaData,
      provData
    };
}
