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
	__webpack_require__(39);
	var TabHeader = __webpack_require__(41);
	var ListManager = __webpack_require__(42);
	var State = __webpack_require__(44);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {
	
		},
		initialize : function(){
			var that = this;
			this.TabHeader = new TabHeader({state:State});
			this.TabHeader.on("switch",function(data){
				var status = data.status;
				that.ListManager.active(status);
			})
			this.ListManager = new ListManager({statusArr:this.TabHeader.getStatus(),state:State});
			this.TabHeader.active(1);
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
	 * Date: 2016/6/7 10:09
	 * Description: 订阅发布模型
	 */
	var E = {
		fn : {},
		on : function(type,fn){
			var fns = this.fn[type] || (this.fn[type]=[]);
			fns.push(fn);
		},
		fire : function(type){
			var fns = this.fn[type];
			if(!fns) return false;
			var args = arguments;
			var len = args.length;
			var argus,scope;
			if(len==1){
				argus = "";
				scope = this;
			}else if(len==2){
				argus = args[len-1];
				scope = this;
			}else if(len==3){
				argus = args[len-2];
				scope = args[len-1];
			}
			for(var i in fns){
				var fn = fns[i];
				fn.call(scope,argus);
			}
		},
		trigger : function(){
			this.fire.apply(this,arguments);
		}
	};
	module.exports = E;

/***/ },

/***/ 13:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/22 18:43
	 * Description: ""
	 */
	module.exports = function(destination,source){
		for(var n in source){
			if(source.hasOwnProperty(n)){
				destination[n]=source[n];
			}
		}
		return destination;
	}

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


/***/ },

/***/ 34:
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

/***/ 39:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 41:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/29 15:48
	 * Description: ""
	 */
	var Header = Backbone.View.extend({
		el : $("#tahHeaderContainer"),
		events : {
			"click .cardType" : "onCardTypeClick"
		},
		initialize : function(opt){
			this.state = opt.state;
			console.log(this.state);
		},
		onCardTypeClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("active")) return false;
			var status = tarBtn.attr("data-status");
			tarBtn.addClass("active").siblings().removeClass("active");
			this.trigger("switch",{status:status});
		},
		active : function(status){
			this.$el.find(".cardType[data-status="+status+"]").trigger("click");
		},
		getStatus : function(){
			var status = [];
			this.$el.find(".cardType").each(function(){
				var item = $(this);
				var s = item.attr("data-status");
				status.push(s);
			})
			return status;
		},
		setCount : function(status,count){
			if(arguments.length!=2) return false;
			$("#cardTypeTab_"+status).find(".num").css("display","inline").text(count);
		}
	});
	module.exports = Header;

/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/29 16:29
	 * Description: ""
	 */
	var itemContainerTpl = __webpack_require__(43);
	var LoadingPc = __webpack_require__(34);
	var Api = __webpack_require__(16);
	var Manager = Backbone.View.extend({
		el : $("#listSlideContainer"),
		tableTh : {
			//激活状态
			1 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况"],
			//未激活状态
			0 : ["售出时间","虚拟卡号/实体卡号 ","发卡商户","激活情况"],
			//禁用状态
			2 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况"],
			//挂失状态
			4 : ["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况"]
		},
		initialize : function(opt){
			opt = opt || {};
			this.state = opt.state;
			this.itemWidth = this.$el.width();
			this.statusArr = opt.statusArr;
			this.slideUl = this.$el.find(".slideUl");
			this.slideUl.width(this.itemWidth*this.statusArr.length);
			this.buildSlideItem(this.statusArr);
		},
		buildSlideItem : function(status){
			var that = this;
			var template = _.template(itemContainerTpl);
			var tableTh = this.tableTh;
			var html = "";
			for(var i=0; i<status.length; i++){
				var _stus = status[i];
				var ths = tableTh[_stus];
				html += template({data:{
					width : that.itemWidth,
					status : _stus,
					ths : ths,
					loading : ""
				}});
			}
			this.slideUl.html(html);
		},
		getSupplySelectVal : function(){
			return $("#supplySelect").val();
		},
		//要切换(激活哪个slide item)
		active : function(status){
			var tarItem = $("#listItemLi_"+status);
			var index = tarItem.index();
			var state = this.state[status] || (this.state[status]={});
			var supply = this.getSupplySelectVal();
			var keyword = $("#searchInp").val();
			var listData = state.listData;
			//切换之前，先把当前pannel里的状态保存到state里
			state["supply"] = supply;
			state["keyword"] = keyword;
			$("#searchInp").val("");
			if(!listData) this.getList(status);
			this.slideUl.animate({left:-1*this.itemWidth*index},400);
		},
		getList : function(status,page,keyword){
			var that = this;
			var container = $("#listItemLi_"+status).find(".tbody");
			PFT.Util.Ajax(Api.Url.storage.getList,{
				params : {
					status : status,
					page : page,
					page_size : 20,
					identify : keyword
				},
				loading : function(){
					var loading = LoadingPc("努力加载中，请稍后..",{
						tag : "tr",
						height : 300,
						colspan : that.tableTh[status].length,
						css : {
							"text-align" : "center"
						}
					});
					container.html(loading);
				},
				complete : function(){
	
				},
				success : function(res){
	
				}
			})
		}
	});
	module .exports = Manager;

/***/ },

/***/ 43:
/***/ function(module, exports) {

	module.exports = "<li style=\"width:<%=data.width%>px\" id=\"listItemLi_<%=data.status%>\" class=\"listItemLi listItemLi_<%=data.status%>\">\r\n    <table id=\"listItemTable_<%=data.status%>\" class=\"listItemTable listItemTable_<%=data.status%>\">\r\n        <thead>\r\n        <tr>\r\n            <%_.each(data.ths,function(item,index){%>\r\n            <th><%=item%></th>\r\n            <% }) %>\r\n        </tr>\r\n        </thead>\r\n        <tbody id=\"tbody_<%=data.status%>\" class=\"tbody tbody_<%=data.status%>\">\r\n            <tr style=\"text-align:center\">\r\n                <td colspan=\"<%=data.ths.length%>\" style=\"text-align:center\"><%=data.loading%></td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n</li>\r\n";

/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/30 17:11
	 * Description: ""
	 */
	var Extend = __webpack_require__(13);
	var PubSub = __webpack_require__(12);
	var State = Extend({},PubSub);
	module.exports = State;

/***/ }

/******/ });
//# sourceMappingURL=all.js.map