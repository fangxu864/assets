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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 14:50
	 * Description: ""
	 */
	__webpack_require__(55);
	var Model = __webpack_require__(57);
	var Header = __webpack_require__(58);
	var PckInfoManager = __webpack_require__(63);
	var Loading = __webpack_require__(38);
	var MainView = Backbone.View.extend({
		el : $("body"),
		initialize : function(){
			var that = this;
			this.model = new Model();
			this.tid = this.model.getTid();
			this.lid = this.model.getLid();
			this.model.fetchTicketInfo({
				loading : function(){
					var html = Loading("努力加载中，请稍后...",{
						id : "fetchTicketInfoLoading",
						width : 798,
						height : 600,
						css : {
							position : "absolute",
							zIndex : 1000,
							top : "28px",
							left : 0,
							right : 0,
							background : "#fff"
						}
					});
					$("#cardContainer").append(html);
				},
				complete : function(){ $("#fetchTicketInfoLoading").remove();},
				success : function(res){
					that.infoManager = new PckInfoManager({model:that.model});
					that.infoManager.init({model:that.model,initData:res});
					that.header = new Header({model:that.model});
					//点击删除一个套餐
					that.header.on("item.delete",function(data){
						that.infoManager.removeItem(data.id);
					});
					//点击切换套餐
					that.header.on("item.switch",function(data){
						var id = data.id;
						if(id>=0){
							that.infoManager.switchItem(id);
						}else{
							if($("#slideItem_"+id).length==0) that.infoManager.createItem(id);
							that.infoManager.switchItem(id);
						}
					});
					that.header.init({model:that.model,initData:res});
				}
			});
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
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
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
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 56 */,
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/3 16:27
	 * Description: ""
	 */
	var fn = new Function();
	var Api = __webpack_require__(5);
	var ManagerStore = Backbone.Model.extend({
		__Cache : {},
		api : {
			fetch_package_list : Api.Url.PackageInfo.getPackageInfoList,
			fetch_prod_list : Api.Url.PackageInfo.getLands,
			fetch_ticket : Api.Url.PackageInfo.getTickets
		},
		initialize : function(){
	
		},
		getTid : function(){
			return typeof this.tid=="undefined" ? (this.tid=PFT.Util.UrlParse()["prod_id"] || "") : this.tid;
		},
		getLid : function(){
			return typeof this.lid=="undefined" ? (this.lid=PFT.Util.UrlParse()["sid"] || "") : this.lid;
		},
		getCache : function(tid){
			if(!tid) return null;
			return this.__Cache[tid] || null
		},
		/**
		* 获取指定年卡产品内的套餐信息
		*/
		fetchTicketInfo : function(opt){
			var opt = opt || {};
			var tid = opt.tid || this.getTid();
			var lid = this.getLid();
			if(!lid && !tid) throw new Error("lid与tid不能同时为空");
			var loading = opt.loading || fn;
			var complete = opt.complete || fn;
			var success = opt.success || fn;
			var params = {};
			if(tid){
				params["tid"] = tid;
			}else if(lid){
				params["lid"] = lid;
			}
			var that = this;
			PFT.Util.Ajax(this.api.fetch_package_list,{
				type : "post",
				params : params,
				loading : function(){
					loading();
					that.trigger("fetchTicketInfo.loading");
				},
				complete : function(){
					complete();
					that.trigger("fetchTicketInfo.complete");
				},
				success : function(res){
					tid && (that.__Cache[tid] = true);
					res = res || {};
					if(res.code!=200) return alert(res.msg || PFT.AJAX_ERROR_TEXT);
					success(res);
					that.trigger("fetchTicketInfo.ready",res);
				}
			})
		},
		/**
		 * 获取产品列表
		 */
		fetchProdList : function(){
			var that = this;
			PFT.Util.Ajax(this.api.fetch_prod_list,{
				loading : function(){
					that.trigger("fetchProdList.loading");
				},
				complete : function(){
					that.trigger("fetchProdList.complete");
				},
				success : function(res){
					res = res || {};
					var code = res.code;
					if(code==200){
						that.trigger("fetchProdList.success",res);
					}else{
						that.trigger("fetchProdList.fail",res);
					}
				}
			})
		},
		/**
		 * 获取某个产品下的票类
		 * @param prod_id
		 */
		fetchTicket : function(prod_id,aid){
			if(!prod_id || !aid) return false;
			var that = this;
			PFT.Util.Ajax(this.api.fetch_ticket,{
				type : "get",
				params : {
					lid : prod_id,
					aid : aid
				},
				loading : function(){
					that.trigger("fetchTicket.loading");
				},
				complete : function(){
					that.trigger("fetchTicket.complete");
				},
				success : function(res){
					res = res || {};
					var code = res.code;
					if(code==200){
						that.trigger("fetchTicket.success",{prodId:prod_id,aid:aid,data:res});
					}else{
						that.trigger("fetchTicket.fail",res);
					}
				}
			})
		}
	});
	module.exports = ManagerStore;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/3 16:56
	 * Description: ""
	 */
	__webpack_require__(59);
	var indexTpl = __webpack_require__(61);
	var itemTpl = __webpack_require__(62);
	var Header = Backbone.View.extend({
		el : $("#headContainer"),
		template : _.template(itemTpl),
		events : {
			"click .pckTitListUlItem" : "onItemClick",
			"click #addPckBtn" : "addItem",
			"click .removeBtn" : "onRemoveBtnClick"
		},
		_uid : 0,
		initialize : function(opt){},
		init : function(opt){
			var that = this;
			this.$el.html(indexTpl);
			this.$addBtn = $("#addPckBtn");
			this.listUl = $("#pckTitListUl");
			this.tid = this.model.getTid(); //票id
			this.lid = this.model.getLid(); //景区id
			var initData = opt.initData;
			var html = "";
			if(this.tid){ //址地栏传入tid进来
				var data = initData.data.otherTicket || [];
				for(var i in data){
					var item = data[i];
					var tid = item.tid;
					var ttitle = item.title;
					html += that.renderItem(tid,ttitle);
				}
				that.$addBtn.before(html);
				that.listUl.children(".pckTitListUlItem").filter("[data-id="+this.tid+"]").trigger("click");
			}else{//地址栏没传入tid 说明是新建一个景区
				html += that.renderItem(that.getUID(),"");
				that.$addBtn.before(html);
				that.listUl.children(".pckTitListUlItem").first().trigger("click");
			}
			$("#packageName").text(initData.data.attribute.ltitle);
		},
		//点击切换
		onItemClick : function(e){
			var tarItem = $(e.currentTarget);
			if(!tarItem.hasClass("pckTitListUlItem")) return false;
			var id = tarItem.attr("data-id");
			var name = tarItem.find(".name").text();
			tarItem.addClass("edit").siblings().removeClass("edit");
			this.trigger("item.switch",{
				id : id,
				name : name
			})
		},
		onRemoveBtnClick : function(e){
			e.stopPropagation();
			if(!confirm("删除该卡种，关联的会员特权也一并删除，是否确定删除？")) return false;
			var tarBtn = $(e.currentTarget);
			var parent = tarBtn.parents(".pckTitListUlItem");
			var id = parent.attr("data-id");
			parent.remove();
			this.trigger("item.delete",{id:id});
			this.listUl.children(".pckTitListUlItem").first().trigger("click");
		},
		switchItem : function(id){
			if(!id) return false;
			this.listUl.find(".pckTitListUlItem[data-id="+id+"]").addClass("edit").siblings().removeClass("edit");
		},
		getUID : function(){
			this._uid++;
			return -1 * this._uid;
		},
		/**
		 * 添加一个套餐
		 */
		addItem : function(){
			var id = this.getUID();
			var html = this.renderItem(id,"");
			this.listUl.children().removeClass("edit");
			this.$addBtn.before(html);
			this.listUl.children(".pckTitListUlItem").last().trigger("click");
		},
		renderItem : function(tid,ttitle){
			return this.template({tid:tid,ttitle:ttitle});
		}
	});
	module.exports = Header;

/***/ },
/* 59 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 60 */,
/* 61 */
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/6/3 17:11 -->\r\n<!-- Description: huangzhiyang -->\r\n<p id=\"packageName\" class=\"packageName\"></p>\r\n<ul id=\"pckTitListUl\" class=\"pckTitListUl\">\r\n    <li id=\"addPckBtn\" class=\"addPckBtn\">＋</li>\r\n</ul>\r\n";

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/6/3 18:41 -->\r\n<!-- Description: huangzhiyang -->\r\n<li data-id=\"<%=tid%>\" id=\"pckTitListUlItem_<%=tid%>\" class=\"pckTitListUlItem edit\">\r\n    <span class=\"name passCard\"><%=ttitle%></span>\r\n    <input type=\"text\" class=\"editNameInp\" placeholder=\"请填写套餐名称\" value=\"<%=ttitle%>\"/><i class=\"removeBtn iconfont\">&#xe627;</i>\r\n</li>";

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/6 11:30
	 * Description: ""
	 */
	var Api = __webpack_require__(5);
	var infoItem_tpl = __webpack_require__(64);
	var rightsItem_tpl = __webpack_require__(65);
	var Calendar = __webpack_require__(66);
	var ProdSelectPop = __webpack_require__(71);
	var Submit = __webpack_require__(77);
	var Loading = __webpack_require__(38);
	var InfoManager = Backbone.View.extend({
		el : $("#slideUl"),
		events : {
			"focus .datePickerInp" : "onDatePickerInpFocus",
			"click .selectProd_picker" : "onSelectProdBtnClick",
			"click .deleteProdBtn" : "onDelectProdBtnClick",
			"click .addPckRightBtn" : "onAddPckRightBtnClick",
			"click .submitBtn" : "onSubmitBtnClick"
		},
		template : _.template(infoItem_tpl),
		rightsTemplate : _.template(rightsItem_tpl),
		initialize : function(){},
		init : function(opt){
			var that = this;
			var initData = this.initData = opt.initData;
			this.itemWidth = $("#infoManagerContainer").width();
	
			this.initList(initData);
	
			this.Calendar = new Calendar();
			this.Calendar.on("select",function(data){
				//点击日历，选中某一日期时
				//业务逻辑可写在这里
			});
	
			this.ProdSelectPop = new ProdSelectPop({model:this.model});
	
			this.submit = new Submit();
			//如果提交保存时验证表单内有错误
			this.submit.on("submit.error",function(data){
				var pckId = data.pckId;
				var error = data.error;
				that.switchItem(pckId,function(){
					alert(error);
				});
			});
	
			//切换特权产品
			this.ProdSelectPop.on("switch.prod",function(data){
				var tid = data.tid;
				var ticketid = data.ticketid;
				var aid = data.aid;
				var prodName = data.prodName;
				var ticName = data.ticName;
				var tarItem = data.triggerItem;
				if($("#privItem_"+tid+"_"+ticketid+"_"+aid).length) return alert("该产品已存在，无法更换");
				var html = that.renderPckRightList(tid,[{
					tid : ticketid,
					aid : aid,
					ltitle : prodName,
					title : ticName,
					use_limit : "-1"
				}]);
				tarItem.after(html);
				tarItem.remove();
			});
			//新增一个特权产品
			this.ProdSelectPop.on("add.prod",function(data){
				var tid = data.tid;
				var prodName = data.prodName;
				var ticketid = data.ticketid;
				var ticName = data.ticName;
				var aid = data.aid;
				if($("#privItem_"+tid+"_"+ticketid+"_"+aid).length) return alert("该产品已存在，请勿重复添加");
				var html = that.renderPckRightList(tid,[{
					tid : ticketid,
					title : ticName,
					ltitle : prodName,
					aid : aid,
					use_limit : "-1"
				}]);
				$("#pckRightListUl_"+tid).append(html);
			})
	
		},
		//获取套餐列表，初始化slide item
		initList : function(initData){
			var that = this;
			var template = this.template;
			var html = "";
			var data = initData.data.attribute;
			var items = initData.data.otherTicket;
			for(var i in items){
				var d = null;
				var tid = items[i]["tid"];
				if(tid==that.model.getTid()){
					d = data;
					var priv = d.priv;
					d["priv"] = that.renderPckRightList(tid,priv);
					html += template({data:d});
				}else{
					html += '<li id="slideItem_'+tid+'" class="slideItem">';
					html += Loading("努力加载中..",{
						height : 1040,
						width : 798,
						id : "switchItemLoading_"+tid,
						css : {
							position : "absolute",
							top : 0,
							right : 0,
							left : 0,
							bottom : 0,
							background : "#fff"
						}
					})
					html += '</li>';
				}
			}
			this.$el.html(html).css({position:"relative"});
			this.refreshSlide();
		},
		onDatePickerInpFocus : function(e){
			var calendar = this.Calendar;
			var tarInp = $(e.currentTarget);
			var date = tarInp.val();
			var siblingInp = tarInp.siblings(".datePickerInp");
			var siblingDate = siblingInp.val();
			var opt = {
				picker : tarInp,
				top : 1
			};
			if(tarInp.hasClass("begin") && siblingDate){
				opt["max"] = siblingDate;
			}else if(tarInp.hasClass("end")){
				opt["min"] = siblingDate;
			}
			calendar.show(date,opt);
		},
		//套餐特权-点击选择产品
		onSelectProdBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			var parent = tarBtn.parents(".pckRightItem");
			var tid = tarBtn.attr("data-tid");
			this.ProdSelectPop.open({tid:tid,triggerItem:parent,type:"switch"});
		},
		//套餐特权-点击删除产品
		onDelectProdBtnClick : function(e){
			if(!confirm("确定删除此特权产品吗？")) return false;
			var tarBtn = $(e.currentTarget);
			var tid = tarBtn.attr("data-id");
			tarBtn.parents(".pckRightItem").remove();
			if(!tid || tid<0) return false;
		},
		//套餐特权-点击新增一个产品-打开产品选择弹窗
		onAddPckRightBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			var pckId = tarBtn.attr("data-pckid");
			this.ProdSelectPop.open({
				tid : pckId,
				type : "add"
			});
		},
		//点击保存
		onSubmitBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			var pckId = tarBtn.attr("data-tid");
			if(tarBtn.hasClass("disable")) return false;
			var data = this.submit.serialize(pckId);
			if(data==null) return false;
			this.submitForm(data,tarBtn);
		},
		//提交保存数据
		submitForm : function(data,tarBtn){
			PFT.Util.Ajax(Api.Url.PackageInfo.updateTicket,{
				type : "post",
				params : data,
				loading : function(){ tarBtn.addClass("disable").text("请稍后...")},
				complete : function(){ tarBtn.removeClass("disable").text("保存")},
				success : function(res){
					res = res || {};
					var d = res.data || [];
					var data = d[0] || {};
					var code = data.code;
					var dd = data.data || {};
					var msg = dd.msg || PFT.AJAX_ERROR_TEXT;
					var tid = dd.tid;
					if(code==200){
						PFT.Util.STip("success",'<div style="width:200px">保存成功</div>');
						var tarNavItem = $("#pckTitListUl").children(".pckTitListUlItem").filter(".edit");
						var id = tarNavItem.attr("id").split("_");
						var urlParams = PFT.Util.UrlParse();
						tid && tarNavItem.attr("id",id[0]+"_"+tid);
						if(!urlParams.prod_id && tid){
							var _href = location.origin+location.pathname+"?sid="+urlParams.sid+"&prod_id="+tid;
							location.href = _href;
						}
					}else{
						alert(msg);
					}
				}
			})
		},
		//新增一个套餐详情
		createItem : function(id){
			var html = this.template({data:{tid:id}});
			this.$el.append(html);
			this.refreshSlide();
		},
		//删除一个套餐详情
		removeItem : function(tid){
			if(!tid) return false;
			$("#slideItem_"+tid).remove();
			this.refreshSlide();
			if(tid<0) return false;
			PFT.Util.Ajax(Api.Url.PackageInfo.deleteTicket,{
				type : "post",
				params : {
					tid : tid,
					status : 6
				},
				loading : function(){},
				complete : function(){},
				success : function(res){
					res = res || {};
					if(res.code==200){
						PFT.Util.STip("success",'<div style="width:200px">删除成功</div>');
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		//切换到指定某个套餐
		switchItem : function(id,callback){
			var that = this;
			var tarItem = $("#slideItem_"+id);
			var width = this.itemWidth;
			var Cache = this.model.__Cache[id];
			if(!Cache && id>=0){
				that.model.fetchTicketInfo({
					tid : id,
					loading : function(){},
					complete : function(){ $("#switchItemLoading_"+id).remove()},
					success : function(res){
						var d = res.data.attribute;
						var priv = d.priv;
						d["priv"] = that.renderPckRightList(id,priv);
						var html = that.template({data:d});
						$("#slideItem_"+id).html(html);
					}
				})
			}
			this.$el.animate({left : -1 * tarItem.index() * width},300,function(){
				callback && callback();
			})
		},
		refreshSlide : function(callback){
			var items = this.$el.children();
			var width = this.itemWidth;
			var count = items.length;
			this.$el.width(width*count);
			callback && callback(items,width,count);
		},
		/**
		 * 渲染某个套餐的特权模块
		 * @param rights []
		 */
		renderPckRightList : function(tid,rights){
			return this.rightsTemplate({tid:tid,privilege:rights});
		},
		//获取套权商品列表里最大的index值
		getPckRightListIndexMax : function(pckId){
			var max = 0;
			$("#pckRightListUl_"+pckId).children().each(function(){
				var index = $(this).attr("data-index") * 1;
				if(index>max) max=index;
			})
			return max;
		}
	});
	module.exports = InfoManager;


/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/6/6 14:21 -->\r\n<!-- Description: huangzhiyang -->\r\n<%\r\n    var pckId=data.tid;\r\n    var price_section = data.price_section || [];\r\n    if(price_section.length<1) price_section = [{}];\r\n    var sdate = price_section.sdate || \"\";\r\n    var edate = price_section.edate || \"\";\r\n    var delaytype = typeof data.delaytype!=\"undefined\" ? data.delaytype : 1;\r\n    var search_limit = data.search_limit || \"1\";\r\n    var search_limit_type_1 = search_limit.indexOf(\"1\")>-1 ? \"checked\" : \"\";\r\n    var search_limit_type_2 = search_limit.indexOf(\"2\")>-1 ? \"checked\" : \"\";\r\n    var search_limit_type_4 = search_limit.indexOf(\"4\")>-1 ? \"checked\" : \"\";\r\n    var nts_sup = typeof data.nts_sup!=\"undefined\" ? data.nts_sup : \"1\";\r\n    var nts_tour = typeof data.nts_tour!=\"undefined\" ? data.nts_tour : \"1\";\r\n%>\r\n<li id=\"slideItem_<%=pckId%>\" class=\"slideItem\">\r\n    <% _.each(price_section,function(priceObj,index){ %>\r\n    <div data-pricesectionid=\"<%=priceObj.id%>\" class=\"line priceSectionLine\">\r\n        <div class=\"time\">\r\n            <p class=\"font-gray\">预定时间段</p>\r\n            <input readonly type=\"text\" value=\"<%=priceObj.sdate%>\" name=\"sdate\" class=\"laydate-icon datePickerInp begin\"/> -\r\n            <input readonly type=\"text\" value=\"<%=priceObj.edate%>\" name=\"edate\" class=\"laydate-icon datePickerInp end\"/>\r\n        </div>\r\n        <div class=\"time\">\r\n            <p class=\"font-gray\">供货价</p><input value=\"<%=priceObj.js ? priceObj.js/100 : ''%>\" type=\"text\" name=\"js\" class=\"midInp\"/>\r\n        </div>\r\n        <div class=\"time\">\r\n            <p class=\"font-gray\">零售价</p><input value=\"<%=priceObj.ls ? priceObj.ls/100 : ''%>\" type=\"text\" name=\"ls\" class=\"midInp\"/>\r\n        </div>\r\n        <div class=\"time\">\r\n            <p class=\"font-gray\">门市价</p><input value=\"<%=data.tprice ? data.tprice : ''%>\" type=\"text\" name=\"tprice\" class=\"midInp\"/>\r\n        </div>\r\n    </div>\r\n    <% }) %>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            <label>产品说明：</label>\r\n        </div>\r\n        <div class=\"rt\">\r\n            <input type=\"text\" class=\"bigInp\" name=\"notes\" value=\"<%=data.notes%>\" placeholder=\"请填写简要说明\"/>\r\n        </div>\r\n    </div>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            <label>使用有效期：</label>\r\n        </div>\r\n        <div class=\"rt\">\r\n            <div class=\"cardImg\">\r\n                <div class=\"cardRadio\">\r\n                    <input type=\"radio\" name=\"delaytype_<%=pckId%>\" value=\"1\" id=\"delaytype_1_<%=pckId%>\" <%=delaytype==1 ? \"checked\" : \"\"%>/>\r\n                    <label for=\"delaytype_1_<%=pckId%>\">\r\n                        卡片售出后 <input type=\"text\" name=\"delaydays\" value=\"<%=data.delaytype==1 ? data.delaydays : \"\"%>\" class=\"smaInp delaydayInp\" style=\"text-indent:0; text-align:center\"/> 天有效\r\n                    </label>\r\n                </div>\r\n                <div class=\"cardRadio\">\r\n                    <input type=\"radio\" id=\"delaytype_0_<%=pckId%>\" value=\"0\" name=\"delaytype_<%=pckId%>\" <%=delaytype==0 ? \"checked\" : \"\"%>/>\r\n                    <label for=\"delaytype_0_<%=pckId%>\">\r\n                        卡片激活后 <input type=\"text\" name=\"delaydays\" value=\"<%=data.delaytype==0 ? data.delaydays : \"\"%>\" class=\"smaInp delaydayInp\" style=\"text-indent:0; text-align:center\"/> 天有效\r\n                    </label>\r\n                </div>\r\n                <div class=\"cardRadio\">\r\n                    <input type=\"radio\" id=\"delaytype_2_<%=pckId%>\" value=\"2\" name=\"delaytype_<%=pckId%>\" <%=delaytype==2 ? \"checked\" : \"\"%>/>\r\n                    <label for=\"delaytype_2_<%=pckId%>\">\r\n                        <input type=\"text\" readonly name=\"order_start\" value=\"<%=data.order_start%>\" class=\"laydate-icon datePickerInp begin\"/> -\r\n                        <input type=\"text\" readonly name=\"order_end\" value=\"<%=data.order_end%>\" class=\"laydate-icon datePickerInp end\"/> 有效\r\n                    </label>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            <label>激活限制：</label>\r\n        </div>\r\n        <div class=\"rt\">\r\n            <div class=\"cardImg\">\r\n                <div class=\"cardRadio\">\r\n                    会员卡售出 <input type=\"text\" name=\"auto_active_days\" value=\"<%=data.auto_active_days || 10%>\" class=\"smaInp\" style=\"text-align:center; text-indent:0\"/> 天后自动激活（仍需提供手机号后使用卡片）</div>\r\n                <div>\r\n                    <input type=\"checkbox\" name=\"cert_limit\" id=\"cert_limit_<%=pckId%>\" <%=data.cert_limit==0 ? \"\" : \"checked\"%>/>\r\n                    <label for=\"cert_limit_<%=pckId%>\">需填写身份证号</label>\r\n                </div>\r\n                <div style=\"display:none\">\r\n                    <input type=\"radio\" id=\"IDnum1\" name=\"active\"/><label for=\"IDnum1\"> 所有可用</label>\r\n                    <input type=\"radio\" id=\"IDnum2\" name=\"active\"/>\r\n                    <label for=\"IDnum2\">\r\n                        身份证号前5位，仅限 <input type=\"text\"class=\"smaInp\"/>\r\n                    </label>\r\n                    <a href=\"javascript:;\" class=\"btn-add\">＋</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            <label>退单限制：</label>\r\n        </div>\r\n        <div class=\"rt\">\r\n            <p style=\"line-height:35px;\">不可退</p>\r\n        </div>\r\n    </div>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            <label>使用说明：</label>\r\n        </div>\r\n        <div class=\"rt\">\r\n            <textarea name=\"getaddr\" placeholder=\"请填写使用说明\" id=\"getaddrTextArea_<%=pckId%>\" rows=\"3\" style=\"width:420px;\"><%=data.getaddr%></textarea>\r\n        </div>\r\n    </div>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            <label>信息通知配置：</label>\r\n        </div>\r\n        <div class=\"rt phone\">\r\n            <div>供应商手机号 <input type=\"text\" placeholder=\"请填写供应商手机号\" name=\"fax\" value=\"<%=data.fax%>\" class=\"laydate-icon\"></div>\r\n            <div><input type=\"checkbox\" name=\"nts_sup\" id=\"nts_sup_checkbox_<%=pckId%>\" <%=nts_sup==1?\"checked\":\"\"%> /><label for=\"nts_sup_checkbox_<%=pckId%>\"> 短信通知供应商</label></div>\r\n            <div><input type=\"checkbox\" name=\"nts_tour\" id=\"nts_tour_checkbox_<%=pckId%>\"  <%=nts_tour==1?\"checked\":\"\"%> /><label for=\"nts_tour_checkbox_<%=pckId%>\"> 短信通知联系人</label></div>\r\n            <div><input type=\"checkbox\" name=\"confirm_wx\" id=\"confirm_wx_checkbox_<%=pckId%>\" <%=data.confirm_wx==1?\"checked\":\"\"%> /><label for=\"confirm_wx_checkbox_<%=pckId%>\"> 会员消费信息通知到微信</label></div>\r\n        </div>\r\n    </div>\r\n    <div id=\"pckRightContainer_<%=pckId%>\" class=\"pckRightContainer\">\r\n        <div class=\"power border-y\">\r\n            <p class=\"tao\">套餐特权<span class=\"font-gray tip\">（设置套餐包含的免费使用景点产品票类，不支持现场支付票类）</span>\r\n                <a data-pckid=\"<%=pckId%>\" id=\"addPckRightBtn_<%=pckId%>\" class=\"btn-add addPckRightBtn\" href=\"javascript:void(0);\" >＋</a>\r\n            </p>\r\n        </div>\r\n        <ul id=\"pckRightListUl_<%=pckId%>\" class=\"pckRightListUl\"><%=data.priv%></ul>\r\n    </div>\r\n    <div class=\"line\">\r\n        <div class=\"lt\">\r\n            是否发布：\r\n        </div>\r\n        <div class=\"rt\">\r\n            <% if(data.apply_limit!=1 && data.apply_limit!=2) data.apply_limit=1;%>\r\n            <label for=\"apply_limit_1_<%=pckId%>\" style=\"margin-right:20px\"><input type=\"radio\" class=\"apply_limit_input\" name=\"apply_limit_<%=pckId%>\" value=\"1\" id=\"apply_limit_1_<%=pckId%>\" <%=data.apply_limit==1?\"checked\":\"\"%> /> 发布</label>\r\n            <label for=\"apply_limit_2_<%=pckId%>\" class=\"line-35\"><input type=\"radio\" class=\"apply_limit_input\" name=\"apply_limit_<%=pckId%>\" value=\"2\" id=\"apply_limit_2_<%=pckId%>\" <%=data.apply_limit==2?\"checked\":\"\"%> /> 放入仓库</label>\r\n        </div>\r\n    </div>\r\n    <div style=\"margin-top:50px; margin-bottom:70px\" class=\"line\">\r\n        <div class=\"lt\"></div>\r\n        <div class=\"rt\"><a id=\"submitBtn_<%=pckId%>\" data-tid=\"<%=pckId%>\" href=\"javascript:void(0);\" class=\"btn btn-3x btn-blue submitBtn\">保存</a></div>\r\n    </div>\r\n</li>\r\n";

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = "<% _.each(privilege,function(item,index,privilege){ %>\r\n    <%\r\n        var ticketid = item.tid;\r\n        var aid = item.aid;\r\n        var id = tid+\"_\"+ticketid+\"_\"+aid;\r\n        var attrFlag = 'data-tid=\"'+tid+'\" data-ticketid=\"'+ticketid+'\" data-aid=\"'+aid+'\"';\r\n        var prodName = item.ltitle;\r\n        var ticName = item.title;\r\n        var uselimit = typeof item.use_limit!=\"undefined\" ? item.use_limit : \"-1\";\r\n        var uselimitArr = [\"\",\"\",\"\"];\r\n        if(uselimit!=-1 && (typeof uselimit!==\"undefined\")){\r\n            uselimitArr = uselimit.split(\",\");\r\n            if(uselimitArr[0]==-1) uselimitArr[0] = \"\";\r\n            if(uselimitArr[1]==-1) uselimitArr[1] = \"\";\r\n            if(uselimitArr[2]==-1) uselimitArr[2] = \"\";\r\n        }\r\n    %>\r\n<li <%=attrFlag%> id=\"privItem_<%=id%>\" class=\"product border-bottom pckRightItem\">\r\n    <div class=\"float-left\">\r\n        <div class=\"line\">\r\n            <div class=\"lt\">\r\n                <label>产品：</label>\r\n            </div>\r\n            <div class=\"rt\">\r\n                <span class=\"name\"><%=prodName%>-<%=ticName%></span>\r\n                <a href=\"javascript:void(0);\" <%=attrFlag%> class=\"btn btn-s btn-border btn-sel selectProd_picker\">选择</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"line\">\r\n            <div class=\"lt\">\r\n                <label>使用规则：</label>\r\n            </div>\r\n            <div class=\"rt\">\r\n                <div class=\"nolimit\">\r\n                    <input type=\"radio\" value=\"-1\" id=\"uselimit_no_<%=id%>\" name=\"uselimit_<%=id%>\" <%=uselimit==-1?\"checked\":\"\"%> />\r\n                    <label for=\"uselimit_no_<%=id%>\">不限</label>\r\n                </div>\r\n                <div class=\"limit\">\r\n                    <input type=\"radio\" value=\"1\" id=\"uselimited_<%=id%>\" name=\"uselimit_<%=id%>\" <%=uselimit!=-1?\"checked\":\"\"%> />\r\n                    <label for=\"uselimited_<%=id%>\">\r\n                        共 <input type=\"text\" name=\"limit_count\" value=\"<%=uselimitArr[2]%>\" class=\"smaInp limitCountInp limitCountInp_total total\"> 次\r\n                        <input type=\"text\" name=\"limit_count\" value=\"<%=uselimitArr[0]%>\" class=\"smaInp limitCountInp limitCountInp_daily daily\"> 次/日\r\n                        <input type=\"text\" name=\"limit_count\" value=\"<%=uselimitArr[1]%>\" class=\"smaInp limitCountInp limitCountInp_month month\"> 次/月\r\n                    </label>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"float-right border-left\"><a href=\"javascript:void(0);\" class=\"btn-del deleteProdBtn\">×</a></div>\r\n</li>\r\n<% }) %>";

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/6 18:34
	 * Description: ""
	 */
	__webpack_require__(67);
	var CalendarCore = __webpack_require__(69);
	var fn = new Function();
	var Calendar = function(opt){
		this.selected = {};
		this.curYearmonth = "";
		this.__callback = {};
		this.init(opt);
	};
	Calendar.prototype = {
		init : function(opt){
			var that = this;
			var opt = opt || {};
			//显示的容器
			this.container = opt.container || $('<div id="calendar-pop-container" class="calendar-pop-contaienr"></div>').appendTo($("body"));
			this.containerID = this.container.attr("id");
			this.selected[this.containerID] = [];
			//是否支持多选日期 默认不支持
			this.mult = typeof opt.mult=="boolean" ? opt.mult : false;
			//模板
			this.tpl = opt.tpl || __webpack_require__(70);
	
			this.template = _.template(this.tpl);
	
			this.maskID = this.containerID+"-mask";
	
			this.mask = $("#"+this.maskID);
			if(!this.mask.length){
				this.mask = $('<div id="'+this.maskID+'" class="calendar-mask"></div>');
				this.mask.appendTo($("body"));
			}
	
			this.bindEvents();
		},
		bindEvents : function(){
			var that = this;
			this.container.on("click",".calendar-td",function(e){
				that.onTdClick(that,e);
				return false;
			})
			this.container.on("click",".monthNavBtn",function(e){
				that.onMonthBtnClick(that,e);
				return false;
			})
			this.mask.on("click",function(e){
				that.close();
			})
		},
		showDate : function(yearmonth,opt){
			var that = this;
			var opt = opt || {};
			var containerID = this.containerID;
			var yearmonth = yearmonth || this.getYearMonth();
			var new_yearmonth = yearmonth.substring(0,7);
			var container = this.container;
			var onBefore = opt.onBefore || fn;
			var onAfter = opt.onAfter || fn;
			that.fire("showDate.before",yearmonth);
			onBefore();
			var html = this.render(new_yearmonth,opt);
			container.html(html);
			that.fire("showDate.after",yearmonth);
			onAfter();
			this.setCurYearmonth(new_yearmonth);
			setTimeout(function(){
				$("#"+containerID+"-calendar-td-"+yearmonth).addClass("selected");
			},10)
		},
		//点击选中某天
		onTdClick : function(that,e){
			var mult = that.mult;
			var tarTd = $(e.currentTarget);
			if(tarTd.hasClass("empty") || tarTd.hasClass("disable")) return false;
			var day = tarTd.attr("data-day");
			var date = tarTd.attr("data-date");
			var week = tarTd.attr("data-week");
			var yearmonth = tarTd.attr("data-yearmonth");
			tarTd.toggleClass("selected");
			var type = tarTd.hasClass("selected") ? "select" : "cancel";
			if(!mult){
				that.container.find(".calendar-td").removeClass("selected"); //单选模式下先清空所有日期的选中状态
				if(type=="select") tarTd.addClass("selected");
			}
			var params = {
				tarDom : tarTd,
				type : type,
				date : date,
				week : week,
				day : day,
				yearmonth : yearmonth
			}
			var selected = that.selected[that.containerID];
			if(type=="select"){ //选中
				if(!mult){ //如果只能单先，需先把上次选中的清理掉
					selected.splice(0,1);
				}
				selected.push(params);
			}else{ //取消选中
				for(var i in selected){
					var select = selected[i];
					var d = select.tarDom.attr("data-date");
					if(date==d){
						selected.splice(i,1);
						break;
					}
				}
			}
			that.setCurYearmonth(yearmonth+"-"+day);
			var picker = that.__onShowOptions.picker;
			if(picker){
				picker.val(params.date);
				that.close()
			}
			that.fire("click",params);
			that.fire("select",params);
		},
		onMonthBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			var curYearMonth = that.getCurYearmonth();
			var toYearMonth = tarBtn.hasClass("next") ? CalendarCore.nextMonth(curYearMonth) : CalendarCore.prevMonth(curYearMonth);
			that.showDate(toYearMonth,that.__onShowOptions);
		},
		getYearMonth : function(date){
			var date = date ||  CalendarCore.gettoday();
			var yearmonth = date.length==10 ? date.substring(0,7) : date;
			return yearmonth;
		},
		render : function(yearmonth,opt){
			if(!yearmonth) return "";
			var containerID = this.containerID;
			var date = CalendarCore.outputDate(yearmonth);
			var min = opt.min; //最小日期
			var max = opt.max;
			var html = this.template({data:{
				containerID : containerID,
				yearmonth : yearmonth,
				dates : date,
				min : min,
				max : max
			}});
			return html;
		},
		//获取当前日历上显示的年月份
		getCurYearmonth : function(){
			return this.curYearmonth;
		},
		setCurYearmonth : function(yearmonth){
			this.curYearmonth = yearmonth;
			$("#"+this.containerID+"-top-calendar-date").text(this.curYearmonth);
		},
		position : function(data){
			var top = data.top;
			var left = data.left;
			this.container.css({
				top : top,
				left : left
			})
		},
		show : function(date,opt){
			opt = opt || {};
			var picker = opt.picker;
			var left = opt.left || 0;
			var top = opt.top || 0;
			this.__onShowOptions = opt;
			if(picker){
				var offset = picker.offset();
				var height = picker.outerHeight(true);
				this.position({
					left : offset.left+left,
					top : offset.top+height+top
				});
			}
			this.container.show();
			this.showDate(date,opt);
			this.mask.show();
		},
		close : function(){
			this.container.hide();
			this.mask.hide();
			this.__onShowOptions = {};
		},
		on : function(type,callback){
			if(typeof type!=="string") return false;
			var __callback = this.__callback;
			var cak = __callback[type] || (this.__callback[type]=[]);
			if(typeof callback==="function"){
				cak.push(callback);
			}
		},
		fire : function(type){
			var that = this;
			if(typeof type!=="string") return false;
			var arr = this.__callback[type];
			if(!arr) return false;
			var args = Array.prototype.slice.call(arguments,1);
			for(var i in arr){
				var callback = arr[i];
				callback.apply(that,args);
			}
		},
		trigger : function(type){
			this.fire(type);
		}
	};
	module.exports = Calendar;

/***/ },
/* 67 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 68 */,
/* 69 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-6-29.
	 */
	var CalendarCore={
		strpad:function(str){
			str=String(str);
			if(str.length==1){
				return "0"+str;
			}else{
				return str;
			}
		},
		/**
		 * 输出日期
		 * @param yearmonth
		 * @param type
		 *   todayValid : 今天可用
		 *   todayUnvalid : 今天不可用
		 *   allValid : 所有日期可用
		 *
		 * @returns {string}
		 */
		outputHtml:function(yearmonth,type){
			var that = this;
			var type = type || "todayValid";
			if(!yearmonth) yearmonth = this.gettoday();
			yearmonth = yearmonth.length==10 ? yearmonth.substring(0,7) : yearmonth;
			var nowtime=new Date();
			nowtime.setHours(0,0,0,0);
			nowtime=nowtime.getTime();//凌晨时间
			var begintime=yearmonth+"-01";
			begintime=begintime.split("-");
			begintime=begintime.join("/");
			var beginDate=new Date(begintime);
			var year=beginDate.getFullYear();
			var month=beginDate.getMonth()+1;
			var lastmonth=(month-1==0)?12:month-1;
			var nextmonth=(month+1==13)?1:month+1;
			var days=(new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate();
			var monthdays=days;
			var emptydays=beginDate.getDay();
			var endtime=yearmonth+"-"+days;
			endtime=endtime.split("-");
			endtime=endtime.join("/");
			var endDate=new Date(endtime);
			days+=beginDate.getDay()+(7-endDate.getDay());
			beginDate.setTime(beginDate.getTime()-(24*3600000*beginDate.getDay()));
			var nextday = new Date(this.gettoday()).getTime().toString();
			var lastmonth_none="lastmonth_none";
			var nextmonth_none="nextmonth_none";
			var html='<div class="calendar" id="calendarContent"><div class="monthbox">'+
				'<div id="calendarHead" class="title calendarHead" data-date="'+year+"-"+month+'"><span class="lastmonth '+lastmonth_none+'"><a title="'+lastmonth+'月">&nbsp;</a></span><span class="nextmonth '+nextmonth_none+'"><a title="'+nextmonth+'月">&nbsp;</a></span><span class="year">'+year+'年'+month+'月</span><span class="close"></span></div>'+
				'<table>'+
				'<tr>'+
				'<th class="weeken">日</th>'+
				'<th>一</th>'+
				'<th>二</th>'+
				'<th>三</th>'+
				'<th>四</th>'+
				'<th>五</th>'+
				'<th class="weeken">六</th>'+
				'</tr>';
			for(var i=0,j=0;i<days-1;i++){
				if(i%7==0){
					html+='<tr>';
				}
				var date=beginDate.getFullYear()+"-"+this.strpad((beginDate.getMonth()+1))+"-"+this.strpad(beginDate.getDate());
				var price="";
				var priceT="";
				var valid="";
				var validT="";
				var remain;
				var beginDate_time = beginDate.getTime();
				var beginDate_day = that.strpad(beginDate.getDate());
				if(i<emptydays||i>=monthdays+emptydays){
					html+='<td><div class="detail"></div></td>';
				}else if(type=="allValid"){ //所有可用
					html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
				}else if(beginDate.getTime()<nowtime || (type=="todayUnvalid" && beginDate.getTime()<nextday)){
					html+='<td><div class="detail"><span class="dateNum">'+beginDate_day+'</span></div></td>';
				}else{
					html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
				}
	//			if(i<emptydays||i>=monthdays+emptydays){
	//				html+='<td><div class="detail"></div></td>';
	//			}else if(beginDate.getTime()<nowtime || (type=="todayUnvalid" && beginDate.getTime()<nextday)){
	//				html+='<td><div class="detail"><span class="dateNum">'+beginDate_day+'</span></div></td>';
	//			}else{
	//				html+='<td><div class="detail valid" date="'+date+'"><span class="dateNum">'+beginDate_day+'</span></div></td>';
	//			}
				if(i%7==6){
					html+='</tr>';
				}
				beginDate.setTime(beginDate.getTime()+24*3600000);
			}
			html+="</table></div>";
			return html;
		},
		outputDate : function(yearmonth){
			var that = this;
			if(!yearmonth) yearmonth = this.gettoday();
			yearmonth = yearmonth.length==10 ? yearmonth.substring(0,7) : yearmonth;
			var nowtime=new Date();
			nowtime.setHours(0,0,0,0);
			nowtime=nowtime.getTime();//凌晨时间
			var begintime=yearmonth+"-01";
			begintime=begintime.split("-");
			begintime=begintime.join("/");
			var beginDate=new Date(begintime);
			var month=beginDate.getMonth()+1;
			var days=(new Date(beginDate.getFullYear(),beginDate.getMonth()+1,0)).getDate();
			var monthdays=days;
			var emptydays=beginDate.getDay();
			var endtime=yearmonth+"-"+days;
			endtime=endtime.split("-");
			endtime=endtime.join("/");
			var endDate=new Date(endtime);
			days+=beginDate.getDay()+(7-endDate.getDay());
			beginDate.setTime(beginDate.getTime()-(24*3600000*beginDate.getDay()));
			var resultArr = [];
			var dateArr = [];
			for(var i=0;i<days-1;i++){
				var json = {};
				var date=beginDate.getFullYear()+"-"+this.strpad((beginDate.getMonth()+1))+"-"+this.strpad(beginDate.getDate());
				var beginDate_day = that.strpad(beginDate.getDate());
				json["weeken"] = (i%7);
				if(i<emptydays){
					json["day"] = "";
					json["month"] = month-1;
				}else if(i>=monthdays+emptydays){
					json["day"] = "";
					json["month"] = month+1;
				}else if(beginDate.getTime()<nowtime){
					json["day"] = beginDate_day;
					json["date"] = date;
					json["today"] = "before";
					json["month"] = "current";
					json["yearmonth"] = yearmonth;
				}else if(beginDate.getTime()==nowtime){
					json["day"] = beginDate_day;
					json["date"] = date;
					json["today"] = "today";
					json["month"] = "current";
					json["yearmonth"] = yearmonth;
				}else{
					json["day"] = beginDate_day;
					json["date"] = date;
					json["today"] = "after";
					json["month"] = "current";
					json["yearmonth"] = yearmonth;
				}
				dateArr.push(json);
				if(dateArr.length==7){
					resultArr.push(dateArr);
					dateArr=[];
				}
				beginDate.setTime(beginDate.getTime()+24*3600000);
			}
			return resultArr;
		},
		getnowdate : function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			m = this.strpad(m);
			var d = date.getDate();
			d = this.strpad(d);
			return y+"-"+m+"-"+d;
		},
		nextday : function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			var a = new Date(y,m,0);
			var maxDay = a.getDate();
			var nextday = d+1;
			if(nextday>maxDay){
				nextday = "01";
				m++;
				if(m>12){
					m = "01";
					y++;
				}
			}
			nextday = this.strpad(nextday);
			m = this.strpad(m);
			return y+"-"+m+"-"+nextday;
		},
		nextMonth : function(yearmonth){
			return this._siblingMonth(yearmonth,"next");
		},
		prevMonth : function(yearmonth){
			return this._siblingMonth(yearmonth,"prev");
		},
		_siblingMonth : function(yearmonth,nextOrPrev){ //2015-06
			yearmonth = yearmonth || "";
			if(yearmonth.length==7){
				yearmonth = yearmonth;
			}else if(yearmonth.length==10){
				yearmonth = yearmonth.substring(0,7);
			}else{
				yearmonth = this.gettoday().substring(0,7);
			}
			if(!nextOrPrev) nextOrPrev = "next";
			var time=yearmonth+"-01";
			time=time.split("-");
			time=time.join("/");
			time=new Date(time);
			var lasttime=new Date(time.getFullYear(),time.getMonth()-1,1);
			var lastmonth=lasttime.getFullYear()+"-"+this.strpad(lasttime.getMonth()+1);
			var nexttime=new Date(time.getFullYear(),time.getMonth()+1,1);
			var nextmonth=nexttime.getFullYear()+"-"+this.strpad(nexttime.getMonth()+1);
			return nextOrPrev=="next" ? nextmonth : lastmonth;
		},
		gettoday : function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			m = this.strpad(m);
			var d = date.getDate();
			d = this.strpad(d);
			return y+"-"+m+"-"+d;
		},
		getCurYearmonth : function(){
			return $("#calendarHead").attr("data-date")
		}
	};
	module.exports = CalendarCore;

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = "<%\r\n    var yearmonth=data.yearmonth,dates=data.dates;\r\n    var min = data.min ? new Date(data.min).getTime() : \"\";\r\n    var max = data.max ? new Date(data.max).getTime() : \"\";\r\n    var containerID = data.containerID;\r\n    var ym = yearmonth.split(\"-\");\r\n    var year = ym[0];\r\n    var month = ym[1];\r\n%>\r\n<div id=\"<%=containerID%>-topCalendar\" class=\"calendarHead\">\r\n    <div class=\"con\"><span id=\"<%=containerID%>-top-calendar-date\" class=\"top-calendar-date\"></span></div>\r\n    <a id=\"<%=containerID%>-monthNavBtnNext\" class=\"monthNavBtn next\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe60d;</i></a>\r\n    <a id=\"<%=containerID%>-monthNavBtnPrev\" class=\"monthNavBtn prev\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe60c;</i></a>\r\n</div>\r\n<div id=\"<%=containerID%>-calendar-panel-<%=yearmonth%>\" class=\"calendar-panel\">\r\n    <table id=\"calendar-table-<%=yearmonth%>\"  class=\"calendar-table\">\r\n        <thead id=\"<%=containerID%>-calendar-thead-<%=yearmonth%>\" class=\"calendar-thead\">\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"0\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-0\">日</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"1\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-1\">一</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"2\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-2\">二</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"3\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-3\">三</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"4\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-4\">四</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"5\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-5\">五</label>\r\n        </th>\r\n        <th data-yearmonth=\"<%=yearmonth%>\" data-week=\"6\">\r\n            <label for=\"calendar-weeken-checkbox-<%=yearmonth%>-6\">六</label>\r\n        </th>\r\n        </thead>\r\n        <tbody id=\"<%=containerID%>-calendar-tbody-<%=yearmonth%>\" class=\"calendar-tbody\">\r\n            <%_.each(dates,function(tr){%>\r\n                <tr>\r\n                    <%_.each(tr,function(td){%>\r\n                        <%\r\n                            var date = td.date;\r\n                            var day = td.day;\r\n                            var weeken = td.weeken;\r\n                            var yearmonth = td.yearmonth;\r\n                            var now_date_str = date ? new Date(date).getTime() : \"\";\r\n                            var minCls = \"\";\r\n                            var maxCls = \"\";\r\n                            if(min && now_date_str && now_date_str<=min) minCls=\"disable\";\r\n                            if(max && now_date_str && now_date_str>=max) maxCls=\"disable\";\r\n                        %>\r\n                        <%if(day){%>\r\n                            <td class=\"calendar-td day <%=minCls%> <%=maxCls%>\" data-day=\"<%=day%>\" data-date=\"<%=date%>\" data-yearmonth=\"<%=yearmonth%>\" data-week=\"<%=weeken%>\" id=\"<%=containerID%>-calendar-td-<%=date%>\">\r\n                                <div class=\"tdCon\">\r\n                                    <span class=\"dayNum\"><%=day%></span>\r\n                                </div>\r\n                            </td>\r\n                        <%}else{%>\r\n                            <td class=\"calendar-td empty\"></td>\r\n                        <%}%>\r\n                    <% }) %>\r\n                </tr>\r\n             <% }) %>\r\n        </tbody>\r\n    </table>\r\n</div>\r\n";

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/7 15:40
	 * Description: ""
	 */
	__webpack_require__(72);
	var index_tpl = __webpack_require__(74);
	var ticket_item_tpl = __webpack_require__(75);
	var prod_item_tpl = __webpack_require__(76);
	var getWinWidthHeight = __webpack_require__(13);
	var ProdSelect = Backbone.View.extend({
		events : {
			"click .btn-group .pop-btn" : "onBtnClick",
			"click .clearSearchBtn" : "onClearBtnClick",
			"keyup .prodSelectSearchInp" : "onSearchInpChange",
			"focus .prodSelectSearchInp" : "onSearchInpFocus",
			"blur .prodSelectSearchInp" : "onSearchInpBlur",
			"click #prodListUl li" : "onProdItemClick"
		},
		el : $("#prodSelectPopContainer"),
		keyupTimer : null,
		prodCache : null,
		ticketCache : {},
		type : "",
		tid : "",
		ticketTemplate : _.template(ticket_item_tpl),
		prodTemplate : _.template(prod_item_tpl),
		initialize : function(){
			var that = this;
			this.mask = $("#prodSelectMask");
			this.$el.html(index_tpl);
			this.searchInp = $("#prodSelectSearchInp");
			this.prodListUl = $("#prodListUl");
			this.ticketListUl = $("#ticketListUl");
			this.clearBtn = this.$el.find(".clearSearchBtn");
	
			//请求产品列表
			this.model.on("fetchProdList.loading",function(){
				that.renderProductList("loading");
			});
			this.model.on("fetchProdList.success",function(res){
				var prodList = res.data;
				that.prodCache = prodList;
				that.renderProductList("success",prodList);
			});
			this.model.on("fetchProdList.fail",function(res){
				that.renderProductList("fail");
			});
	
			//请求某一产品下的票类列表
			this.model.on("fetchTicket.loading",function(){
				that.renderTicketList("loading");
			});
			this.model.on("fetchTicket.success",function(data){
				var prodId = data.prodId;
				var aid = data.aid;
				var res = data.data;
				var ticketData = res.data;
				if(prodId && aid && ticketData){
					that.ticketCache[prodId+"_"+aid] = ticketData;
					that.renderTicketList("success",ticketData);
				}else{
					that.renderTicketList("fail");
				}
			});
			this.model.on("fetchTicket.fail",function(res){
				that.renderTicketList("fail");
			});
	
		},
		onBtnClick : function(e){
			var that = this;
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("yes")){
				var prod = this.prodListUl.children(".active");
				var ticRadio = this.ticketListUl.find("input[type=radio][name=prodSelect_ticketRadio]:checked");
				var prodName = prod.find(".t").text();
				var ticId = ticRadio.attr("data-ticid");
				var ticName = ticRadio.parent().find(".t").text();
				var aid = prod.attr("data-applyid");
				if(this.type=="switch"){ //切换特权商品
					this.trigger("switch.prod",{
						tid : that.tid,
						ticketid : ticId,
						aid : aid,
						prodName : prodName,
						ticName : ticName,
						triggerItem : this.triggerItem
					},this)
				}else if(this.type=="add"){ //新增一个特权商品
					this.trigger("add.prod",{
						tid : that.tid,
						prodName : prodName,
						ticketid : ticId,
						ticName : ticName,
						aid : aid
					},this)
				}
			}
			this.close();
		},
		onSearchInpChange : function(e){
			var that = this;
			clearTimeout(this.keyupTimer);
			this.keyupTimer = setTimeout(function(){
				var tarInp = $(e.currentTarget);
				var val = $.trim(tarInp.val());
				if(val){
					that.clearBtn.show();
				}else{
					that.clearBtn.hide();
				}
				//filter
				that.renderProductList("success",that.filter(val));
			},200)
		},
		onSearchInpFocus : function(e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			if(val){
				this.clearBtn.show();
			}else{
				this.clearBtn.hide();
			}
		},
		onClearBtnClick : function(e){
			this.searchInp.val("").focus();
			$(e.currentTarget).hide();
			this.renderProductList("success",this.prodCache);
		},
		onSearchInpBlur : function(e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			if(val){
				this.clearBtn.show();
			}else{
				this.clearBtn.hide();
			}
		},
		//点击产品item，请求该产品对应的票类 (引入缓存)
		onProdItemClick : function(e){
			var tarItem = $(e.currentTarget);
			var prod_id = tarItem.attr("data-prodid");
			var aid = tarItem.attr("data-applyid");
			if(prod_id && aid){
				var cache = this.ticketCache[prod_id+"_"+aid];
				if(cache){ //如果已经请求过并缓存起来了
					this.renderTicketList("success",cache);
				}else{
					this.model.fetchTicket(prod_id,aid);
				}
				tarItem.addClass("active").siblings().removeClass("active");
			}else{
				this.renderTicketList("success",[])
			}
		},
		filter : function(keyword){
			keyword = $.trim(keyword);
			var prodCache = this.prodCache;
			if(!prodCache) return {};
			if(!keyword) return prodCache;
			var result = [];
			for(var i in prodCache){
				var prod = prodCache[i];
				var name = prod["title"];
				if(name.indexOf(keyword)>-1){
					result.push(prod);
				}
			}
			return result;
		},
		//渲染产品列表
		renderProductList : function(type,products){
			var html = "";
			if(type=="success"){
				html = this.prodTemplate({products:products});
				if(!html){ //如果为空
					html = '<li class="status empty">查无匹配产品...</li>';
				}
			}else if(type=="loading"){
				html = '<li class="status loading">努力加载中...</li>';
			}else if(type=="fail" || type=="serverError"){
				html = '<li class="status error">'+PFT.AJAX_ERROR_TEXT+'</li>';
			}else if(type=="timeout"){
				html = '<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
			}
			this.prodListUl.html(html);
			this.prodListUl.children().first().trigger("click");
		},
		//渲染票类列表
		renderTicketList : function(type,tickets){
			var html = "";
			if(type=="success"){
				html = this.ticketTemplate({tickets:tickets});
				if(!$.trim(html)){ //如果为空
					html = '<li class="status empty">查无匹配票类...</li>';
				}
			}else if(type=="loading"){
				html = '<li class="status loading">努力加载中...</li>';
			}else if(type=="fail" || type=="serverError"){
				html = '<li class="status error">'+PFT.AJAX_ERROR_TEXT+'</li>';
			}else if(type=="timeout"){
				html = '<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</li>';
			}
			this.ticketListUl.html(html);
		},
		open : function(data){
			var wh = getWinWidthHeight();
			var containerH = this.$el.height();
			var top = (wh.height-containerH) / 2;
			var offsetTop = top*0.3;
			this.$el.css({top:-this.$el.height()});
			this.type = data.type;
			this.tid = data.tid;
			this.triggerItem = data.triggerItem;
			this.mask.fadeIn();
			this.$el.show().animate({top:top-offsetTop},100);
			if(this.prodCache) return false;
			this.model.fetchProdList();
		},
		close : function(){
			var $el = this.$el;
			this.mask.fadeOut();
			$el.animate({top:-this.$el.height()-10},100,function(){
				$el.hide();
			});
		}
	});
	module.exports = ProdSelect;


/***/ },
/* 72 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 73 */,
/* 74 */
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/6/7 16:25 -->\r\n<!-- Description: huangzhiyang -->\r\n<div id=\"prodSelectPopBox\" class=\"proSel prodSelectPopBox\">\r\n    <div class=\"pBox left\">\r\n        <div class=\"searchBox\">\r\n            <input type=\"text\" name=\"\" class=\"prodSelectSearchInp\" id=\"prodSelectSearchInp\"/>\r\n            <i class=\"iconfont search\">&#xe633;</i>\r\n            <span href=\"javascript:void(0)\" class=\"clearSearchBtn\"><i class=\"iconfont\">&#xe674;</i></span>\r\n        </div>\r\n        <ul id=\"prodListUl\" class=\"prodListUl\"></ul>\r\n    </div>\r\n    <div class=\"pBox rig\">\r\n        <ul id=\"ticketListUl\" class=\"ticketListUl\"></ul>\r\n    </div>\r\n</div>\r\n<div class=\"btn-group\">\r\n    <a href=\"javascript:void(0);\" class=\"pop-btn yes\">确定</a>\r\n    <a href=\"javascript:void(0);\" class=\"pop-btn no\">取消</a>\r\n</div>\r\n";

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = "<% _.each(tickets,function(item,index){ %>\r\n<% var aid = item.apply_did; %>\r\n<li data-id=\"<%=item.id%>\" class=\"ticketItem\">\r\n    <% var checked = index==0 ? \"checked\" : \"\"; %>\r\n    <input data-ticid=\"<%=item.id%>\" class=\"prodSelect_ticketRadio\" type=\"radio\" name=\"prodSelect_ticketRadio\" id=\"ticketRadio_<%=item.id%>\"  <%=checked%> />\r\n    <label  for=\"ticketRadio_<%=item.id%>\" class=\"t\"><%=item.title%></label>\r\n</li>\r\n<% }) %>\r\n";

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<% _.each(products,function(item){ %>\r\n<li data-prodid=\"<%=item.id%>\" data-applyid=\"<%=item.apply_did%>\" class=\"prodItem\">\r\n    <span class=\"t\"><%=item.title%></span>\r\n</li>\r\n<% }) %>";

/***/ },
/* 77 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/12 16:35
	 * Description: ""
	 */
	var Submit = Backbone.View.extend({
		serialize : function(pckId){
			var result = {};
			var data = {};
			var container = $("#slideItem_"+pckId);
			var tid = $("#pckTitListUlItem_"+pckId).attr("data-id");
			//套餐id及套餐名称
			data["tid"] = tid;
			var ttitle = $("#pckTitListUlItem_"+pckId).find(".editNameInp").val();
			ttitle = $.trim(ttitle);
			if(!ttitle) return this.errorHander(pckId,"套餐名称不能为空");
			if(ttitle.length>20) return this.errorHander(pckId,"套餐名称不能超过30个字符");
			data["ttitle"] = ttitle;
	
			//预定时间段
			var price_section = [];
			var price_section_result = { is_ok:true, error:"" };
			container.find(".priceSectionLine").each(function(){
				var json = {};
				var tarItem = $(this);
				var id = tarItem.attr("data-pricesectionid");
				json["id"] = id;
				json["sdate"] = tarItem.find("input[name=sdate]").val();
				json["edate"] = tarItem.find("input[name=edate]").val();
				json["js"] = $.trim(tarItem.find("input[name=js]").val()*100);         //供货价
				json["ls"] = $.trim(tarItem.find("input[name=ls]").val()*100);         //零售价
				json["storage"] = -1;
				json["weekdays"] = "0,1,2,3,4,5,6";
				price_section.push(json);
				var tprice = $.trim(tarItem.find("input[name=tprice]").val()*100);
	
				//校验
				if(!json["sdate"]){
					price_section_result.is_ok = false;
					price_section_result.error = "预字时间段开始时间不能为空";
					return false;
				}
				if(!json["edate"]){
					price_section_result.is_ok = false;
					price_section_result.error = "预字时间段结束时间不能为空";
					return false;
				}
				//供货价、零售价
				if(isNaN(json["js"]) || json["js"]=="" || json["js"]<0){
					price_section_result.is_ok = false;
					price_section_result.error = "供货价请填写不小于0的数值（可以精确到分）";
					return false;
				}
				if(isNaN(json["ls"]) || json["ls"]=="" || json["ls"]<0){
					price_section_result.is_ok = false;
					price_section_result.error = "零售价请填写不小于0的数值（可以精确到分）";
					return false;
				}
				if(json["js"]>json["ls"]){
					price_section_result.is_ok = false;
					price_section_result.error = "供货价不得大于零售价";
					return false;
				}
				if(json["ls"]>tprice){
					price_section_result.is_ok = false;
					price_section_result.error = "零售价不得大于门市价";
					return false;
				}
				if(String(json["js"]).indexOf(".")>-1){
					price_section_result.is_ok = false;
					price_section_result.error = "供货价最多只能精确到分";
					return false;
				}
				if(String(json["ls"]).indexOf(".")>-1){
					price_section_result.is_ok = false;
					price_section_result.error = "零售价最多只能精确到分";
					return false;
				}
			})
	
			if(!price_section_result.is_ok) return this.errorHander(pckId,price_section_result.error);
			data["price_section"] = price_section;
	
			var tprice = $.trim(container.find(".priceSectionLine").first().find("input[name=tprice]").val()); //门市价
			if(isNaN(tprice) || tprice=="" || tprice<0) return this.errorHander(pckId,"门市价请填写不小于0的数值（可以精确到分）");
			if(String(tprice*100).indexOf(".")>-1) return this.errorHander(pckId,"门市价最多只能精确到分");
			data["tprice"] = tprice;
	
	
			//产品说明
			var notes = $.trim(container.find("input[name=notes]").val());
			if(notes=="") return this.errorHander(pckId,"产品说明不能为空");
			data["notes"] =notes;
	
			//使用说明
			var getaddr = $.trim(container.find("textarea[name=getaddr]").val());
			if(getaddr=="") return this.errorHander(pckId,"使用说明不能为空");
			data["getaddr"] =getaddr;
	
			//使用有效期
			var delaytypeRadio = container.find("input[type=radio][name=delaytype_"+pckId+"]:checked");
			var delaytype = delaytypeRadio.val();
			data["delaytype"] = delaytype;
			if(delaytype==2){
				var order_start = container.find("input[type=text][name=order_start]").val();
				var order_end = container.find("input[type=text][name=order_end]").val();
				if(new Date(order_start)*1>=new Date(order_end)*1) return this.errorHander(pckId,"使用有效期开始时间不能晚于结束时间");
				data["order_start"] = order_start;
				data["order_end"] = order_end;
			}else{ //delaytype==0 || 1
				var delaydays = $.trim(delaytypeRadio.parent().find("input[type=text][name=delaydays]").val());
				if(delaydays=="") return this.errorHander(pckId,"使用有效期，请填写有效天数");
				//不可为0
				if(!PFT.Util.Validate.typeInit(delaydays)) return this.errorHander(pckId,"使用有效期，天数请填写正整数");
				data["delaydays"] = delaydays;
			}
	
			//自动激活(可以为0)
			var auto_active_days = $.trim(container.find("input[type=text][name=auto_active_days]").val());
			if(!PFT.Util.Validate.typeInit0(auto_active_days)) return this.errorHander(pckId,"激活限制，请填写正整数");
			data["auto_active_days"] = auto_active_days;
			//是否需要身份证
			var certLimitInput = $("#cert_limit_"+pckId);
			if(certLimitInput.is(":checked")){
				data["cert_limit"] = 1;
			}else{
				data["cert_limit"] = 0;
			}
	
	
			//使用说明
			data["getaddr"] = $("#getaddrTextArea_"+pckId).val();
	
			//供应商手机号
			var fax = $.trim(container.find("input[type=text][name=fax]").val());
			if(fax=="") return this.errorHander(pckId,"供应商手机号不能为空");
			if(!PFT.Util.Validate.typePhone(fax)) return this.errorHander(pckId,"供应商手机号，请填写正确格式手机号");
			data["fax"] = fax;
	
	
			//消息通知
			//年卡激活时是否通知供应商
			var nts_sup_input = container.find("input[type=checkbox][name=nts_sup]");
			data["nts_sup"] = nts_sup_input.is(":checked") ? 1 : 0;
	
			//年卡激活时是否通知游客
			var nts_tour_input = container.find("input[type=checkbox][name=nts_tour]");
			data["nts_tour"] = nts_tour_input.is(":checked") ? 1 : 0;
	
			//年卡激活时是否通到微信
			var confirm_wx_input = container.find("input[type=checkbox][name=confirm_wx]");
			data["confirm_wx"] = confirm_wx_input.is(":checked") ? 1 : 0;
	
	
			//特权套餐
			var priv = (function(){
	
				var result = {};
				$("#pckRightListUl_"+pckId).children().each(function(){
					var item = $(this);
					var tid = item.attr("data-ticketid");
					var aid = item.attr("data-aid");
					var use_limit = item.find("input[type=radio]:checked").val();
					result[tid] = {
						aid : aid
					};
					if(use_limit==-1){ //使用限制为不限
						result[tid]["use_limit"] = use_limit;
					}else{
						var daily_limit = $.trim(item.find(".limitCountInp_daily").val());
						var month_limit = $.trim(item.find(".limitCountInp_month").val());
						var total_limit = $.trim(item.find(".limitCountInp_total").val());
						if(!PFT.Util.Validate.typeInit(daily_limit) && !PFT.Util.Validate.typeInit(month_limit) && !PFT.Util.Validate.typeInit(total_limit)){
							result["error"] = "限制次数至少填写一个且须为正整数";
							return false;
						}else{
							if(!PFT.Util.Validate.typeInit(daily_limit)) daily_limit = -1;
							if(!PFT.Util.Validate.typeInit(month_limit)) month_limit = -1;
							if(!PFT.Util.Validate.typeInit(total_limit)) total_limit = -1;
							result[tid]["use_limit"] = [daily_limit,month_limit,total_limit].join(",");
						}
					}
				});
				return result;
	
			})();
	
			if(priv.error) return this.errorHander(pckId,priv.error);
			if(_.isEmpty(priv)) return this.errorHander(pckId,"每个套餐须保留至少一个特权产品");
			data["priv"] = priv;
	
	
			//是否发布
			data["apply_limit"] = container.find(".apply_limit_input:checked").val();
	
			data["lid"] = PFT.Util.UrlParse()["sid"] || "";
	
			result[tid] = data;
	
			return result;
	
		},
		errorHander : function(pckId,errorTxt){
			this.trigger("submit.error",{pckId:pckId,error:errorTxt});
			return null;
		}
	});
	module.exports = Submit;

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map