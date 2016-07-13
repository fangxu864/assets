/**
 * Author: huangzhiyang
 * Date: 2016/6/17 16:42
 * Description: ""
 */
var env = require("../../getNodeENV.js");
var path = require("path");
var plugins = require("../../getPlugins")(env);
var config = require("../../config")({
	entry : {
		"annual_card_publish_prod_info" : "./src/annual_card/page/publish_prod_info/index.js",
		"annual_card_publish_package_info" : "./src/annual_card/page/publish_package_info/index.js",
		"annual_card_entry_card" : "./src/annual_card/page/entry_card/index.js",
		"annual_card_makeorder" : "./src/annual_card/page/makeorder/index.js",
		"annual_card_buy_dialog" : "./src/annual_card/page/yorderlist/buy.dialog.js",
		"annual_card_storage" : "./src/annual_card/page/storage/index.js",
		"annual_card_ordersuccess" : "./src/annual_card/page/ordersuccess/index.js",
		"annual_card_active" : "./src/annual_card/page/active/index.js",
		"annual_memdetail" : "./src/annual_card/page/memdetail/index.js",
		"annual_card_mclist" : "./src/annual_card/page/mclist/index.js"
	},
	output : {
		path : path.join(__dirname, "../../build/"+env+"/"),
		filename: "js/[name]/all.js",
		publicPath : {
			local : "http://static.12301.local/assets/build/"+env+"/",
			test  : "http://static.12301.test/assets/build/"+env+"/",
			dev   : "http://static.12301dev.com/assets/build/"+env+"/",
			prod  : "http://static.12301.cc/assets/build/"+env+"/"
		}[env]
	},
	plugins : plugins,
	watch : true
});
module.exports = config;