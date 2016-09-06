var vue = require("vue-loader");
var autoprefixer = require("autoprefixer");
var precss = require("precss");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");
var env = require("./getNodeENV");
module.exports = function(opt){
	var entry = opt.entry;
	var output = opt.output;
	var plugins = opt.plugins;
	var config = {
		debug : true,
		entry : entry,
		output : output,
		module : {
			loaders : [{
				test : /\.html|tpl|xtpl$/,
				loader : "html?-minimize"
			},{
				test : /\.css$/,
				//loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!autoprefixer")
				loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss")
			},{
				test : /\.sass|scss$/,
				//loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!autoprefixer!sass")
				loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss!sass")
			},{
				test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,loader : 'file-loader'
			},{
				test : /\.(png|jpe?g|gif)$/,loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
			},{
				test: /\.vue$/,
				loader: "vue"
			},{
				test: /\.es6$/,
				loader: 'babel',
				exclude: /node_modules/
			},{
				test: /\.json$/,
				loader: 'json'
			},{
				test: /\.jsx$/,
				loader: 'babel-loader',
				query:{
					plugins:['transform-runtime'],
					presets:['es2015','stage-0','react']
				},
				exclude: /node_modules/
			}]
		},
		vue : {
			loaders : {
				css: ExtractTextPlugin.extract("css"),
				sass: ExtractTextPlugin.extract("css!sass")
			}
		},
		postcss : function(){
			return [precss, autoprefixer];
			//return [autoprefixer()];
		},
		plugins : plugins,
		externals: [{
			'react': {
				root: 'React',
				commonjs2: 'react',
				commonjs: 'react'
			}
		},{
			'react-dom': {
				root: 'ReactDOM',
				commonjs2: 'react-dom',
				commonjs: 'react-dom'
			}
		}],
		resolve : {
			alias : {
				COMMON : path.resolve("./common"),
				CSS_CORE : path.resolve("./common/css/base/core"),
				CSS_MIXIN : path.resolve("./common/css/base/mixin"),
				COMMON_VUE_COMPONENTS : path.resolve("./src_mobile/Components"),
				COMMON_VUE_COMPONENTS_B : path.resolve("./src_mobile/B/Components"),
				COMMON_VUE_COMPONENTS_C : path.resolve("./src_mobile/C/Components"),
				SERVICE_M : path.resolve("./src_mobile/Service"),
				VUX_COMPONENTS : path.resolve("./node_modules/vux/src/components"),
				NODE_MODULES : path.resolve("./node_modules")
			}
		},
		devtool : "#source-map"
	};

	// if(env=="local") config["watch"] = true;


	return config;

}