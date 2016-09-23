var scrollTime = 200;
var timer = null;
var siteGotopBtn = null;
function init(){
	var $doc = $(document);
	$("#siteLogoutBtn").on("click",function(e){
		logout();
		e.preventDefault();
	})
	$("#siteAddFavBtn").on("click",function(e){
		AddFavorite("http://www.12301.cc/",'票付通');
		e.preventDefault();
	})
	$("#siteSetHomeBtn").on("click",function(e){
		SetHome(this,"http://www.12301.cc/");
		e.preventDefault();
	})
	$("#siteGotopBtn").on("click",function(e){
		$("html,body").animate({"scrollTop":0},200);
	})
	var maCode = $("#siteMaBox .code_icon");
	var maCode_img = maCode.find(".code_img");
	maCode.mouseover(function(){
		maCode_img.css("display","block");
	});
	maCode.mouseout(function(){
		maCode_img.css("display","none");
	});
	maCode_img.mouseover(function(){
		maCode_img.css("display","block");
	});
	maCode_img.mouseout(function(){
		maCode_img.css("display","none");
	});
	siteGotopBtn = $("#siteGotopBtn");
	$doc.scroll(function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			if($doc.scrollTop()>200){
				siteGotopBtn.css("display","block");
			}else{
				siteGotopBtn.css("display","none");
			}
		},scrollTime)
	})

	//异步获取未读信息数量
	getunReadMsg();

	// 页面ready时，计算leftbar的高度
	// 如果main body的height小于leftbar height则 将leftbar height 赋值给 main body
	//setLeftBarHeightToMainBody();
}
//登出
var logout = function(){
	$.ajax({
		"url":handleApi,
		"data":{"from":"logout"},
		"dataType":"json",
		"success":function(data){
			if(data.outcome==2){
				window.location.href=data.link;
			}else{
				window.location.href="/dlogin_n.html";
			}
		},
		"error":function(){
			window.location.href="/dlogin_n.html";
		}
	});
};


var handleApi = (function(){
	var api = "";
	var __host = {
		"www.12301.cc" : 1,
		"www.12301.local" : 1,
		"www.12301.test" : 1,
		"www.12301dev.test" : 1
	};

	if(__host[window.location.hostname]){ //非独立域名
		api = "/call/handle.php";
	}else{ //独立域名
		api = "/new/d/call/handle.php";
	}

	return api;

})();



//异步获取未读信息数量
var getunReadMsg = function() {
	$.ajax({
		"url":handleApi,
		"data":{"from":"getUnReadMsgNum"},
		"dataType":"json",
		"success":function(data){
			var num = data.num;
			$('#siteAccountMsgCount').html(num);
		},
		"error":function(){
			$('#siteAccountMsgCount').html(0);
		}
	});
}

//加入收藏
var AddFavorite = function(sURL, sTitle){
	try{
		window.external.addFavorite(sURL, sTitle);
	}catch(e){
		try{
			window.sidebar.addPanel(sTitle, sURL, "");
		}catch(e){
			alert("加入收藏失败，请使用Ctrl+D进行添加");
		}
	}
}
//设为首页
var SetHome = function(obj,vrl){
	if (document.all){
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(window.location.href);
	}else if (window.sidebar){
		if(window.netscape){
			try{
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}catch (e){
				alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" );
			}
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage',window.location.href);
	}else{
		alert('您的浏览器不支持自动自动设置首页, 请使用浏览器菜单手动设置!');
	}
};

//页面ready时，计算leftbar的高度 赋值给 main body
var setLeftBarHeightToMainBody = function(){
	var mainBody = $("#PageMainBodyContainer");
	var leftBar = $("#PageLeftBarContainer");
	var mainBody_H = mainBody.height();
	var leftBar_H = leftBar.outerHeight();
	if(leftBar_H>mainBody_H) mainBody.css("minHeight",leftBar_H)
};


module.exports = {
	init : init
}




