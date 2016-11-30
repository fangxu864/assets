/**
 * Author: huangzhiyang
 * Date: 2016/7/7 15:39
 * Description: ""
 */
var Select = require("COMMON/Components/Select/v0.2");

var s = new Select({
	triggerElem:$("#triggerInp"),
	options : function(){
		var data = [];
		for(var i=0; i<20; i++){
			var json = {};
			json[i*1+1] = "选项"+(i*1+1);
			data.push(json)
		}
		return data;
	}
});


