/**
 * Author: huangzhiyang
 * Date: 16-5-9 下午2:16
 * Description: ""
 */
var DialogCard = Backbone.View.extend({
	el : "#dialogCardWrap",
	events : {
		"click #nextStepBtn_bankMsg" : "onNextStep"
	},
	initialize : function(opt){
		this.dialog = opt.dialog;
		this.model = opt.model;
		this.model.on("change:targetBank",this.onModelTargetBankChange);
		this.model.on("targetBank.ajax.loading",function(){
			console.log("targetBank.ajax.loading")
		})
	},
	tpl : require("../../tpl/dialog_card.tpl"),
	onModelTargetBankChange : function(model){

	},
	onNextStep : function(e){
		var tarBtn = $(e.currentTarget);

	},
	onKeywordChange : function(e){
		var tarInp = $(e.currentTarget);
		var keyword = $.trim(tarInp.val());
		this.model.set({keyword:keyword});
	},
	open : function(){
		var that = this;
		var title = "添加银行卡";
		var tpl = this.tpl;
		this.dialog.open({
			container : {
				header : title,
				content : tpl
			},
			overlay : false,
			offsetY : -100,
			drag : true,
			events : {
				"click #nextStepBtn_bankMsg" : function(e){
					that.onNextStep(e);
				},
				"keyup #bankKeywordInp" : function(e){
					that.onKeywordChange(e);
				}
			}
		})
	}
});
module.exports = DialogCard;