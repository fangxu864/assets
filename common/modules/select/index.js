/**
 * Author: huangzhiyang
 * Date: 2016/6/14 11:14
 * Description: 项目时间紧迫，主体功能先实现，更多功能后续会慢慢增加
 */
require("./index.scss");
var Defaults = {
	trigger : null,

	field : {
		id : "id",
		name : "name"
	},

	//是否支持搜索过滤 默认为true(支持)
	//接受的值有：3种
	//true(支持)  false(不支持)  function自定义过滤规则，如：function(data,keyword){ return[{key:value}] }
	filter : true,

	height : 200,

	source : "", //ajax请求的数据源

	offset : { //偏移量
		top : 0,
		left : 0,
		width : 0 //一般情况下，下拉框的宽度会取trigger的宽度，但程序获取trigger宽度有时会存在几个px的误差，此时，offset.width可让使用者来手动调整
	},

	tpl : function(){
		return require("./index.xtpl");
	},

	//适配器，用于适配从后端请求回来的数据为如下格式
	//[{key1:value1,key2:value2}]
	adaptor : function(res){
		res = res || {};
		var code = res.code;
		var data = res.data || [];
		return data;
	},

	//若需要传入自定义的静态data数据,
	//格式需为:[{key1:value1,key2:value2}] 此时将忽略source,adaptor,field参数
	data : null
};
function Select(opt){
	var opt = this.opt = $.extend({},Defaults,opt);
	this.init(opt);
}
Select.prototype = {
	__cacheData : null,
	keyupTimer : null,
	current_id : "",
	current_name : "",
	init : function(opt){
		var trigger = this.trigger = typeof opt.trigger==="string" ? $("#"+opt.trigger.substr(opt.trigger.indexOf("#")+1)) : opt.trigger;
		var source = this.source = opt.source;
		if(!trigger.length) return false;
		if(!source && !opt.data) return false;
		this.selectBox = this.createSelectBox();
		this.mask = this.createMask();
		this.searchInp = this.selectBox.find(".gSelectSearchInp");
		this.clearSearchBtn = this.selectBox.find(".clearSearchBtn");
		this.listUl = this.selectBox.find(".selectOptionUl");
		this.position();
		this.bindEvents();
		if(opt.data){
			this.__cacheData = opt.data;
			this.listUl.html(this.updateListUl(opt.data));
		}
		if(this.opt.source && !this.opt.data && this.__cacheData==null){
			this.fetchData(this.opt.source);
		}
		if(!opt.filter) this.selectBox.addClass("no-search");
	},
	bindEvents : function(){
		var that = this;
		this.trigger.on("click",function(e){
			that.trigger.toggleClass("select-on");
			if(that.trigger.hasClass("select-on")){
				that.open();
			}else{
				that.close();
			}
		})
		this.mask.on("click",function(){
			that.close();
		})
		this.searchInp.on("keyup",function(e){
			if(!that.opt.filter) return false;
			that.onSearchInpChange(e);
		})
		this.clearSearchBtn.on("click",function(e){
			$(e.currentTarget).hide();
			that.searchInp.val("").focus();
			var html = that.renderListHtml(that.__cacheData);
			that.listUl.html(html);
		})
		this.listUl.on("click",".gSelectOptionItem",function(e){
			that.onOptionItemClick(e);
		});
	},
	onOptionItemClick : function(e){
		var that = this;
		var tarItem = $(e.currentTarget);
		if(!tarItem.hasClass("gSelectOptionItem")) return false;
		var field = that.opt.field;
		var field_id = field.id;
		var field_name = field.name;
		var id = tarItem.attr("data-"+field_id);
		var name = tarItem.find(".t").text();
		var data = {};
		data[field_id] = id;
		data[field_name] = name;
		that.current_id = id;
		that.current_name = name;
		that.trigger.attr("data-"+field_id,id).attr("data-"+field_name,name);
		if(that.trigger[0].nodeName.toUpperCase()=="INPUT"){
			that.trigger.val(name);
		}else{
			that.trigger.text(name);
		}
		that.close();
		tarItem.addClass("active").siblings().removeClass("active");
		PFT.Util.PubSub.trigger("option.click",data);
	},
	onSearchInpChange : function(e){
		var that = this;
		clearTimeout(this.keyupTimer);
		this.keyupTimer = setTimeout(function(){
			var keyword = $.trim($(e.currentTarget).val());
			var result = that.filter(keyword);
			keyword=="" ? that.clearSearchBtn.hide() : that.clearSearchBtn.show();
			var html = that.renderListHtml(result);
			that.listUl.html(html);
		},200)
	},
	//过滤
	filter : function(keyword){
		if(typeof this.opt.filter=="function") return this.opt.filter(this.__cacheData,keyword);
		var result = [];
		var cache = this.__cacheData;
		var field = this.opt.field;
		var name_field = field.name;
		if(!keyword || keyword=="") return cache;
		if(cache=="loading" || cache=="error" || cache==null || cache=="empty") return result;
		for(var i in cache){
			var data = cache[i];
			var name = data[name_field];
			if(name.indexOf(keyword)>-1) result.push(data);
		}
		return result;
	},
	//创建主体下拉框
	createSelectBox : function(){
		if(this.selectBox) return this.selectBox;
		var tpl = this.opt.tpl();
		var opt = this.opt;
		var width = opt.trigger.outerWidth()+(opt.offset.width || 0);
		var height = opt.height;
		var selectBox = this.selectBox = $('<div style="display:none;width:'+width+'px;height:'+height+'px" class="gSelectDownBox"></div>');
		selectBox.append(tpl);
		$("body").append(selectBox);
		return this.selectBox;
	},
	//创建遮罩层
	createMask : function(){
		if(this.mask) return this.mask;
		this.mask = $('<div style="display:none" class="gSelectMask"></div>');
		$("body").append(this.mask);
		return this.mask;
	},
	updateListUl : function(data){
		var html = this.renderListHtml(data);
		this.listUl.html(html);
		this.listUl.children().first().trigger("click");
	},
	renderListHtml : function(data,errorMsg){ //data必须为如下格式：[{key1:value1,key2:value2}]
		var html = "";
		var msg = errorMsg || PFT.AJAX_ERROR_TEXT;
		if(Object.prototype.toString.call(data)=="[object Array]"){
			var field = this.opt.field;
			var id_field = field.id;
			var name_field = field.name;
			for(var i in data){
				var d = data[i];
				var id = d[id_field];
				var name = d[name_field];
				html += '<li data-'+id_field+'="'+id+'" class="gSelectOptionItem"><span class="t">'+name+'</span></li>';
			}
			if(!html) html = '<li class="status empty">无匹配选项</li>';
		}else{
			switch(data){
				case null:
					html = "";
					break;
				case "loading":
					html = '<li class="status loading">努力加载中，请稍后...</li>';
					break;
				case "fail" :
					html = '<li class="status fail">'+msg+'</li>';
					break;
				case "timeout":
					html = '<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
					break;
				case "error":
					html = '<li class="status error">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
					break;
			}
		}
		return html;
	},
	//定位
	position : function(){
		var trigger = this.trigger;
		var selectBox = this.createSelectBox();
		var of = trigger.offset();
		var offset = this.opt.offset;
		var trigger_h = trigger.outerHeight(true);
		selectBox.css({
			left : of.left + (offset.left || 0),
			top : of.top + trigger_h + (offset.top || 0)
		})
	},
	fetchData : function(source){
		var that = this;
		PFT.Util.Ajax(source,{
			type : "get",
			dataType : "json",
			loading : function(){
				that.opt.__cacheData = "loading";
				that.updateListUl("loading");
			},
			complete : function(){
				that.opt.__cacheData = "";
				that.updateListUl(null);
			},
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = that.opt.adaptor(res);
				if(code==200){
					that.__cacheData = data;
					that.updateListUl(data);
				}else{
					that.__cacheData = "error";
					that.updateListUl("error");
				}
			},
			error : function(){
				that.opt.__cacheData = "error";
				that.updateListUl("error");
			}
		})
	},
	//=========================================================================
	//=========================================================================
	//=========================== 对外暴露以下4个方法 =============================
	//=========================================================================
	//=========================================================================
	open : function(callback){
		this.createMask().show();
		this.createSelectBox().show();
		this.trigger.addClass("select-on");
		PFT.Util.PubSub.trigger("open");
		callback && callback();
	},
	close : function(callback){
		console.log("close")
		this.mask.hide();
		this.selectBox.hide();
		this.trigger.removeClass("select-on");
		PFT.Util.PubSub.trigger("close");
		callback && callback();
	},
	getValue : function(){
		return{
			id : this.current_id,
			name : this.current_name
		}
	},
	on : function(type,callback){
		if(!type) return false;
		callback = typeof callback=="function" ? callback : function(){};
		PFT.Util.PubSub.on(type,callback);
	}
};

module.exports = Select;
