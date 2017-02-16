/**
 * Created by Administrator on 16-4-15.
 */
var CitySelect = require("COMMON/js/component.city.select.js");
var VInfo = Backbone.View.extend({
	el : $("#infoForm"),
	events : {
		"click #jumpFromInfoBtn" : "onJumpFromInfoBtnClick",
		"click #infoSubmitBtn" : "onInfoSubmitBtnClick"
	},
	initialize : function(opt){
		this.router = opt.router;
		this.getDtype = opt.getDtype;
		this.accountInp = $("#accountInp");
		this.addrInp = $("#addrInp");
		this.businessTextarea = $("#businessTextarea");
		this.submitBtn = $("#infoSubmitBtn");
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
		var nickname = $.trim(this.accountInp.val());
		var dtype = this.getDtype();
		var company_type = this.$el.find("input[type=radio][name=ctype"+dtype+"]:checked").val();
		var pc = this.citySelect.getVal();
		var province = pc.prov;
		var city = pc.city;
		var address = this.addrInp.val();
		var business = this.businessTextarea.val();
		var token = $("#csrf_token").val();
		var submitData = {
			nickname : nickname,
			company_type : company_type,
			province : province,
			city : city,
			address : address,
			business : business,
			token : token
		};
		this.submit(submitData);
	},
	submit : function(data){
		var that = this;
		var api = PFT.Config.Api.get("Member_Register","accountInfo");
		var submitBtn = this.submitBtn;
		PFT.Util.Ajax(api,{
			type : "post",
			params : data,
			loading : function(){ submitBtn.addClass("disable")},
			complete : function(){ submitBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				if(res.code==200){
					that.router.navigate("/step/3",{trigger:true});
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	}
});
module.exports = VInfo;