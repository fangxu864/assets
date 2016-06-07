/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:12
 * Description: ""
 */
'use strict'
var PORT = "9090";
var ROOT_PATH = "./src";
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var entry = {
	"publish_card_prod_info" : ["./src/annual_card/page/publish_card_prod_info/index.js"],
	"publish_card_package_info" : ["./src/annual_card/page/publish_card_package_info/index.js"],
	"publish_card_entry_card" : ["./src/annual_card/page/publish_card_entry_card/index.js"],
	"publish_card_order_purchase" : ["./src/annual_card/page/publish_card_order_purchase/index.js"],
	"publish_card_fill_order" : ["./src/annual_card/page/publish_card_fill_order/index.js"],
	"publish_card_order_success" : ["./src/annual_card/page/publish_card_order_success/index.js"],
	"publish_card_member_details" : ["./src/annual_card/page/publish_card_member_details/index.js"],
	"publish_card_membercard_manage" : ["./src/annual_card/page/publish_card_membercard_manage/index.js"],
	"publish_card_activate" : ["./src/annual_card/page/publish_card_activate/index.js"],
	"publish_card_sell" : ["./src/annual_card/page/publish_card_sell/index.js"],
	"publish_card_stock_details" : ["./src/annual_card/page/publish_card_stock_details/index.js"]
};
for(var i in entry){
	var en = entry[i];
	en.unshift('webpack-dev-server/client?http://localhost:'+PORT, "webpack/hot/only-dev-server");
}

var config = require("./config")({
	entry : entry,
	output : {
		path : path.join(__dirname, "./build/"),
		filename: "assets/build/js/[name]/all.js",
		publicPath : "http://localhost:"+PORT
	},
	plugins : [
		new ExtractTextPlugin("assets/build/css/[name]/all.css"),
		new webpack.HotModuleReplacementPlugin()
	]
});

//启动服务
var app = new WebpackDevServer(webpack(config),{
	hot : false,
	historyApiFallback: true
});

//模拟后端数据
require("./src/annual_card/server_api")(app.app);

//监听端口
app.listen(PORT,"localhost",function(error){
	console.log(error);
});

