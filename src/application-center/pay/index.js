/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");

var ajaxUrls = require('../common/js/ajaxurl.js');

var dialog = require('COMMON/modules/dialog-simple');

var loading = require('COMMON/js/util.loading.pc.js');

var Toast = require('COMMON/modules/Toast');
var toast = new Toast;

var ParseTemplate = PFT.Util.ParseTemplate;
var Template = {
	li : ParseTemplate(require("./tpl/li.xtpl")),
	form: ParseTemplate(require("./tpl/form.xtpl"))
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
			module_id;

		if(urlArr[1]) {
			module_id = urlArr[1].split('=')[1];
		} else {
			alert('无模块Id');
			return false;
		}

		_this.ajaxGetModeList(module_id);

		$(dom.modelist).on('click', 'li', function(){
			$(this).toggleClass('active').siblings().removeClass('active');
		});

		$(dom.accbalance).on('click', function(){
			var chargeMode = $(dom.modelist).find('.active');
			if(!chargeMode.length) {
				alert('请先选择付费模式！');
				return false;
			}

			_this.showDialog( 'accbalance' , module_id, chargeMode.eq(0).attr('data-id'), chargeMode.eq(0).attr('data-fee') );
		});

		$(dom.wepay).on('click', function(){
			var chargeMode = $(dom.modelist).find('.active');
			if(!chargeMode.length) {
				alert('请先选择付费模式！');
				return false;
			}

			_this.showDialog( 'wepay' , module_id, chargeMode.eq(0).attr('data-id') );

		})
		// $(this).qrcode({width: 127,height: 127,text: $(this).attr('data-text')});
	},

    // getModeList: '/r/AppCenter_ModulePayment/getPriceInfo',
    // payViaAccBalance: '/r/AppCenter_ModulePayment/payInPlatform',
    // payViaWepay: '/r/AppCenter_ModulePayment/wxPayCreQrCode',
    // payViaAlipay: '/r/AppCenter_ModulePayment/aliPayCreQrCode'

	// 获取付费模式
	ajaxGetModeList: function( module_id ) {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.getModeList , {
			type: 'POST',
			params: {
				module_id: module_id
			},
			loading: function(){},
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
	showDialog: function( target, module_id, price_id, fee ) {
		var _this = this;

		var dialogBalance,
			dialogWepay;

		switch(target) {
			case 'accbalance':
				var dialogBalance = new dialog({
				 	width: 560,
				 	content: '<div id="dialogAccbalance"></div>',
				 	onOpenAfter: function(){
						PFT.Util.Ajax( ajaxUrls.getAccBalance , {
							type: 'POST',
							params: {
								module_id: module_id,
								price_id: price_id
							},
							loading: function(){
								var html = loading('',{
									tag: 'div',
									id: 'dialogLoading'
								});
								$('#dialogAccbalance').html(html);
							},
							success: function(res) {
								$('#dialogLoading').remove();
								if(res.code == 200) {
									var html = Template.form({ balance: 50.11, fee: fee });
				 					$('#dialogAccbalance').html(html);

				 					if(compareFloat(50.11,fee)) {
				 						$('#dialogAccbalance').append('<a id="btnConfirmPay" href="javascript:;" class="btn btn-default">确认支付</a>');

				 						$(document).on('click', '#btnConfirmPay', function(){
				 							dialogBalance.close();
				 							ajaxPayViaAccBalance({
				 								module_id: module_id,
				 								price_id: price_id,
				 								success: function ( res ) {
				 									console.log( res.msg );
				 								}
				 							});
				 						})
				 					} else {
										$('#dialogAccbalance').append('<a href="recharge.html" class="btn btn-default">余额不足去充值</a>');
				 					}


								} else {
									// opts.error && opts.error( res.code );
									alert( res.msg );
								}
							},
							error: function( xhr, txt ) {
								alert( txt );
							}
						})
				 	}
				});
				break;

			case 'wepay':
				if( !dialogWepay ) {
					dialogWepay = new dialog({
						header: '<div style="padding:10px 25px;font-size:20px; color:#38444D; background-color:#F5F5F5;">扫码支付</div>',
					 	width: 560,
					 	content: '<div id="dialogWepay"></div>',
					 	onOpenAfter: function(){
					 		_this.ajaxRenderData({
					 			url: ajaxUrls.payViaWepay,
					 			params: {
									module_id: module_id,
									price_id: price_id
					 			},
					 			loading: {
					 				id: '#dialogLoading'
					 			},
					 			success: function( res ){
					 				$('#dialogWepay').css({marginTop:46, padding:30,textAlign: 'center'}).qrcode({ width: 165, height: 165, text: res.data });
					 			}
					 		})
					 	}
					});
				}
				dialogWepay.open();
				break;
		}
	},
	ajaxPayViaAccBalance: function( opts ){
		this.ajaxSendData({
			url: ajaxUrls.payViaAccBalance,
			params: {
				module_id: opts.module_id,
				price_id: opts.price_id
			},
			success: function( res ) {
				opts.success( res );
			}
		});
	},
	ajaxRenderData: function ( opts ) {
		/*
			opts: {
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
				$( opts.loading.id ).remove();

				if(res.code == 200) {
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
	ajaxSendData: function ( opts ) {
		/*
			opts: {
				url:
				params:
				loading: {
					text
				}
				success: fn
			}
		 */
		return 	PFT.Util.Ajax( opts.url , {
			type: 'POST',
			params: opts.params,
			loading: function() {
				toast.show( 'loading' , opts.loading.text );
			},
			success: function ( res ) {
				toast.hide();

				if(res.code == 200) {
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

	renderModeList : function( data ){
		var html = Template.li({ data: data });
		$(this.dom.modelist).html(html);
	},

	compareFloat: function( num1, num2 ) {
		// num1 num2 必须为数字或数字字符串
		var num1 = parseFloat( num1 ).toFixed(2),
			num2 = parseFloat( num2 ).toFixed(2);

		return num1 * 100 > num2 * 100;
	}
});

$(function () {
	new Main();
})