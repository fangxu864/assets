/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */
require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
module.exports = function(parent){

	var container = $('<div id="UserInfoBox" class="UserInfoBox modBox"></div>').appendTo(parent);

	var UserInfo = PFT.Util.Class({
		debug : true,
		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			this.fetch();
			console.log(this.container)
		},
		render : function(data){
			var html = this.template(data);
			this.container.html(html);
		},
		fetch : function(){
			var that = this;
			var html = Loading("努力加载中...");
			var container = this.container;
			if(this.debug){
				container.html(html);
				setTimeout(function(){
					container.html("");
					that.render({
						"name": "慢慢的店铺",   //账号名称
						"cname" : "天地银行",   //公司名称
						"type" : 1, //账号类型,0供应商,1分销商
						'hasAuth' : 1, //是否认证
						"remainMoney": 111,     //余额
						"expireDate" : "2012-1-1",   //到期时间
						"mobile": 123123123123,      //手机号
						"abnormalOrder" : 12,    //异常订单  ,
						"lastLogin" : "2012-1-1", //上次登陆时间
						"avatar" : "http://images.12301.cc/123624/1452148699.png" //头像
					});
				},1000);
				return false;
			}

			Common.Ajax(Common.api.Home_HomeMember.getMemberInfo,{
				loading : function(){
					container.html(html);
				},
				complete : function(){ container.html("")},
				success : function(res){
					var code = res.code;
					var msg = res.msg;
					if(code==200){
						that.render(res.data);
					}else{
						alert(msg);
					}
				}
			})


		}
	});


	return new UserInfo;
};