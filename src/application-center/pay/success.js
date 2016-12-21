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

		var url = window.location.href,
			urlArr = url.split('?');

		if(urlArr[1]) {
			_this.order_num = urlArr[1].split('=')[1];
		} else {
			alert('无订单号');
			return false;
		}

		if( /^\w+$/.test( _this.order_num )) {
			_this.ajaxGetOrderInfo({
				params: { order_no: _this.order_num },
				success: function ( res ) {
					var data = res.data ;

					$('#' + dom.sucText).html( _this.successText );
					$('#' + dom.btn.gotoApp).attr('href', data.url );
					$('#' + dom.btn.gotoIndex).attr('href', 'appcenter_index.html');

					var data = {
						method: data.pay,
						fee: 	data.fee,
						name: 	data.name,
						btime: 	data.begin,
						etime: 	data.end
					}
					_this.renderFormSuccess( data );
				}
			});
		} else {
			alert('订单号有误');
		}
	},

	ajaxGetOrderInfo: function ( opts ) {
		var _this = this;

 		_this.ajaxRenderData({
 			container: 	'#' + _this.dom.formSuc,
 			url: 		ajaxUrls.getOrderInfo,
 			params: 	opts.params,
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
					alert( res.msg || '该订单未支付成功！' );
					window.history.go(-1);
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
});