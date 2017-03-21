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
	form: ParseTemplate(require("./tpl/form.xtpl")),
	dialogheader: ParseTemplate(require("./tpl/dialogheader.xtpl"))
};

var Main = PFT.Util.Class({
	dom: {
		modelist: 	'#modeList',
		accbalance: '#viaAccBalance',
		wepay: 		'#viaWepay',
		alipay: 	'#viaAlipay',
		appstate: 	'#appState',
		dialog: {
			qrcode: 'dialogQrcode',
			accbalance: 'dialogAccbalance'
		}
	},

	interval: {
		timer: null,
		time: 1000
	},

	xhr: null,
	xhrChkStatus: null,
	ordernum: null,

	init : function(){
		var _this = this;

		var dom = _this.dom;

		var urlParam = PFT.Util.UrlParse( window.location.href );
		var url = window.location.href,
			urlArr = url.split('?');

		if( urlParam.appid || urlParam.appid == 0 ) {
			_this.module_id = urlParam.appid;
		} else {
			alert('无模块Id');
			return false;
		}

		if( urlParam.pay_type ) {
			$('.progressBox').css('display','block');
			_this.pay_type = urlParam.pay_type ? urlParam.pay_type : '';
		}
		
		_this.ajaxGetModeList( _this.module_id, urlParam.pay_type ? urlParam.pay_type : '' );

		$(dom.modelist).on('click', 'li', function(){
			$(this).toggleClass('active').siblings().removeClass('active');
		});

		$(dom.accbalance).on('click', function(){
			var chargeMode = $(dom.modelist).find('.active');
			if(!chargeMode.length) {
				alert('请先选择付费模式！');
				return false;
			}

			_this.showDialog( 'accbalance' , _this.module_id, chargeMode.eq(0).attr('data-id'), chargeMode.eq(0).attr('data-fee') );
		});

		$(dom.wepay).on('click', function(){
			var chargeMode = $(dom.modelist).find('.active');
			if(!chargeMode.length) {
				alert('请先选择付费模式！');
				return false;
			}

			_this.showDialog( 'wepay' , _this.module_id, chargeMode.eq(0).attr('data-id'), chargeMode.eq(0).attr('data-fee') );
		});

		$(dom.alipay).on('click', function(){
			var chargeMode = $(dom.modelist).find('.active');
			if(!chargeMode.length) {
				alert('请先选择付费模式！');
				return false;
			}

			_this.showDialog( 'alipay' , _this.module_id, chargeMode.eq(0).attr('data-id'), chargeMode.eq(0).attr('data-fee') );
		})
	},

	// 获取付费模式
	ajaxGetModeList: function( module_id, pay_type ) {
		var _this = this;

		PFT.Util.Ajax( ajaxUrls.getModeList , {
			type: 'POST',
			params: {
				module_id: module_id,
				pay_type: pay_type
			},
			loading: function(){},
			success: function(res) {

				if(res.code == 200) {
					_this.renderModeList( res.data.list );
					res.data.vali.is_open ? $(_this.dom.appstate).html('有效期 <em class="c-warning">'+ res.data.vali.begin + '</em> 至 <em class="c-warning">' + res.data.vali.end +'</em>')
											: $(_this.dom.appstate).html('未开通');
				} else if(res.code == 400){
					alert( res.msg );
					window.history.go(-1);
				} else {
					alert( res.msg );
				}
			},
			serverError: function( xhr, txt ) {
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
				dialogBalance = new dialog({
					header: Template.dialogheader({ title: '平台账号余额支付' }),
				 	width: 560,
				 	height: 260,
				 	content: '<div id="'+ _this.dom.dialog.accbalance +'"></div>',
				 	onOpenAfter: function(){
				 		_this.ajaxRenderData({
				 			container: 	'#' + _this.dom.dialog.accbalance,
				 			url: 		ajaxUrls.getAccBalance,
				 			loading: 	{ tag: 'div', id: 'dialogLoading' },
							success: function(res) {
								var html = Template.form({ balance: res.data, fee: fee });
			 					$('#' + _this.dom.dialog.accbalance).html(html);

			 					if(_this.compareFloat( res.data, fee )) {
			 						$('#' + _this.dom.dialog.accbalance).append('<div class="t-center"><a id="btnConfirmPay" href="javascript:;" class="btn btn-default">确认支付</a></div>');

			 						$(document).on('click', '#btnConfirmPay', function(){
			 							dialogBalance.close();
			 							_this.ajaxPayViaAccBalance({
			 								module_id: module_id,
			 								price_id: price_id,
			 								success: function ( res ) {
		 										location.href= 'appcenter_paysuccess.html?ordernum=' + res.data.order_no
			 								}
			 							});
			 						})
			 					} else {
			 						$('#' + _this.dom.dialog.accbalance).append('<div class="t-center"><a target="_blank" href="/recharge.html" class="btn btn-default">余额不足去充值</a></div>');
			 					}
							}
				 		});
				 	},
				 	onCloseAfter: function(){
				 		dialogBalance.remove();
				 		dialogBalance = null;
				 		$(document).off('click', '#btnConfirmPay');
				 	}
				});
				dialogBalance.open();
				break;

			case 'wepay':
				_this.ajaxPayViaQrcode('wepay', module_id, price_id, fee );
				break;

			case 'alipay':
				_this.ajaxPayViaQrcode('alipay', module_id, price_id, fee );
				break;
		}
	},
	ajaxPayViaAccBalance: function( opts ){
		this.ajaxSendData({
			url: ajaxUrls.payViaAccBalance,
			params: {
				module_id: opts.module_id,
				price_id: opts.price_id,
				pay_type: this.pay_type
			},
			loading: { text: '正在处理中' },
			success: function( res ) {
				opts.success && opts.success( res );
			},
			error: function( res ) {
				opts.error && opts.error( res );
			}
		});
	},
	ajaxPayViaQrcode: function( method, module_id, price_id, fee ){
		var _this = this;

		var dialogTitle,
			colorSaoyisao,
			ajaxUrl;

		switch(method) {
			case 'wepay':
				dialogTitle = '微信扫码支付';
				colorSaoyisao = '#45D445';
				ajaxUrl = ajaxUrls.payViaWepay;
				break;
			case 'alipay':
				dialogTitle = '支付宝扫码支付';
				colorSaoyisao = '#0797d9';
				ajaxUrl = ajaxUrls.payViaAlipay;
				break;
		}

		var dialogQrcode = new dialog({
			header: Template.dialogheader({ title: dialogTitle }),
		 	width: 560,
	 		height: 350,
		 	content: '<div id="'+ _this.dom.dialog.qrcode +'" style="margin-top:46px;padding:20px 30px;text-align:center;"></div>',
		 	onOpenAfter: function(){
		 		// if( _this.canvasSupport() ) {
			 		_this.xhr = _this.ajaxRenderData({
			 			container: '#' + _this.dom.dialog.qrcode,
			 			url: ajaxUrl,
			 			params: {
							module_id: module_id,
							price_id: price_id,
							pay_type: _this.pay_type
			 			},
			 			loading: {
			 				id: 'dialogLoading'
			 			},
			 			success: function( res ){
			 				_this.ordernum = res.data.order_no;

			 				if( _this.canvasSupport() ) {
			 					$('#' + _this.dom.dialog.qrcode).qrcode({ width: 165, height: 165, text: res.data.url });
			 				} else {
			 					$('#' + _this.dom.dialog.qrcode).qrcode({ render: "table", width: 165, height: 165, text: res.data.url });
			 					$('#' + _this.dom.dialog.qrcode).wrapInner('<div style="padding-left:167px;"></div>');
			 				}
			 				$('#' + _this.dom.dialog.qrcode).prepend('<div class="t-center f14 mb20">应付金额：<em class="c-warning">'+ fee +'</em>元</div>');
			 				$('#' + _this.dom.dialog.qrcode).append('<div class="t-center f16 mt20 pt10 border-t border-d" style="line-height:32px"><i class="icon-u-bold icon-saoyisao" style="color:' + colorSaoyisao + ';font-size:30px;vertical-align:top;"></i> 扫码完成支付</div>');


			 				_this.checkOrderStatus({
			 					ordernum: _this.ordernum,
			 					success: function( res ) {
			 						if( res.code == 200 ) {
			 							location.href= 'appcenter_paysuccess.html?ordernum=' + _this.ordernum
			 						}
			 						if( res.code == 403 ) {
			 							// 支付失败
			 							$('#' + _this.dom.dialog.qrcode).html('<div class="t-center f20 c-warning" style="padding-top: 60px;">支付失败</div><div class="t-center f20 c-warning" style="padding-top: 60px;"><a href="javascript:;" class="btn btn-default" onclick="location.reload()">重新支付</a></div>');
			 							clearInterval(_this.interval.timer);
			 						}
			 						if( res.code == 400 ) {
			 							// 查询异常
			 							$('#' + _this.dom.dialog.qrcode).html('<div class="t-center f20 c-warning" style="padding-top: 60px;">支付失败</div><div class="t-center f20 c-warning" style="padding-top: 60px;"><a href="javascript:;" class="btn btn-default" onclick="location.reload()">重新支付</a></div>');
			 							clearInterval(_this.interval.timer);
			 						}
			 					}
			 				});
			 			},
			 			error: function( res ) {
			 				dialogQrcode.close();
			 			}
			 		})
		 		// }
		 		//  else {
		 		// 	$('#' + _this.dom.dialog.qrcode).html('<div class="t-center f20 c-warning" style="padding-top: 60px;">支付失败</div>');
		 		// }
		 	},
		 	onCloseAfter: function(){
		 		_this.ordernum = null;
		 		if( _this.xhr && _this.xhr.readyState != 4 ) {
		 			_this.xhr.abort();
		 		}
		 		clearInterval(_this.interval.timer);
		 		dialogQrcode.remove();
		 		dialogQrcode = null;
		 	}
		});
		dialogQrcode.open();
	},
	checkOrderStatus: function( opts ) {
		var _this = this;
		_this.interval.timer = setInterval(function(){
			if( !_this.xhrChkStatus  || _this.xhrChkStatus.readyState == 4 ) {
				_this.xhrChkStatus = _this.ajaxCheckOrderStatus({
					ordernum: opts.ordernum,
					success: function ( res ) {
						opts.success( res );
					}
				});
			}
		}, _this.interval.time )
	},
	ajaxCheckOrderStatus: function ( opts ) {
		return PFT.Util.Ajax( ajaxUrls.checkOrderStatus, {
			type: 'POST',
			params: { order_no: opts.ordernum },
			success: function ( res ) {
				opts.success && opts.success( res );
			},
			serverError: function( xhr, txt ) {
				// alert( txt );
			}
		})
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
					opts.error && opts.error( res );
				}
			},
			serverError: function( xhr, txt ) {
				// alert( txt );
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
					opts.error && opts.error( res );
				}
			},
			serverError: function( xhr, txt ) {
				// alert( txt );
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

		return num1 * 100 >= num2 * 100;
	},
	canvasSupport: function() {
    	return !!document.createElement('canvas').getContext;
	}
});

$(function () {
	new Main();
})