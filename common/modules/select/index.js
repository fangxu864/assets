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
	adaptor : function(data){ return data; },

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
			this.listUl.html(this.renderSelectListUl(opt.data))
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
			console.log("click");
			that.close();
		})
		this.searchInp.on("keyup",function(e){
			that.onSearchInpChange(e);
		})
	},
	onSearchInpChange : function(e){

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
	renderSelectListUl : function(data){ //data必须为如下格式：[{key1:value1,key2:value2}]
		var html = "";
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
	open : function(callback){
		this.createMask().show();
		this.createSelectBox().show();
		this.trigger.addClass("on");
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
