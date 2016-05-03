'use strict';

const router = require('express').Router();

router.post('/', (req, res) => {
  res.status(200).send(['a', 'b', 'c', 'd', 'e']).end()
});

module.exports = router;