/* eslint-disable no-var, strict */
process.env.NODE_ENV = 'production';

var webpack = require('webpack');
var config = require('./webpack.config.production.js');
var bundler = webpack(config);
bundler.run(function (err, stats) {
  console.log(stats.toString(config.stats));
});
