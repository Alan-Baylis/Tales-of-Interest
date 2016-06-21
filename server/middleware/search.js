'use strict';

const conf = require('../conf');
const router = require('express').Router();
const StorySearcher = require('../lib/StorySearcher');

const storySearcher = new StorySearcher(conf.DB_CONN);

router.post('/', (req, res) => {
  storySearcher.query(req.body.query, 0)
    .then(ids => {
      console.log(`For query: ${req.body.query}, got ${ids.length} ids`);
  
      res.send(ids);
    });
});

module.exports = router;