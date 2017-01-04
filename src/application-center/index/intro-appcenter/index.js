

require("./index.css");
var Cookie = require("./cookies.js");


var appIntro = {


	init : function(mid){

		var that = this;

		this.temp = '<div id="introMask"></div>' +   
					'<div id="introHelper"></div>';  

		// cookie部分
		var visited = Cookie.getCookie("memberIntro2"+mid); 
		if(visited == ""){
			console.log("第一次访问");						
			Cookie.setCookie("memberIntro2"+mid,1,100); //Cookie的名称、值以及过期天数(年)
			this.step1();		
		}else{
			console.log("不是第一次访问，访问memberId为"+mid);
			return false
		}

		$("#top-ad-close").on("click",function(){
			$(".topad-wrap").remove();
		});

		// this.step1();		
		

	},

	step1 : function(){

		var that = this;

		this.temp1 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide03.png" id="introImg1">'+
		            '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide03-arr.png" id="introImgArr1">'+
		            '<div id="introNext"></div>';

		$("body").append(this.temp);			
		$("#introHelper").append(this.temp1);

		var listContain = $(".section-applist");
		listContain.css({
			"position" : "relative",
			"z-index" : "99"
		});

		var h = listContain.outerHeight();
		var w = listContain.outerWidth();
		var offset = listContain.offset();
		var left = offset.left;
		var top = offset.top;

		$("#introHelper").css({
			"height" : h,
			"width" : w,
			"left" : left,
			"top" : top,
			"background" : "linear-gradient( rgba(0,0,0,.5),rgba(0,0,0,.5) 18%,rgba(0,0,0,0),rgba(0,0,0,.5) 48%,rgba(0,0,0,.5) )"
		});

		$("#introNext").on("click",function(){
			that.step2(left,top);
		});

	},


	step2 : function(l,t){

		var that = this;

		this.temp2 =  '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide04.png" id="introImg2">'+
		             '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide04-arr.png" id="introImgArr2">'+
		             '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide04-tag.png" id="introImgTag2">'+
		             '<div id="introHelper3"></div>';

		this.next2 = '<div id="introNext2"></div>'+'<div id="introMask2"></div>';

		$("#introHelper").empty();
		$("#introHelper").append(this.temp2);
		$("body").append(this.next2);

		$("#introHelper").css({
			"background" : "none" 
		});

		$("#introNext2").css({
			"left" : l+457,
			"top" : t+263
		});


		$(".section-applist").css({
			"position" : "",
			"z-index" : ""
		});

		$(".tab-list").addClass('introNow').css("background","white");
		$(".app-list1 li").eq(0).addClass("introNow");
		$("a:contains('票券验证')").addClass("introNow");
		$("#top-ad-close").addClass("introNow");

		$("#introNext2").on("click",function(){
			that.step3(l,t);
		});

	},

	step3 : function(l,t){

		this.temp3 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide05.png" id="introImg3">'+
					'<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide05-arr.png" id="introImgArr3">'+
					'<div id="introHelper4" class="introHelper3"></div>'+
					'<div id="introHelper5" class="introHelper3"></div>'+
					'<div id="introHelper6" class="introHelper3"></div>'+
					'<div id="introHelper7" class="introHelper3"></div>';

		$("#introHelper").empty();

		$("#introNext2").css({
			"left" : l+214,
			"top" : t+273,
			"width" : "112px"
		});

		$("#introHelper").append(this.temp3);

		$(".tab-list").removeClass('introNow').css("background","");
		$(".app-list1 li").eq(0).removeClass("introNow");
		$("a:contains('团购导码')").removeClass("introNow");
		$("a:contains('票券验证')").addClass("introNow");
		$("a:contains('订单查询')").addClass("introNow");
		$("a:contains('团购配置')").addClass("introNow");
		$("a:contains('团购导码')").addClass("introNow");

		$("#introNext2").off("click");
		$("#introNext2").on("click",function(){
			window.location.href = "appcenter.html";
		});

	}



}


module.exports = appIntro;





















