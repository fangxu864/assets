/**
 * Author: huangzhiyang
 * Date: 2016/5/23 16:17
 * Description: ""
 */
var Ajax = require("COMMON/js/util.ajax.js");
var CityStore = Backbone.Model.extend({
	defaults : {
		location : {

		},
		allCityFlag : "",
		cityList : "",
		keyword : ""
	},
	initialize : function(){},
	fetchCity : function(){
		var that = this;
		var cityList = this.get("cityList");
		if(cityList || cityList=="loading") return false; //如果已经加载过了或正在加载
		Ajax("../api/v0.0.3/order.php",{
			type : "get",
			dataType : "json",
			params : {
				action : "area_list"
			},
			loading : function(){
				that.set("cityList","loading");
			},
			complete : function(){
				that.set("cityList","complete");
			},
			timeout : function(res){
				that.set("cityList","timeout");
			},
			serverError : function(res){
				that.set("cityList","serverError");
			},
			success : function(res){
				var code = res.code;
				var areas = res.areas;
				if(code==200){
					that.set("cityList",areas);
				}else{
					that.set("cityList","fail");
				}
			}
		})
	}
});
module.exports = CityStore;