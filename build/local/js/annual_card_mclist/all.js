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
	__webpack_require__(37);
	var TabHeader = __webpack_require__(39);
	var ListManager = __webpack_require__(40);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {
	
		},
		initialize : function(){
			var that = this;
			this.TabHeader = new TabHeader();
			this.TabHeader.on("switch",function(data){
				var status = data.status;
				that.ListManager.active(status);
			})
			this.ListManager = new ListManager({statusArr:this.TabHeader.getStatus()});
			this.TabHeader.active(1);
		}
	});
	
	$(function(){
		new MainView();
	})
	


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

/***/ 37:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 39:
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
		initialize : function(){
	
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
		}
	});
	module.exports = Header;

/***/ },

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/29 16:29
	 * Description: ""
	 */
	var itemContainerTpl = __webpack_require__(41);
	var LoadingPc = __webpack_require__(32);
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
			var loading = LoadingPc("努力加载中，请稍后..",{
				tag : "span",
				height : 400
			});
			var html = "";
			for(var i=0; i<status.length; i++){
				var _stus = status[i];
				var ths = tableTh[_stus];
				html += template({data:{
					width : that.itemWidth,
					status : _stus,
					ths : ths,
					loading : loading
				}});
			}
			this.slideUl.html(html);
		},
		//要切换(激活哪个slide item)
		active : function(status){
			var tarItem = $("#listItemLi_"+status);
			var index = tarItem.index();
			this.slideUl.animate({left:-1*this.itemWidth*index},400);
		}
	});
	module .exports = Manager;

/***/ },

/***/ 41:
/***/ function(module, exports) {

	module.exports = "<li style=\"width:<%=data.width%>px\" id=\"listItemLi_<%=data.status%>\" class=\"listItemLi listItemLi_<%=data.status%>\">\r\n    <table id=\"listItemTable_<%=data.status%>\" class=\"listItemTable listItemTable_<%=data.status%>\">\r\n        <thead>\r\n        <tr>\r\n            <%_.each(data.ths,function(item,index){%>\r\n            <th><%=item%></th>\r\n            <% }) %>\r\n        </tr>\r\n        </thead>\r\n        <tbody id=\"tbody_<%=data.status%>\" class=\"tbody tbody_<%=data.status%>\">\r\n            <tr style=\"text-align:center\">\r\n                <td colspan=\"<%=data.ths.length%>\"><%=data.loading%></td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n</li>\r\n";

/***/ }

/******/ });
//# sourceMappingURL=all.js.map