'use strict';

const search = require('./middleware/search');
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.tal_PORT || 5001;

app.use(cors());

app.use('/', (req,res, next) => {
  console.log(`${new Date().toLocaleString()} - ${req.method} - ${req.url}`);
  next();
});

app.use('/api/search', search);

app.listen(PORT);

console.log(`Server started on port ${PORT}`);