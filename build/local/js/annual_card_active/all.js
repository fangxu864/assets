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
	__webpack_require__(1);
	var ReadPhysicsCard = __webpack_require__(5);
	var MainView = Backbone.View.extend({
		el : $("#cardContainer"),
		events : {
			"click #readCardBtn" : "onReadCardBtnClick"
		},
		initialize : function(){
			this.cardInp = $("#cardNum");
			this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
		},
		onReadCardBtnClick : function(e){
			var cardval = this.ReadPhysicsCard.read();
			this.cardInp.val(cardval);
			if(!cardval) alert("读卡失败");
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
		}
	});
	
	$(function(){
		new MainView();
	})


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map