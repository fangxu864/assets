/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var ajaxUrls = require('../common/js/ajaxurl.js');

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
			id = urlArr[1].split('=')[1];


	},

	// 获取付费模式
	ajaxGetMode: function( defaultmode ) {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.getMode , {
			type: 'POST',
			success: function(res) {

				if(res.code == 200) {
					_this.renderSelect( res.data , defaultmode );
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
		$(this.dom.appmode).append(html);
	}
});

$(function () {
	new Main();
})