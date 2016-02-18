'use strict';

//require('./index.jade');
const angular = /**@type {angular}*/ require('angular');

//my code
require(__dirname + '/index.jade');

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