## 如何开始一个新项目

1) 移动端项目请在scr_mobile下新建文件夹，pc端项目请在src下新建文件夹。 文件夹名统一为项目名称
   避免用驼峰或"_"写法，请统一用中横线"-"，如：my-new-project

2) 项目目录划分统一按照如下方式：

   my-new-project (简单的项目) 
   		|
   		|--index.js           项目的入口文件
   		|
   		|--index.scss         css文件，在index.js中第一行引入：require("./index.scss")
   		|
   		|--index.xtpl         模板文件，在index.js中引入：var Tpl = require("./index.xtpl") 非必须，根据项目需求而定
   		|
   		|--webpack.config.js  此项目打包时webpack的配置文件

   		
   	my-new-project (如果此项目比较大，则建议按照模块化方式来写)
   	    |
   	    |--index.js            项目的主入口文件
   	    |
   	    |--index.scss          主样式文件
   	    |
   	    |--sub-entry.js        可以是另一模块入口文件
   	    |
   	    |--module-name         子模块(文件夹)  在主入口文件index.js中引入此模块：var ModuleName = require("./module-name");
   	    |      |
   	    |      |--index.js     子模块入口文件
   	    |      |
   	    |      |--index.scss   子模块css样式
   	    |      |
   	    |      |--index.xtpl   子模块模板文件
   	    |      
   	    |
   	    |--webpack.config.js   此项目打包时webpack的配置文件

3) 配置项目根目录下，webpack.config.js
   
   建议从其它项目copy一份，然后修改其中的入口entry字段即可

   webpack.config.js配置说明：

    //webpack.congif.js
    var env = require("../../task-webpack/getNodeENV");    
	var path = require("path");
	var plugins = require("../../task-webpack/getPlugins")(env);
	var output = require("../../task-webpack/getOutput")(env);
	var config = require("../../task-webpack/config")({
		entry : {
			// 只要修改此处配置即可
			// entry键值对形式，键名用来指定webpack build后生成的文件名
			// 如此处，build后最终生成的文件名为：dealsummary.all.js  dealsummary.all.css
			// 键值即为此项目的主入口文件的路径
			"dealsummary" : "./src/deal_summary/index.js"   
		},
		output : output,
		plugins : plugins
	});
	module.exports = config;

4) 在assets根目录下的package.json中scripts字段中，添加webpack build时的命令行脚本：

   xxx-为项目名

   构建到本地开发环境：
   npm run xxx-start: "set NODE_ENV=develop && webpack --color --progress --watch --config ./src/my-new-project/webpack.config.js"

   构建到内网测试环境:
   npm run xxx-test: "set NODE_ENV=test && webpack --color --progress --config ./src/my-new-project/webpack.config.js"

   构建到预生产环境:
   npm run xxx-release: "set NODE_ENV=release && webpack --color --progress --config ./src/my-new-project/webpack.config.js"

   构建到生产环境:
   npm run xxx-production: "set NODE_ENV=production && webpack --color --progress --config ./src/my-new-project/webpack.config.js"


   构建完后会自动在build目录的相应环境目录下生成一个xxx.all.js及xxx.all.css文件

   如：

   命令行运行npm run xxx-start后，会在build/local/js下生成一个xxx.all.js，在build/local/css下生成一个xxx.all.css

   命令行运行npm run xxx-test后，会在build/test/js下生成一个xxx.all.js，在build/test/css下生成一个xxx.all.css

   命令行运行npm run xxx-release后，会在build/release/js下生成一个xxx.all.js，在build/release/css下生成一个xxx.all.css

   命令行运行npm run xxx-production后，会在build/production/js下生成一个xxx.all.js，在build/production/css下生成一个xxx.all.css


   
