/**
 * Created by Administrator on 15-11-17.
 */
var path = require("path");
module.exports = {
	entry : "./index.js",
	output : {
		path: path.join(__dirname, "./js/build"),
		filename: "orderquery.all.2.1.js"
	},
	watch : true,
	devtool : "source-map"
}