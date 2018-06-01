const csv  = require('csv-parser');
const _    = require('underscore');
const fs   = require('fs');
const path = require('path');

//Take an object where all properties are strings and return a properly typed object
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
function parseData(filePath) {
  let cleanData = [];
  return new Promise( (resolve, reject) => {
    fs.createReadStream( filePath )
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

function addPersonaStories( personaData ) {
  // const storyDir = path.relative(process.cwd(), '../data/stories.json');
  const storyDir  = path.resolve(__dirname, '../data/stories.json');
  const storyData = JSON.parse( fs.readFileSync(storyDir) );

  return personaData.map( p => {
    const matchingPersona = _.findWhere( storyData.personaStories, {persona: p.persona} );
    if ( !matchingPersona ) {
      console.log(`No story data found for ${p.persona}. This is most likely a spelling error in stories.json`);
      throw new Error(500, `No story data found for ${p.persona}. This is most likely a spelling error in stories.json`);
    }
    p.story = matchingPersona.story;
    return p;
  });


}

//get the data and return it
module.exports = async function getData () {
    let personaData = await parseData(`${__dirname}/../data/persona-data.csv`);
    const provData  = await parseData(`${__dirname}/../data/province-data.csv`);

    return {
      personaData: addPersonaStories( personaData ),
      provData
    };
}
