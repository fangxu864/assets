/**
 * Author: huangzhiyang
 * Date: 2016/6/16 10:18
 * Description: ""
 */
require("./index.scss");
var Defaults = {
	container : "",               //组件要渲染到的容器
	onNext : function(){},        //要到下一页时触发回调
	onPrev : function(){},        //要到上一页时触发回调
	onNavigation : function(){},  //不论上一页或下一页都触发回调
	keyup : false                 //是否支持键盘左右键触发事件
};
/**
 * 简单的分页组件
 * @param opt
 * @constructor
 * eg:
 *  var p = new Pagination({
 * 		container : $("#container"),
 * 		keyup : false,
 * 		onNext : function(data){},
 * 		onPrev : function(data){},
 * 		onNavigation : function(data){}
 *  })
 *  p.on("next",function(data){})
 *  p.on("prev",function(data){})
 *  p.on("navigation",function(data){})
 *  p.render({current:1,total:10})
 */
function Pagination(opt){
	this.opt = $.extend(Defaults,opt || {});
	this.init(this.opt);
}
Pagination.prototype = {
	init : function(opt){
		var that = this;
		this.tpl = require("./index.xtpl");
		this.container = typeof opt.container=="string" ? $("#"+opt.container.replace(/#/,"")) : opt.container;
		this.container.hide().html(this.tpl);
		this.currentPage = this.container.find(".whichPageInp");
		this.totalPage = this.container.find(".totalPageInp");
		this.nextBtn = this.container.find(".nextPageBtn");
		this.prevBtn = this.container.find(".prevPageBtn");
		if(opt.keyup){
			$(document).on("keyup",function(e){
				that.onKeyupToNav(e);
			});
			this.container.find(".keyupTip").show();
		}
		this.container.on("click",".navBtn",function(e){
			that.onNavBtnClick(e);
		})
	},
	onNavBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var current_page = this.currentPage.text() * 1;
		var dir = tarBtn.hasClass("next") ? "next" : "prev";
		var toPage = tarBtn.hasClass("next") ? (current_page+1) : (current_page-1);
		var data = {
			dir : dir,
			fromPage : current_page,
			toPage : toPage
		};
		if(dir=="next"){
			this.opt.onNavigation(data);
			this.opt.onNext(data);
			PFT.Util.PubSub.fire("navigation",data);
			PFT.Util.PubSub.fire("next",data);
		}else{
			this.opt.onNavigation(data);
			this.opt.onPrev(data);
			PFT.Util.PubSub.fire("navigation",data);
			PFT.Util.PubSub.fire("prev",data);
		}
	},
	onKeyupToNav : function(e){
		var keyCode = e.keyCode;
		var nextBtn = this.nextBtn;
		var prevBtn = this.prevBtn;
		var current = this.currentPage.text() * 1;
		var data = null;
		if(keyCode==39 && !nextBtn.hasClass("disable")){ //next
			data = {
				dir : "next",
				fromPage : current,
				toPage : current+1
			};
			this.opt.onNavigation(data);
			this.opt.onNext(data);
			PFT.Util.PubSub.fire("navigation",data);
			PFT.Util.PubSub.fire("next",data);
		}else if(keyCode==37 && !prevBtn.hasClass("disable")){ //prev
			data = {
				dir : "next",
				fromPage : current,
				toPage : current-1
			};
			this.opt.onNavigation(data);
			this.opt.onPrev(data);
			PFT.Util.PubSub.fire("navigation",data);
			PFT.Util.PubSub.fire("prev",data);
		}
	},
	on : function(type,callback){
		if(!type) return false;
		callback = typeof callback=="function" ? callback : function(){};
		PFT.Util.PubSub.on(type,callback);
	},
	show : function(){
		this.container.show();
	},
	hide : function(){
		this.container.hide();
	},
	getValue : function(){ //获取当前的页数值
		return{
			current : this.current.text(),
			total : this.total.text()
		}
	},
	render : function(data){ // data={current:1,total:1} data=null
		if(!data){
			this.nextBtn.addClass("disable");
			this.prevBtn.addClass("disable");
			this.hide();
			return;
		}
		var total = 1 * data.total;
		var current = 1 * data.current;
		var totalInp = this.totalPage;
		var currentInp = this.currentPage;
		var nextBtn = this.nextBtn;
		var prevBtn = this.prevBtn;
		if(total==0){
			this.nextBtn.addClass("disable");
			this.prevBtn.addClass("disable");
			this.hide();
			return;
		}
		this.show();
		totalInp.text(total);
		currentInp.text(current);
		if(current<total){
			if(current!=1){
				prevBtn.removeClass("disable");
			}else{
				prevBtn.addClass("disable");
			}
			nextBtn.removeClass("disable");
		}else{
			if(current!=1){
				prevBtn.removeClass("disable");
			}else{
				prevBtn.addClass("disable");
			}
			nextBtn.addClass("disable");
		}
	}
};
module.exports = Pagination;
