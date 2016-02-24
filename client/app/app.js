'use strict';

const angular = /**@type {angular}*/ require('angular');
const app = angular.module('toi', ['ngRoute']);
const mainCtrl = require(__dirname + '/views/main/main-ctrl')(app);
require(__dirname + '/directives/history-panel/history-panel-dir')(app);
require(__dirname + '/directives/search-panel/search-panel-dir')(app);
require(__dirname + '/index.jade');
require(__dirname + '/index.scss');


app.config(($locationProvider, $routeProvider) => {
    $routeProvider
      .when('/', mainCtrl)
      .otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
  });