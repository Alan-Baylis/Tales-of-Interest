'use strict';

const conf = require('../conf');
const router = require('express').Router();
const StorySearcher = require('../lib/StorySearcher');

const storySearcher = new StorySearcher(conf.DB_CONN);

router.post('/', (req, res) => {
  const now = Date.now();
  
  storySearcher.query(req.body.query, 0)
    .then(ids => {
      console.log(`For query: ${req.body.query}, got ${ids.length} ids, time taken: ${Date.now() - now}ms`);
  
      res.send(ids);
    });
});

module.exports = router;