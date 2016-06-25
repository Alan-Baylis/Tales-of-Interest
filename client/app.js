'use strict';

global.$ = global.jQuery = require('jquery');
require('./index.jade');
require('materialize-css/sass/materialize.scss');
require('materialize-css/dist/js/materialize.js');
require('./index.scss');

const vue = require('vue');
const vueRouter = require('vue-router');
const SearchComponent = require('./components/search/SearchComponent.js');

vue.use(vueRouter);
const router = new vueRouter();

router.start({
  components: {
    search: SearchComponent
  }
}, '#app');