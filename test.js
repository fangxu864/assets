/**
 * Author: huangzhiyang
 * Date: 16-5-17 下午5:19
 * Description: ""
 */
var fs = require("fs");
var path = require("path");
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

var url = require("url");
var http = require("http");
//http.get("http://www.baidu.com",function(res){
//	var body = [];
//	res.on("data",function(chunk){
//		body.push(chunk);
//	})
//	res.on("end",function(){
//		body = Buffer.concat(body);
//		console.log(body.toString())
//	})
//})

console.log(url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash'))


