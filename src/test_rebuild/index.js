/**
 * Author: huangzhiyang
 * Date: 2016/7/7 15:39
 * Description: ""
 */
var Select = require("COMMON/Components/Select/v0.2");
var FilterSelect = require("COMMON/Components/Select/v0.2/plugins/filter");
var AjaxSelect = require("COMMON/Components/Select/v0.2/plugins/ajax");
var s = new Select({
	triggerElem : $("#triggerInp"),
	options : function(){
		var to = 30;
		var data = [];
		for(var i=1; i<to; i++){
			var json = {}
			json[i] = "选项"+i;
			data.push(json);
		}
		return data;
	},
	plugins : [{
		//加入ajax功能
		ajax : function(host){
			return new AjaxSelect(host)
		}
	}]
});






