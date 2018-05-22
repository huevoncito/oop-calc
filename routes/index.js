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
    name : "Not Express",
    personas: personas,
    incomeBands: [
      {
        val: 1,
        desc: 1
      },
      {
        val: 2,
        desc: 2
      },
      {
        val: 3,
        desc: 3
      },
      {
        val: 4,
        desc: 4
      },
      {
        val: 5,
        desc: 5
      },
      {
        val: 6,
        desc: 6
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
