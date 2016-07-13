/**
 * Created by Administrator on 15-12-8.
 */
var PFT_MALL = {
	default_account_name : "",
	logo_short : {
		trans : "http://wx.12301.cc/mall/modules/common/images/pft_logo_short_trans.png",
		white : "http://wx.12301.cc/mall/modules/common/images/pft_logo_short_white.png"
	},
	/**
	 * 涉及到需要登录权限的，都调这个方法，直接跳到login.html页面
	 * @param mobile (可不传) 用于下单页面，用户填写的取票人手机号已被注册时，在跳转到登录页，需要把此手机号带过来，并提用户以此手机号登录
	 */
	unlogin : function(mobile){
		var href = window.location.href;
		var indx = href.indexOf("#");
		if(indx>0) href = href.substring(0,indx);
		var mobile = mobile ? ("&mobile="+mobile) : "";
		window.location.href = "login.html?to="+encodeURIComponent(href)+mobile;
	},
	loadingImg : "http://www.12301.cc/images/icons/gloading.gif",
	errorImg : "http://www.12301.cc/images/defaultThum.jpg",
	ajax_timeout : "请求超时，请稍后重试",
	ajax_serverError : "请求出错，请稍后重试",
	ajax_unlogin : "未登录或登录状态已过期，请重新登录",
	wx_js_appid : "wxd72be21f7455640d",
	isWX : function (){
		var ua = navigator.userAgent.toLowerCase();
		return (/micromessenger/.test(ua)) ? true : false;
	},
	showLoading : function(){
		$("#gmaskLayer").css({
			zIndex : 10001,
			display : "block"
		});
	},
	hideLoading : function(){
		$("#gmaskLayer").css({
			zIndex : -1,
			display : "none"
		});
	},
	get_parentid : function(){
		var search = window.location.search.substring(1).split("&");
		var parentid = "";
		for(var i in search){
			var s = search[i] || "";
			s = s.split("=");
			if(s[0]=="parentid"){
				parentid = s[1];
			}
		}
		return parentid;
	},
	storage_set_parentid : function(){
		var memberid = this.get_parentid();
		if(memberid){
			window.localStorage.setItem("memberid_from_share",memberid);
		}else{
			window.localStorage.removeItem("memberid_from_share");
		}
	},
	storage_get_parentid : function(){
		return window.localStorage.getItem("memberid_from_share");
	},
	validate_rules : {
		//非空
		noBlank: function( value ){
			return !!value;
		},
		//最小
		min: function( value, rule ){
			return value.length >= rule;
		},
		//最大
		max: function( value, rule ){
			return value.length <= rule;
		},
		//中文、英文
		typeZE: function( value ){
			return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z]+$/.test( value );
		},
		//英文、数字
		typeEN: function( value ){
			return /^[0-9|a-z|A-Z]+$/.test( value );
		},
		//数字
		typeNum: function( value ){
			return !isNaN( value );
		},
		//电话
		typePhone: function( value ){
			return /^1[0-9]{10}$/.test( value );
		},
		//email
		typeEmail: function( value ){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
		},
		//身份证号合法性验证
		//支持15位和18位身份证号
		//支持地址编码、出生日期、校验位验证
		idcard : function(code){
			var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
			var tip = "";
			var pass= true;

			if(!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)){
				tip = "身份证号格式错误";
				pass = false;
			}else if(!city[code.substr(0,2)]){
				tip = "地址编码错误";
				pass = false;
			}else{
				//18位身份证需要验证最后一位校验位
				if(code.length == 18){
					code = code.split('');
					//∑(ai×Wi)(mod 11)
					//加权因子
					var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
					//校验位
					var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
					var sum = 0;
					var ai = 0;
					var wi = 0;
					for (var i = 0; i < 17; i++)
					{
						ai = code[i];
						wi = factor[i];
						sum += ai * wi;
					}
					var last = parity[sum % 11];
					if(parity[sum % 11] != code[17]){
						tip = "校验位错误";
						pass =false;
					}
				}
			}
			return pass;
		}
	},
	/**
	 * 调用wx jsapi getLocation获取地理位置经纬度
	 * @param opt
	 */
	wx_getLocation : function(wx_obj,opt){
		if(!wx_obj || typeof wx_obj.getLocation!=="function") return console.log("wx未定义");
		var opt = opt || {};
		var fn = new Function;
		var loading = opt.loading || fn;
		var success = opt.success || fn;
		loading();
		wx.getLocation({
			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function (res) {
				var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				var speed = res.speed; // 速度，以米/每秒计
				var accuracy = res.accuracy; // 位置精度
				success(lng,lat,res);
			}
		});
	},
	getOpenBaiduMapLink : function(wx_obj,address,opt){
		var opt = opt || {};
		var fn = new Function;
		var loading = opt.loading || fn;
		var success = opt.success || fn;
		var address = address || "目的地";
		this.wx_getLocation(wx_obj,{
			loading : function(){
				loading();
			},
			success : function(lng,lat,res){
				var link = 'http://api.map.baidu.com/direction?origin=latlng:'+lat+','+lng+'|name:我的位置&destination='+address+'&mode=driving&output=html&src=pft';
				success(link);
			}
		})
	},
	setFontSize : function(){
		document.getElementsByTagName("html")[0].style.fontSize = window.innerWidth / 10 + "px";
	},
	urlParse : function(url){
		if(!url) url = window.location.search.substr(1);
		var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
		var result = {};
		url.replace(reg,function(){
			var key = arguments[2];
			var val = arguments[3];
			result[key] = val;
		})
		return result;
	}
};

PFT_MALL.DocumentTitle = (function(){
	var account_name = "";
	var account_banner = null;
	var hostname = window.location.hostname;

	var initShare = function(opt){
		//默认参数
		var DEFAULT_OPT = {
			account : "",      //用户帐户，如：123757   必填
			wx : null,         //微信内置浏览器的js对象  必填
			title : "title",
			desc : "全民分销微商城 要么旅行，要么开店，精神和物质，总有一个满足你！",  //微信分享时的描述文字
			imgUrl : "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png", //分享到朋友圈或发送给朋友时，显示的图片
			link : "http://"+hostname+"/wx/mall/index.html?parentid="+memberId,
			appId: "",          //wx jsapi appid       必填
			timestamp: "",      //时间戳                必填
			nonceStr: "",       //随机数                必填
			signature: "",      //签名                  必填
			memberId: ""  //上级分享者的id          必填
		};
		var wx = opt.wx;
		var account = window.location.hostname.split(".")[0];
		var default_link = account=="wx" ? "http://wx.12301.cc/mall/index.html" : "http://"+account+".12301.cc/wx/mall/index.html";
		if(!opt.link) opt["link"] = default_link;
		if(!wx) return alert("微信jsapi分享至朋友图缺省wx对象");
		var debug = (PFT_MALL.urlParse()["debug"]=="wx_share");
		var title = document.title || "title";

		wx.config({
			debug: opt.debug,
			appId: opt.appId,
			timestamp: opt.timestamp,
			nonceStr: opt.nonceStr,
			signature: opt.signature,
			jsApiList: [
				'checkJsApi',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'onMenuShareQZone'
			]
		});
		wx.ready(function () {
			wx.checkJsApi({
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareWeibo',
					'onMenuShareQQ',
					'onMenuShareQZone'
				],success: function(res){
					if(opt.debug) alert(JSON.parse(res))
				}
			});
			//分享到朋友圈(wx jsapi接口里，此接口没有desc属性)
			wx.onMenuShareTimeline({
				title : opt.title,
				imgUrl : opt.imgUrl,
				link : opt.link
			});
			//分享给朋友
			wx.onMenuShareAppMessage({
				title: opt.title, // 分享标题
				desc: opt.desc, // 分享描述
				link: opt.link, // 分享链接
				imgUrl: opt.imgUrl, // 分享图标
				//type: '', // 分享类型,music、video或link，不填默认为link
				//dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			//分享到QQ
			wx.onMenuShareQQ({
				title: opt.title, // 分享标题
				desc: opt.desc, // 分享描述
				link: opt.link, // 分享链接
				imgUrl: opt.imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			//分享到腾讯微博
			wx.onMenuShareWeibo({
				title: opt.title, // 分享标题
				desc: opt.desc, // 分享描述
				link: opt.link, // 分享链接
				imgUrl: opt.imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			//分享到QQ空间
			wx.onMenuShareQZone({
				title: opt.title, // 分享标题
				desc: opt.desc, // 分享描述
				link: opt.link, // 分享链接
				imgUrl: opt.imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
		})

		wx.error(function (res) {
			opt.debug && alert('wx.error: '+JSON.stringify(res));
		});
	};

	var _initShare = function(opt){
		opt = opt || {};
		var wx = opt.wx;
		if(!wx) return alert("微信jsapi分享至朋友图缺省wx对象");
		var debug = typeof opt.debug=="boolean" ? !!opt.debug : false;
		var title = opt.title || "title";
		var desc = opt.desc || "全民分销微商城 要么旅行，要么开店，精神和物质，总有一个满足你！";
		var imgUrl = opt.imgUrl || "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png";
		var link = opt.link || "";
		var form = $("#jsApiForm");
		var appId = form.find("[name=appId]").val();
		var timestamp = form.find("[name=timestamp]").val();
		var noncestr = form.find("[name=noncestr]").val();
		var signature = form.find("[name=signature]").val();
		var memberId = form.find("[name=memberId]").val();
		wx.config({
			debug: debug,
			appId: appId,
			timestamp: timestamp,
			nonceStr: noncestr,
			signature: signature,
			jsApiList: [
				'checkJsApi',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'onMenuShareQZone'
			]
		});
		wx.ready(function () {
			wx.checkJsApi({
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareWeibo',
					'onMenuShareQQ',
					'onMenuShareQZone'
				],success: function(res){
					if(opt.debug) alert(JSON.parse(res))
				}
			});
			//分享到朋友圈(wx jsapi接口里，此接口没有desc属性)
			wx.onMenuShareTimeline({
				title : title,
				imgUrl : imgUrl,
				link : link
			});
			//分享给朋友
			wx.onMenuShareAppMessage({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				//type: '', // 分享类型,music、video或link，不填默认为link
				//dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			//分享到QQ
			wx.onMenuShareQQ({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			//分享到腾讯微博
			wx.onMenuShareWeibo({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			//分享到QQ空间
			wx.onMenuShareQZone({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
		})
		wx.error(function (res) {
			debug && alert('wx.error: '+JSON.stringify(res));
		});
	};
	var getDocTitle = function(callback){
		$.ajax({
			url : "../api/index.php?c=Mall_Common&a=getMallConfig",
			type : "get",
			dataType : "json",
			success : function(res){
				var res = res || {};
				var code = res.code;
				var data = res.data;
				var msg = res.msg || "请求出错，请稍后重试";
				if(code==200){
					var title = data.name || "";
					var banner = data.banner || [];
					account_name = title;
					account_banner = banner;
					setTimeout(function(){
						document.title = title;
						callback && callback(title,banner);
					},50);
				}else{
					account_banner = "error";
					account_name = "error";
					alert(msg);
				}
			},
			error : function(xhr,text){
				account_banner = "error";
				account_name = "error";
				if(text=="timeout"){
					alert("获取店铺名称超时");
				}else{
					alert("获取店铺名称出错");
				}
			}
		})
	};

	var init = function(wx){
		var memberId = form.find("[name=memberId]").val();
		var account = window.location.hostname.split(".")[0];
		getDocTitle(function(title,banner){
			initShare({
				debug : (PFT_MALL.urlParse()["debug"]=="wx_share"),
				wx : wx,
				desc : "",
				title : title,
				imgUrl : "",
				link : "",
				account : account,
				appId : appId,
				timestamp : timestamp,
				noncestr : noncestr,
				signature : signature,
				memberId : memberId
			})
		})
	};
	var interval = null;
	var getAccountName = function(){
		return account_name;
	};
	var getAccountBanner = function(callback){
		var callback = typeof callback==="function" ? callback : new Function;
		if(account_banner==null){
			interval = setInterval(function(){ //每隔1s轮询取一次，直到account值不为null
				getAccountBanner(callback);
			},1*1000);
		}else{
			clearInterval(interval);
			callback(account_banner);
		}
	};


	return{
		init : init,
		getAccountName : getAccountName,
		getAccountBanner : getAccountBanner
	}

})();



