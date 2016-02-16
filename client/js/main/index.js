'use strict';

const angular = /**@type {angular}*/ require('angular');
console.log('required');
const mainCtrl = require('./main-ctrl');

angular
  .module('main', [])
  .controller('mainCtrl', mainCtrl);