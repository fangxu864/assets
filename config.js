var autoprefixer = require("autoprefixer");
var precss = require("precss");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");
module.exports = function(opt){
	var entry = opt.entry;
	var output = opt.output;
	var plugins = opt.plugins;
	return {
		debug : true,
		entry : entry,
		output : output,
		module : {
			loaders : [{
				test : /\.html|tpl|xtpl$/,loader : "html?-minimize"
			},{
				test : /\.css$/,
				loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss")
			},{
				test : /\.sass|scss$/,
				loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!sass")
			},{
				test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,loader : 'file-loader'
			},{
				test : /\.(png|jpe?g|gif)$/,loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
			}]
		},
		postcss : function(){
			return [precss, autoprefixer];
		},
		//	babel: {
		//		presets: ['es2015', 'stage-0'],
		//		plugins: ['transform-runtime']
		//	},
		plugins : plugins,
		resolve : {
			alias : {
				COMMON : path.resolve("./common"),
				NODE_MODULES : path.resolve("./node_modules")
			}
		},
		devtool : "#source-map"
	};
}