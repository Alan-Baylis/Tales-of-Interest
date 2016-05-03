'use strict';

const bluebird = /**@type {Promise}*/ require('bluebird');
const axios = require('axios');
const searchRequest = (term) => axios.post('http://me:5001/api/search', {term: term});

bluebird.config({
  cancellation: true
});

module.exports = {
  template: require('jade!./SearchTemplate.jade')(),
  
  data: () => ({
    search: '',
    searchResults: []
  }),
  
  computed: {
    showList: function() {
      return this.searchResults.length !== 0;
    }
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