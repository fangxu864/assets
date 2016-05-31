/**
 * Author: huangzhiyang
 * Date: 2016/5/23 16:17
 * Description: ""
 */
var Debug = true;
var Ajax = require("COMMON/js/util.ajax.js");
var CityStore = Backbone.Model.extend({
	defaults : {
		allCityFlag : "",
		allCityCache : "",
		cityList : "",
		keyword : ""
	},
	initialize : function(){},
	fetchCity : function(){
		var that = this;

		if(Debug){
			that.set("cityList","loading");
			that.set("allCityCache","loading");
			setTimeout(function(){
				that.set("cityList",{f:[{"a":"f","id":1000,"hanzi":"福州","pinyin":"fuzhou","shouzimu":"fz"}]});
				that.set("allCityCache",{f:[{"a":"f","id":1000,"hanzi":"福州","pinyin":"fuzhou","shouzimu":"fz"}]});
			},1000);
			return;
		}

		var cityList = this.get("cityList");
		if(cityList || cityList=="loading") return false;
		Ajax("../api/v0.0.3/order.php",{
			type : "get",
			dataType : "json",
			params : {
				action : "area_list"
			},
			loading : function(){
				that.set("cityList","loading");
				that.set("allCityCache","loading");
			},
			complete : function(){
				that.set("cityList","complete");
				that.set("allCityCache","complete");
			},
			timeout : function(res){
				that.set("cityList","timeout");
				that.set("allCityCache","timeout");
			},
			serverError : function(res){
				that.set("cityList","serverError");
				that.set("allCityCache","serverError");
			},
			success : function(res){
				var code = res.code;
				var areas = res.areas;
				if(code==200 && _.isObject(areas)){
					if(!_.isEmpty(areas)){
						that.set("cityList",areas);
						that.set("allCityCache",areas);
					}else{
						that.set("cityList","empty");
						that.set("allCityCache","empty");
					}
				}else{
					that.set("cityList","fail");
					that.set("allCityCache","fail");
				}
			}
		})
	},
	filter : function(val){
		var result = {};
		var all = this.get("allCityCache");
		if(typeof all=="string") return result;
		if(!val) return this.set("cityList",all);
		val = val.toLowerCase();
		var first_letter = val.substring(0,1);
		if(/^[a-z]+$/g.test(first_letter)){ //首字符是英文
			var citys = all[first_letter];
			var arr = [];
			if(citys){
				for(var i in citys){
					var city = citys[i];
					var pin = city["pinyin"];
					var abb = city["shouzimu"];
					var hanzi = city["hanzi"];
					if(pin.indexOf(val)>-1 || abb.indexOf(val)>-1 || hanzi.indexOf(val)>-1){
						arr.push({
							a: city["a"],
							hanzi : hanzi,
							id : city["id"],
							pinyin : pin,
							shouzimu : abb
						})
					}
				}
			}
			if(arr.length) result[first_letter] = arr;
		}else{ //首字符是中文
			for(var letter in all){
				var citys = all[i];
				var array = [];
				for(var c in citys){
					var city = citys[c];
					var hanzi = city["hanzi"];
					var pin = city["pinyin"];
					var abb = city["shouzimu"];
					if(hanzi.indexOf(val)>-1 || pin.indexOf(val)>-1 || abb.indexOf(val)>-1){
						array.push({
							a: city["a"],
							hanzi : city["hanzi"],
							id : city["id"],
							pinyin : city["pinyin"],
							shouzimu : city["shouzimu"]
						})
					}
				}
				if(array.length) result[letter] = array;
			}
		}
		if(!_.isEmpty(result)){ //如果result是空{}
			this.set("cityList",result);
		}else{
			this.set("cityList","empty");
		}
	}
});
module.exports = CityStore;