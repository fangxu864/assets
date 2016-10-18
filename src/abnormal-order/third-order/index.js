/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:14
 * Description: ""
 */
require('./index.scss');
var Search = require("./search");
var List = require("./list");
var Main = PFT.Util.Class({
	container : "#pageRightArea",
	init : function(){

		var search = new Search();
		var list = new List(search);

		search.on("search",function(params){
			list.fetchList(params);
		})

		$("#searchBtn").trigger("click");

	}
});

$(function(){
	new Main();
})
