/**
 * Author: huangzhiyang
 * Date: 2016/11/29 16:48
 * Description: ""
 */
require("../filter/index.scss");
var Tpl = require("../filter/index.xtpl");
var fn = new Function();
var Defaults = function(){
	return{
		sourceUrl : "",         //ajax请求的url
		ajaxType : "get",       //ajax请求方式 get,post
		ifPage : true,          //是否支持分页
		field : {               //ajax请求搜索时
			keyword : "keyword",  //默认以"keyword"字段名发送给后端
			page : "page"         //默认以"page"字段名发送给后端(在支持分页的情况下)
		},
		adaptData : function(res){ //ajax请求回来的data需要用renderOptions方法渲染到listUl里，但后端返回的数据格式经常不统一，此方法用来对数据做一层适配转换
			//返回的数据结构需要以下格式，如果不满足此格式，需要在new时手动做适配
			//res = {
			//	code : 200,
			//	data : {
			//		list : [{
			//			1 : "选项1",
			//			2 : "选项2"
			//		}],
			//		page : 1,       支持分页时才需要此字段
			//		totalPage : 10  支持分页时才需要此字段
			//	},
			//  msg : ""
			//}
			return res;
		},
		initAndLoadAll : true   //是否初始化时就发请求加载数，默认为true (极端情况下，有些接口返回的数据量太大，甚至加载时间超过几分钟，此时只能让用户先输入关键字进行筛选加载)
	}
};
module.exports = PFT.Util.Class({
	init : function(host,opt){
		this.opt = $.extend(Defaults(),opt || {});
		this.host = host;
		this.__Cache = host.__Cache;
		this.container = host.container;
		this.searchBoxContainer = $('<div class="searchBoxContainer"></div>').prependTo(this.container);
		this.searchBoxContainer.prepend(Tpl);
		this.__bindEvent();
	},
	__bindEvent : function(){
		var that = this;
		this.container.on("keyup",".searchInp",function(e){
			clearTimeout(that.__interval);
			that.__interval = setTimeout(function(){
				that.onSearchInpChange(e);
			},200)
		})
	},
	onSearchInpChange : function(e){
		var tarInp = $(e.currentTarget);
		var keyword = $.trim(tarInp.val());
		var result = this.filter(keyword);
		var html = this.host.renderOptions(result);
		this.host.listUl.html(html);
	},
	filter : function(keyword){
		var opt = this.opt;
		var result = [];
		if(!keyword) return __cacheData;

		return result;
	},
	fetchData : function(keyword){
		var that = this;
		var opt = this.opt;
		var _Cache = this.__Cache;
		var page = _Cache.page || 1;
		var ifPage = opt.ifPage;
		var field = opt.field;
		var ajaxType = opt.ajaxType;
		var ajaxParams = {};
		var url = opt.sourceUrl;
		var adaptData = opt.adaptData;
		if(ifPage){
			ajaxParams[field.page] = page;
		}
		ajaxParams[field.keyword] = keyword;
		PFT.Util.Ajax(url,{
			type : ajaxType,
			params : ajaxParams,
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = adaptData(res);
				var code = res.code;
				var data = res.data;
				var list = data.list;
				var page = data.page;
				var totalPage = data.totalPage;
				if(code==200){

				}else{

				}
			},
			timeout : function(){},
			serverError : function(){}
		})

	},
	//当插件销毁时自动调用
	destoryPlugin : function(host){

	}
});
