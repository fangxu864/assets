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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(22);
	var PubSub = PFT.Util.PubSub;
	var Header = __webpack_require__(24);
	var List = __webpack_require__(25);
	var Dialog = __webpack_require__(26);
	var Select = __webpack_require__(30);
	var Api = __webpack_require__(5);
	var MainView = Backbone.View.extend({
		el : $("body"),
		events : {
			"click #relateSHCardBtn" : "onRelateSHCardBtnClick",
			"click #clearAllListBtn" : "onClearAllListClick",
			"click #submitBtn" : "onSubmit"
		},
		initialize : function(){
			var that = this;
			this.pid = PFT.Util.UrlParse()["pid"] || "";
			this.Header = new Header();
			this.List = new List();
			this.Dialog = new Dialog({List:this.List});
			this.Header.on("create.card",function(data){
				var cards = data.cards;
				that.List.render(cards);
			})
			this.cardList = $("#cardList");
			this.Select = new Select({
				trigger : $("#cardProdTriggerInput"),
				source : Api.Url.EntryCard.getProdList + "?page=1&page_size=1000",
				defaultVal : this.pid,
				height : 400,
				field : {
					id : "id",
					name : "p_name"
				},
				adaptor : function(res){
					res = res || {};
					var data = res.data || {};
					var list = data.list || [];
					return list;
				}
			});
			$(".arrowup").hide();
			this.Select.on("open",function(){
				$("#card_headerContaienr").addClass("select-on");
				$(".arrowdown").hide();
				$(".arrowup").show();
			})
			this.Select.on("close",function(){
				$("#card_headerContaienr").removeClass("select-on");
				$(".arrowdown").show();
				$(".arrowup").hide();
			})
		},
		onRelateSHCardBtnClick : function(e){
			var cardList = this.cardList;
			if(cardList.children(".cardItem").length==0) return alert("请先生成卡号");
			this.Dialog.open(function(){
				var total = 0;
				var hasRelated = 0;
				cardList.children().each(function(){
					var tarItem = $(this);
					var card_no = tarItem.find(".card").text();
					var physics_no = tarItem.find(".physics").text();
					if(card_no=="--") card_no = "";
					if(physics_no=="--") physics_no = "";
					total+=1;
					if(card_no && card_no) hasRelated+=1;
				});
				$("#hasRelatedCount").text(hasRelated);
				$("#totalRelatedCount").text(total);
			});
		},
		//清空重置
		onClearAllListClick : function(e){
			if(this.cardList.children().length==0) return false;
			if(!confirm("确定要清空卡片列表吗？")) return false;
			this.cardList.html("");
		},
		//确定发卡
		onSubmit : function(e){
			var submitBtn = $(e.currentTarget);
			if(submitBtn.hasClass("disable")) return false;
			var pid = this.Select.getValue().id;
			if(!pid) return alert("缺少年卡产品id");
			var list = [];
			this.cardList.children().each(function(){
				var item = $(this);
				var virtual = item.find(".virtual").text();
				var card = item.find(".card").text();
				var physics = item.find(".physics").text();
				if(card=="--") card = "";
				if(physics=="--") physics = "";
				list.push({
					virtual_no : virtual,
					card_no : card,
					physics_no : physics
				})
			})
			if(list.length==0) return false;
			PFT.Util.Ajax(Api.Url.EntryCard.createAnnualCard,{
				type : "post",
				params : {
					pid : pid,
					list : list
				},
				loading : function(){ submitBtn.addClass("disable")},
				complete : function(){ submitBtn.removeClass("disable")},
				success : function(res){
					res = res || {};
					var code = res.code;
					if(code==200){
						PFT.Util.STip("success",'<p style="width:200px">发卡成功</p>');
						$("#cardList").html("");
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		}
	});
	
	$(function(){
		new MainView();
	})

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
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
				detail : "/r/product_AnnualCard/getMemberDetail/",
				history : "/r/product_AnnualCard/getHistoryOrder/"
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
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/25 18:20
	 * Description: ""
	 */
	module.exports = function(){
		var result = {
			width : 0,
			height : 0
		};
		if(window.innerWidth){
			result.width = window.innerWidth;
			result.height = window.innerHeight;
		}else if(document.documentElement && document.documentElement.clientWidth){
			result.width = document.documentElement.clientWidth;
			result.height = document.documentElement.clientHeight;
		}else{
			result.width = document.body.clientWidth;
			result.height = document.body.clientHeight;
		}
		return result;
	}

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 23 */,
/* 24 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/14 15:55
	 * Description: ""
	 */
	var Header = Backbone.View.extend({
		el : $("#card_headerContaienr"),
		events : {
			"click #createCardListBtn" : "onCreateCardListBtnClick",
			"keyup #cardCountInp" : "onCardCountInpKeyup"
		},
		MAX_COUNT : 50, //单次生成新卡的最大数量
		initialize : function(){
			this.cardCountInp = $("#cardCountInp");
			this.cardListUl = $("#cardList");
		},
		//点击生成卡号
		onCreateCardListBtnClick : function(e){
			var that = this;
			var count = $.trim(this.cardCountInp.val());
			if(!PFT.Util.Validate.typeInit0(count)) return alert("生成数量请填写正整数");
			if(count>this.MAX_COUNT) return alert("单次最多只能生成"+this.MAX_COUNT+"张");
			if(this.cardListUl.children(".cardItem").length) return alert("请先将已生成的卡保存，方可再次生成新卡");
			var result = [];
			for(var i=0; i<count; i++){
				result.push(that.createCardNumber());
			}
			this.trigger("create.card",{cards:result});
		},
		//回车直接生成卡号
		onCardCountInpKeyup : function(e){
			if(e.keyCode==13){ //回车
				$("#createCardListBtn").trigger("click");
			}
		},
		//点击关联实体卡
		onRelateSHCardBtnClick : function(e){
			this.trigger("onRelateSHCardBtnClick");
		},
		createCardNumber : function(){
			var result = [];
			//首位随机大写字母
			result.push(this.randomWord("letter",false,1,1));
			//2，3，4位随机英文或数字
			result.push(this.randomWord("both",false,1,1));
			result.push(this.randomWord("both",false,1,1));
			result.push(this.randomWord("both",false,1,1));
			//567位随机数字
			result.push(this.randomWord("number",false,1,1));
			result.push(this.randomWord("number",false,1,1));
			result.push(this.randomWord("number",false,1,1));
	
			var last = 0;
			for(var i in result){
				var r = result[i];
				if(PFT.Util.Validate.typeInit0(r)){
					last += r*1;
				}
			}
			last = last+"";
			last = last.substr(last.length-1);
	
			result.push(last);
	
			return result.join("");
	
		},
		/**
		 *  生成随机字母与数字组合
		 *  参考 https://gist.github.com/xuanfeng/b23ab28ab412254e1594
		 *  type : letter生成随机字母   number生成随机数字  both生成随机数字与字母组合
		 *  randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
		 */
		randomWord : function(type,randomFlag,min,max){
			var str = "",
				range = min,
				arr = [];
			if(type=="letter"){
				arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			}else if(type=="number"){
				arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			}else{
				arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			}
	
			// 随机产生
			if(randomFlag){
				range = Math.round(Math.random() * (max-min)) + min;
			}
			for(var i=0; i<range; i++){
				var pos = Math.round(Math.random() * (arr.length-1));
				str += arr[pos];
			}
			return str;
		}
	});
	module.exports = Header;

/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/14 17:39
	 * Description: ""
	 */
	var List = Backbone.View.extend({
		el : $("#cardList"),
		events : {
			"click .deleteBtn" : "onDeleteBtnClick"
		},
		initialize : function(){},
		onDeleteBtnClick : function(e){
			if(!confirm("是否确定删除该卡？")) return false;
			var tarBtn = $(e.currentTarget);
			tarBtn.parents(".cardItem").remove();
		},
		render : function(data){
			var html = "";
			for(var i in data){
				var card = data[i];
				html += '<tr class="cardItem"><td class="virtual">'+card+'</td><td class="card">--</td><td class="physics">--</td><td><a class="deleteBtn" href="javascript:void(0);">删除</a></td></tr>'
			}
			this.$el.html(html);
		}
	});
	module.exports = List;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/14 18:19
	 * Description: ""
	 */
	var box_tpl = __webpack_require__(27);
	var winWidthHeight = __webpack_require__(13);
	__webpack_require__(28);
	var Dialog = Backbone.View.extend({
		state : 0,
		initialize : function(opt){
			var that = this;
			this.List = opt.List;
			this.dialogBox = this.createDialog();
			this.mask = this.createMask();
			this.readCardObj = document.getElementById("readCardObj");
			$("#dialogCloseBtn").on("click",function(e){
				that.close();
			})
			$("#relateCardBtn").on("click",function(e){
				that.relateCard(e);
			})
			$("#clearCardInpBtn").on("click",function(e){
				var inp = $("#physic_no_Inp");
				inp.val("").focus();
				$(e.currentTarget).hide();
			})
			$("#physic_no_Inp").on("keyup",function(e){
				var tarInp = $(e.currentTarget);
				var keycode = e.keyCode;
				if(keycode!=13) return false;
				$("#clearCardInpBtn").show();
			})
		},
		//关联卡
		relateCard : function(e){
			var physicInp = $("#physic_no_Inp");
			var cardNumInp = $("#cardNumberInput");
			var physic_number = physicInp.val();
			var card_number = $.trim(cardNumInp.val());
			if(!physic_number) return alert("请先把卡放在读卡器上，然后点击读卡按钮");
			if(!card_number) return alert("实体卡号不能为空");
			this.addCardToList(physic_number,card_number);
			physicInp.val("");
			cardNumInp.val("");
		},
		addCardToList : function(physic_number,card_number){
			if(!physic_number) return false;
			var hasExist = false;
			var cardList = $("#cardList");
			var unRelate_first = null;
			cardList.children().each(function(){
				var item = $(this);
				var physics = item.find(".physics").text();
				if(physics=="--") physics = "";
				if(physics=="" && !unRelate_first) unRelate_first = item;
				if(physics==physic_number && physics!=""){
					hasExist = true;
					return false;
				}
			})
			if(hasExist) return alert("此卡已关联过");
			unRelate_first.find(".physics").text(physic_number);
			unRelate_first.find(".card").text(card_number);
			var hasRelatedCount = $("#hasRelatedCount");
			hasRelatedCount.text(hasRelatedCount.text()*1+1);
		},
		readwuKa : function(e){
			var readCardObj = this.readCardObj;
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
			$("#physic_no_Inp").val(val);
		},
		createDialog : function(){
			if(this.dialogBox) return this.dialogBox;
			this.dialogBox = $('<div style="display:none; float:left" class="dialogBoxContainer"></div>');
			this.dialogBox.append(box_tpl);
			$("body").append(this.dialogBox);
			return this.dialogBox;
		},
		createMask : function(){
			if(this.mask) return this.mask;
			this.mask = $('<div style="display:none" class="dialogMask"></div>');
			$("body").append(this.mask);
			return this.mask;
		},
		position : function(box){
			var w = box.width();
			var h = box.height();
			var win = winWidthHeight();
			box.css({
				position : "fixed",
				left : (win.width-w)/2,
				top : (win.height-h)/2-(win.height-h)*0.1
			})
		},
		slide : function(callback){
			var slideStage = $("#dialog-slideStage");
			var step = slideStage.height();
			var slideCon = slideStage.children(".slideCon");
			var top = slideCon.css("top");
			top = top.substr(0,top.length-2)*1;
			var dir = top==0 ? -1 : 0;
			slideCon.animate({top:dir*step},100,function(){
				callback && callback()
			});
		},
		open : function(callback){
			if(this.state==1) return false;
			this.state = 1;
			this.dialogBox.show().css({zIndex:100});
			this.mask.show().css({zIndex:99});
			this.position(this.dialogBox);
			$("#dialog-slideStage").children(".slideCon").css({top:0});
			callback && callback();
		},
		close : function(callback){
			this.state = 0;
			this.dialogBox.hide().css({zIndex:-1});
			this.mask.hide().css({zIndex:-1})
			callback && callback()
		}
	});
	module.exports = Dialog;


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<div class=\"dialogBoxContainerCon\">\r\n    <div class=\"charge border\" id=\"chaBox\">\r\n        <div id=\"dialog-slideStage\" class=\"slideStage\">\r\n            <div style=\"top:0px\" class=\"slideCon\">\r\n                <!--<div style=\"margin-top:18px\" class=\"cha slideItem\">-->\r\n                    <!--<h1 class=\"entry\">请刷卡！</h1>-->\r\n                    <!--<h2 style=\"display:none\" id=\"cardExitTip\" class=\"font-red\">已存在</h2>-->\r\n                <!--</div>-->\r\n                <div class=\"cha slideItem\">\r\n                    <!--<object classid=\"clsid:b1ee5c7f-5cd3-4cb8-b390-f9355defe39a\" width=\"0\" height=\"0\" id=\"readCardObj\"></object>-->\r\n                    <div style=\"position:relative; margin-bottom:10px\" class=\"font-gray line-40\">\r\n                        物理ID：<input style=\"padding:5px 6px;\" type=\"text\" name=\"\" id=\"physic_no_Inp\"/>\r\n                        <span class=\"readCardBtn\" id=\"\">请用读卡器读卡</span>\r\n                        <div id=\"clearCardInpBtn\" class=\"clearCardInpBtn\"><i class=\"iconfont\">&#xe674;</i></div>\r\n                    </div>\r\n                    <div class=\"relaBox\">\r\n                        <input id=\"cardNumberInput\" type=\"text\"  placeholder=\"请输入实体卡号（卡面号码）\" class=\"guanInp\"/>\r\n                        <a id=\"relateCardBtn\" href=\"javascript:void(0);\" class=\"btn btn-orange\">关联</a>\r\n                    </div>\r\n                    <p style=\"color:#bfbfbf; margin-top:5px;\">请确保填写的卡号确认无误！</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"enCard\">\r\n            <span>已关联实体卡:\r\n                <span id=\"hasRelatedCount\" class=\"numChild\">2</span><i class=\"letr\">/</i><span id=\"totalRelatedCount\" class=\"numP\">10</span><span class=\"font-gray\">（不关联实体卡亦可）</span></span>\r\n            <a id=\"dialogCloseBtn\" href=\"javascript:void(0);\" class=\"btn btn-5x btn-blue btn-finish closeBtn\">关闭</a>\r\n        </div>\r\n    </div>\r\n    <!--<div style=\"display:none;\" class=\"charge border\" id=\"guanBox\">-->\r\n        <!--<a href=\"javascript:void(0);\" class=\"btn-del\" style=\"color:#ccc\">×</a>-->\r\n        <!--<div class=\"cha border-bottom\">-->\r\n            <!--<p class=\"font-gray line-40\">物理ID:565666</p>-->\r\n            <!--<div class=\"relaBox\">-->\r\n                <!--<input type=\"text\" placeholder=\"请输入实体卡号（卡面号码）\"class=\"guanInp\"/>-->\r\n                <!--<a href=\"javascript:;\" class=\"btn btn-orange\">关联</a>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <!--<div class=\"enCard\">-->\r\n            <!--<span>已关联实体卡:<span class=\"numChild\">2</span><span class=\"numP\">/10</span><span class=\"font-gray\">（不关联实体卡亦可）</span></span>-->\r\n            <!--<a href=\"javascript:;\" class=\"btn btn-5x btn-blue btn-finish\">完成</a>-->\r\n        <!--</div>-->\r\n    <!--</div>-->\r\n</div>";

/***/ },
/* 28 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 29 */,
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/14 11:14
	 * Description: 项目时间紧迫，主体功能先实现，更多功能后续会慢慢增加
	 */
	__webpack_require__(31);
	var Defaults = {
		trigger : null,
	
		field : {
			id : "id",
			name : "name"
		},
	
		//是否支持搜索过滤 默认为true(支持)
		//接受的值有：3种
		//true(支持)  false(不支持)  function自定义过滤规则，如：function(data,keyword){ return[{key:value}] }
		filter : true,
	
		height : 200,
	
		source : "", //ajax请求的数据源
	
		offset : { //偏移量
			top : 0,
			left : 0,
			width : 0 //一般情况下，下拉框的宽度会取trigger的宽度，但程序获取trigger宽度有时会存在几个px的误差，此时，offset.width可让使用者来手动调整
		},
	
		defaultVal : "",  //初始化时默认选中的值
	
		tpl : function(){
			return __webpack_require__(33);
		},
	
		//适配器，用于适配从后端请求回来的数据为如下格式
		//[{key1:value1,key2:value2}]
		adaptor : function(res){
			res = res || {};
			var code = res.code;
			var data = res.data || [];
			return data;
		},
	
		//若需要传入自定义的静态data数据,
		//格式需为:[{key1:value1,key2:value2}] 此时将忽略source,adaptor,field参数
		data : null
	};
	function Select(opt){
		var opt = this.opt = $.extend({},Defaults,opt);
		this.init(opt);
	}
	Select.prototype = {
		__cacheData : null,
		keyupTimer : null,
		current_id : "",
		current_name : "",
		init : function(opt){
			var that = this;
			var trigger = this.trigger = typeof opt.trigger==="string" ? $("#"+opt.trigger.substr(opt.trigger.indexOf("#")+1)) : opt.trigger;
			var source = this.source = opt.source;
			if(!trigger.length) return false;
			if(!source && !opt.data) return false;
			this.selectBox = this.createSelectBox();
			this.mask = this.createMask();
			this.searchInp = this.selectBox.find(".gSelectSearchInp");
			this.clearSearchBtn = this.selectBox.find(".clearSearchBtn");
			this.listUl = this.selectBox.find(".selectOptionUl");
			this.position();
			this.bindEvents();
			if(opt.data){
				this.__cacheData = opt.data;
				this.listUl.html(this.updateListUl(opt.data));
			}
			if(this.opt.source && !this.opt.data && this.__cacheData==null){
				this.fetchData(this.opt.source);
			}
			if(!opt.filter) this.selectBox.addClass("no-search");
		},
		bindEvents : function(){
			var that = this;
			this.trigger.on("click",function(e){
				that.trigger.toggleClass("select-on");
				if(that.trigger.hasClass("select-on")){
					that.open();
				}else{
					that.close();
				}
			})
			this.mask.on("click",function(){
				that.close();
			})
			this.searchInp.on("keyup",function(e){
				if(!that.opt.filter) return false;
				that.onSearchInpChange(e);
			})
			this.clearSearchBtn.on("click",function(e){
				$(e.currentTarget).hide();
				that.searchInp.val("").focus();
				var html = that.renderListHtml(that.__cacheData);
				that.listUl.html(html);
			})
			this.listUl.on("click",".gSelectOptionItem",function(e){
				that.onOptionItemClick(e);
			});
		},
		onOptionItemClick : function(e){
			var that = this;
			var tarItem = $(e.currentTarget);
			if(!tarItem.hasClass("gSelectOptionItem")) return false;
			var field = that.opt.field;
			var field_id = field.id;
			var field_name = field.name;
			var id = tarItem.attr("data-"+field_id);
			var name = tarItem.find(".t").text();
			var data = {};
			data[field_id] = id;
			data[field_name] = name;
			that.current_id = id;
			that.current_name = name;
			that.trigger.attr("data-"+field_id,id).attr("data-"+field_name,name);
			if(that.trigger[0].nodeName.toUpperCase()=="INPUT"){
				that.trigger.val(name);
			}else{
				that.trigger.text(name);
			}
			that.close();
			tarItem.addClass("active").siblings().removeClass("active");
			PFT.Util.PubSub.trigger("option.click",data);
		},
		onSearchInpChange : function(e){
			var that = this;
			clearTimeout(this.keyupTimer);
			this.keyupTimer = setTimeout(function(){
				var keyword = $.trim($(e.currentTarget).val());
				var result = that.filter(keyword);
				keyword=="" ? that.clearSearchBtn.hide() : that.clearSearchBtn.show();
				var html = that.renderListHtml(result);
				that.listUl.html(html);
			},200)
		},
		//过滤
		filter : function(keyword){
			if(typeof this.opt.filter=="function") return this.opt.filter(this.__cacheData,keyword);
			var result = [];
			var cache = this.__cacheData;
			var field = this.opt.field;
			var name_field = field.name;
			if(!keyword || keyword=="") return cache;
			if(cache=="loading" || cache=="error" || cache==null || cache=="empty") return result;
			for(var i in cache){
				var data = cache[i];
				var name = data[name_field];
				if(name.indexOf(keyword)>-1) result.push(data);
			}
			return result;
		},
		//创建主体下拉框
		createSelectBox : function(){
			if(this.selectBox) return this.selectBox;
			var tpl = this.opt.tpl();
			var opt = this.opt;
			var width = opt.trigger.outerWidth()+(opt.offset.width || 0);
			var height = opt.height;
			var selectBox = this.selectBox = $('<div style="display:none;width:'+width+'px;height:'+height+'px" class="gSelectDownBox"></div>');
			selectBox.append(tpl);
			$("body").append(selectBox);
			return this.selectBox;
		},
		//创建遮罩层
		createMask : function(){
			if(this.mask) return this.mask;
			this.mask = $('<div style="display:none" class="gSelectMask"></div>');
			$("body").append(this.mask);
			return this.mask;
		},
		updateListUl : function(data){
			var html = this.renderListHtml(data);
			this.listUl.html(html);
			var defaultVal = this.opt.defaultVal;
			if(data=="loading" || data=="error" || data==null) return false;
			if(defaultVal){
	
				this.selectDefaultVal();
			}else{
				this.listUl.children().first().trigger("click");
			}
		},
		//初始化时选中默认值
		selectDefaultVal : function(){
			var defaultVal = this.opt.defaultVal;
			if(!defaultVal) return false;
			this.listUl.children().filter("[data-"+this.opt.field.id+"="+defaultVal+"]").trigger("click");
		},
		renderListHtml : function(data,errorMsg){ //data必须为如下格式：[{key1:value1,key2:value2}]
			var html = "";
			var msg = errorMsg || PFT.AJAX_ERROR_TEXT;
			if(Object.prototype.toString.call(data)=="[object Array]"){
				var field = this.opt.field;
				var id_field = field.id;
				var name_field = field.name;
				for(var i in data){
					var d = data[i];
					var id = d[id_field];
					var name = d[name_field];
					html += '<li data-'+id_field+'="'+id+'" class="gSelectOptionItem"><span class="t">'+name+'</span></li>';
				}
				if(!html) html = '<li class="status empty">无匹配选项</li>';
			}else{
				switch(data){
					case null:
						html = "";
						break;
					case "loading":
						html = '<li class="status loading">努力加载中，请稍后...</li>';
						break;
					case "fail" :
						html = '<li class="status fail">'+msg+'</li>';
						break;
					case "timeout":
						html = '<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
						break;
					case "error":
						html = '<li class="status error">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
						break;
				}
			}
			return html;
		},
		//定位
		position : function(){
			var trigger = this.trigger;
			var selectBox = this.createSelectBox();
			var of = trigger.offset();
			var offset = this.opt.offset;
			var trigger_h = trigger.outerHeight(true);
			selectBox.css({
				left : of.left + (offset.left || 0),
				top : of.top + trigger_h + (offset.top || 0)
			})
		},
		fetchData : function(source){
			var that = this;
			PFT.Util.Ajax(source,{
				type : "get",
				dataType : "json",
				loading : function(){
					that.opt.__cacheData = "loading";
					that.updateListUl("loading");
				},
				complete : function(){
					that.opt.__cacheData = "";
					that.updateListUl(null);
				},
				success : function(res){
					res = res || {};
					var code = res.code;
					var data = that.opt.adaptor(res);
					if(code==200){
						that.__cacheData = data;
						that.updateListUl(data);
					}else{
						that.__cacheData = "error";
						that.updateListUl("error");
					}
				},
				error : function(){
					that.opt.__cacheData = "error";
					that.updateListUl("error");
				}
			})
		},
		//=========================================================================
		//=========================================================================
		//=========================== 对外暴露以下4个方法 =============================
		//=========================================================================
		//=========================================================================
		open : function(callback){
			this.createMask().show();
			this.createSelectBox().show();
			this.trigger.addClass("select-on");
			PFT.Util.PubSub.trigger("open");
			callback && callback();
		},
		close : function(callback){
			this.mask.hide();
			this.selectBox.hide();
			this.trigger.removeClass("select-on");
			PFT.Util.PubSub.trigger("close");
			callback && callback();
		},
		getValue : function(){
			return{
				id : this.current_id,
				name : this.current_name
			}
		},
		on : function(type,callback){
			if(!type) return false;
			callback = typeof callback=="function" ? callback : function(){};
			PFT.Util.PubSub.on(type,callback);
		}
	};
	
	module.exports = Select;


/***/ },
/* 31 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 32 */,
/* 33 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gSelectDownBoxCon\">\r\n    <div class=\"selectTopCon\">\r\n        <div class=\"searchBox\">\r\n            <div class=\"searchBoxCon\">\r\n                <input type=\"text\" name=\"\" class=\"gSelectSearchInp\"/>\r\n                <i class=\"iconfont search\">&#xe60a;</i>\r\n                <span class=\"clearSearchBtn\"><i class=\"iconfont\">&#xe674;</i></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <ul class=\"selectOptionUl\"></ul>\r\n</div>\r\n\r\n";

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map