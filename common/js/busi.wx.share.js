/**
 * Author: huangzhiyang
 * Date: 16-5-17 下午12:15
 * Description: 微信分享至朋友圈分享发送给朋友等
 */
var GetDocTitle = require("./util.get.document.title");

var initShare = function(opt){
	var wx = opt.wx;
	if(!wx) return alert("微信jsapi分享至朋友图缺省wx对象");
	var hostname = window.location.hostname;
	var custom_share = {
		title : opt.title,
		desc : opt.title,
		imgUrl : opt.imgUrl,
		link : "http://"+hostname+"/wx/mall/index.html?parentid="+opt.memberid,
		dataUrl : "http://"+hostname+"/wx/mall/index.html?parentid="+opt.memberid,
		type : "link",
		success : function(){},
		cancel : function(){}
	};
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
                ]
            });
            wx.onMenuShareTimeline({
                title : opt.title,
                desc : opt.title,
                imgUrl : opt.imgUrl,
                link : "http://"+hostname+"/wx/mall/index.html?parentid="+opt.memberid
            });
            wx.onMenuShareAppMessage(custom_share);
            wx.onMenuShareQQ(custom_share);
            wx.onMenuShareWeibo(custom_share);
            wx.onMenuShareQZone(custom_share);
        })

        wx.error(function (res) {
            opt.debug && alert('wx.error: '+JSON.stringify(res));
        });
};

var init = function(opt){
	var opt = opt || {};
	//默认参数
	var DEFAULT_OPT = {
		account : "",      //用户帐户，如：123757   必填
		wx : null,         //微信内置浏览器的js对象  必填
		debug: false,      //是否开启调试模试
		imgUrl : "http://wx.12301.cc/mall/modules/common/images/active_welcome_banner.png", //分享到朋友圈或发送给朋友时，显示的图片
		appId: "",         //wx jsapi appid       必填
		timestamp: "",     //时间戳                必填
		nonceStr: "",      //随机数                必填
		signature: "",     //签名                  必填
		memberid: "",      //上级分享者的id         必填
		loading : null,
		complete : null,
		timeout : null,
		serverError : null,
		fail : null,
		success : null
	};
	for(var i in DEFAULT_OPT){
		var val = opt[i];
		if(typeof val==="undefined") opt[i] = DEFAULT_OPT[i];
	}

	GetDocTitle({
		account : opt.account,
		loading : opt.loading,
		complete : opt.complete,
		timeout : opt.timeout,
		serverError : opt.serverError,
		fail : opt.fail || function(msg){ alert(msg)},
		success : function(res){
			var data = res.data;
			var title = data.name;
			var banner = data.banner;
			opt["title"] = title;
			opt["banner"] = banner;
			setTimeout(function(){
				document.title = title;
			},50);
			initShare(opt);
		}
	})
};

module.exports = init;