/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var UserInfo = require("./userinfo");
var CardList = require("./card-list");
var OrderInfo = require("./orderinfo");
var CheckExistDialog = require("./check-exist-dialog");
var Api = require("../../common/api.js");
var Format = function (date,fmt) { //author: meizz
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {
		"click #submitBtn" : "onSubmitBtnClick"
	},
	initialize : function(){
		var that = this;
		this.submitBtn = $("#submitBtn");
		this.urlParams = PFT.Util.UrlParse();
		this.pid = this.urlParams["pid"];
		this.aid = this.urlParams["aid"];
		this.physics = this.urlParams["physics"]; //如果有physics参数 说明购买的是实体卡  反之，则购买的是虚拟卡
		this.type = this.physics ? "physics" : "virtual";
		this.UserInfo = new UserInfo();
		this.CardList = new CardList();
		this.OrderInfo = new OrderInfo();
		this.CheckExistDialog = new CheckExistDialog();
		this.CheckExistDialog.on("replaceAndSubmit",function(submitData){
			that.submit(submitData);
			this.close();
		})
	},
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var pid = this.pid;
		var aid = this.aid;
		var userinfo = this.UserInfo.getUserInfo();
		var name = userinfo.name;
		var mobile = userinfo.mobile;
		var id_card = userinfo.id_card;
		var note = userinfo.note;
		if(!pid || !aid) return false;
		if(name=="error" || mobile=="error" || id_card=="error") return false;
		var pay = $("#paytypeContainer").find("input[type=checkbox]:checked");
		//授信支付=2  帐户余额=0  在线支付=1  自供应=3
		var paymode = pay.length ? pay.val() : "3";
		var sid = this.CardList.getSid();
		if(!sid) throw new Error("缺少sid");
		var pids = {};
		pids[pid] = 1;
		this.checkHasBand({
			pid : this.pid,
			aid : this.aid,
			paymode : paymode,
			ordertel : mobile,
			mobile : mobile,
			name : name,
			ordername : name,
			id_card : id_card,
			idCard : id_card,
			sid : sid,
			pids : pids
		})
	},
	//如果购买虚拟卡，订单提交之前需要先请你去这个接口，判断会员是否已经绑定过其他年卡
	checkHasBand : function(opt){
		opt = opt || {};
		var that = this;
		var submitBtn = this.submitBtn;
		var mobile = opt.mobile;
		var name = opt.name;
		var id_card = opt.id_card || "";
		var sid = opt.sid;
		if(this.type=="physics") return this.submit(opt);
		if(!mobile || !name || !sid) throw new Error("缺少mobile或name或sid");
		PFT.Util.Ajax(Api.Url.makeOrder.isNeedToReplace,{
			type : "post",
			params : {
				mobile : mobile,
				name : name,
				id_card : id_card,
				sid : sid
			},
			loading : function(){ submitBtn.addClass("disable")},
			complete : function(){ submitBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					var exist = data.exist;
					var name = data.name;
					var left = data.left;
					if(exist==1){ //已存在
						that.CheckExistDialog.open({
							mobile : mobile,
							idCard : id_card,
							name : name,
							left : left,
							submitData : opt
						});
					}else{
						that.submit(opt);
					}
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	submit : function(opt){
		var submitBtn = this.submitBtn;
		var data = {
			pid : opt.pid,
			aid : opt.aid,
			idCard : opt.idCard,
			paymode : opt.paymode,
			ordertel : opt.ordertel,
			ordername : opt.ordername,
			pids : opt.pids
		};
		data["begintime"] = Format(new Date,"yyyy-MM-dd");
		PFT.Util.Ajax(Api.Url.makeOrder.submit,{
			type : "post",
			params : data,
			loading : function(){ submitBtn.addClass("disable")},
			complete : function(){ submitBtn.removeClass("disable")},
			success : function(res){
				res = res || {};
				var status = res.status || "";
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(status=="success"){
					alert("下单成功");
				}else if(status=="fail"){
					alert(msg)
				}
			}
		})
	}
});

$(function(){
	new MainView();
})
