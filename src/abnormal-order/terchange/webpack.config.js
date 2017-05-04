/**
 * Created by Administrator on 15-11-17.
 */
var path = require("path");
module.exports = {
	entry : {
		"terchange" : "./js/main.js"
	},
	output : {
		path: path.join(__dirname, "./js/build"),
		filename: "[name].all.js"
	},
	watch : true,
	devtool : "source-map"
}