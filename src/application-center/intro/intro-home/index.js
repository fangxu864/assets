

require("./index.scss");
var Cookie = require("./cookies.js");

var homeIntro = {

	init : function(){
		this.temp = '<div id="introMask"></div>' +   
					'<div id="introHelper"></div>'+
					'<div id="introMask2"></div>';  

		this.memberID = $("#memberId").attr("data-id");			


		// 0不是散客1是散客
		var sanke = $("#sanke").val();

		if( sanke == 1){//散客没有应用中心权限
			return false
		}


		// cookie部分
		var visited = Cookie.getCookie("memberIntro1"+this.memberID); 
		if(visited == ""){
			Cookie.setCookie("memberIntro1"+this.memberID,1,100); //Cookie的名称、值以及过期天数(年)
			this.step1();		
		}else{
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
						
		this.helpr1 =       '<div id="introHelper2" class="introHelper1"></div>'+
						    '<div id="introHelper3" class="introHelper1"></div>'+
			                '<div id="introHelper4" class="introHelper1"></div>';

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

		this.setSideBarHL($("a:contains('B2C')"),$("#introHelper2"));
		this.setSideBarHL($("a:contains('数据罗盘')"),$("#introHelper3"));
		this.setSideBarHL($("a:contains('微信公众号')"),$("#introHelper4"));

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
		this.helpr2 = '<div id="introHelper6" class="introHelper2"></div>';

		$("#introHelper").empty();
		$("#introHelper2").remove();
		$("#introHelper3").remove();
		$("#introHelper4").remove();

		$("a:contains('B2C')").removeClass("introNow");
		$("a:contains('数据罗盘')").removeClass("introNow");
		$("a:contains('微信公众号')").removeClass("introNow");

		$("#introHelper").append(this.temp2);
		$("body").append(this.helpr2);
		window.scrollTo(0,document.body.scrollHeight);		

		this.setSideBarHL($("dt:contains('应用中心')"),$("#introHelper6"));

		$("#introNext2").on("click",function(){
			window.location.href = "new/appcenter.html";
		});

	},


	setSideBarHL : function(a,helper){

		if(a.length > 0){
			var tagType = a[0].tagName; 
			a.addClass("introNow");
			var offset = a.offset();
			var left = offset.left;
			var top = offset.top;
			if(tagType == "A"){
				helper.css({
					"left" : left-10,
					"top" : top-6
				});
			}else{
				helper.css({
					"left" : left-10,
					"top" : top
				});
			}
		}else{
			helper.remove();
		}

	}

}


$(function(){
	homeIntro.init();
});

























