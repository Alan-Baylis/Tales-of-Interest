'use strict';

global.$ = global.jQuery = require('jquery');
require('./index.jade');
require('materialize-css/sass/materialize.scss');
require('materialize-css/dist/js/materialize.js');
require('./index.scss');

const vue = require('vue');
const SearchComponent = require('./components/search/SearchComponent.js');

new vue({
  el: '#app',
  components: {
    'search': SearchComponent
  }
});