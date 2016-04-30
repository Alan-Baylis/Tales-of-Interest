'use strict';

const child_process = require('child_process');
const path = require('path');
const jetpack = require('fs-jetpack');
const _ = require('lodash');
const STORIES = path.join(__dirname, '../../../../stories/raw-stories');
const CPU_NUM =  require('os').cpus().length;

class FileSearcher {
  constructor() {
    this.workers = [];

    _.times(CPU_NUM, () => this.workers.push(child_process.fork('./Worker')));

    this._updateWorkersStoryPaths();
  }

  /**
   * @param {String} term
   */
  search(term) {
    const terms = [];
    /**@type {?SearchTerm}*/ let currTerm;

    term
      .replace(/[^A-Za-z0-9\s"+-]/, '')
      .replace(/\s{2,}/, ' ')
      .split('')
      .forEach(char => {
        if(!currTerm) {
          if(char === '+') currTerm = createSearchTerm('', false, true, false);
          else if(char === '"') currTerm = createSearchTerm('', true, false, false);
          else if(char === '-') currTerm = createSearchTerm('', false, false, true);
          else if(char !== ' ') currTerm = createSearchTerm(char, false, false, false);
          else if(char === ' ') return;

          return terms.push(currTerm);
        }

        if(char === '+' || char === '-') return;
        if(char === ' ' && !currTerm.quoted) return currTerm = null;
        if(char === '"' && currTerm.quoted) return currTerm = null;

        if(char === '"') {
          if(currTerm.term.length === 0) return currTerm.quoted = true;

          return currTerm = createSearchTerm('', true, false, false);
        }

        return currTerm.term += char;
      });

    this._sendAllWorkersMessages( {search: createSearchObj(terms)} );
  }

  _sendAllWorkersMessages(msg) {
    this.workers.forEach(worker => worker.send(msg));
  }

  _updateWorkersStoryPaths() {
    const dirs = jetpack.list(STORIES).map(storyPath => path.join(STORIES, storyPath));
    const splitDirs = _.chunk(dirs, Math.ceil(dirs.length / CPU_NUM));

    splitDirs.forEach((splitDir, i) => this.workers[i].send({paths: splitDir}));
  }
}

module.exports = FileSearcher;

function createSearchObj(terms) {
  /**
   * @typedef {Object} SearchObj
   * @property {String} id
   * @property {Array<SearchTerm>} terms
   * @property {Number} index
   */

  return {
    id: Math.random().toString(35).slice(-20), //creates id of random alphanumeric characters
    terms: terms,
    index: 0
  }
}

function createSearchTerm(term, quoted, required, negated) {
  /**
   @typedef {Object} SearchTerm
   @property {String} term
   @property {Boolean} quoted
   @property {Boolean} required
   @property {Boolean} negated
   */

  return {
    term: term,
    quoted: quoted,
    required: required,
    negated: negated
  };
}
