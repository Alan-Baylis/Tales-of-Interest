'use strict';

const Searcher = require('./Searcher');
require(__dirname + '/../common.scss');
require(__dirname + '/search-panel.jade');

/**
 * @param {angular.IModule} app
 */
module.exports = function(app) {
  app.directive('searchPanelDir', searchPanelDir);

  function searchPanelDir() {
    return {
      templateUrl: './search-panel.html',
      link: function(scope) {
        const results = /**@type {Array<String>}*/ [] ;
        const searcher = new Searcher(results);

        scope.$watch('search', searcher.onTermChange);
      }
    }
  }
};