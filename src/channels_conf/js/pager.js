/**
 * Created by Administrator on 15-6-26.
 */
var Pager = RichBase.extend({
	statics : {},
	EVENTS : {
		"click" : {
			".pageBtn" : "onPageBtnClick"
		}
	},
	init : function(opt){
		var container = this.container = opt.container;
		this.nextBtn = container.find(".nextBtn");
		this.prevBtn = container.find(".prevBtn");
	},
	refresh : function(){

	},
	onPageBtnClick : function(that,e){
		console.log("ddd")
		var tarBtn = $(e.currentTarget);
		var dir = tarBtn.hasClass("nextBtn") ? "next" : "prev";
		that.fire("navigate",dir);
	},
	disableNavigate : function(dir){
		if(dir=="next"){
			this.nextBtn.addClass("disable");
		}else{
			this.prevBtn.addClass("disable");
		}
	}
});