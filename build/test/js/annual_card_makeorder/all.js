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
/******/ 	__webpack_require__.p = "http://static.12301.test/assets/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/15 15:36
	 * Description: 此项目所有与后端交互数据的接口都汇总到这里
	 */
	var fn = function(){};
	var Api = {
		Url : {
			//卡片录入相关接口
			EntryCard : {
				//获取供应商的年卡产品列表
				getProdList : "/r/product_annualCard/getAnnualCardProducts/",
				//录入卡片
				createAnnualCard : "/r/product_annualCard/createAnnualCard/",
				//获取相关产品已生成好的卡片
				getAnnualCards : "/r/product_annualCard/getAnnualCards/",
				//删除生成好的卡片
				deleteAnnualCard : "/r/product_annualCard/deleteAnnualCard/"
			},
			//下单页面
			makeOrder : {
				//预定页面请求卡片信息接口
				getCardsForOrder : "/r/product_annualCard/getCardsForOrder/",
				//预定页面请求订单信息接口
				getOrderInfo : "/r/product_annualCard/getOrderInfo/"
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
		///**
		// * 获取供应商的年卡产品列表 (分页)
		// * @param page      获取第几页
		// * @param pagesize  每页显示多少条
		// */
		//getCardProdList : function(opt){
		//	opt = $.extend(Defaults,opt||{});
		//	var page = opt.page || 1;
		//	var pagesize = opt.pagesize || 1000;
		//	PFT.Util.Ajax(Url.EntryCard.getProdList,{
		//		type : opt.type,
		//		params : {
		//			page : page,
		//			page_size : pagesize
		//		},
		//		ttimeout : opt.ttimeout,
		//		loading : function(){ opt.loading()},
		//		complete : function(){ opt.complete()}
		//	},function(res){
		//		res = res || {};
		//		var code = res.code;
		//		if(code==200){
		//			opt.success(res);
		//		}else{
		//			opt.fail(res);
		//		}
		//	})
		//}
	};
	module.exports = Api;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(20);
	var UserInfo = __webpack_require__(22);
	var CardList = __webpack_require__(23);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {},
		initialize : function(){
			this.UserInfo = new UserInfo();
			this.CardList = new CardList();
		}
	});
	
	$(function(){
		new MainView();
	})

/***/ },
/* 20 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 21 */,
/* 22 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 11:04
	 * Description: ""
	 */
	var UserInfoView = Backbone.View.extend({
		el : $("#userInfoContainer"),
		events : {
			"focus .validateInp" : "onTextInpFocus",
			"blur .validateInp" : "onTextInpBlur"
		},
		initialize : function(){
			this.nameInp = $("#userinfo_nameInp");
			this.mobileInp = $("#userinfo_mobileInp");
			this.idCardInp = $("#userinfo_idCardInp");
			this.noteInp = $("#userinfo_noteInp");
			this.nameError = this.nameInp.parent().find(".tip");
			this.mobileError = this.mobileInp.parent().find(".tip");
			this.idCardError = this.idCardInp.parent().find(".tip");
		},
		onTextInpFocus : function(e){
			var tarInp = $(e.currentTarget);
			var tip = tarInp.parent().find(".tip");
			tip.removeClass("error").text(tarInp.attr("id")=="userinfo_idCardInp" ? "(可选项)" : "(必填项)");
		},
		onTextInpBlur : function(e){
			var tarInp = $(e.currentTarget);
			var name = tarInp.attr("name");
			var val = $.trim(tarInp.val());
			var error = "";
			if(name=="name"){
				if(this.validateName(val)) this.nameError.addClass("error");
			}else if(name=="mobile"){
				error = this.validateMobile(val);
				if(error) this.mobileError.addClass("error").text(error);
			}else if(name=="id_card"){
				error = this.validateIDCard(val);
				if(error) this.idCardError.addClass("error").text(error);
			}
		},
		validateName : function(name){
			if(name=="") return "请填写购买人姓名";
		},
		validateMobile : function(mobile){
			if(mobile==""){
				return "(必填项)";
			}else if(!PFT.Util.Validate.typePhone(mobile)){
				return "请输入正确格式手机号";
			}
		},
		validateIDCard : function(idCard){
			if(idCard && !PFT.Util.Validate.idcard(idCard)) return "请输入正确身份证号";
		},
		getUserInfo : function(){
			var name = $.trim(this.nameInp.val());
			var mobile = $.trim(this.mobileInp.val());
			var id_card = $.trim(this.idCardInp.val());
			var notes = this.noteInp.val();
			this.nameInp.blur();
			this.mobileInp.blur();
			this.idCardInp.blur();
			return{
				name : this.validateName(name) ? "error" : name,
				mobile : this.validateMobile(mobile) ? "error" : mobile,
				id_card : this.validateIDCard(id_card) ? "error" : id_card,
				note : notes
			}
		}
	});
	module.exports = UserInfoView;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 15:17
	 * Description: ""
	 */
	var Api = __webpack_require__(18);
	var Loading_Pc = __webpack_require__(24);
	var List = Backbone.View.extend({
		el : $("#cardMsgListUl"),
		loading_str : Loading_Pc("请稍后",{tag:"li",height:100}),
		initialize : function(){
			var urlParam = PFT.Util.UrlParse();
			var pid = this.pid = urlParam["pid"];
			var physics = this.physics = urlParam["physics"];
			if(!pid) return alert("缺少pid");
			if(!physics) return alert("缺少physics");
			this.getList(pid,physics);
			this.$el.html(this.loading_str);
		},
		getList : function(pid,physics){
			var that = this;
			PFT.Util.Ajax(Api.Url.makeOrder.getCardsForOrder,{
				params : {
					pid : pid,
					physics : physics
				},
				loading : function(){ that.renderList("loading")},
				complete : function(){ that.renderList("complete")},
				success : function(res){
					res = res || {};
					if(res.code==200){
						that.renderList(res.data);
					}else{
						that.renderList(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		renderList : function(data){
			var html = "";
			if(data=="loading"){
				html = this.loading_str;
			}else if(data=="complete"){
				html = "";
			}else if(Object.prototype.toString.call(data)=="[object Array]"){
				for(var i in data){
					var d = data[i];
					var virtual_no = d["virtual_no"];
					var sid = d["sid"];
					var physics_no = d["physics_no"];
					var card_no = d["card_no"] || "无";
					html += '<li data-sid="'+sid+'" data-virtual="'+virtual_no+'" data-card="'+card_no+'" data-physics="'+physics_no+'" class="border cardItem"><p>虚拟卡号：'+virtual_no+'</p><p>实体卡号：'+card_no+'</p><p>物理ID：'+physics_no+'</p></li>';
				}
				if(!html) html += '<li class="status empty" style="height:100px; line-height:100px; text-align:center">无查卡信息</li>';
			}else{
				html = '<li class="status fail" style="height:100px; line-height:100px; text-align:center">'+data+'</li>';
			}
			this.$el.html(html);
		}
	});
	module.exports = List;

/***/ },
/* 24 */
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
		var id = opt.id || "";
		var html = "";
		var imgSrc = 'http://static.12301.cc/assets/build/images/gloading.gif';
		html += '<'+tag+' id="'+id+'" style="width:'+width+'; height:'+height+'px; line-height:'+height+'px; text-align:center" class="'+className+'">';
		html += 	'<img style="width:'+imgWidth+'px; position:relative; top:'+top+'px; vertical-align:middle; margin-right:5px" src="'+imgSrc+'"/>';
		html +=     '<span class="t">'+text+'</span>';
		html += '</'+tag+'>';
		return html;
	};
	module.exports = Loading;

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map