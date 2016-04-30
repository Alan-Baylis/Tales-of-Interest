'use strict';

const jetpack = require('fs-jetpack');
const pg = require('pg');
const dbConfig = require('../../../conf/db.json');
const MAX_RUNNING = 100;

class Worker {
  constructor() {
    this.searchObjs = /**@type {Array<SearchObj>}*/ [];
    this._running = 0;
    console.log(dbConfig);
    pg.connect(dbConfig, (err, client, done) => {
      if(err) {
        console.log(err.stack);
        process.exit(1);
      }

      this.client = client;
      this.done = done;
    });

    process.on('message', message => {
      if(message.paths) this.updateStoryPaths(message.paths);
      if(message.search) this.search(message.search);
    });
  }

  updateStoryPaths(storyPaths) {
    this.storyPaths = storyPaths;
  }

  /**
   * @param {SearchObj} searchObj
   */
  search(searchObj) {
    this.searchObjs.push(searchObj);
    if(this.running === 0) this._launchSearches();
  }

  set running(val) {
    if(typeof val !== 'number') throw new Error('Running must be a number!');
    const oldVal = this._running;
    this._running = val;

    if(val < (MAX_RUNNING / 2) && val < oldVal) process.nextTick(() => this._launchSearches());
  }

  get running() {
    return this._running;
  }

  _launchSearches() {
    while(this.running < MAX_RUNNING) {
      this.searchObjs.forEach(searchObj => this._searchFile(searchObj));
    }
  }

  /**
   * @param {SearchObj} searchObj
   * @private
   */
  _searchFile(searchObj) {
    this.running++;
    const filePath = this.storyPaths[searchObj.index++];
    const id = searchObj.id;
    const terms = searchObj.terms;
    const searchResult = createSearchResult();

    if(searchObj.index % 1000 === 0) console.log(searchObj.index);
    if(!filePath) {
      console.log(searchObj.index);
      process.exit();
    }

    jetpack.readAsync(filePath)
      .then(file => {

        this.client.query(`INSERT INTO stories (raw_story, tsv) VALUES ($1, to_tsvector('english', $1))`, [file], err => {
          if(err) {
            console.log(err.stack);
            process.exit();
          }
          this.running--;
        });
      })
      .catch(err => console.log(err.stack));
  }
}
console.time('run');
new Worker();

/**
 * @returns {SearchResult}
 */
function createSearchResult() {
  /**
   * @typedef {Object} SearchResult
   * @property {Array<String>} foundTerms
   * @property {Number} foundOptional
   */
  return {
    foundTerms: [],
    foundOptional: 0
  }
}