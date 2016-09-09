/**
 * Author: huangzhiyang
 * Date: 2016/9/8 19:14
 * Description: ""
 */
var webpack = require("webpack");
var path = require("path");
module.exports = {
	entry : {
		"react_vendor" : [
			//'superagent',
			'isomorphic-fetch',
			'react',
			'react-dom',
			'react-redux',
			'react-router',
			'redux',
			'redux-promise-middleware',
			'redux-thunk'
		]
	},
	output: {
		//path: path.join(__dirname,"..","build/lib"),
		path: __dirname,
		filename: '[name].js',
		library: '[name]_library'
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]_library',
			//context: path.join(__dirname,"..","build/lib"),
			context: __dirname,
			path: path.join(__dirname, '[name]-manifest.json')
		})
	]
}