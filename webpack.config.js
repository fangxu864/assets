//webpack构建时，通过判断传入的参数(-local / -test / -dev / -p)执行不同的打包方式
//-local:本地开发
//-test :内网测试
//-dev  :预生产环境
//-p    :生产环境
var ENV = (function(){
	var argv = process.argv;
	var pro = argv[argv.length-1];
	pro = pro.replace("-",""); //pro=local,test,dev,p
	var EXT = {  //build后的文件名后缀
		local : "local",  //本地开发环境使用
		test  : "test",   //内网测试环境使用
		dev   : "dev",    //预发布环境使用
		prod  : "prod",   //生产环境使用
		p     : "prod"    //生产环境使用
	}[pro] || "default";
	console.log("webpack run "+EXT);
	return EXT;
})();
var fs = require("fs");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//动态获取入口文件
var getEntry = function(){
	var srcDir = "./src/";
	var dirs = fs.readdirSync(srcDir);
	var files = {};
	dirs.forEach(function(project_name){
		var js = fs.readdirSync(srcDir+project_name+"/js");
		if(!js || js.length==0) return;
		var main_file_path = srcDir+project_name+"/js/main.js";
		if(fs.readFileSync(main_file_path)){
			files[project_name] = main_file_path;
		}
	});
	return files;
}
//入口文件配置
var entry = getEntry();
//输出目录配置
var output = (function(){
	var output = {
		path : path.join(__dirname, "./build/"+ENV),
		filename: "js/[name].all.js"
	};
	var host = {
		local : "http://static.12301.local/assets/build/local",
		test  : "http://static.12301.test/assets/build",
		dev   : "http://static.12301dev.com/assets/build",
		prod  : "http://static.12301.cc/assets/build"
	}[ENV];
	output["publicPath"] = host;
	return output;
})();
//插件配置
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
		var filename = config.filename ? config.filename : (dirname+i+".html");
		var template = config.template ? config.template : "";
		opt["filename"] = filename;
		opt["chunks"] = [i];
		opt["hash"] = true;
		if(template) opt["template"] = template;
		plugins.push(new HtmlWebpackPlugin(opt));
	}

	plugins.push(new ExtractTextPlugin("css/[name].all.css"));

	return plugins;
})();


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
		},{
			test: /\.(png|jpe?g|gif)$/,
			loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
		}]
	},
	plugins : Plugins,
	resolve : {
		alias : {
			COMMON : path.resolve("./common")
		}
	},
	devtool : "#source-map"
};