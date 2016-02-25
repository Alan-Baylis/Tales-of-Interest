'use strict';

const bluebird = /**@type {Promise}*/ require('bluebird');
const axios = require('axios');
bluebird.config({cancellation: true});

class Searcher {
  /**
   *
   * @param {Array<String>} results
   */
  constructor(results) {
    this.results = /**@type {Array<String>}*/ results;
    this.searchPromise = /**@type {?Promise}*/ null;
  }

  /**
   * Call whenever the search term changes, automatically throttles the network requests
   * @param {String} term
   */
  onTermChange(term) {
    if(!term || term.length === 0) return;

    if(this.searchPromise) this.searchPromise.cancel();

    this.searchPromise = bluebird.delay(2000)
      .then(() => {

      });
  }
}

module.exports = Searcher;