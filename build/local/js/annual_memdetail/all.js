/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://static.12301.local/assets/build/local/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(89);
	var Api = __webpack_require__(5);
	var LoadingPc = __webpack_require__(38);
	var detailTpl = __webpack_require__(91);
	var MainView = Backbone.View.extend({
		el : $("#detailContainer"),
		initialize : function(){
			this.memberid = PFT.Util.UrlParse()["id"];
			this.getDetail(this.memberid);
		},
		template : _.template(detailTpl),
		getDetail : function(memberid){
			var that = this;
			if(!memberid) return false;
			PFT.Util.Ajax(Api.Url.memdetail.detail,{
				params : {
					memberid : memberid
				},
				loading : function(){
					var loading = LoadingPc("加载中，请稍后..",{
						tag : "div",
						height : 500,
						css : {
							"background" : "#fff"
						}
					});
					that.$el.html(loading);
				},
				complete : function(){
					that.$el.html("");
				},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						that.$el.html(that.template({data:data}));
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		}
	});
	
	$(function(){
		new MainView;
	})

/***/ },

/***/ 5:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/15 15:36
	 * Description: 此项目所有与后端交互数据的接口都汇总到这里
	 */
	var fn = function(){};
	var Api = {
		Url : {
			//发布年卡产品
			PublishCardProd : {
				submit : "/r/product_scenic/save/",
				//图片上传
				uploadFile : "/r/product_AnnualCard/uploadImg/",
				//编辑状态，获取年卡产品详细信息
				getInfo : "/r/product_scenic/get/"
			},
			//年卡套餐-即票类编辑
			PackageInfo : {
				//添加&修改票类
				updateTicket : "/r/product_ticket/UpdateTicket/",
				//拉取已存在的票类
				getPackageInfoList : "/r/product_ticket/ticket_attribute/",
				//获取产品列表
				getLands : "/r/product_AnnualCard/getLands/",
				//获取票类列表
				getTickets : "/r/product_AnnualCard/getTickets/",
				//删除票类
				deleteTicket : "/route/index.php?c=product_ticket&a=set_status"//"/r/product_ticket/set_status"
			},
			//卡片录入相关接口
			EntryCard : {
				//获取供应商的年卡产品列表
				getProdList : "/r/product_AnnualCard/getAnnualCardProducts/",
				//录入卡片
				createAnnualCard : "/r/product_AnnualCard/createAnnualCard/",
				//获取相关产品已生成好的卡片
				getAnnualCards : "/r/product_AnnualCard/getAnnualCards/"
	
			},
			//下单页面
			makeOrder : {
				//预定页面请求卡片信息接口
				getCardsForOrder : "/r/product_AnnualCard/getCardsForOrder/",
				//预定页面请求订单信息接口
				getOrderInfo : "/r/product_AnnualCard/getOrderInfo/",
				//如果购买虚拟卡，订单提交之前需要先请你去这个接口，判断会员是否已经绑定过其他年卡
				isNeedToReplace : "/r/product_AnnualCard/isNeedToReplace/",
				submit : "/formSubmit_v01.php"
			},
			//获取某个产品的虚拟卡的库存
			getVirtualStorage : "/r/product_AnnualCard/getVirtualStorage/",
			//库存明细页
			storage : {
				//获取库存列表
				getList : "/r/product_AnnualCard/getAnnualCardStorage/",
				//删除生成好的卡片
				deleteAnnualCard : "/r/product_AnnualCard/deleteAnnualCard/"
			},
			//下单成功页
			ordersuccess : {
				getOrderDetail : "/r/product_AnnualCard/orderSuccess/"
			},
			//激活页面
			active : {
				checkCard : "/r/product_AnnualCard/activeCheck/",
				getVCode : "/r/product_AnnualCard/sendVcode/",
				activateForPc : "/r/product_AnnualCard/activateForPc/"
			},
			//会员卡列表管理
			mclist : {
				getList : "/r/product_AnnualCard/getMemberList/"
			},
			//会员详情页面
			memdetail : {
				detail : "/r/product_AnnualCard/getMemberDetail/"
			}
		},
		defaults : {
			type : "get",
			ttimout : 60 * 1000,
			loading : fn,
			complete : fn,
			success : fn,
			fail : fn,
			timeout : fn,
			serverError : fn
		}
	};
	module.exports = Api;


/***/ },

/***/ 38:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 15:24
	 * Description: ""
	 */
	/**
	 * pc端全局loading效果
	 * @param text loading时显示的文字
	 * @param opt  附加选项
	 * @constructor
	 */
	var Loading = function(text,opt){
		text = text || "请稍后...";
		opt = opt || {}
		var tag = opt.tag || "div";
		if(tag=="td") tag = "tr";
		var width = opt.width+"px" || "100%";
		var height = opt.height || 150;
		var loadingImg = opt.loadingImg || {};
		var imgWidth = loadingImg.width || 24;
		var top = loadingImg.top || 0;
		var className = opt.className || "";
		var td_colspan = opt.colspan || 1;
		var id = opt.id || "";
		var html = "";
		var css = opt.css || {};
		var style = "";
		for(var i in css) style += i+":"+css[i]+"; ";
		var imgSrc = 'http://static.12301.cc/assets/build/images/gloading.gif';
		html += '<'+tag+' id="'+id+'" style="width:'+width+'; height:'+height+'px; line-height:'+height+'px; text-align:center; '+style+'" class="'+className+'">';
		if(tag=="tr"||tag=="td") html += '<td style="text-align:center" colspan="'+td_colspan+'">';
		html += 	'<img style="width:'+imgWidth+'px; position:relative; top:'+top+'px; vertical-align:middle; margin-right:5px" src="'+imgSrc+'"/>';
		html +=     '<span class="t">'+text+'</span>';
		if(tag=="tr"||tag=="td") html += '</td>';
		html += '</'+tag+'>';
		return html;
	};
	module.exports = Loading;

/***/ },

/***/ 89:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 91:
/***/ function(module, exports) {

	module.exports = "<% var member=data.member, list=data.list || [], history=data.history; %>\r\n<% var statusTxt = {\"1\":\"正常\",\"0\":\"未激活\",\"2\":\"挂失\",\"4\":\"禁用\"}; %>\r\n<div class=\"memberBox\" style=\"background:#e2f6fe\">\r\n    <span class=\"memberH\">H</span>\r\n    <ul class=\"memUl\">\r\n        <li>\r\n            <p><span class=\"memL\">会员名称：</span><span class=\"memR\"><%=member.account%></span></p>\r\n        </li>\r\n        <li>\r\n            <p><span class=\"memL\">手机号：</span><span class=\"memR\"><%=member.mobile%></span></p>\r\n        </li>\r\n    </ul>\r\n</div>\r\n<%_.each(list,function(item){%>\r\n<div style=\"background:#fff; border-top:1px solid #e5e5e5\" class=\"memberBox\">\r\n    <ul class=\"memUl marL-70\">\r\n            <li>\r\n                <p><span class=\"memL\">虚拟卡号：</span><span class=\"memR\"><%=item.virtual_no%></span></p>\r\n                <p><span class=\"memL\">实体卡号：</span><span class=\"memR\"><%=item.card_no%></span></p>\r\n                <p><span class=\"memL\">物理ID：</span><span class=\"memR\"><%=item.physics_no%></span></p>\r\n                <!--<p><span class=\"memL\">可用优惠券：</span><span class=\"memR\">0</span></p>-->\r\n                <p><span class=\"memL\">发卡商户：</span><span class=\"memR\"><%=item.supply%></span></p>\r\n            </li>\r\n            <li>\r\n                <p><span class=\"memL\">卡套餐：</span><span class=\"memR\">无</span></p>\r\n                <p><span class=\"memL\">有效期：</span><span class=\"memR\"><%=item.valid_time%></span></p>\r\n                <div class=\"memLine\">\r\n                    <span class=\"memL\">已用特权：</span>\r\n                    <div class=\"memR\">\r\n                        <%_.each(item.priv,function(priv){%>\r\n                            <p><%=priv.title%> <%=priv.use%></p>\r\n                        <%})%>\r\n                    </div>\r\n                </div>\r\n                <p><span class=\"memL\">状态：</span><span class=\"memR font-orange\"><a href=\"javascript:void(0);\" class=\"unActivate\"><%=statusTxt[item.status]%></a></span></p>\r\n                <p><span class=\"memL\">备注：</span></p>\r\n            </li>\r\n    </ul>\r\n</div>\r\n<%})%>\r\n<div class=\"historyContainer\" style=\"border-left:1px solid #e5e5e5; border-right:1px solid #e5e5e5\">\r\n    <p class=\"useHistory border-top\">使用记录</p>\r\n    <table class=\"memTable\">\r\n        <thead>\r\n            <tr class=\"border-bottom bg-gray\">\r\n                <th>订单号</th>\r\n                <th>产品</th>\r\n                <th>虚拟卡号</th>\r\n                <th>订单总额</th>\r\n                <th>套餐特权</th>\r\n                <th>优惠券</th>\r\n                <th>余额支付</th>\r\n                <th>下单时间</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody style=\"background:#fff\">\r\n            <% if(history.lenght){ %>\r\n                <%_.each(history,function(hist){%>\r\n                <tr class=\"border-bottom\">\r\n                    <td class=\"font-blue\">4654546</td>\r\n                    <td>XXXXXXXXX景区-成人票-1张</td>\r\n                    <td></td>\r\n                    <td></td>\r\n                    <td class=\"font-orange\">-100</td>\r\n                    <td class=\"font-orange\">-10</td>\r\n                    <td class=\"font-orange\">123</td>\r\n                    <td>2016/05/06 12:00</td>\r\n                </tr>\r\n                <% }) %>\r\n            <% }else{ %>\r\n                <tr>\r\n                    <td style=\"text-align:center; height:300px\" colspan=\"8\">暂无使用记录...</td>\r\n                </tr>\r\n            <% } %>\r\n        </tbody>\r\n    </table>\r\n</div>\r\n\r\n";

/***/ }

/******/ });
//# sourceMappingURL=all.js.map