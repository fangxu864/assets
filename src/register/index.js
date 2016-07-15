/**
 * Created by Administrator on 16-4-12.
 */
require("./css/register.scss");
var Placeholder = require("COMMON/js/util.placeholder.js");
var SlideManager = require("./modules/slide.manager.js");
var VRegister = require("./modules/view.register.js");
var VInfo = require("./modules/view.info.js");
var Router = Backbone.Router.extend({
	routes : {
		"" : "main",
		"step/:id" : "step"
	},
	initialize : function(){
		var that = this;
		this.slideManager = new SlideManager();
		this.VRegister = new VRegister({router:this,getDtype:this.getDtype});
		this.VInfo = new VInfo({router:this,getDtype:this.getDtype});
		this.slideManager.on("slide.before",function(id){})
		this.slideManager.on("slide.after",function(id){})
		Placeholder.init();
	},
	getDtype : function(){
		return PFT.Util.UrlParse()["dtype"];
	},
	main : function(){
		this.slideManager.slide(1);
	},
	step : function(id){
		//如果注册失败或还未注册，不能跳到第2，3 step
		if((id==2 || id==3) && !this.VRegister.__registerSuccess) return window.history.back();
		this.slideManager.slide(id);
	}
});

//$(function(){
//	$("#nextBtn").on("click",function(e){
//		$("#selectDtypeContainer").hide();
//		$("#registerContainer").show();
//	})
//	$("#backtoSelectDtypeBtn").on("click",function(e){
//		$("#selectDtypeContainer").show();
//		$("#registerContainer").hide();
//	})
//	$("#selectDtypeContainer").on("click",".box",function(e){
//		var tarBox = $(e.currentTarget);
//		tarBox.addClass("active").siblings().removeClass("active");
//
//	})
//})




var router = new Router;
Backbone.history.start();
