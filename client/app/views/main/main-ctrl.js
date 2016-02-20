'use strict';

require(__dirname + '/main.jade');

/**
 * @param {angular.IModule} app
 */
module.exports = function(app) {
  app.controller('mainCtrl', mainCtrl);

  function mainCtrl($scope) {
    $scope.test = 'So this works?';
  }

  return {
    controller: 'mainCtrl',
    templateUrl: 'main.html'
  }
};