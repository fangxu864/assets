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


var http = require("http");
//var querystring = require("querystring");
//var postData = querystring.stringify({
//	'msg' : 'Hello World!'
//});
//var options = {
//	hostname: 'www.google.com',
//	port: 80,
//	path: '/upload',
//	method: 'POST',
//	headers: {
//		'Content-Type': 'application/x-www-form-urlencoded',
//		'Content-Length': postData.length
//	}
//};
//var req = http.request(options, function(res) {
//	console.log('STATUS: ' + res.statusCode);
//	console.log('HEADERS: ' + JSON.stringify(res.headers));
//	res.setEncoding('utf8');
//	res.on('data', function (chunk) {
//		console.log('BODY: ' + chunk);
//	});
//});
//
//req.on('error', function(e) {
//	console.log('problem with request: ' + e.message);
//});


function query(){
	return new Promise(function(resolve,reject){
		http.request({
			hostname: '123624.12301.cc',
			path: '/r/Mall_Product/getTypeList/',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		},function(res){
			if(res.code==200){
				resolve(res);
			}else{
				reject(res);
			}
		})
	})
}

//let res = query().then(function(data){
//	console.log(data);
//}).catch(function(data){
//	console.log(data);
//})


var promisify = function promisify(fn, receiver) {
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return new Promise(function (resolve, reject) {
			fn.apply(receiver, [].concat(args, [function (err, res) {
				return err ? reject(err) : resolve(res);
			}]));
		});
	};
};


readFile("file.json","utf-8",function(err,data){

})


var fs = require('fs');
var readFilePromise = promisify(fs.readFile, fs); //包装为 Promise 接口
readFilePromise('package.json', 'utf8').then(function(content){
	console.log(content);
	//正常情况
}).catch(function(err){
	//异常情况
	console.log(err);
})