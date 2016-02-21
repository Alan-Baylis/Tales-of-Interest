'use strict';

require(__dirname + '/history-panel.scss');
require(__dirname + '/history-panel.jade');
const storyHistory = /**@type {StoryHistory}*/ require('../../lib/story-history')();
const $ = require('jquery');

/**
 * @param {angular.IModule} app
 */
module.exports = function(app) {
  app.directive('historyPanelDir', historyPanelDir);

  function historyPanelDir() {
    return {
      templateUrl: '/history-panel.html',
      link: function(scope) {
        scope.historyItems = storyHistory.histArr;

        scope.link = function(path) {
          console.log(path);
        };

        for(let x = 0; x < 15; x++) {
          storyHistory.addItem({
            path: '/' + x,
            subject: 'story ' + x
          });
        }
      }
    };
  }
};