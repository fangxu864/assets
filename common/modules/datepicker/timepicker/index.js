/**
 * Author: huangzhiyang
 * Date: 2016/9/23 9:45
 * Description: ""
 */
require("./index.scss");
var Tpl = require("./index.xtpl");
var Timepicker = PFT.Util.Class({
	EVENTS : {
		"click .slideStage .timeSpan" : "onTimeSpanClick",
		"click .timeLine .navBtn" : "onNavBtnClick",
		"mouseenter .timeLine .navBtn" : "onNavBtnMouseEnter",
		"mouseleave .timeLine .navBtn" : "onNavBtnMouseLeave"
	},
	beginX : 0,
	STEP : 4,
	SPEED : 60,
	__interval : null,
	init : function(opt){
		this.container.html(Tpl);
		setTimeout(this.buildTimeSpan.call(this),0);
	},
	onTimeSpanClick : function(e){
		var tarSpan = $(e.currentTarget);
		var num = tarSpan.text();
		tarSpan.addClass("active").siblings().removeClass("active");
		tarSpan.parents(".timeLine").children(".showBox").find(".num").text(num);
	},
	onNavBtnMouseEnter : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		var slideStage = tarBtn.siblings(".slideStage");
		var stageWidth = slideStage.width();
		var slideBox = slideStage.children(".slideBox");
		var slideBoxWidth = slideBox.width();
		var left = slideBox.css("left");
		var dir = tarBtn.hasClass("next") ? -1 : 1;
		this.beginX = left.substr(0,left.length-2) * 1;

		this.__interval = setInterval(function(){
			that.slide(slideBox,stageWidth,slideBoxWidth,dir);
		},1000/this.SPEED);

	},
	onNavBtnMouseLeave : function(e){
		clearInterval(this.__interval);
		this.__interval = null;
	},
	onNavBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var slideStage = tarBtn.siblings(".slideStage");
		var stageWidth = slideStage.width();
		var slideBox = slideStage.children(".slideBox");
		var slideBoxWidth = slideBox.width();
		var offset = stageWidth - slideBoxWidth;
		var left = tarBtn.hasClass("next") ? offset : 0;
		clearInterval(this.__interval);
		slideBox.css({left:left});
	},
	buildTimeSpan : function(){
		var that = this;
		this.container.find(".slideBox").each(function(item,index){
			var count = $(this).hasClass("hour") ? 24 : 60;
			var html = that.__buildTimeSpan(count);
			$(this).html(html);
		});

	},
	__buildTimeSpan : function(count){
		var html = "";
		for(var i=0; i<count; i++){
			var is = i<10 ? ("0"+i) : i;
			html += '<span class="timeSpan timeSpan_'+is+'">'+is+'</span>';
		}
		return html;
	},
	slide : function(tarDom,stageWidth,slideBoxWidth,dir){
		this.beginX = this.beginX + (dir*this.STEP);
		if(this.beginX>=0){
			this.beginX = 0;
		}else{
			var off = stageWidth - slideBoxWidth;
			if(this.beginX<=off){
				this.beginX = off;
			}
		}
		tarDom.css({left:this.beginX});
	},
	show : function(){
		this.container.show();
	},
	hide : function(){
		this.container.hide();
	},
	setTime : function(hour,minu,second){
		this.setHour(hour);
		this.setMinu(minu);
		this.setSecond(second);
	},
	setHour : function(hour){
		if(!hour) return this.container.hide();
		var slideBoxHour = this.container.find('.slideBoxHour');
		hour = +hour;
		if(hour.length<2) hour = "0"+hour;
		slideBoxHour.find('.timeSpan_'+hour+'').trigger("click");
	},
	setMinu : function(minu){
		var slideBoxMinu = this.container.find('.slideBoxMinu');
		if(!minu){
			slideBoxMinu.hide();
			return false;
		}
		minu = +minu;
		if(minu.length<2) minu = "0"+minu;
		slideBoxMinu.find('.timeSpan_'+minu+'').trigger("click");
	},
	setSecond : function(second){
		var slideBoxSecond = this.container.find('.slideBoxSecond');
		if(!second){
			slideBoxSecond.hide();
			return false;
		}
		second = +second;
		if(second.length<2) second = "0"+second;
		slideBoxSecond.find('.timeSpan_'+second+'').trigger("click");
	},
	getTime : function(){
		return (this.getHour() + ":" + this.getMinu() + ":" + this.getSecond());
	},
	getHour : function(){
		return this.container.find(".slideBoxHour .active").text();
	},
	getMinu : function(){
		return this.container.find(".slideBoxMinu .active").text();
	},
	getSecond : function(){
		return this.container.find(".slideBoxSecond .active").text();
	}
});
module.exports = Timepicker;