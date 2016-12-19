/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var ajaxUrls = require('../common/js/ajaxurl.js');

var dialog = require('COMMON/modules/dialog-simple');

var ParseTemplate = PFT.Util.ParseTemplate;
var Template = {
	li : ParseTemplate(require("./tpl/li.xtpl"))
};

var Main = PFT.Util.Class({
	dom: {
		modelist: 	'#modeList',
		accbalance: '#viaAccBalance',
		wepay: 		'#viaWepay',
		alipay: 	'#viaAlipay',
		appstate: 	'#appState'
	},

	xhr: null,

	init : function(){
		var _this = this;

		var dom = _this.dom;

		var url = window.location.href,
			urlArr = url.split('?'),
			id;

		if(urlArr[1]) {
			id = urlArr[1].split('=')[1];
		} else {
			alert('无模块Id');
			return false;
		}

		_this.ajaxGetModeList(id);

		$(dom.modelist).on('click', 'li', function(){
			$(this).toggleClass('active').siblings().removeClass('active');
		})


		// $(this).qrcode({width: 127,height: 127,text: $(this).attr('data-text')});
	},

    // getModeList: '/r/AppCenter_ModulePayment/getPriceInfo',
    // payViaAccBalance: '/r/AppCenter_ModulePayment/payInPlatform',
    // payViaWepay: '/r/AppCenter_ModulePayment/wxPayCreQrCode',
    // payViaAlipay: '/r/AppCenter_ModulePayment/aliPayCreQrCode'

	// 获取付费模式
	ajaxGetModeList: function( id ) {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.getModeList , {
			type: 'POST',
			params: {
				module_id: id
			},
			success: function(res) {

				if(res.code == 200) {
					_this.renderModeList( res.data );
				} else {
					// opts.error && opts.error( res.code );
					alert( res.msg );
				}
			},
			error: function( xhr, txt ) {
				alert( txt );
			}
		})
	},

	renderModeList : function( data ){
		var html = Template.li({ data: data });
		$(this.dom.modelist).html(html);
	}
});

$(function () {
	new Main();
})