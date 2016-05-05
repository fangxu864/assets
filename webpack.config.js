//webpack构建时，通过判断传入的参数(-local / -test / -dev / -p)执行不同的打包方式
//-local:本地开发
//-test :内网测试
//-dev  :预生产环境
//-p    :生产环境
var webpack = require("webpack");
var Params = (function(){
	var argv = process.argv;
	var env = argv[argv.length-1];
	var project_name = "";
	if(env.indexOf("-")<0){ //如果命令行传入的最后一个参数不是带 "-" 说明最后一个参数是指定入口项目名
		project_name = argv[argv.length-1];
		env = argv[argv.length-2];
	}
	env = env.replace("-","");
	var EXT = {  //build后的文件名后缀
		local : "local",   //本地开发环境使用
		test  : "test",    //内网测试环境使用
		dev   : "dev",     //预发布环境使用
		myProduct  : "prod"      //生产环境使用
	}[env] || "default";
	console.log("project_name="+project_name);
	console.log("webpack run "+EXT);
	return{
		env : EXT,
		project_name : project_name
	};
})();
var ROOT_PATH = "./src";
var fs = require("fs");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require("precss");
var autoprefixer = require("autoprefixer");
//动态获取入口文件
var getEntry = function(project_name){
	var root = ROOT_PATH;
	var files = {};
	var dirs = fs.readdirSync(root);
	var read_project_main_file_path = function(project_name){
		//检查是否存在指定项目目录
		if(dirs.indexOf(project_name)<0) return "";
		//检查指定项目目录里是否存在js目录
		var project_iner_dirs = fs.readdirSync(root+"/"+project_name);
		if(project_iner_dirs.indexOf("js")<0) return "";
		var js_iner_dirs = fs.readdirSync(root+"/"+project_name+"/js");
		//检查js目录里是否存在index.js文件
		if(js_iner_dirs.indexOf("index.js")<0) return "";
		return root+"/"+project_name+"/js/index.js";
	};
	if(project_name){ //如果指定只编译某个项目
		var main_file_path = read_project_main_file_path(project_name);
		if(main_file_path) files[project_name] = main_file_path;
	}else{ //未指定编译某个项目则编译src下的所有项目
		dirs.forEach(function(project_name){
			var main_file_path = read_project_main_file_path(project_name);
			if(main_file_path) files[project_name] = main_file_path;
		});
	}
	return files;
};
//入口文件配置
var entry = getEntry(Params.project_name);
//输出目录配置
var output = (function(){
	var env = Params.env;
	var output = {
		path : path.join(__dirname, "./build/"+env+"/"),
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
})();
//插件配置
var Plugins = (function(){
	var plugins = [];
//	var HtmlTpl = {
//		terminal : {
//			template : "./src/terminal/view/index.html"
//		}
//	};
//	var rendViewConfig = function(project_name){
//		var viewDir = ""
//	};
//	for(var i in entry){
//		var opt = {};
//		var config = HtmlTpl[i] || {};
//		var _i = i.substr(0,2);
//		var dirname = _i=="wx_" ? "view/wx/" : "view/pc/";
//		var filename = config.filename ? config.filename : (dirname+i+".html");
//		var template = config.template ? config.template : "";
//		opt["filename"] = filename;
//		opt["chunks"] = [i];
//		opt["hash"] = true;
//		if(template) opt["template"] = template;
//		plugins.push(new HtmlWebpackPlugin(opt));
//	}

	plugins.push(new ExtractTextPlugin("css/[name].all.css"));
	//压缩js css
	if(Params.env=="prod"){
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings : false
			},
			sourceMap : false
		}))
	}

	return plugins;
})();


module.exports = {
	entry : entry,
	output : output,
	module : {
		loaders: [{
			test: /\.html|tpl$/,
			loader: "html?-minimize"
		},{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!cssnext-loader!postcss-loader")
		},{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel'
		},{
			test: /\.(png|jpe?g|gif)$/,
			loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
		}]
	},
	postcss: function () {
		return [precss, autoprefixer];
	},
	babel: {
		presets: ['es2015', 'stage-0'],
		plugins: ['transform-runtime']
	},
	plugins : Plugins,
	resolve : {
		alias : {
			COMMON : path.resolve("./common")
		}
	},
	devtool : "#source-map"
};