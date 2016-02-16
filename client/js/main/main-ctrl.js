'use strict';

/**
 * @param {angular.IModule} app
 */
module.exports = function(app) {
  app.controller('mainCtrl', mainCtrl);

  function mainCtrl($scope) {
    $scope.test = 'testers!';
  }
};