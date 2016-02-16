'use strict';

//Libraries
const angular = /**@type {angular}*/ require('angular');
require('angular-route');

//my code
require('./main');


angular
  .module('toi', ['ngRoute', 'main'])
  .config(($locationProvider, $routeProvider) => {
    $routeProvider
      .when('/', {
        controller: 'mainCtrl',
        templateUrl: './main/main.html'
      })
      .otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
  });