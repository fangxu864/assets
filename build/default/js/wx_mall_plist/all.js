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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(75);


/***/ },

/***/ 17:
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-13.
	 */
	module.exports = function(url,opt){
		if(!url) return alert("ajax请求缺少url");
		var fn = new Function;
		var opt = opt || {};
		var params = opt.params || {};
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var timeout = opt.timeout || function(){ alert("请求超时，请稍后重试")};
		var serverError = opt.serverError || function(xhr,txt){
			var txt = txt || "请求出错，请稍后重试";
			if(txt=="parsererror") txt = "请求出错，请稍后重试";
			alert(txt);
		};
		var type = opt.type || "get";
		var dataType = opt.dataType || "json";
		var ttimeout = opt.ttimeout || 120 * 1000;
		$.ajax({
			url : url,
			type : type,
			dataType : dataType,
			data : params,
			timeout :ttimeout,
			beforeSend : function(){
				loading();
			},
			success : function(res){
				complete(res);
				success(res);
			},
			error : function(xhr,txt){
				complete(xhr,txt);
				if(txt == "timeout"){
					timeout(xhr,txt);
				}else{
					serverError(xhr,txt);
				}
			}
		})
	}

/***/ },

/***/ 24:
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-4-20.
	 */
	module.exports = function(url){
		if(!url) url = window.location.search.substr(1);
		var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
		var result = {};
		url.replace(reg,function(){
			var key = arguments[2];
			var val = arguments[3];
			result[key] = val;
		})
		return result;
	};

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/30 16:15
	 * Description: ""
	 */
	__webpack_require__(76);
	var FastClick = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fastclick\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var GMasker = __webpack_require__(78);
	var Api = __webpack_require__(81);
	
	FastClick.attach(document.body);
	var TopSearch = __webpack_require__(83)({Api:Api});
	var FilterBar = __webpack_require__(87)({Api:Api});


/***/ },

/***/ 76:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/30 17:08
	 * Description: ""
	 */
	__webpack_require__(79);
	module.exports = {
		open : function(callback){
			var gmaskLayer = document.getElementById("gmaskLayer");
			if(gmaskLayer){
				gmaskLayer.className = gmaskLayer.className+" show";
			}else{
				gmaskLayer = document.createElement('div');
				gmaskLayer.setAttribute("id","gmaskLayer");
				gmaskLayer.className = "gmaskLayer show";
				gmaskLayer.innerHTML = '<div class="gLoadingBox" style="margin-top:-4.5rem"><div class="gLoading load1"></div></div>';
				document.body.appendChild(gmaskLayer);
			}
			callback && callback();
		},
		close : function(callback){
			var gmaskLayer = document.getElementById("gmaskLayer");
			if(gmaskLayer.classList){
				gmaskLayer.classList.remove("show");
			}else{
				var cls = gmaskLayer.className.split(",");
				cls = cls.replace(/[,]*show/,"");
				gmaskLayer.className = cls;
			}
			callback && callback();
		}
	}

/***/ },

/***/ 79:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/30 19:32
	 * Description: ""
	 */
	var Debug = true;
	var Ajax = __webpack_require__(17);
	var Promise = __webpack_require__(82);
	var Api = {
		api : "wx/api/v0.0.3/order.php?action=topic_list",
		getTopic : function(){
			var defer = Promise();
			if(Debug){
				setTimeout(function(){
					defer.resolve(["爱上古迹", "逐海踏浪", "度假山庄", "激情漂流", "城市观光", "乐游山水", "文化追根", "主题乐园", "温泉养生", "水世界", "激情漂流"])
				},1000)
			}else{
	
			}
			return defer.promise;
		}
	};
	module.exports = Api;

/***/ },

/***/ 82:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/25 17:33
	 * Description: promiseʵ��  from https://github.com/gf-rd/blog/issues/32
	 */
	var Deferred = function () {
		var _pending = [], _result, _reason;
		var _this = {
			resolve: function (result) {
				if (_this.promise.status !== 'pending') {
					return;
				}
				_result = result;
	
				setTimeout(function () {
					processQueue(_pending, _this.promise.status = 'resolved', _result);
					_pending = null;
				}, 0);
			},
			reject: function (reason) {
				if (_this.promise.status !== 'pending') {
					return;
				}
				_reason = reason;
	
				setTimeout(function () {
					processQueue(_pending, _this.promise.status = 'rejected', null, _reason);
					_pending = null;
				}, 0);
			},
			promise: {
				then: function (onResolved, onRejected) {
					// ����һ���µ�defer������, ���ҽ�defer��callbackͬʱ���ӵ���ǰ��pending�С�
					var defer = Deferred();
					var status = _this.promise.status;
					if (status === 'pending') {
						_pending.push([defer, onResolved, onRejected]);
					} else if (status === 'resolved') {
						onResolved(_result);
					} else if (status === 'rejected') {
						onRejected(_reason);
					}
					return defer.promise;
				},
				status: 'pending'
			}
		};
	
		function processQueue(pending, status, result, reason) {
			var item, r, i, l, callbackIndex, method, param;
			if (status === 'resolved') {
				callbackIndex = 1;
				method = 'resolve';
				param = result;
			} else {
				callbackIndex = 2;
				method = 'reject';
				param = reason;
			}
			for (i = 0, l = pending.length; i < l; i++) {
				item = pending[i];
				r = item[callbackIndex](param);
				// �����ص��Ľ������ص���promise(��then����), ������then��������resolve��������
				if (r && typeof r.then === 'function') {
					r.then.call(r, item[0].resolve, item[0].reject);
				} else {
					item[0][method](param);
				}
			}
		}
	
		return _this;
	};
	
	module.exports = Deferred;

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/30 18:03
	 * Description: ""
	 */
	__webpack_require__(84);
	var Search = Backbone.View.extend({
		initialize : function(){
			$("#page-index").append($(__webpack_require__(86)));
		}
	});
	module.exports = function(){
		return new Search();
	}

/***/ },

/***/ 84:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 86:
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/5/30 18:03 -->\r\n<!-- Description: huangzhiyang -->\r\n<div class=\"ui-fixHead plist fixHead\">\r\n    <div class=\"con\">\r\n        <i class=\"iconfont searchIcon\">&#xe633;</i>\r\n        <input type=\"text\" name=\"\" id=\"searchInp_list\" class=\"searchInp searchInp_list list\" placeholder=\"搜索产品 / 景区\"/>\r\n    </div>\r\n    <a class=\"btn goback\" href=\"javascript:window.history.go(-1)\"><i class=\"iconfont\">&#xe60c;</i></a>\r\n    <a class=\"btn user\" href=\"usercenter.html\"><i class=\"iconfont\">&#xe682;</i></a>\r\n</div>";

/***/ },

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/30 19:30
	 * Description: ""
	 */
	__webpack_require__(88);
	var UrlParse = __webpack_require__(24);
	var GeoLocation = __webpack_require__(90);
	var CityQuery = __webpack_require__(91);
	module.exports = function(opt){
	
		var FilterBar = Backbone.View.extend({
			PTYPE : {
				"A" : "景区",
				"C" : "酒店",
				"F" : "套票",
				"H" : "演出",
				"B" : "周边游",
				"I" : "年卡"
			},
			el : $("#filterBar"),
			initialize : function(opt){
				var that = this;
				var opt = opt || {};
	
				//载入html模板
				$("#page-index").append(__webpack_require__(96));
	
				this.Api = opt.Api;
				this.Api.getTopic().then(function(topics){
					console.log(topics)
				})
				var urlParams = UrlParse();
				var topic = urlParams.topic || "不限";
				var ptype = urlParams.ptype;
				if(topic) this.topic(topic);
				if(ptype) this.ptype(ptype);
				this.city(GeoLocation.getStorageCity());
				this.CityQuery = CityQuery.init({GeoLocation:GeoLocation});
				this.CityQuery.on("city.switch",function(data){
					var cityname = data.name;
					that.city(cityname);
				})
			},
			//getor or setor
			topic : function(topic){
				var target = $("#switchTopicBtn");
				if(topic){
					if(topic=="不限"){
						target.attr("data-val","").find(".t").text("主题");
					}else{
						target.attr("data-val",topic).find(".t").text(city);
					}
				}else{
					return target.attr("data-val");
				}
			},
			ptype : function(ptype){
				var target = $("#switchPtypeBtn");
				if(ptype){
					target.attr("data-val",ptype).find(".t").text(this.PTYPE[ptype]);
				}else{
					return target.attr("data-val");
				}
			},
			city : function(city){
				var target = $("#switchCityBtn");
				if(city){
					if(city=="全国" || city=="不限"){
						target.attr("data-val","").find(".t").text("不限");
					}else{
						target.attr("data-val",city).find(".t").text(city);
					}
				}else{
					return target.attr("data-val");
				}
			}
		});
	
		return new FilterBar(opt);
	
	}

/***/ },

/***/ 88:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 90:
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/23 15:28
	 * Description: ""
	 */
	var Location = {
		DEFAULT_CITY : "福州",
		LOCALSTORAGE_KEY : "wx-16u-local-city",
		UNLIKE_CITY_STORAGE_KEY : "wx-16u-unlink-city",
		getStorageCity : function(){
			var key = this.LOCALSTORAGE_KEY;
			var city = localStorage.getItem(key);
			return !!city ? city : this.DEFAULT_CITY;
		},
		setStorageCity : function(city){
			if(!city) return false;
			localStorage.setItem(this.LOCALSTORAGE_KEY,city);
			return city;
		},
		unLikeCitys : function(city){ //set or get
			var key = this.UNLIKE_CITY_STORAGE_KEY;
			var citys = localStorage.getItem(key);
			if(!city){
				if(!!citys) return citys.split(",");
				return [];
			}else{
				if(!!citys){
					citys += ","+city;
				}else{
					citys = city;
				}
				localStorage.setItem(key,citys);
			}
		},
		isUnLikeCitys : function(city){
			var result = false;
			if(!city) return result;
			var unLikeCitys = this.unLikeCitys().split(",");
			for(var i in unLikeCitys){
				if(city===unLikeCitys[i]){
					result = true;
					break;
				}
			}
			return result;
		},
		/**
		 * ��λ����  ��ѡ��h5��λ��IP��ַ��λ(type����)
		 * @param opt
		 * local({
		 * 		loading : function(){},
		 * 		complete : function(res){},
		 * 		success : function(cityname){},
		 * 		fail : function(res){}
		 * })
		 */
		local : function(opt){
			var that = this;
			var opt = opt || {};
			var fn = new Function;
			var type = opt.type || "H5";
			var loading = opt.loading || fn;
			var complete = opt.complete || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			if(!BMap) return console.log("缺省BMap对象");
			loading();
			if(type=="H5"){
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(res){
					//����״̬��
					//BMAP_STATUS_SUCCESS	�����ɹ�����Ӧ��ֵ��0����
					//BMAP_STATUS_CITY_LIST	�����б���Ӧ��ֵ��1����
					//BMAP_STATUS_UNKNOWN_LOCATION	λ�ý��δ֪����Ӧ��ֵ��2����
					//BMAP_STATUS_UNKNOWN_ROUTE	�������δ֪����Ӧ��ֵ��3����
					//BMAP_STATUS_INVALID_KEY	�Ƿ���Կ����Ӧ��ֵ��4����
					//BMAP_STATUS_INVALID_REQUEST	�Ƿ����󡣶�Ӧ��ֵ��5����
					//BMAP_STATUS_PERMISSION_DENIED	û��Ȩ�ޡ���Ӧ��ֵ��6����(�� 1.1 ����)
					//BMAP_STATUS_SERVICE_UNAVAILABLE	���񲻿��á���Ӧ��ֵ��7����(�� 1.1 ����)
					//BMAP_STATUS_TIMEOUT	��ʱ����Ӧ��ֵ��8����(�� 1.1 ����)
					var status = this.getStatus();
					if(status==0){
						var point = res.point;
						var lng = point.lng;
						var lat = point.lat;
						$.getJSON('http://api.map.baidu.com/geocoder/v2/?ak=485641E293ABd3523de065f7c1bbfeba&callback=?&location='+lat+','+lng+'&output=json&pois=1', function(res){
							complete(res);
							if(res && res.result && res.result.addressComponent && res.result.addressComponent.city){
								var city = res.result.addressComponent.city;
								if(city.indexOf("市")) city = city.substring(0,city.length-1);
								success(city);
							}else{
								fail(res);
							}
						});
					}else{
						complete(res);
						fail(res);
					}
				},{enableHighAccuracy:true});
			}else{
				var myCity = new BMap.LocalCity();
				myCity.get(function(result){
					complete(result);
					if(result && result.name){
						success(result.name);
					}else{
						fail(result);
					}
				});
			}
		}
	};
	module.exports = Location;

/***/ },

/***/ 91:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/23 15:28
	 * Description: ""
	 */
	__webpack_require__(92);
	var Debug = true;
	var indexTpl = __webpack_require__(94);
	var Model = __webpack_require__(95);
	var Main = Backbone.View.extend({
		el : $("body"),
		events : {
			"input #citySearchInp" : "onCitySearchInpChange",
			"click #city_search_clearBtn" : "onClearSearchBtnClick",
			"click .cityItem" : "onCityItemClick"
		},
		initialize : function(opt){
			var that = this;
			//开始定位
			var locateCurrentCity = this.locateCurrentCity = $("#locateCurrentCity");
			this.GeoLocation = opt.GeoLocation;
			if(!Debug){
				this.GeoLocation.local({
					loading : function(){
						locateCurrentCity.addClass("disable").find(".city").text("正在定位...")
					},
					complete : function(){
						locateCurrentCity.find(".city").text("正在完成...")
					},
					success : function(city){
						locateCurrentCity.removeClass("disable").find(".city").text(city);
					},
					fail : function(res){
						locateCurrentCity.find(".city").text("定位失败...")
					}
				})
			}
			//处理model
			this.model.on("change:cityList",function(model){
				var cityList = model.get("cityList");
				var type = _.isObject(cityList) ? "success" : cityList;
				that.render(type,cityList);
			})
			//获取地区数据
			this.model.fetchCity();
	
		},
		onCitySearchInpChange : function(e){
			var clearBtn = $("#city_search_clearBtn");
			var tarInp = $(e.currentTarget);
			var keyword = $.trim(tarInp.val());
			var allCitys = this.model.get("allCityCache");
			if(typeof allCitys=="string") return false;
			keyword ? clearBtn.show() : clearBtn.hide();
			this.model.filter(keyword);
		},
		onClearSearchBtnClick : function(){
			$(e.currentTarget).hide();
			$("#citySearchInp").val("").focus();
			this.model.filter("");
		},
		onCityItemClick : function(e){
			var tarItem = $(e.currentTarget);
			if(tarItem.hasClass("disable") || tarItem.hasClass("active")) return false;
			$("#cityQueryPage").find(".cityItem").removeClass("active");
			tarItem.addClass("active");
			var name = tarItem.attr("data-name") || tarItem.find(".t").text();
			if(name=="所有城市" || name=="全国") name="不限";
			var code = tarItem.attr("data-id");
			var pin = tarItem.attr("data-pin");
			var abb = tarItem.attr("data-abb");
			this.GeoLocation.setStorageCity(name);
			this.close();
			this.trigger("city.switch",{
				name : name,
				code : code,
				pin : pin,
				abb : abb
			})
		},
		render : function(type,data){
			var html = "";
			switch (type){
				case "loading":
					html += '<li class="state loading">努力加载中...</li>';
					break;
				case "complete":
					html += '<li class="state complete"></li>';
					break;
				case "timeout":
					html += '<li class="state timeout">请求超时，请稍后重试...</li>';
					break;
				case "serverError":
					html += '<li class="state serverError">请求出错，请稍后重试...</li>';
					break;
				case "empty":
					html += '<li class="state empty">没有匹配城市...</li>';
					break;
				case "success":
					for(var i in data){
						var group = data[i];
						var letter = i.toUpperCase();
						var letterCls = letter=="0" ? "none" : "let";
						html += '<li class="group">';
						html += 	'<p class="letter '+letterCls+'">'+letter+'</p>';
						html +=		'<ul class="cityUl">';
						for(var g in group){
							var city = group[g];
							var id = city["id"];
							var name = city["hanzi"];
							var pinyin = city["pinyin"];
							var shouzimu = city["shouzimu"];
							html += [
								'<li class="cityItem" data-name="'+name+'" data-id="'+id+'" data-pin="'+pinyin+'" data-abb="'+shouzimu+'">',
								'<span class="t">'+name+'</span><i class="iconfont checkbox selected">&#xe664;</i><i class="iconfont checkbox unselect">&#xe665;</i>',
								'</li>'
							].join("");
						}
						html +=	'</ul>';
						html += '</li>';
					}
					break;
			}
			$("#allcityUl").html(html);
		},
		open : function(){
			$("#cityQueryPage").addClass("on");
		},
		close : function(){
			$("#cityQueryPage").removeClass("on");
		}
	});
	
	
	
	module.exports = {
		init : function(opt){
			var opt = opt || {};
			$(document.body).append(indexTpl);
			opt["model"] = new Model();
			return new Main(opt);
		}
	};


/***/ },

/***/ 92:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 94:
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/5/23 19:29 -->\r\n<!-- Description: huangzhiyang -->\r\n<div id=\"cityQueryPage\" class=\"page allCity allCityPage cityQueryPage\">\r\n    <div id=\"\" class=\"fixHead\">\r\n        <div class=\"con\"><span class=\"fixHeadTxt\">城市列表</span></div>\r\n        <a class=\"topBtn goBack\" href=\"javascript:window.history.go(-1)\"><i style=\"color:#fff\" class=\"iconfont\">&#xe60c;</i></a>\r\n        <a id=\"querycity_result_btn\" style=\"color:#fff\" href=\"usercenter.html\" class=\"topBtn user ok\"><i class=\"iconfont\">&#xe682;</i></a>\r\n    </div>\r\n    <div class=\"searchBox\">\r\n        <div class=\"con\">\r\n            <input class=\"formInp searchInp ui-radius ui-border\" type=\"text\" name=\"\" id=\"citySearchInp\" placeholder=\"福州 / fuzhou / fz\"/>\r\n            <i class=\"iconfont search\">&#xe60a;</i>\r\n            <i class=\"iconfont loading\">&#xe643;</i>\r\n            <i id=\"city_search_clearBtn\" class=\"iconfont clear\">&#xe634;</i>\r\n        </div>\r\n    </div>\r\n    <div id=\"mainPageCon_city\" class=\"mainPageCon_city\">\r\n        <div id=\"locateCurrentCity\" class=\"cityItem disable topBar\">\r\n            <i class=\"iconfont\">&#xe603;</i><span class=\"t\">定位城市：</span><span class=\"city\"></span>\r\n            <i class=\"iconfont checkbox selected\">&#xe664;</i><i class=\"iconfont checkbox unselect\">&#xe665;</i>\r\n        </div>\r\n        <div id=\"allCItyBar\" class=\"allCityBar cityItem topBar success\">\r\n            <i class=\"iconfont\">&#xe6a7;</i><span class=\"t\">所有城市</span>\r\n            <i class=\"iconfont checkbox selected\">&#xe664;</i><i class=\"iconfont checkbox unselect\">&#xe665;</i>\r\n        </div>\r\n        <ul id=\"allcityUl\" class=\"allcityUl\"></ul>\r\n    </div>\r\n</div>";

/***/ },

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/5/23 16:17
	 * Description: ""
	 */
	var Debug = true;
	var Ajax = __webpack_require__(17);
	var CityStore = Backbone.Model.extend({
		defaults : {
			allCityFlag : "",
			allCityCache : "",
			cityList : "",
			keyword : ""
		},
		initialize : function(){},
		fetchCity : function(){
			var that = this;
	
			if(Debug){
				that.set("cityList","loading");
				that.set("allCityCache","loading");
				setTimeout(function(){
					that.set("cityList",{f:[{"a":"f","id":1000,"hanzi":"福州","pinyin":"fuzhou","shouzimu":"fz"}]});
					that.set("allCityCache",{f:[{"a":"f","id":1000,"hanzi":"福州","pinyin":"fuzhou","shouzimu":"fz"}]});
				},1000);
				return;
			}
	
			var cityList = this.get("cityList");
			if(cityList || cityList=="loading") return false;
			Ajax("../api/v0.0.3/order.php",{
				type : "get",
				dataType : "json",
				params : {
					action : "area_list"
				},
				loading : function(){
					that.set("cityList","loading");
					that.set("allCityCache","loading");
				},
				complete : function(){
					that.set("cityList","complete");
					that.set("allCityCache","complete");
				},
				timeout : function(res){
					that.set("cityList","timeout");
					that.set("allCityCache","timeout");
				},
				serverError : function(res){
					that.set("cityList","serverError");
					that.set("allCityCache","serverError");
				},
				success : function(res){
					var code = res.code;
					var areas = res.areas;
					if(code==200 && _.isObject(areas)){
						if(!_.isEmpty(areas)){
							that.set("cityList",areas);
							that.set("allCityCache",areas);
						}else{
							that.set("cityList","empty");
							that.set("allCityCache","empty");
						}
					}else{
						that.set("cityList","fail");
						that.set("allCityCache","fail");
					}
				}
			})
		},
		filter : function(val){
			var result = {};
			var all = this.get("allCityCache");
			if(typeof all=="string") return result;
			if(!val) return this.set("cityList",all);
			val = val.toLowerCase();
			var first_letter = val.substring(0,1);
			if(/^[a-z]+$/g.test(first_letter)){ //首字符是英文
				var citys = all[first_letter];
				var arr = [];
				if(citys){
					for(var i in citys){
						var city = citys[i];
						var pin = city["pinyin"];
						var abb = city["shouzimu"];
						var hanzi = city["hanzi"];
						if(pin.indexOf(val)>-1 || abb.indexOf(val)>-1 || hanzi.indexOf(val)>-1){
							arr.push({
								a: city["a"],
								hanzi : hanzi,
								id : city["id"],
								pinyin : pin,
								shouzimu : abb
							})
						}
					}
				}
				if(arr.length) result[first_letter] = arr;
			}else{ //首字符是中文
				for(var letter in all){
					var citys = all[i];
					var array = [];
					for(var c in citys){
						var city = citys[c];
						var hanzi = city["hanzi"];
						var pin = city["pinyin"];
						var abb = city["shouzimu"];
						if(hanzi.indexOf(val)>-1 || pin.indexOf(val)>-1 || abb.indexOf(val)>-1){
							array.push({
								a: city["a"],
								hanzi : city["hanzi"],
								id : city["id"],
								pinyin : city["pinyin"],
								shouzimu : city["shouzimu"]
							})
						}
					}
					if(array.length) result[letter] = array;
				}
			}
			if(!_.isEmpty(result)){ //如果result是空{}
				this.set("cityList",result);
			}else{
				this.set("cityList","empty");
			}
		}
	});
	module.exports = CityStore;

/***/ },

/***/ 96:
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/5/30 19:53 -->\r\n<!-- Description: huangzhiyang -->\r\n<div style=\"position:fixed\" data-ptype=\"<?=$_GET['ptype']?>\" id=\"filterBar\" class=\"filterBar ui-filterBar\">\r\n    <div class=\"con ui-flex\">\r\n        <a id=\"switchTopicBtn\" data-param=\"topic\" data-show=\"\" data-val=\"\" href=\"#topic?active=<?=$topic?>\" style=\"display:block; color:#fff\" class=\"ui-filterItem ui-filterItem-tap ui-filterItem-topic ui-flex-box topic\">\r\n            <i class=\"iconfont\">&#xe6a7;</i><span class=\"t\"></span>\r\n        </a>\r\n        <a id=\"switchPtypeBtn\" href=\"#ptype\" class=\"ui-filterItem ui-flex-box ui-filterItem-ptype ptype\" data-param=\"type\" data-val=\"\" style=\"color:#fff\">\r\n            <i style=\"top:1px\" class=\"iconfont\">&#xe6ab;</i><span class=\"t\"></span>\r\n        </a>\r\n        <a id=\"switchCityBtn\" href=\"#city\" class=\"ui-filterItem ui-flex-box ui-filterItem-city city\" data-param=\"area\" data-val=\"<?=$city_id?>\" data-show=\"<?=$city?>\" style=\"color:#fff\">\r\n            <i style=\"top:1px\" class=\"iconfont\">&#xe603;</i><span class=\"t\"><?=$city?></span>\r\n        </a>\r\n    </div>\r\n</div>";

/***/ }

/******/ });
//# sourceMappingURL=all.js.map