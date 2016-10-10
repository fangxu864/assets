/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:03
 * Description: ajax分页器
 *
 * how to use:
 *
 * var Pagination = require("COMMON/modules/pagination-x");
 * var pagination = new Pagination({
 * 		container : "#container"  //必须，组件容器id
 * 		count : 7,                //可选  连续显示分页数 建议奇数7或9
 *		showTotal : true,         //可选  是否显示总页数
 *		jump : true	              //可选  是否显示跳到第几页
 * });
 *
 * pagination.on("page.switch",function(toPage,currentPage,totalPage){
 *		// toPage :      要switch到第几页
 *	    // currentPage : 当前所处第几页
 *	    // totalPage :   当前共有几页
 * })
 *
 * 主方法：(也是唯一对外显露的方法) 把分页器当前状态渲染到页面上
 * pagination.render({current:1,total:10})
 *
 * current - 当前在第几页
 * total   - 共几页
 *
 *
 *
 */
require("./index.scss");
var UtilClass = require("COMMON/js/util.class");
var ParseTemplate = require("COMMON/js/util.parseTemplate");
var tpl = require("./index.xtpl");
var Defaults = {
	count : 7,
	showTotal : true,
	jump : true
};

var Pagination = UtilClass({
	init : function(opt){
		opt = $.extend({},Defaults,opt);
		var container = this.container = opt.container;
		if(!container) return alert("缺少container参数");
		this.currentPage = 0;
		this.totalPage = 0;
		this.__Count = opt.count;
		this.showTotal = opt.showTotal;
		this.jump = opt.jump;
		this.container = typeof container=="string" ? $(container) : container;
	},
	template : ParseTemplate(tpl),
	EVENTS : {
		"click .nav" : "onNavClick",
		"click .prevNextBtn" : "onPrevNextBtnClick",
		"mousedown .toWhichBtn" : "onWhichPageClick",
		"focus .whichPageInp" : "onWhichInpFocus",
		"blur .whichPageInp" : "onWhichInpBlur",
		"keyup .whichPageInp" : "onWhichPageEnter"
	},
	onNavClick : function(e){
		var tarNav = $(e.currentTarget);
		if(tarNav.hasClass("dot") || tarNav.hasClass("disable") || tarNav.hasClass("current")) return false;
		var page = tarNav.attr("data-page") * 1;
		this.trigger("page.switch",page,this.currentPage,this.totalPage,tarNav);
	},
	onPrevNextBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var currentPage = this.currentPage;
		if(tarBtn.hasClass("disable")) return false;
		if(!currentPage || isNaN(currentPage)) return false;
		currentPage = currentPage * 1;
		var toPage = tarBtn.hasClass("prev") ? currentPage-1 : currentPage+1;
		var eventType = tarBtn.hasClass("prev") ? "prev" : "next";
		this.trigger(eventType,toPage,currentPage,this.totalPage);
		this.trigger("page.switch",toPage,currentPage,this.totalPage,tarBtn);
	},
	onWhichPage : function(toPage){
		if(!toPage) return false;
		toPage = $.trim(toPage);
		var totalPage = this.totalPage;
		var currentPage = this.currentPage;
		if(isNaN(toPage) || (toPage==0) || !(/^[1-9][0-9]*$/.test(toPage)) || (totalPage<=0) || !totalPage || (toPage>totalPage)) return false;
		this.trigger("page.switch",toPage*1,currentPage,totalPage);
	},
	onWhichPageEnter : function(e){
		var keyCode = e.keyCode;
		if(keyCode!=13) return false;
		var toPage = $(e.currentTarget).val();
		this.onWhichPage(toPage);
	},
	onWhichPageClick : function(e){
		var toPage = this.container.find(".whichPageInp").val();
		this.onWhichPage(toPage);
	},
	onWhichInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		var width = tarInp.parent().width();
		tarInp.parents(".whichPageBox").addClass("focus").animate({width : width},100)
	},
	onWhichInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		tarInp.parents(".whichPageBox").removeClass("focus").animate({width : 50},100)
	},
	_adapt : function(current,total){
		var __Count = this.__Count;
		var result = [];
		var __push = function(val){
			result.push({
				val : val,
				isCurrent : val==current,
				isFirst : val==1,
				isLast : val==total
			});
		};

		if(total<=__Count){ //小于等于__Count页全部显示

			for(var i=1; i<=total; i++) __push(i);

		}else{ //大于__Count页

			var fix = (__Count-3)/2;

			if(current<=fix+2){
				for(var i=1; i<=fix+2; i++) __push(i);
				for(var i=fix+3; i<fix+3+fix; i++) __push(i);
				__push("...");
				__push(total);
			}else if(current>=(total-fix-1)){
				__push(1);
				__push("...");
				for(i=current-fix; i<current; i++) __push(i);
				for(var i=current; i<=total; i++) __push(i);
			}else{
				__push(1);
				__push("...");
				for(var i=current-fix; i<=current; i++) __push(i);
				for(var i=current+1; i<=current+fix; i++) __push(i);
				__push("...");
				__push(total);
			}

		}

		return result;

	},
	/**
	 * 主方法
	 * @param opt {current:10,total:15,showTotal:true,jump:false}
	 * current:当前页数  必须
	 * total:总页数      必须
	 * showTotal:是否显示总页数  true/false  非必须
	 * jump:是否显示跳转到第几页  true/false  非必须
	 */
	render : function(opt){
		if(opt==null) return this.container.html("").hide();
		opt = opt || {};
		var current = opt.current;
		var total = opt.total;
		var showTotal = typeof opt.showTotal=="boolean" ? opt.showTotal : this.showTotal;
		var jump = typeof opt.jump=="boolean" ? opt.jump : this.jump;
		if(total==1) jump = false;
		this.currentPage = current;
		this.totalPage = total;
		if(total==0 || current>total) return this.container.html("").hide();

		var resultData = this._adapt(current,total);

		var html = this.template({data:resultData,current:current,total:total,showTotal:showTotal,jump:jump});

		this.container.html(html);
	},
	getCurrentPage : function(){
		return this.currentPage;
	},
	getTotalPage : function(){
		return this.totalPage;
	}
});


module.exports = Pagination;