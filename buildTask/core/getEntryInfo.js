/**
 * @author huangzhiyang 348845730@qq.com
 * @date   2017-04-01
 * 
 * 获取webpack entry入口信息
 * 
 * @return object
 * object[filename] 入口文件名
 * object[path]     入口文件所在目录
 * object[fullPath] 入口文件的完整路径
 * 
 * 
 */



var fs = require("fs");
var Path = require("path");
var Root = require("../../rootDir.js")();
var Argvs = require("./getArgv")();
module.exports = function(){
    var entryPath = Argvs[0]; //入口文件路径
    var outputPath = Argvs[1]; //output文件路径
    if(!fs.existsSync(entryPath)) return console.error("entry file unexists");
    var result = {
        filename : "",
        path : "",
        relativePath : "",
        fullPath : ""
    };
    var path = entryPath.split("/").filter(function(item,index){
        if(item!=="." && item!=="") return true;
    });
    var entry = path[path.length-1];
    //如果命令行里有指定入口文件
    //如：./src-pc/myproject-name/index.js 或 ./src-pc/myproject-name/index_new.js
    if(entry.indexOf(".js")>0 || entry.indexOf(".es6")){ 
        result.filename = entry;
        result.relativePath = entryPath.replace(/(.*)(\/.*\.js|es6)/g,function($0,$1,$2){return $1});
        result.path = Path.join(Root,result.relativePath);
        result.fullPath = Path.join(Root,entryPath);
    }else{ //如果没传，则默认取index.js，如：./src-pc/myproject-name  => 默认取index.js为入口文件
        result.filename = "index.js";
        result.relativePath = entryPath;
        result.path = Path.join(Root,entryPath);
        result.fullPath = Path.join(Root,entryPath,"index.js");
    }
    return result;
}
