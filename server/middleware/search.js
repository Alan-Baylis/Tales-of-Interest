'use strict';

const router = require('express').Router();

router.get('/test', (req, res) => res.send('hello world'));

module.exports = router;