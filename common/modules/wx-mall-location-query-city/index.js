/**
 * Author: huangzhiyang
 * Date: 2016/5/23 15:28
 * Description: ""
 */
require("./css/style.css");
var indexTpl = require("./tpl/index.html");
var Model = require("./city.store.js");
var Main = Backbone.View.extend({
	el : $("body"),
	events : {
		"click #citySearchInp" : "onCitySearchInpChange"
	},
	initialize : function(opt){
		var that = this;
		//开始定位
		var locateCurrentCity = this.locateCurrentCity = $("#locateCurrentCity");
		this.GeoLocation = opt.GeoLocation;
		//this.GeoLocation.local({
		//	loading : function(){
		//		locateCurrentCity.addClass("disable").find(".city").text("正在定位...")
		//	},
		//	complete : function(){
		//		locateCurrentCity.find(".city").text("正在完成...")
		//	},
		//	success : function(city){
		//		locateCurrentCity.removeClass("disable").find(".city").text(city);
		//	},
		//	fail : function(res){
		//		locateCurrentCity.find(".city").text("定位失败...")
		//	}
		//})

		//处理model
		this.model.on("change:cityList",function(model){
			var cityList = model.get("cityList");
			var type = _.isObject(cityList) ? "success" : cityList;
			that.render(type,cityList);
		})
		//获取地区数据
		this.model.fetchCity();

	},
	onCitySearchInpChange : function(e){
		console.log(this);
		console.log(e.currentTarget);
	},
	render : function(type,data){
		var html = "";
		switch (type){
			case "loading":
				html += '<li class="state loading">努力加载中...</li>';
				break;
			case "complete":
				html += '<li class="state complete"></li>';
				break;
			case "timeout":
				html += '<li class="state timeout">请求超时，请稍后重试...</li>';
				break;
			case "serverError":
				html += '<li class="state serverError">请求出错，请稍后重试...</li>';
				break;
			case "empty":
				html += '<li class="state empty">没有匹配城市...</li>';
				break;
			case "success":
				for(var i in data){
					var group = data[i];
					var letter = i.toUpperCase();
					var letterCls = letter=="0" ? "none" : "let";
					html += '<li class="group">';
					html += 	'<p class="letter '+letterCls+'">'+letter+'</p>';
					html +=		'<ul class="cityUl">';
					for(var g in group){
						var city = group[g];
						var id = city["id"];
						var name = city["hanzi"];
						var pinyin = city["pinyin"];
						var shouzimu = city["shouzimu"];
						html += [
							'<li class="cityItem" data-name="'+name+'" data-id="'+id+'" data-pin="'+pinyin+'" data-abb="'+shouzimu+'">',
							'<span class="t">'+name+'</span><i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i>',
							'</li>'
						].join("");
					}
					html +=	'</ul>';
					html += '</li>';
				}
				break;
		}
		$("#allcityUl").html(html);
	},
	open : function(){
		$("#cityQueryPage").addClass("on");
	},
	close : function(){
		$("#cityQueryPage").removeClass("on");
	}
});



module.exports = {
	init : function(opt){
		var opt = opt || {};
		$(document.body).append(indexTpl);
		opt["model"] = new Model();
		return new Main(opt);
	}
};
