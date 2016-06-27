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
/******/ 	__webpack_require__.p = "http://static.12301.test/assets/build/test/";
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
	__webpack_require__(25);
	var UserInfo = __webpack_require__(27);
	var CardList = __webpack_require__(28);
	var OrderInfo = __webpack_require__(30);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {},
		initialize : function(){
			this.UserInfo = new UserInfo();
			this.CardList = new CardList();
			this.OrderInfo = new OrderInfo();
		}
	});
	
	$(function(){
		new MainView();
	})

/***/ },

/***/ 12:
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
				uploadFile : "/r/product_annualCard/uploadImg/",
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
				getLands : "/r/product_annualCard/getLands/",
				//获取票类列表
				getTickets : "/r/product_annualCard/getTickets/",
				//删除票类
				deleteTicket : "/route/index.php?c=product_ticket&a=set_status"//"/r/product_ticket/set_status"
			},
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
			},
			//获取某个产品的虚拟卡的库存
			getVirtualStorage : "/r/product_annualCard/getVirtualStorage/"
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

/***/ 25:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 27:
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

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 15:17
	 * Description: ""
	 */
	var Api = __webpack_require__(12);
	var Loading_Pc = __webpack_require__(29);
	var List = Backbone.View.extend({
		el : $("#cardMsgListUl"),
		loading_str : Loading_Pc("请稍后",{tag:"li",height:100}),
		initialize : function(){
			var urlParam = PFT.Util.UrlParse();
			var pid = this.pid = urlParam["pid"];
			var physics = this.physics = urlParam["physics"];
			if(!pid) return alert("缺少pid");
			this.getList(pid,physics);
			this.$el.html(this.loading_str);
		},
		getList : function(pid,physics){
			var that = this;
			physics = physics || "";
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

/***/ 29:
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

/***/ 30:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/17 16:27
	 * Description: ""
	 */
	var Api = __webpack_require__(12);
	var Loading_Pc = __webpack_require__(29);
	var tpl = __webpack_require__(31);
	var OrderIno = Backbone.View.extend({
		initialize : function(){
			this.listUl = $("#orderInfoList");
			//return this.listUl.html(this.renderInfo("loading"));
	
			this.urlParams = PFT.Util.UrlParse();
			this.pid = this.urlParams["pid"];
			this.aid = this.urlParams["aid"];
			this.physics = this.urlParams["physics"]; //如果有physics参数 说明购买的是实体卡  反之，则购买的是虚拟卡
			this.type = this.physics ? "physics" : "virtual";
			if(!this.pid || !this.aid || !this.type) return false;
			this.getInfo(this.pid,this.aid,this.type);
		},
		template : _.template(tpl),
		getInfo : function(pid,aid,type){
			PFT.Util.Ajax(Api.Url.makeOrder.getOrderInfo,{
				loading : function(){
	
				},
				complete : function(){},
				success : function(res){
					res = res || {};
					var data = res.data;
					var product = data.product;
					if(res.code==200){
						$("#ltitle_text").text(product.ltitle);
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		renderInfo : function(data){
			var html = "";
			if(data=="loading"){
				html = Loading_Pc("请稍后...",{
					tag : "tr",
					colspan : 6,
					height : 100
				});
			}else if(data=="complete"){
				html = "";
			}else if(data=="fail" || data=="error"){
				html = arguments[1] || PFT.AJAX_ERROR_TEXT;
			}else{
				html = this.template({data:data});
			}
			return html;
		}
	});
	module.exports = OrderIno;

/***/ },

/***/ 31:
/***/ function(module, exports) {

	module.exports = "<tr>\r\n    <td>\r\n        <p><%=data.product.title%></p>\r\n        <% if(data.privileges.length){ %>\r\n            <p>包含：</p>\r\n            <%_.each(data.privileges,function(item,index){%>\r\n                <p>XXXXXX 景区成人票 共50张 限使用2次/日</p>\r\n            <% }) %>\r\n        <% } %>\r\n    </td>\r\n    <td><%=data.product.storage%></td>\r\n    <td><i class=\"yen\">&yen;</i><em class=\"price\"><%=data.product.price%></em></td>\r\n    <td>不可退</td>\r\n    <td>1</td>\r\n    <td class=\"font-red\"><i class=\"yen\">&yen;</i><em class=\"total_price\"><%=data.product.price%></em></td>\r\n</tr>";

/***/ }

/******/ });
//# sourceMappingURL=all.js.map