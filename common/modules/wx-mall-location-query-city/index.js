/**
 * Author: huangzhiyang
 * Date: 2016/5/23 15:28
 * Description: ""
 */
require("./css/style.css");
var Debug = true;
var indexTpl = require("./tpl/index.html");
var Model = require("./city.store.js");
var Main = Backbone.View.extend({
	el : $("body"),
	events : {
		"input #citySearchInp" : "onCitySearchInpChange",
		"click #city_search_clearBtn" : "onClearSearchBtnClick",
		"click .cityItem" : "onCityItemClick"
	},
	initialize : function(opt){
		var that = this;
		//开始定位
		var locateCurrentCity = this.locateCurrentCity = $("#locateCurrentCity");
		this.GeoLocation = opt.GeoLocation;
		if(!Debug){
			this.GeoLocation.local({
				loading : function(){
					locateCurrentCity.addClass("disable").find(".city").text("正在定位...")
				},
				complete : function(){
					locateCurrentCity.find(".city").text("正在完成...")
				},
				success : function(city){
					locateCurrentCity.removeClass("disable").find(".city").text(city);
				},
				fail : function(res){
					locateCurrentCity.find(".city").text("定位失败...")
				}
			})
		}
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
		var clearBtn = $("#city_search_clearBtn");
		var tarInp = $(e.currentTarget);
		var keyword = $.trim(tarInp.val());
		var allCitys = this.model.get("allCityCache");
		if(typeof allCitys=="string") return false;
		keyword ? clearBtn.show() : clearBtn.hide();
		this.model.filter(keyword);
	},
	onClearSearchBtnClick : function(){
		$(e.currentTarget).hide();
		$("#citySearchInp").val("").focus();
		this.model.filter("");
	},
	onCityItemClick : function(e){
		var tarItem = $(e.currentTarget);
		if(tarItem.hasClass("disable") || tarItem.hasClass("active")) return false;
		$("#cityQueryPage").find(".cityItem").removeClass("active");
		tarItem.addClass("active");
		var name = tarItem.attr("data-name") || tarItem.find(".t").text();
		if(name=="所有城市" || name=="全国") name="不限";
		var code = tarItem.attr("data-id");
		var pin = tarItem.attr("data-pin");
		var abb = tarItem.attr("data-abb");
		this.GeoLocation.setStorageCity(name);
		this.close();
		this.trigger("city.switch",{
			name : name,
			code : code,
			pin : pin,
			abb : abb
		})
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
