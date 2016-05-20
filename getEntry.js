/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:28
 * Description: ""
 */
var path = require("path");
var fs = require("fs");
module.exports = function(root,project_name){
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
					json[dir.substr(4)] = ["./"+index_path];
				}else{
					console.log("²»´æÔÚjsÄ¿Â¼");
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