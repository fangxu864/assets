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
//npm run server :                 server整个项目内的所有模块(模块多时启动会耗时一会)
//npm run server my_project_name : server整个项目内的指定模块(my_project_name为要server的模块名)


var entry = {
	"publish_card_prod_info" : ["./src/annual_card/page/publish_card_prod_info/index.js"],
	"publish_card_package_info" : ["./src/annual_card/page/publish_card_package_info/index.js"],
	"publish_card_entry_card" : ["./src/annual_card/page/publish_card_entry_card/index.js"],
	"publish_card_order_purchase" : ["./src/annual_card/page/publish_card_order_purchase/index.js"],
	"publish_card_fill_order" : ["./src/annual_card/page/publish_card_fill_order/index.js"],
	"publish_card_order_success" : ["./src/annual_card/page/publish_card_order_success/index.js"],
	"publish_card_member_details" : ["./src/annual_card/page/publish_card_member_details/index.js"]
};
for(var i in entry){
	var en = entry[i];
	en.unshift('webpack-dev-server/client?http://localhost:'+PORT, "webpack/hot/dev-server");
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
	//,proxy : [{
	//	path: "/r/*",
	//	target: "http://www.12301.local",
	//	host: "www.12301.local"
	//}]
});
var Http = app.app;
var ceateRespones = function(code,data,msg){
	var code = code || 0;
	var data = data || {};
	var msg = msg || "";
	return JSON.stringify({
		code : code,
		data : data,
		msg : msg
	})
}

//图片上传
Http.post("/upload",function(req,res){
	var result = JSON.stringify({
		code : 200,
		data : {
			src : "https://sfault-image.b0.upaiyun.com/847/123/847123006-573551703f418_articlex"
		},
		msg : ""
	});
	setTimeout(function(){
		res.end('<script>var FileuploadCallbacks=window.parent.FileuploadCallbacks[1];for(var i in FileuploadCallbacks) FileuploadCallbacks[i]('+result+');</script>')
	},1000)
});
//保存提交数据
Http.post("/r/publish_prod_info/submit",function(req,res){
	setTimeout(function(){
		res.end(ceateRespones(200))
	},1000)
});

//发布产品-套餐页-获取产品内的套餐列表
Http.get("/r/publish_prod_package/fetch_list",function(req,res){
	setTimeout(function(){
		res.end(ceateRespones(200,{
			"1" : {
				"id" : "1",
				"name" : "测试套餐名111"
			},
			"2" : {
				"id" : "2",
				"name" : "测试套餐名222"
			},
			"3" : {
				"id" : "3",
				"name" : "测试套餐名333"
			}
		}))
	},1000)
})



app.listen(PORT,"localhost",function(error){
	console.log(error);
});