

require("./index.scss");
var Toast = require("COMMON/modules/Toast");

var Transit = PFT.Util.Class({

	container : $("#transitWrap"),
	EVENTS : {       
		"click #gotoLogin" : "ongotoLogin"
	},
	init : function(opt){         

		var that = this;
		
		this.toast = new Toast();

		PFT.Util.Ajax("/r/MicroPlat_Member/loginChoose",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken()
		    },
		    loading : function(){
		        that.toast.show("loading");
		    },
		    complete : function(){
		        that.toast.hide();
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){
		        	var account = data.account;
					$(".account").text(account);
					var url = data.url;
					that.Countdown(url);

					$("#gotoMall").on("click",function(){
						window.location.href = url;
					});

		        }else if(code==201){
		            window.location.href = "login.html";
		        }else{
					PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
				}
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	},
	Countdown : function(url){
		var down = 10;
		setInterval(function(){
			down -= 1;
			$(".CountdownSecond").text(down + "s");			
			if(down == 0){
				window.location.href = url;
			}
		},1000);
	},
	ongotoLogin : function(){

		var that = this;

		//退出登录
		PFT.Util.Ajax("/r/MicroPlat_Member/logout",{
			type : "POST",
		    dataType : "json",
		    params : {
		    	token : PFT.Util.getToken()
		    },
		    loading : function(){
		        that.toast.show("loading");
		    },
		    complete : function(){
		        that.toast.hide();
		    },
		    success : function(res){
		        var code = res.code;
		        var data = res.data;
		        if(code==200){
					console.log(res);
					window.location.href = "login.html";
		        }else{
					PFT.Mobile.Alert(res.msg || PFT.AJAX_ERROR)
				}
		    },
		    timeout : function(){ PFT.Mobile.Alert("请求超时") },
		    serverError : function(){ PFT.Mobile.Alert("请求出错")}
		})

	}


});


$(function(){
	new Transit();
});









