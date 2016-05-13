/**
 * Author: huangzhiyang
 * Date: 16-5-10 上午10:26
 * Description: ""
 */
var EaseDialog = require("COMMON/modules/easydialog");
var Validate = require("COMMON/js/util.validate.js");
var UrlParse = require("COMMON/js/util.url.parse.query.js");
var Ajax = require("COMMON/js/util.ajax.js");
require("../css/style.css");
var Main = {
	timer : null,
	init : function(){
		this.pwdInp = $("#ch_ops");
		this.newPwdInp = $("#ch_nps");
		this.newPwdInp_tip = $("#ptxt");
		this.newPwdInp_tip_text = this.newPwdInp_tip.text();
		this.rePwdInp = $("#ch_dps");
		this.levelBar = $("#plvl");
		this.showPwdBtn = $("#showPwdBtn");
		this.submitBtn = $("#submitBtn");
		this.bindEvents();
		if(this.checkNeedModify()) this.dialog();
	},
	bindEvents : function(){
		var that = this;
		var pwdInp = this.newPwdInp;
		this.newPwdInp.on("keyup",function(e){
			clearTimeout(that.timer);
			that.timer = setTimeout(function(){
				that.onNewPwdInpKeyup(e);
			},100)
		})
		this.showPwdBtn.on("mousedown",function(e){
			pwdInp.prop("type","text")
		})
		this.showPwdBtn.on("mouseup",function(e){
			pwdInp.prop("type","password")
		})
		this.submitBtn.on("click",function(e){
			e.stopPropagation();
			e.preventDefault();
			that.onSubmitBtnClick(e);
		})
	},
	onNewPwdInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var levelBar = this.levelBar;
		var tip = this.newPwdInp_tip;
		var tip_origin_text = this.newPwdInp_tip_text;
		var val = $.trim(tarInp.val());
		var result = Validate.validatePwd(val);
		var error = result.error; //此密码是否可用，如果error为空，则此密码可用
		var level = result.level; //此密码的安全等级  weak=弱  normal=中  strong=强
		if(error){
			if(error=="密码不能为空"){
				tip.removeClass("error").text(tip_origin_text);
			}else{
				tip.addClass("error").text(error);
			}
			levelBar.removeClass().addClass("con1");
		}else{
			tip.removeClass("error").html("<i style='font-size:18px; color:#3eba40' class='iconfont'>&#xe64c;</i>");
			var cls = "qia";
			if(level=="weak"){
				level = "1";
			}else if(level=="normal"){
				level = "2";
			}else if(level=="strong"){
				level = "3";
			}
			levelBar.addClass(cls+level);
		}
	},
	//点击提交
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var pwdInp = this.pwdInp;
		var newPwdInp = this.newPwdInp;
		var rePwdInp = this.rePwdInp;
		var pwd = $.trim(pwdInp.val());
		var newPwd = $.trim(newPwdInp.val());
		var rePwd = $.trim(rePwdInp.val());
		var newPwdInp_tip = this.newPwdInp_tip;
		if(newPwdInp_tip.hasClass("error")) return false;
		if(!pwd) return alert("请填当前密码");
		if(!newPwd) return alert("请输入新密码");
		if(newPwd!==rePwd) return alert("两次输入的密码不一致,请再次输入新密码");
		Ajax("route/index.php?c=Member&a=resetPassword",{
			type : "post",
			params : {
				old:pwd,
				new_pwd:newPwd,
				confirm_pwd:rePwd
			},
			loading : function(){ tarBtn.addClass("disable").val("正在修改...")},
			complete : function(){ tarBtn.removeClass("disable").val("确认修改")},
			success : function(res){
				var res = res || {};
				var code = res.code;
				var msg = res.msg;
				if(code==200){
					alert("修改成功");
				}else{
					alert(msg || "未知错误");
				}
			}
		})
	},
	dialog : function(){
		EaseDialog.open({
			container : {
				header : "请修改密码",
				content : (function(){
					return '<div style="width:300px; padding:10px 20px; color:#df0024">系统检测到您的密码为弱密码，为了保障您的资金安全，请修改密码后再进行其他操作</div>'
				})()
			},
			offsetY : -100,
			drag : false
		})
	},
	checkNeedModify : function(){
		//code==201
		return UrlParse().code==201 ? true : false;
	}
};

$(function(){ Main.init()})