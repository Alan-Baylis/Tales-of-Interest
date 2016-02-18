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
      {test: /\.scss$/, loader: `style!css!sass`},
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$|\.woff2$/, loader: 'file?name=[name].[ext]!url'},
      {test: /\.jade/, loader: 'file?name=[name].html!jade-html?pretty'}
    ]
  }
};