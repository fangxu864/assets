/**
 * Author: huangzhiyang
 * Date: 2016/5/30 19:30
 * Description: ""
 */
require("./style.scss");
var UrlParse = require("COMMON/js/util.url.parse.query");
var GeoLocation = require("COMMON/modules/geolocation");
var CityQuery = require("COMMON/modules/wx-mall-location-query-city");
module.exports = function(opt){

	var FilterBar = Backbone.View.extend({
		PTYPE : {
			"A" : "景区",
			"C" : "酒店",
			"F" : "套票",
			"H" : "演出",
			"B" : "周边游",
			"I" : "年卡"
		},
		el : $("#filterBar"),
		initialize : function(opt){
			var that = this;
			var opt = opt || {};

			//载入html模板
			$("#page-index").append(require("./tpl.html"));

			this.Api = opt.Api;
			this.Api.getTopic().then(function(topics){
				console.log(topics)
			})
			var urlParams = UrlParse();
			var topic = urlParams.topic || "不限";
			var ptype = urlParams.ptype;
			if(topic) this.topic(topic);
			if(ptype) this.ptype(ptype);
			this.city(GeoLocation.getStorageCity());
			this.CityQuery = CityQuery.init({GeoLocation:GeoLocation});
			this.CityQuery.on("city.switch",function(data){
				var cityname = data.name;
				that.city(cityname);
			})
		},
		//getor or setor
		topic : function(topic){
			var target = $("#switchTopicBtn");
			if(topic){
				if(topic=="不限"){
					target.attr("data-val","").find(".t").text("主题");
				}else{
					target.attr("data-val",topic).find(".t").text(city);
				}
			}else{
				return target.attr("data-val");
			}
		},
		ptype : function(ptype){
			var target = $("#switchPtypeBtn");
			if(ptype){
				target.attr("data-val",ptype).find(".t").text(this.PTYPE[ptype]);
			}else{
				return target.attr("data-val");
			}
		},
		city : function(city){
			var target = $("#switchCityBtn");
			if(city){
				if(city=="全国" || city=="不限"){
					target.attr("data-val","").find(".t").text("不限");
				}else{
					target.attr("data-val",city).find(".t").text(city);
				}
			}else{
				return target.attr("data-val");
			}
		}
	});

	return new FilterBar(opt);

}