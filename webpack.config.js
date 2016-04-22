var pro = process.title.split(" ");
console.log(pro);
pro = pro[pro.length-1];
var ENV = pro!=="-p" ? "dev" : "product";
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var entry = {
	//新注册页
	register : "./src/register/js/main.js",
	//个人设置页：基本信息->修改绑定的手机号
	modify_mobileBinded : "./src/register/modify_mobileBinded/modify_mobileBinded.js",
	terminal : "./src/terminal/js/main.js",
	yx_storage_normal : "./src/yx_storage_normal/js/main.js"
};
var MIN = ENV=="dev" ? "" : ".min";
var Plugins = (function(){
	var plugins = [];
	var HtmlTpl = {
		terminal : {
			template : "./src/terminal/view/index.html"
		}
	};

	for(var i in entry){
		var opt = {};
		var config = HtmlTpl[i] || {};
		var _i = i.substr(0,2);
		var dirname = _i=="wx_" ? "view/wx/" : "view/pc/";
		var filename = config.filename ? config.filename : (dirname+i+MIN+".html");
		var template = config.template ? config.template : "";
		opt["filename"] = filename;
		opt["chunks"] = [i];
		opt["hash"] = true;
		if(template) opt["template"] = template;
		plugins.push(new HtmlWebpackPlugin(opt));
	}
	return plugins;
})();
var output = {
	path : path.join(__dirname, "./build"),
//	publicPath : "<?=STATIC_URL?>/assets/build",
	filename: "js/[name].all"+MIN+".js"
};
Plugins.push(new ExtractTextPlugin("css/[name].all"+MIN+".css"));
module.exports = {
	entry : entry,
	output : output,
	module : {
		loaders: [{
			test: /\.html$/,
			loader: "html?-minimize"
		},{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!cssnext-loader")
		}
		,{
			test: /\.png$/,
			loader: "url-loader?limit=100000"
		}]
	},
	plugins : Plugins,
	resolve : {
		alias : {
			COMMON : path.resolve("./common")
		}
	},
	watch : true,
	devtool : "#source-map"
};