'use strict';

const axios = require('axios');

module.exports = {
  template: require('jade!./StoryTemplate.jade')(),
  
  data: () => ({
    text: ''
  }),
  
  route: {
    data: function() {
      const id = this.$route.params.id;
  
      axios.get('http://me:5001/api/story/' + id)
        .then(res => {
          const textArr = /**@type {String[]}*/ res.data.split('');
          let formattedText = '';
          let lastChar = '';
          
          //gets rid of line breaks but preserves paragraph breaks
          for(let char of textArr) {
            if(char === '\n') {
              if(lastChar === '\n') {
                formattedText += '\n\n';
                continue;
              }
              
              lastChar = char;
              formattedText += ' ';
              continue;
            }
            
            lastChar = char;
            formattedText += char;
          }
          
          this.text = formattedText;
        })
        .catch(err => console.error(err));
    }
  }
};