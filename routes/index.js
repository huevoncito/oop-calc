const express = require('express');
const router = express.Router();
const getData = require(`../server/getData.js`);

const colourList = [ "#e1131d", "#ff717b", "#ecb05b", "#acbf00", "#00a6a0", "#e68d61", "#f4e1c6", "#5cc2b7", "#f4a9c9", "#d1466c"];

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await getData();

  //assign colours
  const personas = data.personaData.map( (persona, index) => {
    persona.bgColour = colourList[index];
    return persona;
  });

  res.render('index', {
    personas: personas,
    //This list matches the one found in script.js on the client. If you change this, change that one too.
    incomeBands: [
      {
        val: 1,
        desc: "Up to $25,000"
      },
      {
        val: 2,
        desc: "$25,001 - $50,000"
      },
      {
        val: 3,
        desc: "$50,001 - $75,000",
        selected: 'selected' //this is the default value
      },
      {
        val: 4,
        desc: "$75,001 - $100,000"
      },
      {
        val: 5,
        desc: "$100,001 - $150,000"
      },
      {
        val: 6,
        desc: "$150,001 and up"
      }
    ],
    distances: [
      {
        val: "within-5km",
        desc: "Within 5km"
      },
      {
        val: "within-15km",
        desc: "Within 15k"
      },
      {
        val: "within-50km",
        desc: "Within 50km"
      },
      {
        val: "within-200km",
        desc: "Within 200km"
      },
      {
        val: ">200km",
        desc: "Greater than 200km"
      }
    ],
    provinces: [
      {
        acronym: "AB",
        name: "Alberta"
      },
      {
        acronym: "BC",
        name: "British Columbia"
      },
      {
        acronym: "MB",
        name: "Manitoba"
      },
      {
        acronym: "NL",
        name: "Newfoundland and Labrador"
      },
      {
        acronym: "NB",
        name: "New Brunswick"
      },
      {
        acronym: "NS",
        name: "Nova Scotia"
      },
      {
        acronym: "ON",
        name: "Ontario"
      },
      {
        acronym: "PEI",
        name: "Prince Edward Island"
      },
      {
        acronym: "QC",
        name: "Quebec"
      },
      {
        acronym: "SK",
        name: "Saskatchewan"
      }
    ]
  });
});

module.exports = router;
