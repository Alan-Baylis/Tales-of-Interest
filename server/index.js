'use strict';

const search = require('./middleware/search');
const express = require('express');
const app = express();

app.use('/api/stories', search);

app.use(express.static(__dirname + '/../public/'));

app.listen(5000);

console.log('Server started on port 5000');