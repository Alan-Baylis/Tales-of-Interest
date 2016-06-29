'use strict';

require('./SearchStyle.scss');
const bluebird = /**@type {Promise}*/ require('bluebird');
const axios = require('axios');
const searchRequest = (query) => axios.post('http://me:5001/api/search', {query: query});
const randStr = () => Math.random().toString(35).slice(-10);

bluebird.config({
  cancellation: true
});

module.exports = {
  template: require('jade!./SearchTemplate.jade')(),
  
  data: () => ({
    search: '',
    searchResults: [],
    menuButton: randStr(),
    slideId: randStr()
  }),
  
  computed: {
    showList: function() {
      return this.searchResults.length !== 0;
    }
  },
  
  ready: function() {
    $(`#${this.$data.menuButton}`).sideNav({closeOnClick: true});
  },
  
  watch: {
    search: function(val) {
      if(this.$data.promise) this.$data.promise.cancel();
  
      if(val === '') return this.$data.searchResults = [];
      
      this.$data.promise = bluebird.delay(500)
        .then(() => searchRequest(val))
        .then(res => {
          this.$data.searchResults = res.data;
        })
        .catch(err => console.error(err));
    }
  }
};