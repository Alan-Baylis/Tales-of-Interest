'use strict';

const search = require('./middleware/search');
const express = require('express');
const app = express();

app.use('/api/stories', search);

app.use(express.static(__dirname + '/../public/'));

app.use((req, res) => {
  console.log(req.originalUrl + ': lead nowhere. Redirecting to index');
  res.sendFile('public/index.html', {root: __dirname + '/../'});
});

app.listen(5000);

console.log('Server started on port 5000');