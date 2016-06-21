/**
 * Created by Administrator on 15-11-17.
 */
var path = require("path");
module.exports = {
	entry : "./js/main.js",
	output : {
		path: path.join(__dirname, "./js/build"),
		filename: "yorderlist.all.6.0.2.js"
	},
	watch : true,
	devtool : "source-map"
}