/**
 * Created by Administrator on 15-9-21.
 */
var path = require("path");
module.exports = {
	entry : [
//		'webpack/hot/only-dev-server',
		"./js/main_webpack.js"
	],
	output : {
		path : path.join(__dirname,"./js/build"),
		filename: "bundle.js"
	},
	watch : true
}