'use strict';

const HISTORY_SIZE = 10;

class StoryHistory {
  constructor() {
    this.histArr = /**@type {Array<historyItem>}*/ window.localStorage.getItem('history') || [];
  }

  /**
   * Adds item to beginning of histArr
   * @param {historyItem} historyItem
   */
  addItem(historyItem) {
    this.histArr.unshift(historyItem);
    if(this.histArr.length > HISTORY_SIZE) this.histArr.pop();
  }
}

let historyObj;
module.exports = function() {
  if(historyObj) return historyObj;
  else return historyObj = new StoryHistory();
};

/**
 @typedef {Object} historyItem
 @property {String} path
 @property {String} subject
*/