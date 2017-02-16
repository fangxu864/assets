const webpack = require('atool-build/lib/webpack');
const path = require("path");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = function(webpackConfig, env) {
  webpackConfig.babel.plugins.push('transform-runtime');

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = '#eval';
    webpackConfig.babel.plugins.push('dva-hmr');
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }

  // Don't extract common.js and common.css
  webpackConfig.plugins = webpackConfig.plugins.filter(function(plugin) {
    return !(plugin instanceof webpack.optimize.CommonsChunkPlugin);
  });

  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.less$/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.less$/;
    }
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.css$/;
    }
    if (loader.test.toString() === '/\\.module\\.css$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.css$/;
    }
  });

    webpackConfig["externals"] = {
        "react": "React",
        "dva" : "dva"
    }

    webpackConfig["resolve"] = webpackConfig["resolve"] || {};
    let alias = webpackConfig["resolve"]["alias"] = webpackConfig["resolve"]["alias"] || {};
    alias["COMPONENTS"] = path.resolve("./src/components");

    webpackConfig.module.loaders.push({
        test : /\.sass|scss$/,
        //loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!autoprefixer!sass")
        loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!sass")
    })

    return webpackConfig;
};
