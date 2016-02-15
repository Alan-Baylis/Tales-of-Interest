'use strict';

/**
 * @param {Server} server
 */
module.exports = function(server) {
  server.get('/stories', (req, res) => {res.send(200)});
};

const router = require('express').Router();

router.get('/test', (req, res) => res.send('hello world'));

module.exports.router = router;