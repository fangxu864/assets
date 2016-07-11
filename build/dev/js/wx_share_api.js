/**
 * Author: huangzhiyang
 * Date: 2016/7/8 14:28
 * Description: ""
 */
var initShare = function(opt){
	var DEFAULT_OPT = {
		account : "",      //用户帐户，如：123757   必填
		wx : null,         //微信内置浏览器的js对象  必填
		debug: false,      //是否开启调试模试
		title : "title",
		desc : "全民分销微商城 要么旅行，要么开店，精神和物质，总有一个满足你！",  //微信分享时的描述文字
		imgUrl : "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png", //分享到朋友圈或发送给朋友时，显示的图片
		link : "http://"+window.location.hostname+"/wx/mall/index.html?parentid="+(opt.memberId || ""),
		appId: "wxd72be21f7455640d",         //wx jsapi appid       必填
		timestamp: "",     //时间戳                必填
		nonceStr: "",      //随机数                必填
		signature: "",     //签名                  必填
		memberId: (opt.memberId || "")      //上级分享者的id         必填
	};
	for(var i in DEFAULT_OPT){
		var val = opt[i];
		if(typeof val==="undefined") opt[i] = DEFAULT_OPT[i];
	}
	var wx = opt.wx;
	if(!wx) return alert("微信jsapi分享至朋友图缺省wx对象");
	if(opt.debug) alert(JSON.stringify(opt));
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


var timestamp = $("input[name=timestamp]").val();
var noncestr = $("input[name=noncestr]").val();
var signature = $("input[name=signature]").val();

initShare({
	wx : wx,
	debug : true,
	appId: "wxd72be21f7455640d",
	title : "titletitletitletitletitletitle",
	desc : "descdescdescdescdescdescdescdesc",
	link : "http://wx.12301dev.com/mall/index.html",
	imgUrl : "http://static.12301.cc/assets/build/images/wx_share_timeline_photo.png",
	timestamp : timestamp,
	nonceStr : noncestr,
	signature : signature,
	memberId : "123123"
});

