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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-12.
	 */
	__webpack_require__(1);
	var SlideManager = __webpack_require__(5);
	var Router = Backbone.Router.extend({
		routes : {
			"" : "main",
			"step/:id" : "step"
		},
		initialize : function(){
			var that = this;
			this.slideManager = new SlideManager();
			this.slideManager.on("slide.before",function(id){
				console.log("slide.before");
			})
			this.slideManager.on("slide.after",function(id){
				console.log("slide.after");
			})
		},
		main : function(){
	
		},
		step : function(id){
			this.slideManager.slide(id);
		}
	});
	var router = new Router;
	Backbone.history.start();

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
	 * Created by Administrator on 16-4-12.
	 */
	var SlideManager = Backbone.View.extend({
		el : $("#slideContainer"),
		initialize : function(){
			this.stepWidth = this.$el.children().first().width();
		},
		slide : function(id){
			var that = this;
			var dir = -1;
			var id = id-1;
			this.trigger("slide.before",id);
			this.$el.animate({left:dir*id*this.stepWidth},200,function(){
				that.trigger("slide.after",id);
			});
		}
	});
	module.exports = SlideManager;

/***/ }
/******/ ]);
//# sourceMappingURL=register.all.js.map