'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const search = require('./middleware/search');

const app = express();
const PORT = process.env.tai_PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use('/', (req,res, next) => {
  console.log(`${new Date().toLocaleString()} - ${req.method} - ${req.url}`);
  next();
});

app.use('/api/search', search);

app.listen(PORT);

console.log(`Server started on port ${PORT}`);