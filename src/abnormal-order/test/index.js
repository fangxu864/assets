/**
 * Author: huangzhiyang
 * Date: 2016/9/20 18:34
 * Description: ""
 */
var Search = require("./search");




var List = require("./list");

Search.on("search",function(e){
	List.featch();
})

