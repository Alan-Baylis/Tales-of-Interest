'use strict';

class Worker {
  constructor() {
    process.on('message', message => {
      if(message.paths) this.updateStoryPaths(message.paths);
      if(message.search) this.search(message.search);
    });
  }

  updateStoryPaths(storyPaths) {
    this.storyPaths = storyPaths;
  }

  /**
   * @param {String} term
   */
  search(term) {
    const terms = [];
    /**@type {?searchTerm}*/ let currTerm;

    term
      .replace(/[^A-Za-z0-9\s"+-]/, '')
      .replace(/\s{2,}/, ' ')
      .split('')
      .forEach(char => {
        if(!currTerm) {
          if(char === '+') currTerm = Worker.createSearchTerm('', false, true, false);
          else if(char === '"') currTerm = Worker.createSearchTerm('', true, false, false);
          else if(char === '-') currTerm = Worker.createSearchTerm('', false, false, true);
          else if(char !== ' ') currTerm = Worker.createSearchTerm(char, false, false, false);
          else if(char === ' ') return;

          return terms.push(currTerm);
        }

        if(char === '+' || char === '-') return;
        if(char === ' ' && !currTerm.quoted) return currTerm = null;
        if(char === '"' && currTerm.quoted) return currTerm = null;

        if(char === '"') {
          if(currTerm.term.length === 0) return currTerm.quoted = true;

          return currTerm = Worker.createSearchTerm('', true, false, false);
        }

        return currTerm.term += char;
      });

    console.log(terms);
  }

  static createSearchTerm(term, quoted, required, negated) {
    return {
      term: term,
      quoted: quoted,
      required: required,
      negated: negated
    };
  }
}

new Worker();

/**
 @typedef {Object} searchTerm
 @property {String} term
 @property {Boolean} quoted
 @property {Boolean} required
 @property {Boolean} negated

 */