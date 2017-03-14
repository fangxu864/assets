/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */
require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
var Message = require("pft-ui-component/Message");
var numberToFixed = PFT.Util.numberToFixed;
module.exports = function(parent){

	var container = $('<div id="UserInfoBox" class="UserInfoBox modBox"></div>').appendTo(parent);

	var UserInfo = PFT.Util.Class({
		debug : false,
		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		EVENTS : {
			"click .switchBox" : "onSwitchBoxClick",
			"click .tipBox .modifyBtn" : "onModifyBtnClick",
			"click .maBoxContainer .link" : "onMaLinkClick"
		},
		init : function(){
			this.fetch();
		},
		initMaBox : function(){
			var maImg = $("#homeMaImg").clone().show();
			this.container.children(".maBoxContainer").find(".maBox").append(maImg);
			setTimeout(function(){
				//复制二维码链接
				$("#copyMaLink").zclip({
					path: "wx_public/zclip/ZeroClipboard.swf",
					copy: function(){
						return "1223423423"
						return $(this).attr("data-link");
					},
					deforeCopy : function(){},
					afterCopy : function(){
						Message.success("已复制到剪贴板");
					}
				});
			},2000)
		},
		onSwitchBoxClick : function(e){
			var that = this;
			var target = $(e.currentTarget);
			var toState = target.hasClass("on") ? "off" : "on";
			if(toState=="off"){ //关
				Message.confirm("确定要关闭余额阀值提醒吗？",function(result){
					if(!result) return false;
					that.ajaxFaZhi(0);
				})
			}else{ //开
				Message.prompt("请设置余额提醒阀值","0",function(result,value){
					if(!result) return false;
					if(!PFT.Util.Validate.typeInit(value)) return Message.error("金额必须是大于0的整数");
					that.ajaxFaZhi(value);
				})
			}
		},
		onModifyBtnClick : function(e){
			var that = this;
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var orignValue = $("#balanceNoticeBox").find(".fazhi").text();
			Message.prompt("请输入余额提醒阀值",orignValue,function(result,value){
				if(!result) return false;
				if(!PFT.Util.Validate.typeInit(value)) return Message.error("金额必须是大于0的整数");
				that.ajaxFaZhi(value,tarBtn);
			})
		},
		render : function(data){
			var html = this.template(data);
			this.container.html(html);
		},
		ajaxFaZhi : function(value,tarBtn){
			var successText = value==0 ? "余额预警阀值关闭成功" : "余额预警阀值设置成功";
			var balanceNoticeBox = $("#balanceNoticeBox");
			var switchBox = balanceNoticeBox.find(".switchBox");
			var tipBox = balanceNoticeBox.find(".tipBox");
			var orignText = tarBtn ? tarBtn.text() : "";
			Common.Ajax(Common.api.Home_HomeMember.setRemainWaring,{
				type : "post",
				params : {
					val : value * 100
				},
				loading : function(){
					if(tarBtn) tarBtn.addClass("disable").text("请稍后");
				},
				complete : function(){ if(tarBtn) tarBtn.removeClass("disable").text(orignText);},
				success : function(res){
					var code = res.code;
					var msg = res.msg || PFT.AJAX_ERROR_TEXT;
					if(code==200){
						Message.success(successText);
						if(!tarBtn) switchBox.toggleClass("on");
						if(value==0){
							switchBox.find(".text").text("已关");
							tipBox.hide();
						}else{
							switchBox.find(".text").text("已开");
							tipBox.show().find(".fazhi").text(value);
						}
					}else{
						Message.fail(msg);
					}
				},
				serverError : function(){
					Message.error(PFT.AJAX_ERROR_TEXT);
				}
			})
		},
		fetch : function(){
			var that = this;
			var html = Loading("努力加载中...");
			var container = this.container;
			Common.Ajax(Common.api.Home_HomeMember.getMemberInfo,{
				loading : function(){
					container.html(html);
				},
				complete : function(){ container.html("")},
				success : function(res){
					var code = res.code;
					var msg = res.msg;
					var data= res.data;
					if(code==200){
						var unread = res.data.unread;
						data["remainMoney"] = numberToFixed(data.remainMoney/100,2);
						data["warning"] = numberToFixed(data.warning/100,2);
						that.render(res.data);
						that.initMaBox();
					}else{
						Message.error(msg);
					}
				},
				serverError : function(){
					Message.error(PFT.AJAX_ERROR_TEXT);
				}
			})


		}
	});


	return new UserInfo;
};