/**
 * Created by Administrator on 15-12-4.
 */
var path = require("path");
module.exports = {
	entry : {
		"distributor.manager" : "./js/distributor.manager.js"
	},
	output : {
		path: path.join(__dirname, "./js/build/v0.1"),
		filename: "[name].all.js"
	},
	watch : true
}