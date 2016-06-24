'use strict';

class Parrot {
  /**
   * @param {String} className
   */
  constructor(className) {
    this.className = className;
  }
  
  /**
   * @param {*} msg
   */
  log(msg) {
    const msgStr = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    console.log(`${new Date().toLocaleString()} - ${this.className} - ${msgStr}`);
  }
  
  /**
   * @param {*} msg
   */
  error(msg) {
    const msgStr = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    console.error(`${new Date().toLocaleString()} - ${this.className} - ${msgStr}`);
  }
}

module.exports = Parrot;