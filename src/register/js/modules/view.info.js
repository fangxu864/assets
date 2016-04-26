/**
 * Created by Administrator on 16-4-15.
 */
var CitySelect = require("../../../../common/js/component.city.select.simple.js");
var VInfo = Backbone.View.extend({
	el : $("#infoForm"),
	events : {
		"click #jumpFromInfoBtn" : "onJumpFromInfoBtnClick",
		"click #infoSubmitBtn" : "onInfoSubmitBtnClick"
	},
	initialize : function(opt){
		this.router = opt.router;
		this.citySelect = new CitySelect({
			provId : "#provSelect",
			cityId : "#citySelect"
		});
	},
	onJumpFromInfoBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var account = tarBtn.data("account");
		this.router.navigate("step/3",{trigger:true});
	},
	onInfoSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var params = this.$el.serialize();
		console.log(params);
	}
});
module.exports = VInfo;