'use strict';

const conf = require('../conf');
const bluebird = require('bluebird');
const Parrot = require('../lib/Parrot');
const pg = require('pg');
const router = require('express').Router();

const parrot = new Parrot('Story Middleware');

router.get('/:id', (req, res) => {
  const id = req.params.id;
  parrot.log(`Request for story with id: ${id}`);
  
  getStoryById(id)
    .then(story => {
      parrot.log(`Got story for id: ${id}`);
      res.send(story);
    })
    .catch(err => {
      parrot.error(`Failed to get story for id: ${id}`);
      parrot.error(err);
      
      res.status(500).end();
    });
});

router.get('/', (req, res) => {
  parrot.error('Request for story didn\'t contain id');
  
  res.status(400).send('Request requires id');
});

module.exports = router;

/**
 * @param {String|Number} id
 */
function getStoryById(id) {
  let resolve, reject;
  const promise = new bluebird((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  pg.connect(conf.DB_CONN, (err, client, done) => {
    if(err) {
      done();
      return reject(err);
    }
    
    client.query('SELECT story FROM stories WHERE stories.id=$1', [id], (err, res) => {
      done();
      if(err) return reject(err);
      
      resolve(res.rows[0].story);
    });
  });
  
  return promise;
}