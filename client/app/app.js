'use strict';

require(__dirname + '/index.jade');
require(__dirname + '/index.scss');
const angular = /**@type {angular}*/ require('angular');
const app = angular.module('toi', ['ngRoute']);
const mainCtrl = require(__dirname + '/main/main-ctrl')(app);


app.config(($locationProvider, $routeProvider) => {
    $routeProvider
      .when('/', mainCtrl)
      .otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
  });