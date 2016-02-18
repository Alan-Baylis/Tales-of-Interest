'use strict';

//Libraries
global.jQuery = global.$ = require('jquery');
require('angular');
require('angular-route');
require('bootstrap-sass/assets/javascripts/bootstrap.min.js');

//Styles
require('bootswatch/superhero/bootstrap.css');

//my code
require(__dirname + '/app/app.js');