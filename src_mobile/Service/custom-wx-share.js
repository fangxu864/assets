/**
 * Author: huangzhiyang
 * Date: 2016/8/4 17:40
 * Description: ""
 */
var WXShare = {
	getPagename : function(){
		var pathname = window.location.pathname;
		var lastIndex = pathname.lastIndexOf("/");
		var pagename = pathname.substr(lastIndex+1);
		pagename = pagename.split(".")[0];
		return pagename;
	},
	init : function(CustomShopConfig){
		var that = this;

		this.CustomShopConfig = CustomShopConfig;

		//获取店铺配置成功后，开始初始化微信自定义分享
		this.CustomShopConfig.on("success",function(res){

			var title = res.data.name;
			var banner = res.data.banner;

			//设置页面标题
			document.title = title;

			var banner_img = "";
			for(var i in banner[0]) banner_img = i;
			var default_imgUrl = banner_img ? banner_img : "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png";
			var default_dsec = "全民分销微商城 要么旅行，要么开店，精神和物质，总有一个满足你！";

			var prefix = window.location.search ? "&" : "?";
			var memberId = $("#wx_share_hidden_inp_memberId").val();

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
					title : $("#productTitle_hiddenInp").val(),
					imgUrl : $("#imgpath_hiddenInp").val(),
					desc : $("#productTitle_hiddenInp").val()
				},
				share_my_shop : {
					link : ("http://"+window.location.hostname+"/wx/mall/index.html"+"?parentid=" + memberId)
				}
			};

			var curPagename = that.getPagename();
			var customConfig = CustomConfigPages[curPagename];
			var link = (customConfig && customConfig["link"]) ? customConfig["link"] : (window.location.href + prefix + "parentid=" + memberId);
			var imgUrl = (customConfig && customConfig["imgUrl"]) ? customConfig.imgUrl : default_imgUrl;
			var desc = (customConfig && customConfig["desc"]) ? customConfig.desc : default_dsec;
			var _title = (customConfig && customConfig.title) ? customConfig.title : title;

			that.initShare({
				debug : false,
				title : _title,
				desc : desc,  //微信分享时的描述文字
				imgUrl : imgUrl, //分享到朋友圈或发送给朋友时，显示的图片
				link : link,
				appId: $("#wx_share_hidden_inp_appId").val(),            //wx jsapi appid       必填
				timestamp: $("#wx_share_hidden_inp_timestamp").val(),    //时间戳                必填
				nonceStr: $("#wx_share_hidden_inp_noncestr").val(),      //随机数                必填
				signature: $("#wx_share_hidden_inp_signature").val()     //签名                  必填
			})

		})
	},
	initShare : function(opt){
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

module.exports = WXShare;
