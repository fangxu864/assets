/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:44
 * Description: ""
 * 
 * 
 * 说明
 * 2017-03-21  huangzhiyang
 * 
 * 重新整理目录结构，主要解决package.json的scripts里，npm run 命名过多，
 * 每次要修改一个已做过的页面时都要找好久相应的npm run指令，现在assets的开发目录主要分3个：
 * 
 * src(旧的)、src-mobile(手机端项目)、src-pc(pc端项目).
 * 
 * >> 对于src下的旧项目，保持不变，npm run projectname-start
 * 
 * >> 对于要新开发的项目，统一按照下面规范进行:
 * 
 * [1] 要开发pc端项目，首先在src-pc新建项目文件夹，然后在src-pc目录下的webpack.config.js里增加相应的入口文件，
 *     然后命令行执行：
 * 		npm run start(开发时)、
 * 		npm run test(内网)、
 * 		npm run release(dev环境)、
 * 		npm run prodcution(生产环境)
 * 
 * 
 * [2] 要开发手机端项目，首先在src-mobile新建项目文件夹，然后在src-mobile目录下的webpack.config.js里增加相应的入口文件，
 *     然后命令行执行：
 * 		npm run start-m(开发时)、
 * 		npm run test-m(内网)、
 * 		npm run release-m(dev环境)、
 * 		npm run prodcution-m(生产环境) 
 * 
 * 
 * 注意：
 * 随着以后项目越来越多，webpack.config.js里 entry字段里的入口文件将会越来越多，
 * 此时如果你要编辑你的项目，建议先将其它项目的入口注释掉，否则编译速度将会极慢
 * 
 */
var env = require("../task-webpack/getNodeENV");
var path = require("path");
var plugins = require("../task-webpack/getPlugins")(env);
var output = require("../task-webpack/getOutput")(env);

var entry = {
	// 新版首页
	// "home.pc" : "./src-pc/home/index.js",


	// 新版产品预订-订单填写页-景区类产品
	"booking.pc.a" : "./src-pc/booking/index.a.js",

	// 新版产品预订-订单填写页-线路类产品
	"booking.pc.b" : "./src-pc/booking/index.b.js",



	// 新版首页 右边栏点击更多进去的二级列表页
	// "notice.list.pc" : "./src-pc/notice-list/index.js"
};




var config = require("../task-webpack/config")({
	entry :entry,
	output : output,
	plugins : plugins
});

module.exports = config;