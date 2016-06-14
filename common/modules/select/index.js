/**
 * Author: huangzhiyang
 * Date: 2016/6/14 11:14
 * Description: ""
 */
require("./index.scss");
var Defaults = {
	trigger : null,

	field : {
		id : "id",
		name : "name"
	},

	width : 200, //selectBox的宽度
	height : 200,

	source : "",

	offset : { //偏移量
		top : 0,
		left : 0
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
	init : function(opt){
		var trigger = this.trigger = typeof opt.trigger==="string" ? $("#"+opt.trigger.substr(opt.trigger.indexOf("#")+1)) : opt.trigger;
		var source = this.source = opt.source;
		if(!trigger.length) return false;
		if(!source && !opt.data) return false;
		this.selectBox = this.createSelectBox();
		this.mask = this.createMask();
		this.searchInp = this.selectBox.find(".gSelectSearchInp");
		this.position();
		this.bindEvents();
		this.listUl = this.selectBox.find(".selectOptionUl");
		if(opt.data){
			this.__cacheData = opt.data;
			this.listUl.html(this.renderSelectListUl("success",opt.data));
		}
	},
	bindEvents : function(){
		var that = this;
		this.trigger.on("click",function(e){
			that.trigger.toggleClass("on");
			if(that.trigger.hasClass("on")){
				that.open();
			}else{
				that.close();
			}
		})
		this.mask.on("click",function(){
			that.close();
		})
		this.searchInp.on("keyup",function(e){
			that.onSearchInpChange(e);
		})
	},
	onSearchInpChange : function(e){
		var that = this;
		clearTimeout(this.keyupTimer);
		this.keyupTimer = setTimeout(function(){
			var keyword = $.trim($(e.currentTarget).val());
			var result = that.filter(keyword);
			if(result=="loading" || result=="error" || result==null || result=="empty"){
				that.renderSelectListUl("empty");
			}else{
				that.renderSelectListUl("success",result);
			}
		},200)
	},
	//过滤
	filter : function(keyword){
		var result = [];
		var cache = this.__cacheData;
		var field = this.opt.field;
		var id_field = field.id;
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
		var width = this.opt.width;
		var height = this.opt.height;
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
	renderSelectListUl : function(type,data){ //data必须为如下格式：[{key1:value1,key2:value2}]
		var html = "";
		if(type=="success"){
			if(Object.prototype.toString.call([],data)!=="[object Array]") return html;
			var field = this.opt.field;
			var id_field = field.id;
			var name_field = field.name;
			for(var i in data){
				var d = data[i];
				var id = d[id_field];
				var name = d[name_field];
				html += '<li data-'+id_field+'="'+id+'" class="gSelectOptionItem">'+name+'</li>';
			}
		}else if(type=="empty"){
			html += '<li class="status empty">无匹配选项</li>';
		}else if(type=="error"){
			html += '<li class="status error">出错</li>';
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
			left : of.left + offset.left,
			top : of.top + trigger_h + offset.top
		})
	},
	fetchData : function(source){
		var that = this;
		PFT.Util.Ajax(source,{
			type : "get",
			dataType : "json",
			loading : function(){
				that.opt.__cacheData = "loading";
			},
			complete : function(){
				that.opt.__cacheData = "";
			},
			success : function(res){
				var data = that.opt.adaptor(res);
				that.renderSelectListUl("success",data);
			},
			error : function(){
				that.opt.__cacheData = "error";
			}
		})
	},
	open : function(callback){
		this.createMask().show();
		this.createSelectBox().show();
		this.trigger.addClass("on");
		if(this.opt.source && !this.opt.data && this.__cacheData==null){
			this.fetchData(this.opt.source);
		}
		callback && callback();
	},
	close : function(callback){
		this.mask.hide();
		this.selectBox.hide();
		this.trigger.removeClass("on");
		callback && callback();
	}
};

module.exports = Select;
