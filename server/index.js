'use strict';

const search = require('./middleware/search');
const express = require('express');
const app = express();
app.listen(5000);

app.use('/api/stories', search.router);

app.use(express.static(__dirname + '/../public/'));