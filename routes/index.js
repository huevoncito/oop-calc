const express = require('express');
const router = express.Router();
const getData = require(`../server/getData.js`);

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await getData();

  const personas = data.personaData;

  res.render('index', {
    name : "Not Express",
    personas: personas
  });
});

module.exports = router;
