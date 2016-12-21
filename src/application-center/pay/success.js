/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var ajaxUrls = require('../common/js/ajaxurl.js');

var loading = require('COMMON/js/util.loading.pc.js');

var Toast = require('COMMON/modules/Toast');
var toast = new Toast;

var ParseTemplate = PFT.Util.ParseTemplate;
var Template = {
	formSuccess: ParseTemplate(require("./tpl/form-suc.xtpl"))
};

var Main = PFT.Util.Class({
	dom: {
		sucText: 	'sucText',
		formSuc: 	'formSuc',
		btn: {
			gotoApp: 	'btnGotoApp',
			gotoIndex: 	'btnGotoIndex'
		}
	},

	successText: '<i class="ico-success"></i>恭喜您，支付成功',

	init : function(){
		var _this = this;

		var dom = _this.dom;

		// var url = window.location.href,
		// 	urlArr = url.split('?');

		// if(urlArr[1]) {
		// 	_this.module_id = urlArr[1].split('=')[1];
		// } else {
		// 	alert('无模块Id');
		// 	return false;
		// }
		_this.ajaxGetOrderInfo({
			success: function ( res ) {
				$('#' + dom.sucText).html( _this.successText );
				$('#' + dom.btn.gotoApp).attr('href', '1');
				$('#' + dom.btn.gotoIndex).attr('href', '2');

				var data = {
					method: '微信二维码支付',
					fee: 	'88',
					name: 	'微商城',
					btime: 	'2016-02-02',
					etime: 	'2017-03-03'
				}
				_this.renderFormSuccess( data );
			}
		})

	},

	ajaxGetOrderInfo: function ( opts ) {
		var _this = this;

 		_this.ajaxRenderData({
 			container: 	'#' + _this.dom.formSuc,
 			url: 		ajaxUrls.getAccBalance,
 			loading: 	{ tag: 'div', id: 'formLoading' },
			success: function(res) {
				opts.success && opts.success( res );
			}
 		});
	},

	ajaxRenderData: function ( opts ) {
		/*
			opts: {
				container: //ajax获取数据的容器, 表格容器需设定为 #tbSelector tbody
				url:
				params:
				loading: {
					id
					text
					tag
					colspan
					className
				}
				success: fn
			}
		 */
		return 	PFT.Util.Ajax( opts.url , {
			type: 'POST',
			params: opts.params,
			loading: function() {
				var loadingOpts = {};

				loadingOpts.id = opts.loading.id;
				loadingOpts.text = opts.loading.text || '';
				loadingOpts.className = opts.loading.className;
				if( opts.loading.tag == 'tr' ) {
					loadingOpts.colspan = opts.loading.colspan ? opts.loading.colspan : '';
				}

				var html = loading( opts.loading.text , loadingOpts );
				$( opts.container ).html(html);
			},
			success: function ( res ) {
				$( '#'+opts.loading.id ).remove();


				if(res.code == 200 || res.code == 'success') {
					opts.success && opts.success( res );
				} else {
					alert( res.msg );
				}
			},
			error: function( xhr, txt ) {
				alert( txt );
			}
		})
	},

	renderFormSuccess : function( data ){
		var html = Template.formSuccess( data );
		$('#' + this.dom.formSuc).html(html);
	}
});

$(function () {
	new Main();
})