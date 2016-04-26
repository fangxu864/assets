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
/******/ 	__webpack_require__.p = "http://static.12301.test/assets/build";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-6.
	 */
	__webpack_require__(57);
	var List = __webpack_require__(59);
	var Main = RichBase.extend({
		init : function(){
			this.areaSelect = $("#areaSelect");
			this.switchBtn = $("#switchStorageBtn");
			this.list = new List();
			this.bindEvents();
	
		},
		bindEvents : function(){
			var that = this;
			this.areaSelect.on("change",function(e){
				that.list.fetchList();
			})
		}
	});
	
	$(function(){ new Main()})

/***/ },

/***/ 57:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 59:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-2-3.
	 */
	var Api = __webpack_require__(60);
	var ListManager = __webpack_require__(61);
	var List = RichBase.extend({
		init : function(opt){
			var that = this;
			this.container = $("#listContainerWrap");
			this.listUl = $("#listContainer");
			this.loadingBox = $("#listLoading");
			this.areaSelect = $("#areaSelect");
			this.errorBox = $("#errorStatusBox");
			this.switchBtn = $("#switchStorageBtn");
			this.tpl = __webpack_require__(62);
			this.listManager = new ListManager();
			this.getAreaList(function(res){
				setTimeout(function(){
					that.fetchList();
				},50)
			});
			this.switchBtn.on("click",function(e){
				var tarBtn = $(e.currentTarget);
				var type = tarBtn.hasClass("on") ? "close" : "open";
				if(tarBtn.hasClass("disable")) return false;
				Api.switchOpenOrClose(type,{
					loading : function(){
						tarBtn.addClass("disable");
					},
					removeLoading : function(){
						tarBtn.removeClass("disable");
					},
					success : function(res){
						tarBtn.toggleClass("on");
						var text = tarBtn.hasClass("on") ? "开启成功" : "关闭成功";
						PFT.Help.AlertTo("success",'<p style="width:180">'+text+'</p>');
					},
					fail : function(res){
						var msg = res.msg || "请求出错，请稍后重试";
						alert(msg);
					}
				})
			})
		},
		//获取分销商列表
		fetchList : function(){
			var that = this;
			var venus_id = Api.getVenusId();
			var area_id = Api.getAreaId();
			Api.fetchList(venus_id,area_id,{
				loading : function(){
					that.container.hide();
					that.errorBox.hide();
					that.loadingBox.show();
					$("#searchBtn").addClass("disable");
				},
				removeLoading : function(){
					that.loadingBox.hide();
					$("#searchBtn").removeClass("disable");
				},
				success : function(res){
					var data = res.data;
					var summary = data.summary || {};
					var status = summary.status;
					that.render(data,"success");
					if(status==1){ //开启分销商存
						that.switchBtn.addClass("on")
					}else{ //关闭
						that.switchBtn.removeClass("on")
					}
				},
				empty : function(res){that.render(null,"empty")},
				fail : function(res){that.render(res,"fail")},
				timeout : function(res){that.render(null,"timeout")},
				serverError : function(res){that.render(null,"serverError")}
			})
		},
		//获取分区
		getAreaList : function(callback){
			var that = this;
			Api.getAreaList({
				loading : function(){},
				removeLoading : function(){},
				success : function(res){
					var data = res.data || {};
					var areaList = data.area_list || [];
					if(!areaList.length) return alert("暂无该场馆对应的分区");
					var html = "";
					for(var i in areaList){
						var area = areaList[i];
						var id = area.id;
						var name = area.name;
						html += '<option value="'+id+'">'+name+'</option>';
					}
					that.areaSelect.html(html);
					callback && callback(res);
				},
				fail : function(res){
					var res = res || {};
					var msg = res.msg || "请求分区列表出错，请稍后重试";
					alert(msg);
				}
			})
		},
		render : function(data,type){
			var that = this;
			var tpl = this.tpl;
			var html = "";
			if(type=="success"){
				var list = data.list;
				var summary = data.summary;
				var total = summary.total*1;
				var reserve = summary.reserve*1;
				for(var i in list){
					var d = list[i];
					var total_num = d["total_num"];
					html += that.parseTemplate(tpl,d);
				}
				that.container.show();
				that.listUl.html(html);
				//总库存
				$("#total_total").text(summary.total);
				setTimeout(function(){
					that.listManager.setTotal_unallocated();
				},50)
	
			}else if(type=="empty"){
				that.container.hide();
				that.loadingBox.hide();
				that.errorBox.show().find(".t").text("无匹配条件分销商");
			}else if(type=="fail"){
				var msg = data.msg || "请求出错，请稍后重试";
				that.container.hide();
				that.loadingBox.hide();
				that.errorBox.show().find(".t").text(msg);
			}
		}
	});
	
	module.exports = List;


/***/ },

/***/ 60:
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 16-2-3.
	 */
	var Api = {
		api : "/route/?c=product_storage",
		fn : new Function,
		AJAX_TIMEOUT : 60*1000,
		AJAX_TIMEOUT_TEXT : "请求超时，请稍后重试",
		AJAX_SERVER_ERROR_TEXT : "请求出错，请稍后重试",
		getVenusId : function(){
			return $.trim($("#venueIdHidInp").val());
		},
		//获取默认场次id
		getDefaultRoundId : function(){
			return $.trim($("#default_roundIdHidInp").val());
		},
		getDefaultDate : function(){
			return $.trim($("#default_dateHidInp").val());
		},
		//获取分区id
		getAreaId : function(){
			return $("#areaSelect").val()
		},
		//获取分销商列表
		fetchList : function(venus_id,area_id,opt){
			var that = this;
			var api = that.api+"&a=getListDefault";
			var opt = opt || {};
			var fn = that.fn;
			var ajax_timeout = that.AJAX_TIMEOUT;
			var loading = opt.loading || fn;
			var removeLoaidng = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
			if(!venus_id) return alert("缺少venus_id");
			if(!area_id) return alert("缺少area_id");
			PFT.Ajax({
				url : api,
				type : "post",
				dataType : "json",
				data : {
					venus_id : venus_id,
					area_id : area_id
				},
				ttimeout : ajax_timeout,
				loading : function(){loading()},
				removeLoading : function(){removeLoaidng()},
				timeout : function(res){timeout(res)},
				serverError : function(res){serverError(res)}
			},function(res){
				var res = res || {};
				var code = res.code;
				var data = res.data || {};
				var list = data.list;
				var summary = data.summary || {};
				var msg = res.msg;
				if(code==200){
					if(list.length){
						success(res);
					}else{
						empty(res)
					}
				}else{
					fail(res);
				}
			})
		},
		getAreaList : function(opt){
			var that = this;
			var venus_id = this.getVenusId();
			if(!venus_id) return alert('缺少venus_id');
			var api = that.api+"&a=getConfigDefault";
			var opt = opt || {};
			var fn = that.fn;
			var ajax_timeout = that.AJAX_TIMEOUT;
			var loading = opt.loading || fn;
			var removeLoaidng = opt.removeLoading || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
			PFT.Ajax({
				url : api,
				type : "post",
				dataType : "json",
				ttimeout : ajax_timeout,
				data : {
					venus_id : venus_id
				},
				loading : function(){loading();},
				removeLoading : function(){removeLoaidng();},
				timeout : function(){timeout();},
				serverError : function(){serverError();}
			},function(res){
				var res = res || {};
				var code = res.code;
				if(code==200){
					success(res);
				}else{
					fail(res);
				}
			})
		},
		//开启&&关闭分销库存设置
		//type=open||close
		switchOpenOrClose : function(type,opt){
			var that = this;
			var venus_id = this.getVenusId();
			if(!venus_id) return alert('缺少venus_id');
			var area_id = this.getAreaId();
			if(!area_id) return alert('area_id');
			var action = type=="open" ? "openDefault" : "closeDefault";
			var api = that.api+"&a="+action;
			var opt = opt || {};
			var fn = that.fn;
			var ajax_timeout = that.AJAX_TIMEOUT;
			var loading = opt.loading || fn;
			var removeLoaidng = opt.removeLoading || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
			PFT.Ajax({
				url : api,
				type : "post",
				dataType : "json",
				ttimeout : ajax_timeout,
				data : {
					venus_id : venus_id,
					area_id : area_id
				},
				loading : function(){loading();},
				removeLoading : function(){removeLoaidng();},
				timeout : function(){timeout();},
				serverError : function(){serverError();}
			},function(res){
				var res = res || {};
				var code = res.code;
				if(code==200){
					success(res);
				}else{
					fail(res);
				}
			})
		},
		/**
		 * 保存设置
		 */
		submit : function(data,opt){
			var that = this;
			var api = that.api+"&a=setListDefault";
			var opt = opt || {};
			var fn = that.fn;
			var ajax_timeout = that.AJAX_TIMEOUT;
			var loading = opt.loading || fn;
			var removeLoaidng = opt.removeLoading || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || function(){ alert(that.AJAX_TIMEOUT_TEXT)};
			var serverError = opt.serverError || function(){ alert(that.AJAX_SERVER_ERROR_TEXT)};
			var status = $("#switchStorageBtn").hasClass("on") ? 1 : 0;
			PFT.Ajax({
				url : api,
				type : "post",
				dataType : "json",
				ttimeout : ajax_timeout,
				data : {
					area_id : that.getAreaId(),
					venus_id : that.getVenusId(),
					status : status,
					data : that.stringify(data)
				},
				loading : function(){loading()},
				removeLoading : function(){removeLoaidng()},
				timeout : function(){timeout()},
				serverError : function(){serverError()}
			},function(res){
				var res = res || {};
				var code = res.code;
				var msg = res.msg || "请求出错，请稍后重试";
				if(code==200){
					success(res);
				}else{
					res["msg"] = msg;
					fail(res);
				}
			})
		},
		stringify : function(obj){
			//如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
			if(window.JSON) return JSON.stringify(obj);
			var t = typeof (obj);
			if (t != "object" || obj === null) {
				if (t == "string") obj = '"' + obj + '"';
				return String(obj);
			} else {
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				var self = arguments.callee;
				for (n in obj) {
					v = obj[n];
					t = typeof(v);
					if (obj.hasOwnProperty(n)) {
						if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null)
							v = self(v);
						json.push((arr ? "" : '"' + n + '":') + String(v));
					}
				}
				return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		},
		parse : function(jsonString) {
			if (window.JSON) return window.JSON.parse(jsonString);
			return $.parseJSON(jsonString);
		}
	};
	module.exports = Api;

/***/ },

/***/ 61:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-2-4.
	 */
	var Api = __webpack_require__(60);
	var ListManager = RichBase.extend({
		EVENTS : {
			"click" : {
				"#listContainer .countBtn" : "onCountBtnClick",
				"#submitBtn" : "onSubmitClick"
			},
			"blur" : {
				"#listContainer .countInp" : "onCountInpBlur"
			},
			"focus" : {
				"#listContainer .countInp" : "onCountInpFocus"
			}
		},
		input_last_val : "",
		init : function(){
			this.listUl = $("#listContainer");
		},
		onCountBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			var trParent = tarBtn.parents(".item");
			var tarInp = trParent.find(".countInp");
			var selled = trParent.find(".selled").text()*1;
			var val = $.trim(tarInp.val());
			var newVal = tarBtn.hasClass("add") ? (val*1+1) : (val*1-1);
			that.onCountInpChange(tarInp,newVal,val);
		},
		onCountInpBlur : function(that,e){
			var tarInp = $(e.currentTarget);
			var newVal = $.trim(tarInp.val());
			var oldVal = tarInp.attr("data-lastval");
			if(newVal=="") newVal="0";
			that.onCountInpChange(tarInp,newVal,oldVal);
		},
		onCountInpChange : function(tarInp,newVal,oldVal){
			if(newVal==-1){
				tarInp.val(newVal);
				this.setTotal_unallocated();
			}else{
				if(!PFT.Help.isPositiveNum(newVal,true)) return tarInp.val(oldVal);
				tarInp.val(newVal);
				var unallocated = this.calculate_unallocated();
				var total_all = $("#total_total").text()*1;
				if(total_all-unallocated<0){
					alert("保留库存总和不能超出总库存");
					tarInp.val(oldVal);
					return false;
				}
				this.setTotal_unallocated(unallocated);
			}
		},
		onCountInpFocus : function(that,e){
			var tarInp = $(e.currentTarget);
			tarInp.attr("data-lastval",tarInp.val());
		},
		onSubmitClick : function(that,e){
			var submitBtn = $(e.currentTarget);
			var total_unallocated = $("#total_unallocated").text() * 1;
			var total_total = $("#total_total").text() * 1;
			if(total_unallocated<0) return alert("保留库存总和不能大于总库存"+total_total);
			if(submitBtn.hasClass("disable")) return false;
			var data = [];
			$("#listContainer").children(".item").each(function(){
				var tarItem = $(this);
				var tarInp = tarItem.find(".countInp");
				var id = tarInp.attr("data-id");
				var val = tarInp.val();
				data.push({
					"reseller_id" : id,
					"total_num" : val
				})
			})
			Api.submit(data,{
				loading : function(){
					submitBtn.addClass("disable").text("正在保存...");
				},
				removeLoading : function(){
					submitBtn.removeClass("disable").text("保存配置")
				},
				timeout : function(){ alert(Api.AJAX_TIMEOUT_TEXT)},
				serverError : function(){ alert(Api.AJAX_SERVER_ERROR_TEXT)},
				success : function(res){
					PFT.Help.AlertTo("success",'<p style="width:200px">保存成功</p>');
				},
				fail : function(res){ alert(res.msg)}
			})
		},
		calculate_unallocated : function(){
			var total = 0;
			this.listUl.children(".item").each(function(){
				var tarItem = $(this);
				var save = $.trim(tarItem.find(".countInp").val())*1;
				if(save==-1) return true;
				total = total+save;
			})
			return total;
		},
		setTotal_unallocated : function(unallocated){
			var total_all = $("#total_total").text()*1;
			var unallocated = typeof unallocated=="undefined" ? this.calculate_unallocated() : unallocated;
			$("#total_unallocated").text(total_all-unallocated);
		}
	});
	module.exports = ListManager;

/***/ },

/***/ 62:
/***/ function(module, exports) {

	module.exports = "<tr class=\"item\" data-id=\"<%=id%>\">\r\n    <td class=\"ltTxt\">\r\n        <span></span>\r\n        <span class=\"colorGray\"><%=name%>（<%=account%>）</span>\r\n    </td>\r\n    <td>\r\n        <a class=\"iconfont countBtn minu\" href=\"javascript: void(0);\">&#xe6b5;</a>\r\n        <input data-id=\"<%=id%>\" class=\"baseInp countInp\" type=\"text\" value=\"<%=total_num%>\"/>\r\n        <a class=\"iconfont countBtn add \" href=\"javascript: void(0);\">&#xe649;</a>\r\n    </td>\r\n    <td class=\"total\" style=\"color:#c4c4c4; text-align:left; padding-left:10px;\">-1表示使用未分配库存</td>\r\n</tr>";

/***/ }

/******/ });
//# sourceMappingURL=yx_storage_normal.all.js.map