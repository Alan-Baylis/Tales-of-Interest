'use strict';

const bluebird = /**@type {Promise}*/ require('bluebird');
const pg = require('pg');

class StorySearcher {
  /**
   * @param {String} dbConn 
   */
  constructor(dbConn) {
    this.dbConn = dbConn;
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
      .replace(/[^A-Za-z0-9\s"+-]/, '')
      .replace(/\s{2,}/, ' ')
      .split('')
      .forEach(char => {
        if(!currTerm) {
          currTerm = /**@type {SearchTerm}*/ {term: ''};
        
          if(char === '+') currTerm.required = true;
          else if(char === '"') currTerm.quoted = true;
          else if(char === '-') currTerm.negated = true;
          else if(char === ' ') return;
          else currTerm.term += char;
        
          return terms.push(currTerm);
        }
      
        if(char === '+' || char === '-') return;
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
    const promise = new bluebird((res, rej) => {
      resolve = res;
      reject = rej;
    });
    
    pg.connect(this.dbConn, (err, client, done) => {
      if(err) {
        done();
        return reject(err);
      }
      
      const storyResults = /**@type {String[]}*/ [];
      const tsQuery = this._convertSearchObjToSQL(searchObj);
      console.log(`Converted user query: ${searchObj.query} to ${tsQuery}`);
      
      client.query('SELECT id,title FROM stories WHERE stories.tsv @@ to_tsquery($1) LIMIT 50', [tsQuery], (err, res) => {
        if(err) {
          done();
          return reject(err);
        }
        done();
        
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
    const or = [];
    const not = [];
    let tsQuery = '';
    
    searchObj.terms.forEach(term => {
      if(term.term.length === 0) return;
      if(term.quoted) return;
      if(term.required) return and.push(term.term);
      if(term.negated) return not.push(term.term);
      
      or.push(term.term);
    });
    
    if(or.length !== 0) tsQuery += `(${ or.join(' | ') }) `;
    if(and.length !== 0) tsQuery += `${tsQuery.length != 0 ? '& ' : ''} ${ and.join(' & ') } `;
    if(not.length !== 0) tsQuery += `${tsQuery.length != 0 ? '& ! ' : '!'} ${ not.join(' & ! ') }`;
    
    return tsQuery;
  }
}

module.exports = StorySearcher;

/**
 @typedef {Object} SearchTerm
 @property {String} term
 @property {Boolean} quoted
 @property {Boolean} required
 @property {Boolean} negated
 */

/**
 * @typedef {Object} SearchObj
 * @property {String} query
 * @property {Array<SearchTerm>} terms
 * @property {Number} index
 */