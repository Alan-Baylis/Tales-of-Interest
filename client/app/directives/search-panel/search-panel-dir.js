'use strict';

require(__dirname + '/../common.scss');
require(__dirname + '/search-panel.jade');
const storyHistory = /**@type {StoryHistory}*/ require('../../services/story-history')();

/**
 * @param {angular.IModule} app
 */
module.exports = function(app) {
  app.directive('searchPanelDir', searchPanelDir);

  function searchPanelDir() {
    return {
      templateUrl: './search-panel.html',
      link: function() {

      }
    }
  }
};