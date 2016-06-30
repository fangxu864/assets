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
	__webpack_require__(42);
	var Api = __webpack_require__(14);
	var tpl = __webpack_require__(44);
	var LoadingPc = __webpack_require__(32);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		template : _.template(tpl),
		initialize : function(){
			this.ordernum = PFT.Util.UrlParse()["ordernum"] || "";
			if(!this.ordernum) return alert("缺少ordernum");
			this.getOrderDetail(this.ordernum);
		},
		getOrderDetail : function(ordernum){
			if(!ordernum) return false;
			var that = this;
			PFT.Util.Ajax(Api.Url.ordersuccess.getOrderDetail,{
				params : {
					ordernum : ordernum
				},
				loading : function(){ that.render("loading")},
				complete : function(){ that.render("complete")},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						that.render(data);
					}else{
						that.render("fail",res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		render : function(data){
			var html = "";
			var template = this.template;
			if(data=="loading"){
				html = LoadingPc("努力加载中，请稍后..",{
					width : this.$el.width(),
					height : 300,
					css : {
						"background" : "#fff"
					}
				});
			}else if(data=="complete"){
				html = "";
			}else if(data=="fail"){
				html = '<div style="width:100%; height:300px; line-height:300px; text-align:center">'+arguments[1]+'</div>';
			}else{
				html = template({data:data});
			}
			this.$el.html(html);
		}
	});
	
	$(function(){
		new MainView();
	})


/***/ },

/***/ 14:
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

/***/ 32:
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
		if(tag=="tr"||tag=="td") html += '<td colspan="'+td_colspan+'">';
		html += 	'<img style="width:'+imgWidth+'px; position:relative; top:'+top+'px; vertical-align:middle; margin-right:5px" src="'+imgSrc+'"/>';
		html +=     '<span class="t">'+text+'</span>';
		if(tag=="tr"||tag=="td") html += '</td>';
		html += '</'+tag+'>';
		return html;
	};
	module.exports = Loading;

/***/ },

/***/ 42:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 44:
/***/ function(module, exports) {

	module.exports = "<div class=\"sucBox border\">\r\n    <% var successTit = data.type==\"virtual\" ? \"售卡成功！已激活\" : \"售卡成功！需要激活后使用\" %>\r\n    <h1 class=\"success\"><i class=\"iconfont\">&#xe6b6;</i><%=successTit%></h1>\r\n    <% if(data.type!=\"virtual\"){ %>\r\n        <p class=\"font-14 firstAct\">可在第一次使用时激活</p>\r\n    <% } %>\r\n    <div class=\"btnBox\">\r\n        <% if(data.type!=\"virtual\"){ %>\r\n        <a href=\"javascript:;\" class=\"btn btn-blue\" id=\"activeBtn\">立即激活</a>\r\n        <% } %>\r\n        <a href=\"/plist.html\" class=\"btn btn-border\" id=\"backBtn\">返回预定列表</a>\r\n    </div>\r\n</div>\r\n<div class=\"orderDetailContainer\">\r\n    <% if(data.title){ %>\r\n    <p class=\"sucP\"><%=data.title%></p>\r\n    <% } %>\r\n    <table class=\"sucTable border\">\r\n        <thead class=\"border-bottom\">\r\n        <tr>\r\n            <th>订单号</th>\r\n            <th>卡类型</th>\r\n            <th>虚拟卡号/实体卡号 </th>\r\n            <th>结算价</th>\r\n            <th>日期</th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr>\r\n            <td><%=data.ordernum%></td>\r\n            <td><%=data.type==\"virtual\" ? \"虚拟卡\" : \"实体卡\"%></td>\r\n            <td>\r\n                <% _.each(data.list,function(item,index){ %>\r\n                    <p><%=item.virtual_no%> / <%=item.physics_no ? item.physics_no : \"无\"%></p>\r\n                <% }) %>\r\n            </td>\r\n            <td><i style=\"font-style:normal\" class=\"yen\">&yen;</i><em class=\"moneyNum\"><%=data.price%></em></td>\r\n            <td><%=data.date%></td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n</div>";

/***/ }

/******/ });
//# sourceMappingURL=all.js.map