/**
 * Author: huangzhiyang
 * Date: 2016/6/29 15:48
 * Description: ""
 */
var Header = Backbone.View.extend({
	el : $("#tahHeaderContainer"),
	events : {
		"click .cardType" : "onCardTypeClick"
	},
	initialize : function(opt){
		this.state = opt.state;
		console.log(this.state);
	},
	onCardTypeClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("active")) return false;
		var status = tarBtn.attr("data-status");
		tarBtn.addClass("active").siblings().removeClass("active");
		this.trigger("switch",{status:status});
	},
	active : function(status){
		this.$el.find(".cardType[data-status="+status+"]").trigger("click");
	},
	getStatus : function(){
		var status = [];
		this.$el.find(".cardType").each(function(){
			var item = $(this);
			var s = item.attr("data-status");
			status.push(s);
		})
		return status;
	},
	setCount : function(status,count){
		if(arguments.length!=2) return false;
		$("#cardTypeTab_"+status).find(".num").css("display","inline").text(count);
	}
});
module.exports = Header;