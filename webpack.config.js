'use strict';

const path = require('path');

module.exports = {
  context: path.join(__dirname, 'client'),
  entry: './app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'require.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.scss$/, loader: `style!css!sass`},
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$|\.woff2$/, loader: 'file?name=[name].[ext]'},
      {test: /index.jade/, loader: 'file?name=[name].html!jade-html?pretty'}
    ]
  }
};