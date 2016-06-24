'use strict';

const bluebird = /**@type {Promise}*/ require('bluebird');
const Parrot = require('./Parrot');
const pg = require('pg');

class StorySearcher {
  /**
   * @param {String} dbConn 
   */
  constructor(dbConn) {
    this.dbConn = dbConn;
    this.parrot = new Parrot('StorySearcher');
  }
  
  /**
   * Searches database using user query, and returns array of story ids
   * @param {String} query
   * @param {Number} index
   */
  query(query, index) {
    const searchObj = this._convertQueryToSearchObj(query);
    searchObj.index = index;
    
    return this._searchDB(searchObj);
  }
  
  /**
   * Convert user query to more usable SearchObj
   * @param {String} query
   * @returns SearchObj
   * @private
   */
  _convertQueryToSearchObj(query) {
    const terms = /**@type {SearchTerm[]}*/ [];
    /**@type {?SearchTerm}*/ let currTerm;
  
    query
      .replace(/[^A-Za-z0-9\s"-]/, '')
      .replace(/\s{2,}/, ' ')
      .split('')
      .forEach(char => {
        if(!currTerm) {
          currTerm = /**@type {SearchTerm}*/ {term: ''};
        
          if(char === '"') currTerm.quoted = true;
          else if(char === '-') currTerm.negated = true;
          else if(char === ' ') return currTerm = null;
          else currTerm.term += char;
        
          return terms.push(currTerm);
        }
      
        if(char === '-') return;
        if(char === ' ' && !currTerm.quoted) return currTerm = null;
        if(char === '"' && currTerm.quoted) return currTerm = null;
      
        if(char === '"') {
          if(currTerm.term.length === 0) return currTerm.quoted = true;
        
          //if quote is found in non-quoted term, assume it's start of new, quoted term"
          currTerm = /**@type {SearchTerm}*/ {term: '', quoted: true};
          return terms.push(currTerm);
        }
      
        return currTerm.term += char;
      });
  
    
  
    return /**@type {SearchObj}*/ {
      terms: terms,
      query: query,
      index: 0
    };
  }
  
  /**
   * @param {SearchObj} searchObj
   * @returns Promise
   * @private
   */
  _searchDB(searchObj) {
    let resolve, reject;
    const storyResults = /**@type {String[]}*/ [];
    const tsQuery = this._convertSearchObjToSQL(searchObj);
    const quotedArray = /**@type {String[]}*/ searchObj.terms.filter(term => term.quoted).map(term => `%${term.term}%`);
    const promise = new bluebird((res, rej) => {
      resolve = res;
      reject = rej;
    });
  
    this.parrot.log(`Converted user query: ${searchObj.query} to ${tsQuery}`);
    
    pg.connect(this.dbConn, (err, client, done) => {
      if(err) {
        done();
        return reject(err);
      }
      
      client.query(`SELECT id,title FROM (SELECT * FROM stories WHERE stories.tsv @@ to_tsquery($1)) as stories WHERE stories.story LIKE ALL($2) LIMIT 50`, [tsQuery, quotedArray], (err, res) => {
        done();
        if(err) return reject(err);
        
        if(res.rowCount === 0) return resolve([]);
        
        res.rows.forEach(row => storyResults.push(row));
        
        resolve(storyResults);
      });
    });
    
    return promise;
  }
  
  /**
   * Converts SearchObj to proper format for sql statement
   * @param {SearchObj} searchObj
   * @private
   */
  _convertSearchObjToSQL(searchObj) {
    const and = [];
    const not = [];
    let tsQuery = '';
    
    searchObj.terms.forEach(term => {
      if(term.term.length === 0) return;
      if(term.quoted && !term.negated) return and.push(`'${term.term}'`);
      if(term.quoted && term.negated) return not.push(`'${term.term}'`);
      if(term.negated) return not.push(term.term);
      
      and.push(term.term);
    });
    
    if(and.length !== 0) tsQuery += `${ and.join(' & ') } `;
    if(not.length !== 0) tsQuery += `${tsQuery.length != 0 ? '& ! ' : '!'} ${ not.join(' & ! ') }`;
    
    return tsQuery;
  }
}

module.exports = StorySearcher;

/**
 @typedef {Object} SearchTerm
 @property {String} term
 @property {Boolean} quoted
 @property {Boolean} negated
 */

/**
 * @typedef {Object} SearchObj
 * @property {String} query
 * @property {Array<SearchTerm>} terms
 * @property {Number} index
 */