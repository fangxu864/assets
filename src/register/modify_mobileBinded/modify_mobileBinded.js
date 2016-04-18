/**
 * Created by Administrator on 16-4-18.
 */
var Dialog = require("../../../common/modules/easydialog");
var tpl = require("../tpl/modify_mobileBinded.html");
var getOldMobile = function(){
	return "18750178296";
	return $("#mob").val();
};

var Main = {
	init : function(){
		this.bindEvents();
		var s = "blur #modifyDialogBox .submitBtn";
	},
	bindEvents : function(){
		var that = this;
		$("#modifyBtn").on("click",function(e){
			Dialog.open({
				container : {
					header : '修改绑定手机号',
					content : tpl
				},
				offsetY : -160,
				overlay : false,
				events : {
					"blur #modifyDialogBox .vcodeInp" : function(e){
						var tarInp = $(e.currentTarget);
						that.onVCodeInpBlur(tarInp);
					},
					"focus #modifyDialogBox .textInp" : function(e){
						var tarInp = $(e.currentTarget);
						that.onTextInpFocus(tarInp);
					},
					"click #modifyDialogBox .submitBtn" : function(e){
						that.onSubmitBtnClick(e);
					},
					"click #modifyDialogBox .getVCodeBtn" : function(e){
						that.onGetVCodeBtnClick($(e.target));
					}
				}
			})
			$("#mobile_old").text(getOldMobile());
		})
	},
	onVCodeInpBlur : function(tarInp){
		var val = $.trim(tarInp.val());
		var parent = tarInp.parents(".rt");
		if(val.length!=6){
			parent.addClass("error");
			return false;
		}else{
			parent.removeClass("error");
			return true;
		}
	},
	onGetVCodeBtnClick : function(tarBtn){
		if(tarBtn.hasClass("disable")) return false;

	},
	onTextInpFocus : function(tarInp){
		tarInp.parents(".rt").removeClass("error");
	},
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		if(tarBtn.hasClass("old")){
			if(!this.onVCodeInpBlur($("#vcodeInpOld"))) return false;
			var slideContainer = $("#slideContainer");
			slideContainer.animate({left:-slideContainer.children().first().width()})
		}else if(tarBtn.hasClass("new")){

		}
	}
}

$(function(){
	Main.init();
})