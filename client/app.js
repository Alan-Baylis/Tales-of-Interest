'use strict';

global.$ = global.jQuery = require('jquery');
require('./index.jade');
require('materialize-css/sass/materialize.scss');
require('materialize-css/dist/js/materialize.js');
require('./index.scss');

const vue = require('vue');
const vueRouter = require('vue-router');
const SearchComponent = require('./components/search/SearchComponent');
const StoryView = require('./views/story-view/StoryView');

vue.use(vueRouter);
const router = new vueRouter({history: true});

router.map({
  '/story/:id': {
    component: StoryView
  } 
});

router.start({
  components: {
    search: SearchComponent
  }
}, '#app');