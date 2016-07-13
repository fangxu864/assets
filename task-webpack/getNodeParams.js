/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:25
 * Description: ""
 */
//webpack构建时，通过判断传入的参数(-local / -test / -dev / -p)执行不同的打包方式
//-local:本地开发
//-test :内网测试
//-dev  :预生产环境
//-p    :生产环境
module.exports = function(){
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
};