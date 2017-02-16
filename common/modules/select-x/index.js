/**
 * Author: huangzhiyang
 * Date: 2016/9/19 15:49
 * Description: ""
 */
var Masker = require("./lib/masker");


var Select = PFT.Util.Class({
	init : function(){
		this.masker = Masker();
	}
});


var s = new Select({
	placeholder : "请输入搜索",
	source : "",
	ajaxType : "get",
	ajaxParams : {
		page : 1,
		pageSize : 15,
		keyword : "1212"
	},
	trigger : "#tirggerId",
	options : [{
		id : 12,
		text : "text"
	}],
	filter : true, // false  function(){}
	filterType : "cache" // ajax
});