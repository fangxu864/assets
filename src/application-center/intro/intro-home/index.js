

require("./index.scss");
var Cookie = require("./cookies.js");

var homeIntro = {

	init : function(){
		this.temp = '<div id="introMask"></div>' +   
					'<div id="introHelper"></div>'+
					'<div id="introMask2"></div>';  

		this.memberID = $("#memberId").attr("data-id");			

		// cookie部分
		var visited = Cookie.getCookie("memberIntro1"+this.memberID); 
		if(visited == ""){
			console.log("第一次访问");						
			Cookie.setCookie("memberIntro1"+this.memberID,1,100); //Cookie的名称、值以及过期天数(年)
			this.step1();		
		}else{
			console.log("不是第一次访问，访问memberId为"+this.memberID);
			return false
		}			

		// this.step1();		

	},


	step1 : function(){

		var that = this;

		this.temp1 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide01.png" id="introImg1">'+
					'<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide01-arr.png" id="introImgArr1">'+
				    '<div id="introNext"></div>'+
				    '<div id="introExit"></div>';
						
			this.helpr1 =   '<div class="helper1Wrap">'+
		 		 			    '<div id="introHelper2" class="introHelper1"></div>'+	
							    '<div id="introHelper3" class="introHelper1"></div>'+
				                '<div id="introHelper4" class="introHelper1"></div>'+
				                '<div id="introHelper5" class="introHelper1"></div>'+
		                    '</div>';	

		$("body").append(this.temp);	
		$("body").append(this.helpr1);		
		$("#introHelper").append(this.temp1);

		var Contain = $(".con_memb");
		var offset = Contain.offset();
		var left = offset.left;
		var top = offset.top;
		$("#introHelper").css({
			"left" : left,
			"top" : top
		});

		var left_memb = $(".left_memb");
		var loffset = left_memb.offset();
		var lleft = loffset.left;
		var ltop = loffset.top;
		$(".helper1Wrap").css({

			"left" : lleft,
			"top" : ltop

		});

		$("a:contains('票券验证')").addClass("introNow");
		$("a:contains('计调下单')").addClass("introNow");
		$("a:contains('B2C/微商城')").addClass("introNow");
		$("a:contains('微信公众号配置')").addClass("introNow");

		$("#introExit").on("click",function(){  //退出介绍
			$("#introMask").remove();
			$("#introHelper").remove();
			$("#introMask2").remove();
			$(".helper1Wrap").remove();
		});
		$("#introNext").on("click",function(){  //下一步
			that.step2();
		});

	},


	step2 : function(){

		this.temp2 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide02.png" id="introImg2">'+
					'<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide02-arr.png" id="introImgArr2">'+
					'<div id="introNext2"></div>'+
					'<div id="introMask2"></div>';

		$("#introHelper").empty();
		$(".helper1Wrap").remove();

		$("a:contains('票券验证')").removeClass("introNow");
		$("a:contains('计调下单')").removeClass("introNow");
		$("a:contains('B2C/微商城')").removeClass("introNow");
		$("a:contains('微信公众号配置')").removeClass("introNow");

		$("#introHelper").append(this.temp2);
		window.scrollTo(0,document.body.scrollHeight);

		$("#introNext2").on("click",function(){
			window.location.href = "new/appcenter.html";
		});

	}

}


$(function(){
	homeIntro.init();
});

























