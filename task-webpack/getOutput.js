/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:55
 * Description: ""
 */
var path = require("path");
module.exports = function(env){
	var output = {
		path : path.join(__dirname, "../build/"+env+"/"),
		filename: "js/[name].all.js"
	};
	var host = {
		local : "http://static.12301.local/assets/build/local/",
		test  : "http://static.12301.test/assets/build/",
		dev   : "http://static.12301dev.com/assets/build/",
		prod  : "http://static.12301.cc/assets/build/"
	}[env];
	output["publicPath"] = host;
	return output;
};