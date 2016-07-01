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
	__webpack_require__(1);
	var Api = __webpack_require__(16);
	var ReadPhysicsCard = __webpack_require__(15);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {
			"click #readCardBtn" : "onReadCardBtnClick",
			"blur .textInp" : "onTextInpBlur"
		},
		initialize : function(){
			this.cardInp = $("#cardNum");
			this.readCardBtn = $("#readCardBtn");
			this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
		},
		onReadCardBtnClick : function(e){
			var cardval = this.ReadPhysicsCard.read();
			this.cardInp.val(cardval);
			if(!cardval) alert("读卡失败");
		},
		onTextInpBlur : function(e){
			var tarInp = $(e.currentTarget);
			var validate = tarInp.attr("validate");
			validate = validate.split("|");
			for(var i in validate){
	
			}
		},
		validator : {
			card : function(){
	
			},
			mobile : function(){
	
			},
			vcode : function(){
	
			},
			idCard : function(){
	
			},
			membername : function(){
	
			}
		},
		getCardInfo : function(card_no,type){
			var tarBtn = this.readCardBtn;
			if(!card_no || !type) return false;
			PFT.Util.Ajax(Api.Url.active.checkCard,{
				params : {
					identify : card_no,
					type : type
				},
				loading : function(){
					tarBtn.addClass("disable");
				},
				complete : function(){
					tarBtn.removeClass("disable");
				},
				success : function(res){
					res = res || {};
					var data= res.data;
					if(res.code==200){
						var needID = data.need_ID;
						var virtual_no = data.virtual_no;
						var physics_no = data.physics_no;
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT)
					}
				}
			})
		}
	});
	
	$(function(){
		new MainView();
	})


/***/ },

/***/ 1:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 15:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/24 17:28
	 * Description: ""
	 */
	function readPhysicsCard(opt){
		opt = opt || {};
		this.id = opt.id;
		if(!this.id) throw Error("缺少id");
		this.readObj = document.getElementById(this.id);
		//<object classid="clsid:b1ee5c7f-5cd3-4cb8-b390-f9355defe39a" width="0" height="0" id="readCardObj"></object>
	}
	readPhysicsCard.prototype = {
		read : function(){
			var readCardObj = this.readObj;
			if(!readCardObj){
				alert("请使用IE浏览器读物理卡号");
				return false;
			}
			if(typeof readCardObj.open!="number" && typeof readCardObj.ICReaderRequest!="string"){
				alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
				return false;
			}
			readCardObj.open();
			var val = readCardObj.ICReaderRequest();
			return val || "";
		}
	};
	module.exports = readPhysicsCard;

/***/ },

/***/ 16:
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
				checkCard : "/r/product_AnnualCard/activeCheck/"
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


/***/ }

/******/ });
//# sourceMappingURL=all.js.map