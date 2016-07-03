/**
 * Author: huangzhiyang
 * Date: 2016/6/17 11:04
 * Description: ""
 */
var UserInfoView = Backbone.View.extend({
	el : $("#userInfoContainer"),
	events : {
		"focus .validateInp" : "onTextInpFocus",
		"blur .validateInp" : "onTextInpBlur"
	},
	initialize : function(){
		this.nameInp = $("#userinfo_nameInp");
		this.mobileInp = $("#userinfo_mobileInp");
		this.idCardInp = $("#userinfo_idCardInp");
		this.noteInp = $("#userinfo_noteInp");
		this.nameError = this.nameInp.parent().find(".tip");
		this.mobileError = this.mobileInp.parent().find(".tip");
		this.idCardError = this.idCardInp.parent().find(".tip");
	},
	onTextInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		var tip = tarInp.parent().find(".tip");
		tip.removeClass("error").text(tarInp.attr("id")=="userinfo_idCardInp" ? "" : "必填项");
	},
	onTextInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		var name = tarInp.attr("name");
		var val = $.trim(tarInp.val());
		var error = "";
		if(name=="name"){
			if(this.validateName(val)) this.nameError.addClass("error");
		}else if(name=="mobile"){
			error = this.validateMobile(val);
			if(error) this.mobileError.addClass("error").text(error);
		}else if(name=="id_card"){
			error = this.validateIDCard(val);
			if(error) this.idCardError.addClass("error").text(error);
		}
	},
	validateName : function(name){
		if(name=="") return "请填写购买人姓名";
	},
	validateMobile : function(mobile){
		if(mobile==""){
			return "必填项";
		}else if(!PFT.Util.Validate.typePhone(mobile)){
			return "请输入正确格式手机号";
		}
	},
	validateIDCard : function(idCard){
		var idCardInp = this.idCardInp;
		var isRequire = idCardInp.attr("data-needid");
		if(isRequire==1){ //要求必填
			if(!idCard){
				return "请输入身份证号";
			}else if(!PFT.Util.Validate.idcard(idCard)){
				return "请输入正确身份证号";
			}
		}else{ //不要求必填，可选项，但如果填写了，格式要求正确
			if(idCard && !PFT.Util.Validate.idcard(idCard)) return "请输入正确身份证号";
		}
	},
	getUserInfo : function(){
		var name = $.trim(this.nameInp.val());
		var mobile = $.trim(this.mobileInp.val());
		var id_card = $.trim(this.idCardInp.val());
		var notes = this.noteInp.val();
		this.nameInp.blur();
		this.mobileInp.blur();
		this.idCardInp.blur();
		return{
			name : this.validateName(name) ? "error" : name,
			mobile : this.validateMobile(mobile) ? "error" : mobile,
			id_card : this.validateIDCard(id_card) ? "error" : id_card,
			note : notes
		}
	}
});
module.exports = UserInfoView;