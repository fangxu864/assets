//webpack构建时，通过判断传入的参数(-local / -test / -dev / -p)执行不同的打包方式
//-local:本地开发
//-test :内网测试
//-dev  :预生产环境
//-p    :生产环境
var ROOT_PATH = "./src";
var webpack = require("webpack");
var fs = require("fs");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require("precss");
var autoprefixer = require("autoprefixer");
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

//动态获取入口文件
var getEntry = function(project_name){
	var root = ROOT_PATH;
	var dir = project_name ? path.join(root,project_name) : root;
	var json = {};
	function _test(dir){
		try{
			var result = fs.readdirSync(dir);
			var js_len = result.filter(function(file){
				return file=="js";
			}).length;
			if(js_len>0){
				var index_path = path.join(dir,"js/index.js");
				var index_exits = fs.statSync(index_path).isFile();
				if(index_exits){
					json[dir.substr(4)] = "./"+index_path;
				}else{
					console.log("不存在js目录");
				}
			}else{
				result.forEach(function(file){
					_test(path.join(dir,file));
				})
			}
		}catch(e){
			console.log(e);
		}
	}
	_test(dir);
	return json;
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
	if(Params.env=="prod" || Params.env=="dev"){
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
			test : /\.sass|scss$/,
			loader : ExtractTextPlugin.extract("style", "css?sourceMap!cssnext!postcss!sass")
		},{
			test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			loader : 'file-loader'
		},
//		{
//			test: /\.js$/,
//			exclude: /node_modules/,
//			loader: 'babel'
//		},
		{
			test: /\.(png|jpe?g|gif)$/,
			loader: 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
		}]
	},
	postcss: function () {
		return [precss, autoprefixer];
	},
//	babel: {
//		presets: ['es2015', 'stage-0'],
//		plugins: ['transform-runtime']
//	},
	plugins : Plugins,
	resolve : {
		alias : {
			COMMON : path.resolve("./common"),
			NODE_MODULES : path.resolve("./node_modules")
		}
	},
	devtool : "#source-map"
};