const express = require('express');
const router = express.Router();
const getData = require(`../server/getData.js`);

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await getData();
  res.send(data);
});

module.exports = router;
