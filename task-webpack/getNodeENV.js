/**
 * Author: huangzhiyang
 * Date: 2016/6/27 10:20
 * Description: ""
 */
var env = process.env.NODE_ENV || "";
if(env.trim){
	env = env.trim(env);
}else{
	env = env.replace(/(^\s*)|(\s*$)/g,"");
}
var ENV_STR = {
	develop : "local",          //开发环境编译到/build/local
	production : "production",  //生产环境编译到/build/prodduction
	test : "test",              //测试环境编译到/build/test
	release : "release"         //预发布环境编译到/build/release
};
var _env = ENV_STR[env] || "error";
module.exports = _env;

