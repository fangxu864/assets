/**
 * Author: huangzhiyang
 * Date: 2016/7/13 11:34
 * Description: ""
 */
var PFT_MALL = PFT_MALL || {};

PFT_MALL.ShopConfig = {
	__interval : null,
	title : "",
	banner : null,
	getConfig : function(opt){
		opt = opt || {};
		var that = this;
		var fn = new Function;
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		$.ajax({
			url : "../api/index.php?c=Mall_Common&a=getMallConfig",
			type : "get",
			dataType : "json",
			beforeSend : function(){loading()},
			success : function(res){
				complete(res);
				var res = res || {};
				var code = res.code;
				var data = res.data;
				var msg = res.msg || "请求出错，请稍后重试";
				if(code==200){
					var title = data.name || "";
					var banner = data.banner || [];
					that.title = title;
					that.banner = banner;
					success(title,banner);
				}else{
					that.banner = [];
					alert(msg);
				}
			},
			error : function(xhr,text){
				complete(text);
				that.banner = [];
				if(text=="timeout"){
					alert("获取店铺名称超时");
				}else{
					alert("获取店铺名称出错");
				}
			}
		})
	},
	getShopName : function(){
		return this.title;
	},
	getBanner : function(callback){
		var callback = typeof callback==="function" ? callback : new Function;
		if(this.banner==null){
			this.__interval = setInterval(function(){ //每隔1s轮询取一次，直到account值不为null
				PFT_MALL.ShopConfig.getBanner(callback);
			},1*1000);
		}else{
			clearInterval(this.__interval);
			callback(this.banner);
		}
	}
};

PFT_MALL.WXShare = {
	getPagename : function(){
		var pathname = window.location.pathname;
		var lastIndex = pathname.lastIndexOf("/");
		var pagename = pathname.substr(lastIndex+1);
		pagename = pagename.split(".")[0];
		return pagename;
	},
	init : function(opt){
		//默认参数
		var DEFAULT_OPT = {
			debug : false,
			title : "title",
			desc : "全民分销微商城 要么旅行，要么开店，精神和物质，总有一个满足你！",  //微信分享时的描述文字
			imgUrl : "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png", //分享到朋友圈或发送给朋友时，显示的图片
			link : window.location.href,
			appId: "",          //wx jsapi appid       必填
			timestamp: "",      //时间戳                必填
			nonceStr: "",       //随机数                必填
			signature: ""      //签名                  必填
		};
		if(!wx) return alert("微信jsapi分享至朋友图缺省wx对象");
		opt = $.extend({},DEFAULT_OPT,opt);
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
	}
};


PFT_MALL.ShopConfig.getConfig({
	success : function(title,banner){
		var banner_img = "";
		for(var i in banner[0]) banner_img = i;
		var default_imgUrl = banner_img ? banner_img : "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png";
		var default_dsec = "全民分销微商城 要么旅行，要么开店，精神和物质，总有一个满足你！";

		//需要自定义微信分享的页面
		var CustomConfigPages = {
			index : {
				imgUrl : default_imgUrl,
				desc : default_dsec
			},
			plist : {
				imgUrl : default_imgUrl,
				desc : default_dsec
			},
			pdetail : {
				imgUrl : $("#imgpath_hiddenInp").val(),
				desc : $("#productTitle_hiddenInp").val()
			}
		};

		var memberId = $("#wx_share_hidden_inp_memberId").val();
		var curPagename = PFT_MALL.WXShare.getPagename();
		var customConfig = CustomConfigPages[curPagename];
		var prefix = window.location.search ? "&" : "?";
		var link = window.location.href + prefix + "parentid=" + memberId;
		var imgUrl = customConfig ? customConfig.imgUrl : default_imgUrl;
		var desc = customConfig ? customConfig.desc : default_dsec;

		PFT_MALL.WXShare.init({
			debug : false,
			title : title,
			desc : desc,  //微信分享时的描述文字
			imgUrl : imgUrl, //分享到朋友圈或发送给朋友时，显示的图片
			link : link,
			appId: $("#wx_share_hidden_inp_appId").val(),            //wx jsapi appid       必填
			timestamp: $("#wx_share_hidden_inp_timestamp").val(),    //时间戳                必填
			nonceStr: $("#wx_share_hidden_inp_noncestr").val(),      //随机数                必填
			signature: $("#wx_share_hidden_inp_signature").val()     //签名                  必填
		})

	}
})