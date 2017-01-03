

require("./index.css");
var Cookie = require("./cookies.js");


var appIntro = {


	init : function(mid){

		var that = this;

		this.temp = '<div id="introMask"></div>' +   
					'<div id="introHelper"></div>';  


		//cookie部分
		// var visited = Cookie.getCookie("memberIntro"+mid); 
		// if(visited == ""){
		// 	console.log("第一次访问");						
		// 	Cookie.setCookie("memberIntro"+mid,1,100); //Cookie的名称、值以及过期天数(年)
		// 	this.step1();		
		// }else{
		// 	console.log("不是第一次访问，访问memberId为"+mid);
		// 	return false
		// }


		this.step1();		

		$("#introNext").on("click",function(){
			that.step2();
		});

		

	},

	step1 : function(){

		this.pic1 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide03.png" id="introImg1">';	
		this.arrpic1 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide03-arr.png" id="introImgArr1">';
		this.next = '<div id="introNext"></div>';

		$("body").append(this.temp);			
		$("#introHelper").append(this.pic1);
		$("#introHelper").append(this.arrpic1);
		$("#introHelper").append(this.next);

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



	},


	step2 : function(){

		console.log("step2");
		var that = this;

		this.pic2 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide04.png" id="introImg2">';	
		this.arrpic2 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide04-arr.png" id="introImgArr2">';
		this.tag2 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide04-tag.png" id="introImgTag2">';
		this.helper2 = '<div id="introHelper2"></div>';
		this.helper3 = '<div id="introHelper3"></div>';
		this.next2 = '<div id="introNext2"></div>';

		$("#introImg1").remove();
		$("#introImgArr1").remove();
		$("#introNext").remove();

		$("#introHelper").append(this.pic2);
		$("#introHelper").append(this.arrpic2);
		$("#introHelper").append(this.tag2);
		$("#introHelper").append(this.next2);
		$("#introHelper").append(this.helper2);
		$("#introHelper").append(this.helper3);

		$("#introHelper").css({
			"background" : "none" 
		});

		$(".section-applist").css({
			"position" : "",
			"z-index" : ""
		});

		$(".tab-list").addClass('introNow').css("background","white");
		$(".app-list1 li").eq(0).addClass("introNow");
		$("a:contains('票券验证')").addClass("introNow");

		$("#introNext2").on("click",function(){
			that.step3();
		});


	},

	step3 : function(){

		this.pic3 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide05.png" id="introImg3">';	
		this.arrpic3 = '<img src="http://static.12301.cc/assets/build/images/appcenter/guide/guide05-arr.png" id="introImgArr3">';
		this.next3 = '<div id="introNext3"></div>';
		this.helper4 = '<div id="introHelper4" class="introHelper3"></div>';
		this.helper5 = '<div id="introHelper5" class="introHelper3"></div>';
		this.helper6 = '<div id="introHelper6" class="introHelper3"></div>';
		this.helper7 = '<div id="introHelper7" class="introHelper3"></div>';

		$("#introHelper2").remove();
		$("#introHelper3").remove();
		$("#introImg2").remove();
		$("#introImgArr2").remove();
		$("#introImgTag2").remove();
		$("#introNext2").remove();

		$(".tab-list").removeClass('introNow').css("background","");
		$(".app-list1 li").eq(0).removeClass("introNow");
		$("a:contains('团购导码')").removeClass("introNow");

		$("#introHelper").append(this.pic3);
		$("#introHelper").append(this.arrpic3);
		$("#introHelper").append(this.next3);
		$("#introHelper").append(this.helper4);
		$("#introHelper").append(this.helper5);
		$("#introHelper").append(this.helper6);
		$("#introHelper").append(this.helper7);

		$("a:contains('票券验证')").addClass("introNow");
		$("a:contains('订单查询')").addClass("introNow");
		$("a:contains('团购配置')").addClass("introNow");
		$("a:contains('团购导码')").addClass("introNow");

		$("#introNext3").on("click",function(){
			window.location.href = "appcenter_details.html";
		});



	}



}


module.exports = appIntro;





















