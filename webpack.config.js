'use strict';

module.exports = {
  context: __dirname + '/client',
  entry: './index.js',
  output: {
    path: __dirname + '/public',
    filename: 'require.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'},
      { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$|\.woff2$/, loader: 'file?name=[name].[ext]' },
      {test: /\.jade/, loader: 'file?name=[name].html!jade-html?pretty'}
    ]
  },
  jadeLoader: {
    pretty: true,
    basedir: '/'
  }
};