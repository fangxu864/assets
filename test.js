/**
 * Author: huangzhiyang
 * Date: 16-5-17 下午5:19
 * Description: ""
 */
var fs = require("fs");
var path = require("path");
var yargs = require("yargs");
function travel(dir, callback) {
	try{
		fs.readdirSync(dir).forEach(function (file) {
			var pathname = path.join(dir, file);
			if (fs.statSync(pathname).isDirectory()) {
				travel(pathname, callback);
			} else {
				callback && callback(pathname);
			}
		});
	}catch(e){
		console.log(e);
	}
}

function test(project_name){
	var root = "./src";
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
					json[dir.substr(4)] = index_path;
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
}


var Deferred = require('./common/js/util.promise.js');

function asyncJob1(param, isOk) {
	var defer = Deferred();
	//setTimeout(function () {
	var result = param + ' with job1';
	if (isOk) {
		defer.resolve(result);
	} else {
		defer.reject('job1 fail');
	}
	//}, 100);
	return defer.promise;
}

function asyncJob2(param, isOk) {
	var defer = Deferred();
	//setTimeout(function () {
	var result = param + ' with job2';
	if (isOk) {
		defer.resolve(result);
	} else {
		defer.reject('job2 fail');
	}
	//}, 100);
	return defer.promise;
}

