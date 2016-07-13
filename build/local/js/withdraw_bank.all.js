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
	 * Author: huangzhiyang
	 * Date: 2016/7/11 11:01
	 * Description: ""
	 */
	__webpack_require__(1)
	var Dialog = __webpack_require__(5);
	var BankManager = function(){
		this.bankListUl = $("#bankListUl");
		this.addBankBtn = $("#addbk");
		this.Dialog = new Dialog();
		this.bindEvents();
	}
	BankManager.prototype = {
		bindEvents : function(){
			var that = this;
			var Dialog = this.Dialog;
			//添加银行��?
			this.addBankBtn.on("click",function(e){
				var type = $(e.currentTarget).attr("type");
				Dialog.open({
					mode : "create",
					type : type
				});
			})
			this.bankListUl.on("click",".click_li",function(e){
				var tarLi = $(e.currentTarget);
				tarLi.addClass("checked").siblings("li").removeClass("checked");
			})
			//配置银行��?
			this.bankListUl.on("click",".card_config",function(e){
				var tarBtn = $(e.currentTarget);
				var province_id = tarBtn.attr("bank_province");
				var city_id = tarBtn.attr("bank_city");
				var bank_id = tarBtn.attr("bank_id");
				var card_number = tarBtn.attr("bank_num");
				var username = tarBtn.attr("username");
				var subBank_id = tarBtn.attr("code");
				var type = tarBtn.attr("type");
				var acc_type = tarBtn.attr("acc_type");
				Dialog.open({
					mode : "edit",
					bank_id : bank_id,
					subBank_id : subBank_id,
					province_id : province_id,
					city_id : city_id,
					card_number : card_number,
					account_name : username,
					type : type,
					card_type : acc_type
				})
			})
			//删除银行��?
			this.bankListUl.on("click",".delete",function(e){
				var tarBtn = $(e.currentTarget);
				if(tarBtn.hasClass("disable")) return false;
				if(!confirm("确定要删除该银行卡？")) return false;
				var bankname = tarBtn.attr("bankname");
				that.deleteCard(bankname,tarBtn);
			})
			this.Dialog.on("submit",function(data){
				var submitBtn = data.submitBtn;
				var submitData = data.submitData;
				var mode = data.mode;
				that.submit(submitBtn,submitData,mode)
			})
	
		},
		//添加、配置银行卡
		submit : function(submitBtn,submitData,mode){
			var tip = mode=="create" ? "添加" : "配置";
			PFT.Util.Ajax("call/handle.php?from=withdraw_card",{
				type : "post",
				params : submitData,
				loading : function(){
					submitBtn.addClass("disable");
				},
				complete : function(){
					submitBtn.removeClass("disable");
				},
				success : function(res){
					res = res || {};
					if(res.outcome==1){
						window.location.reload();
					}else{
						alert(tip+"失败，失败原因：\n"+(res.msg || PFT.AJAX_ERROR_TEXT));
					}
				}
			})
		},
		deleteCard : function(bankname,tarBtn){
			if(!bankname) return false;
			var url = "call/handle.php?from=withdraw_dele&bankaccount="+bankname;
			PFT.Util.Ajax(url,{
				loading : function(){
					tarBtn.addClass("disable").text("正在删除...");
				},
				complete : function(){
					tarBtn.removeClass("disable").text("删除");
				},
				success : function(res){
					res = res || {};
					if(res.outcome==1){
						window.location.reload();
					}else{
						alert("删除失败");
					}
				}
			})
		}
	};
	
	$(function(){
		new BankManager();
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
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/7/11 11:48
	 * Description: ""
	 */
	__webpack_require__(6);
	var Select = __webpack_require__(8);
	var Dialog = __webpack_require__(12);
	var dialog_content = __webpack_require__(19);
	var Api = __webpack_require__(20);
	var Main = function(){
		var that = this;
		this.dialog = new Dialog({
			width : 750,
			content : dialog_content,
			drag : true,
			speed : 100,
			events : {
				"keyup #bankCardNumInp" : function(e){
					that.onBankCardNumInpKeyup(e);
				},
				"focus #bankCardNumInp" : function(e){
					that.onBankCardNumInpKeyup(e);
				},
				"blur #bankCardNumInp" : function(e){
					that.onBankCardNumInpBlur(e);
				},
				"click #bankDialog-submitBtn" : function(e){
					that.onSubmitBtnClick(e);
				}
			},
			onReady : function(){
				that.bankSelect = $("#bankName");
				that.provSelect = $("#provSelect");
				that.citySelect = $("#citySelect");
				that.bankSelect.on("change",function(e){
					var bank_id = $(this).val();
					var city_id = that.citySelect.val();
					that.getBankBranch(bank_id,city_id);
				})
				that.provSelect.on("change",function(e){
					var provId = that.provSelect.val();
					that.getCityByProvId(provId);
				})
				that.citySelect.on("change",function(e){
					var bank_id = that.bankSelect.val();
					var city_id = $(this).val();
					that.getBankBranch(bank_id,city_id);
				})
			}
		})
	};
	Main.prototype = {
		__bankList : null,
		__province : null,
		__ifCache : true,
		__cityCache : {},
		__bankCache : {},
		__initOption : null,
		onBankCardNumInpKeyup : function(e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			var bankCopyBox = $("#bankCopyBox");
			var format = val.replace(/(.{4})/g,function($1){
				return $1+" ";
			});
			if(!val) return bankCopyBox.hide().text("");
			bankCopyBox.show().text(format);
		},
		onBankCardNumInpBlur : function(e){
			$("#bankCopyBox").hide();
		},
		onSubmitBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			var bankCardNumInp = $("#bankCardNumInp");
			var usernameInp = $("#bankCardAccount");
			var bank_account = $.trim(bankCardNumInp.val());
			if(!bank_account) return alert("请输入银行卡号/存折号");
			if(!/^\d*$/.test(bank_account)) return alert("银行卡号格式错误");
			var account_name = $.trim(usernameInp.val());
			if(!account_name) return alert("请填写开户姓名");
			var subBank = this.subBankSelect.getValue();
			var bank_code = subBank.id;
			var bank_name = subBank.name;
			var acc_type = $("#cardTypeSelect").val();
			var type = this.__initOption.type;
			var mode = this.__initOption.mode;
	
			var submitData = {
				bank_name : bank_name,            //支行名称
				bank_code : bank_code,            //支行行号
				bank_account : bank_account,      //银行卡号
				account_name : account_name,      //开户人姓名
				acc_type : acc_type,              //银行卡类别
				type : type                       //编辑的是第几张银行卡
			};
	
			this.dialog.close();
			this.dialog.trigger("submit",{
				submitBtn : tarBtn,
				submitData : submitData,
				mode : mode
			});
	
		},
		serializeParams : function(opt){
			var res = [];
			for(var i in opt) res.push(i+"="+opt[i]);
			return res.join("&");
		},
		getBankList : function(){
			var that = this;
			PFT.Util.Ajax(Api.url("getList"),{
				type : "post",
				loading : function(){},
				complete : function(){},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					var list = data.list;
					var province = data.province;
					if(res.code==200){
						that.__bankList = list;
						that.__province = province;
						var bankHtml = "";
						var provHtml = "";
						for(var i in list){
							var d = list[i];
							var code = d["code"];
							var name = d["name"];
							bankHtml += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
						}
						for(var p in province){
							var d = province[p];
							var code = d["code"];
							var name = d["name"];
							provHtml += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
						}
						that.bankSelect.html(bankHtml);
						that.provSelect.html(provHtml);
						var init_bank_id = that.__initOption.bank_id;
						var init_province_id = that.__initOption.province_id;
						if(init_bank_id) that.bankSelect.attr("value",init_bank_id);
						if(init_province_id){
							that.provSelect.attr("value",init_province_id);
							that.getCityByProvId(init_province_id);
						}else{
							that.getCityByProvId(province[0]["code"]);
						}
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		getCityByProvId : function(id){
			if(!id) return false;
			var that = this;
			var ifCache = this.__ifCache;
			var Cache = this.__cityCache[id];
			var init_city_id = that.__initOption.city_id;
			var renderOption = function(list){
				var html = "";
				for(var i in list){
					var d = list[i];
					var code = d["code"];
					var name = d["name"];
					html += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
				}
				var bank_id = that.bankSelect.val();
				var _cityid = init_city_id ? init_city_id : list[0]["code"];
				if(bank_id) that.getBankBranch(bank_id,_cityid);
				return html;
			};
			if(ifCache && Cache){
				that.citySelect.html(renderOption(Cache));
				if(init_city_id) that.citySelect.attr("value",init_city_id);
			}else{
				PFT.Util.Ajax(Api.url("cityList"),{
					type : "post",
					params : {
						province_id : id
					},
					loading : function(){},
					complete : function(){},
					success : function(res){
						res = res || {};
						var data = res.data || {};
						var list = data.list;
						if(res.code==200){
							that.citySelect.html(renderOption(list));
							if(init_city_id) that.citySelect.attr("value",init_city_id);
							if(ifCache) that.__cityCache[id] = list;
						}else{
							alert(res.msg || PFT.AJAX_ERROR_TEXT);
						}
					}
				})
			}
			if(init_city_id) that.__initOption["city_id"] = "";
		},
		getBankBranch : function(bank_id,city_id,name,page,size){
			if(!bank_id || !city_id) return false;
			var that = this;
			name = name || "";
			page = page || 1;
			size = size || 200;
			var ifCache = this.__ifCache;
			var params = this.serializeParams({
				bank_id : bank_id,
				city_id : city_id,
				name : name,
				page : page,
				size : size
			});
			var Cache = this.__bankCache[params];
			var init_subBank_id = this.__initOption.subBank_id;
			if(ifCache && Cache){
				that.subBankSelect.refresh(Cache);
				if(init_subBank_id) that.subBankSelect.setValue(init_subBank_id);
			}else{
				PFT.Util.Ajax(Api.url("subbranchList"),{
					type : "post",
					params : {
						bank_id : bank_id,
						city_id : city_id,
						name : name,
						page : page,
						size : size
					},
					loading : function(){},
					complete : function(){},
					success : function(res){
						res = res || {};
						var data = res.data || {};
						var list = data.list;
						if(res.code==200){
							if(!that.subBankSelect){
								that.subBankSelect = that.initSubBankSelect(list);
							}else{
								that.subBankSelect.refresh(list);
							}
							if(init_subBank_id) that.subBankSelect.setValue(init_subBank_id);
							if(ifCache) that.__bankCache[params] = list;
						}else{
							alert(res.msg || PFT.AJAX_ERROR_TEXT)
						}
					}
				})
			}
			if(init_subBank_id) this.__initOption["subBank_id"] = "";
		},
		initSubBankSelect : function(data){
			this.subBankSelect = new Select({
				trigger : $("#subBranchName"),
				height : 300,
				filter : true,
				data : data,
				field : {
					id : "code",
					name : "name"
				}
			})
			this.subBankSelect.on("open",function(){
				$("#subBranchBankBox").addClass("on");
			});
			this.subBankSelect.on("close",function(){
				$("#subBranchBankBox").removeClass("on");
			})
			return this.subBankSelect;
		},
		open : function(opt){
			var that = this;
			opt = opt || {};
			//opt = {
			//	type : "",
			//	bank_id : "",
			//	subBank_id : "",
			//	province_id : "",
			//	city_id : "",
			//	card_number : "",
			//	account_name : "",
			//	card_type : ""
			//};
			this.__initOption = opt;
			this.dialog.open({
				onAfter : function(){
					if(!that.__bankList && !that.__province) that.getBankList();
					var card_number = opt.card_number || "";
					var account_name = opt.account_name || "";
					var card_type = opt.card_type;
					$("#bankCardNumInp").val(card_number);
					$("#bankCardAccount").val(account_name);
					if(card_type) $("#cardTypeSelect").attr("value",card_type);
				}
			});
		},
		on : function(type,fn){
			this.dialog.on(type,fn);
		}
	};
	module.exports = Main;

/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/14 11:14
	 * Description: 项目时间紧迫，主体功能先实现，更多功能后续会慢慢增加
	 */
	__webpack_require__(9);
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
			return __webpack_require__(11);
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
		//格式需为:[{key1:value1,key2:value2}] 此时将忽略source,adaptor参数
		data : null
	};
	var __uuid = (function(){
		var _id = 1;
		return function(){
			return _id++;
		}
	})();
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
			this.__uid = __uuid();
			var trigger = this.trigger = typeof opt.trigger==="string" ? $("#"+opt.trigger.substr(opt.trigger.indexOf("#")+1)) : opt.trigger;
			this.triggerId = this.trigger.attr("id");
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
			var id = this.__uid;
			var selectBox = this.selectBox = $('<div id="gSelectDownBox_'+id+'" style="display:none;width:'+width+'px;height:'+height+'px" class="gSelectDownBox"></div>');
			selectBox.append(tpl);
			$("body").append(selectBox);
			return this.selectBox;
		},
		//创建遮罩层
		createMask : function(){
			if(this.mask) return this.mask;
			var id = this.__uid;
			this.mask = $('<div id="gSelectMask_'+id+'" style="display:none" class="gSelectMask"></div>');
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
			var trigger = $("#"+this.triggerId);
			var selectBox = this.createSelectBox();
			var of = trigger.offset();
			var offset = this.opt.offset;
			var scrollTop = $(window).scrollTop();
			var trigger_h = trigger.outerHeight(true);
			selectBox.css({
				left : of.left + (offset.left || 0),
				top : (of.top-scrollTop) + trigger_h + (offset.top || 0)
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
			this.createMask().show().css({zIndex:503});
			this.createSelectBox().show().css({zIndex:504});
			this.position();
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
		setValue : function(id){
			if(!id) return false;
			var field = this.opt.field;
			var id_field = field.id;
			var selectBox = this.createSelectBox();
			selectBox.find(".gSelectOptionItem").filter("[data-"+id_field+"="+id+"]").trigger("click");
		},
		on : function(type,callback){
			if(!type) return false;
			callback = typeof callback=="function" ? callback : function(){};
			PFT.Util.PubSub.on(type,callback);
		},
		refresh : function(data){
			this.__cacheData = data;
			this.listUl.html(this.updateListUl(data));
		}
	};
	
	module.exports = Select;


/***/ },
/* 9 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gSelectDownBoxCon\">\r\n    <div class=\"selectTopCon\">\r\n        <div class=\"searchBox\">\r\n            <div class=\"searchBoxCon\">\r\n                <input type=\"text\" name=\"\" class=\"gSelectSearchInp\"/>\r\n                <i class=\"iconfont search\">&#xe60a;</i>\r\n                <span class=\"clearSearchBtn\"><i class=\"iconfont\">&#xe674;</i></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <ul class=\"selectOptionUl\"></ul>\r\n</div>\r\n\r\n";

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/21 10:04
	 * Description: ""
	 */
	__webpack_require__(13);
	var WinWidthHeight = __webpack_require__(15);
	var Drag = __webpack_require__(16);
	var PubSub = __webpack_require__(17);
	var Extend = __webpack_require__(18);
	var fn = new Function();
	var Defaults = {
		width : "",
		height : "",
		closeBtn : true,
		content : "",
		drag : false,
		speed : 200,
		offsetX : 0,
		offsetY : 0,
		overlay : true,
		headerHeightMin : 46,
		events : {},
		onReady : fn,
		onOpenBefore : fn,
		onOpenAfter : fn,
		onCloseBefore : fn,
		onCloseAfter : fn,
		onDragBefore : fn,
		onDrag : fn,
		onDragAfter : fn
	};
	var getUid = (function(){
		var uid = 0;
		return function(){
			return uid++;
		}
	})();
	var Dialog = function(opt){
		var that = this;
		var opt = this.opt = $.extend(Defaults,opt||{});
		this.uid = getUid();
		this.flag = "gSimpleDialog-";
		this.id = this.flag + this.uid + "-";
		var container = this.container = $('<div></div>');
		$("body").append(container);
		container.attr({
			id : this.id + "container"
		}).addClass(this.flag + "container").addClass(this.id+"container");
		if(typeof opt.width=="number") container.width(opt.width);
		if(typeof opt.height=="number") container.height(opt.height);
	
		var header = this.header = $('<div></div>');
		header.attr({id : this.id+"header"})
			  .addClass(this.flag + "header").addClass(this.id+"header")
			  .css({minHeight:opt.headerHeightMin}).appendTo(container);
		if(opt.header){
			var header_tpl = typeof opt.header=="function" ? opt.header() : opt.header;
			header.prepend(header_tpl);
		}
		var content = this.content = $('<div></div>');
		content.attr({id : this.id + "content"})
			   .addClass(this.flag + "content")
			   .addClass(this.id + "content")
			   .appendTo(container)
		       .html(typeof opt.content=="function" ? opt.content() : opt.content);
		var closeBtn = this.closeBtn = $('<div>×</div>');
		closeBtn.attr({id : this.id+"closeBtn"})
			.addClass(this.flag + "closeBtn")
			.addClass(this.id + "closeBtn")
			.appendTo(container);
		var hh = header.height();
		closeBtn.css({width:hh+6,height:hh,lineHeight:hh-4+"px"});
		if(!opt.closeBtn) closeBtn.addClass("hidden");
		closeBtn.on("click",function(){
			that.close();
		})
		this.init(opt);
	};
	Dialog.prototype = Extend({
		init : function(opt){
			var that = this;
			var events = this.events = opt.events;
			var container = this.container;
			for(var i in events){
				//"click .parent .children" => "click:.parent .children"
				var _key = i.replace(/(\w*)\s(.*)/,function(str,p1,p2){
					return p1+":"+p2;
				}).split(":");
				(function(_key){
					var eventType = _key[0];
					var selector = _key[1];
					var handler = events[i];
					container.on(eventType,selector,function(e){
						if(typeof handler=="function"){
							handler(e);
						}else if(typeof handler=="string"){
							that.prototype[handler](e);
						}
					})
				})(_key);
			}
			setTimeout(function(){
				if(opt.drag){
					Drag({
						trigger : that.header[0],
						target : that.container[0],
						onMousedown : function(e){
							opt.onDragBefore(e);
						},
						onMousemove : function(e){
							opt.onDrag(e);
						},
						onMouseup : function(e){
							opt.onDragAfter(e);
						}
					})
				}
			},10)
			this.position();
			opt.onReady();
		},
		position : function(){
			var container = this.container;
			var height = container.height();
			var width = container.width();
			var WinWH = WinWidthHeight();
			var offsetX = this.opt.offsetX;
			container.css({
				left : (WinWH.width-width)/2 + offsetX,
				top : -height + 10
			}).hide();
		},
		getMask : function(){
			var mask = $("#"+this.flag+"mask");
			if(mask.length) return mask;
			mask = $('<div></div>');
			mask.attr({
				id : this.flag + "mask",
				class : this.flag + "mask"
			}).appendTo($("body"));
			return mask;
		},
		open : function(opt){
			opt = opt || {};
			var that = this;
			var overlay = typeof opt.overlay=="undefined" ? this.opt.overlay : !!opt.overlay;
			var speed = opt.speed || this.opt.speed;
			var offsetY = opt.offsetY || this.opt.offsetY;
			var onBefore = opt.onBefore || this.opt.onOpenBefore;
			var onAfter = opt.onAfter || this.opt.onOpenAfter;
			var winH = WinWidthHeight().height;
			var containerH = this.container.height();
			this.position();
			this.container.show().css({zIndex:501});
			onBefore();
			this.container.animate({
				top : (winH-containerH)/2 + offsetY
			},speed,function(){
				onAfter();
			})
			if(overlay) this.getMask().fadeIn(function(){
				that.getMask().css("zIndex",500);
			});
		},
		close : function(opt){
			opt = opt || {};
			var container = this.container;
			var speed = opt.speed || this.opt.speed;
			var onBefore = opt.onBefore || this.opt.onCloseBefore;
			var onAfter = opt.onAfter || this.opt.onCloseAfter;
			var containerH = container.height();
			onBefore();
			container.animate({
				top : -(containerH+10)
			},speed,function(){
				onAfter();
				container.hide().css({zIndex:-1});
			})
			var mask = $("#"+this.flag+"mask");
			mask.fadeOut(function(){
				mask.css("zIndex",0)
			});
		}
	},PubSub);
	module.exports = Dialog;

/***/ },
/* 13 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 14 */,
/* 15 */
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
/* 16 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/22 19:07
	 * Description: ""
	 */
	var win = window;
	var	doc = win.document,
		docElem = doc.documentElement;
	var	body = doc.body,
		isIE = !-[1,],	// 判断IE6/7/8 不能判断IE9
		isIE6 = isIE && /msie 6/.test( navigator.userAgent.toLowerCase() ), // 判断IE6
		uuid = 1,
		expando = 'cache' + ( +new Date() + "" ).slice( -8 ),  // 生成随机数
		cacheData = {
			/**
			 *	1 : {
		 *		eclick : [ handler1, handler2, handler3 ];
		 *		clickHandler : function(){ //... };
		 *	}
			 */
		};
	var capitalize = function( str ){
		var firstStr = str.charAt(0);
		return firstStr.toUpperCase() + str.replace( firstStr, '' );
	};
	/**
	 * 获取滚动条的位置
	 * @param { String } 'top' & 'left'
	 * @return { Number }
	 */
	var getScroll = function( type ){
		var upType = capitalize( type );
		return document.documentElement['scroll' + upType] || body['scroll' + upType];
	};
	/**
	 * 获取元素在页面中的位置
	 * @param { Object } DOM元素
	 * @param { String } 'top' & 'left'
	 * @return { Number }
	 */
	var getOffset = function( elem, type ){
		var upType = capitalize( type ),
			client  = docElem['client' + upType]  || body['client' + upType]  || 0,
			scroll  = getScroll( type ),
			box = elem.getBoundingClientRect();
	
		return Math.round( box[type] ) + scroll - client;
	};
	
	var Drag = function(opt){
		opt = opt || {};
		var target = opt.trigger;
		var moveElem = opt.target;
		var opt_onMousedown = opt.onMousedown || function(){};
		var opt_onMousemove = opt.onMousemove || function(){};
		var opt_onMouseup = opt.onMouseup || function(){};
		target.style.cursor = "move";
		// 清除文本选择
		var	clearSelect = 'getSelection' in win ? function(){
				win.getSelection().removeAllRanges();
			} : function(){
				try{
					doc.selection.empty();
				}
				catch( e ){};
			},
	
			self = this,
			event = Drag.event,
			isDown = false,
			newElem = isIE ? target : doc,
			//fixed = moveElem.style.position === 'fixed',
			fixed = true,
			_fixed = true;
	
		// mousedown
		var down = function( e ){
			isDown = true;
			var scrollTop = getScroll( 'top' ),
				scrollLeft = getScroll( 'left' ),
				edgeLeft = fixed ? 0 : scrollLeft,
				edgeTop = fixed ? 0 : scrollTop;
	
			Drag.data( 'dragData', {
				x : e.clientX - getOffset( moveElem, 'left' ) + ( fixed ? scrollLeft : 0 ),
				y : e.clientY - getOffset( moveElem, 'top' ) + ( fixed ? scrollTop : 0 ),
				// 设置上下左右4个临界点的位置
				// 固定定位的临界点 = 当前屏的宽、高(下、右要减去元素本身的宽度或高度)
				// 绝对定位的临界点 = 当前屏的宽、高 + 滚动条卷起部分(下、右要减去元素本身的宽度或高度)
				el : edgeLeft,	// 左临界点
				et : edgeTop,  // 上临界点
				er : edgeLeft + docElem.clientWidth - moveElem.offsetWidth,  // 右临界点
				eb : edgeTop + docElem.clientHeight - moveElem.offsetHeight  // 下临界点
			});
	
			if( isIE ){
				// IE6如果是模拟fixed在mousedown的时候先删除模拟，节省性能
				if( isIE6 && _fixed ){
					moveElem.style.removeExpression( 'top' );
				}
				target.setCapture();
			}
	
			event.bind( newElem, 'mousemove', move );
			event.bind( newElem, 'mouseup', up );
	
			if( isIE ){
				event.bind( target, 'losecapture', up );
			}
	
			opt_onMousedown(e);
	
			e.stopPropagation();
			e.preventDefault();
	
		};
	
		event.bind( target, 'mousedown', down );
	
		// mousemove
		var move = function( e ){
			if( !isDown ) return;
			clearSelect();
			var dragData = Drag.data( 'dragData' ),
				left = e.clientX - dragData.x,
				top = e.clientY - dragData.y,
				et = dragData.et,
				er = dragData.er,
				eb = dragData.eb,
				el = dragData.el,
				style = moveElem.style;
	
			// 设置上下左右的临界点以防止元素溢出当前屏
			style.marginLeft = style.marginTop = '0px';
			style.left = ( left <= el ? el : (left >= er ? er : left) ) + 'px';
			style.top = ( top <= et ? et : (top >= eb ? eb : top) ) + 'px';
	
			opt_onMousemove(e);
	
			e.stopPropagation();
		};
	
		// mouseup
		var up = function( e ){
			isDown = false;
			if( isIE ){
				event.unbind( target, 'losecapture', up );
			}
			event.unbind( newElem, 'mousemove', move );
			event.unbind( newElem, 'mouseup', up );
			if( isIE ){
				target.releaseCapture();
				// IE6如果是模拟fixed在mouseup的时候要重新设置模拟
				if( isIE6 && _fixed ){
					var top = parseInt( moveElem.style.top ) - self.getScroll( 'top' );
					moveElem.style.setExpression('top',"fuckIE6=document.documentElement.scrollTop+" + top + '+"px"');
				}
			}
	
			opt_onMouseup(e);
	
			e.stopPropagation();
		};
	};
	/**
	 * 设置并返回缓存的数据 关于缓存系统详见：http://stylechen.com/cachedata.html
	 * @param { String / Object } 任意字符串或DOM元素
	 * @param { String } 缓存属性名
	 * @param { Anything } 缓存属性值
	 * @return { Object }
	 */
	Drag.data = function( elem, val, data ){
		if( typeof elem === 'string' ){
			if( val !== undefined ){
				cacheData[elem] = val;
			}
			return cacheData[elem];
		}
		else if( typeof elem === 'object' ){
			// 如果是window、document将不添加自定义属性
			// window的索引是0 document索引为1
			var index = elem === win ? 0 :
					elem.nodeType === 9 ? 1 :
						elem[expando] ? elem[expando] :
							(elem[expando] = ++uuid),
	
				thisCache = cacheData[index] ? cacheData[index] : ( cacheData[index] = {} );
	
			if( data !== undefined ){
				// 将数据存入缓存中
				thisCache[val] = data;
			}
			// 返回DOM元素存储的数据
			return thisCache[val];
		}
	};
	/**
	 * 删除缓存
	 * @param { String / Object } 任意字符串或DOM元素
	 * @param { String } 要删除的缓存属性名
	 */
	Drag.removeData = function( elem, val ){
		if( typeof elem === 'string' ){
			delete cacheData[elem];
		}
		else if( typeof elem === 'object' ){
			var index = elem === win ? 0 :
				elem.nodeType === 9 ? 1 :
					elem[expando];
	
			if( index === undefined ) return;
			// 检测对象是否为空
			var isEmptyObject = function( obj ) {
					var name;
					for ( name in obj ) {
						return false;
					}
					return true;
				},
			// 删除DOM元素所有的缓存数据
				delteProp = function(){
					delete cacheData[index];
					if( index <= 1 ) return;
					try{
						// IE8及标准浏览器可以直接使用delete来删除属性
						delete elem[expando];
					}
					catch ( e ) {
						// IE6/IE7使用removeAttribute方法来删除属性(document会报错)
						elem.removeAttribute( expando );
					}
				};
	
			if( val ){
				// 只删除指定的数据
				delete cacheData[index][val];
				if( isEmptyObject( cacheData[index] ) ){
					delteProp();
				}
			}
			else{
				delteProp();
			}
		}
	};
	// 事件处理系统
	Drag.event = {
	
		bind : function( elem, type, handler ){
			var events = Drag.data( elem, 'e' + type ) || Drag.data( elem, 'e' + type, [] );
			// 将事件函数添加到缓存中
			events.push( handler );
			// 同一事件类型只注册一次事件，防止重复注册
			if( events.length === 1 ){
				var eventHandler = this.eventHandler( elem );
				Drag.data( elem, type + 'Handler', eventHandler );
				if( elem.addEventListener ){
					elem.addEventListener( type, eventHandler, false );
				}
				else if( elem.attachEvent ){
					elem.attachEvent( 'on' + type, eventHandler );
				}
			}
		},
	
		unbind : function( elem, type, handler ){
			var events = Drag.data( elem, 'e' + type );
			if( !events ) return;
	
			// 如果没有传入要删除的事件处理函数则删除该事件类型的缓存
			if( !handler ){
				events = undefined;
			}
			// 如果有具体的事件处理函数则只删除一个
			else{
				for( var i = events.length - 1, fn = events[i]; i >= 0; i-- ){
					if( fn === handler ){
						events.splice( i, 1 );
					}
				}
			}
			// 删除事件和缓存
			if( !events || !events.length ){
				var eventHandler = Drag.data( elem, type + 'Handler' );
				if( elem.addEventListener ){
					elem.removeEventListener( type, eventHandler, false );
				}
				else if( elem.attachEvent ){
					elem.detachEvent( 'on' + type, eventHandler );
				}
				Drag.removeData( elem, type + 'Handler' );
				Drag.removeData( elem, 'e' + type );
			}
		},
	
		// 依次执行事件绑定的函数
		eventHandler : function( elem ){
			return function( event ){
				event = Drag.event.fixEvent( event || win.event );
				var type = event.type,
					events = Drag.data( elem, 'e' + type );
	
				for( var i = 0, handler; handler = events[i++]; ){
					if( handler.call(elem, event) === false ){
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		},
	
		// 修复IE浏览器支持常见的标准事件的API
		fixEvent : function( e ){
			// 支持DOM 2级标准事件的浏览器无需做修复
			if ( e.target ) return e;
			var event = {}, name;
			event.target = e.srcElement || document;
			event.preventDefault = function(){
				e.returnValue = false;
			};
			event.stopPropagation = function(){
				e.cancelBubble = true;
			};
			// IE6/7/8在原生的window.event中直接写入自定义属性
			// 会导致内存泄漏，所以采用复制的方式
			for( name in e ){
				event[name] = e[name];
			}
			return event;
		}
	};
	
	module.exports = Drag;

/***/ },
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ function(module, exports) {

	module.exports = "<div id=\"bankDialogCxtContainer\" class=\"bankDialogCxtContainer\">\r\n    <form id=\"bankForm\">\r\n        <div class=\"bankTitle\">添加配置银行卡</div>\r\n        <div class=\"line\">\r\n            <div class=\"lineLeft\">\r\n                <label for=\"\"><span class=\"warningTip\">*</span>银行:</label>\r\n            </div>\r\n            <div class=\"lineright\">\r\n                <select id=\"bankName\" class=\"bankName selectInp\"></select>\r\n                <span class=\"tip\">请选择开户行</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"line\">\r\n            <div class=\"lineLeft\">\r\n                <label for=\"\"><span class=\"warningTip\">*</span>选择地区:</label>\r\n            </div>\r\n            <div class=\"lineright\">\r\n                <select id=\"provSelect\" class=\"selectPro selectAreaInp\"></select>\r\n                <select id=\"citySelect\" class=\"selectCity selectAreaInp\"></select>\r\n                <span class=\"tip\">请选择地区</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"line\">\r\n            <div class=\"lineLeft\">\r\n                <label for=\"\"><span class=\"warningTip\">*</span>开户支行:</label>\r\n            </div>\r\n            <div id=\"subBranchBankBox\" class=\"lineright subBranchBankBox\">\r\n                <input readonly style=\"width:365px; height:22px; line-height:22px;\" type=\"text\" name=\"\" id=\"subBranchName\" class=\"subBranchName selectInp\"/>\r\n                <i class=\"iconfont tri up\">&#xe695;</i>\r\n                <i class=\"iconfont tri down\">&#xe673;</i>\r\n                <!--<select id=\"subBranchName\" class=\"subBranchName selectInp\"></select>-->\r\n                <span class=\"tip\">请填写开户支行</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"line\">\r\n            <div class=\"lineLeft\">\r\n                <label for=\"\"><span class=\"warningTip\">*</span>银行卡/存折号:</label>\r\n            </div>\r\n            <div class=\"lineright\">\r\n                <input id=\"bankCardNumInp\" class=\"bankCard textInp\"/>\r\n                <span class=\"tip\">请准确填写银行卡号</span>\r\n                <div id=\"bankCopyBox\" class=\"bankCopyBox\">928349238492348</div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"line\">\r\n            <div class=\"lineLeft\">\r\n                <label for=\"\"><span class=\"warningTip\">*</span>开户姓名:</label>\r\n            </div>\r\n            <div class=\"lineright\">\r\n                <input id=\"bankCardAccount\" class=\"bankCard textInp\"/>\r\n                <span class=\"tip\">请准确填写开户姓名用以核对</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"line\">\r\n            <div class=\"lineLeft\">\r\n                <label for=\"\"><span class=\"warningTip\">*</span>银行卡类别</label>\r\n            </div>\r\n            <div class=\"lineright\">\r\n                <select id=\"cardTypeSelect\" class=\"bankCard selectInp\">\r\n                    <option value=\"0\">借记卡</option>\r\n                    <option value=\"1\">存折</option>\r\n                    <option value=\"2\">贷记卡(信用卡)</option>\r\n                    <option value=\"3\">公司账号</option>\r\n                </select>\r\n                <span class=\"tip\"></span>\r\n            </div>\r\n        </div>\r\n        <div class=\"line\" style=\"margin-top:20px\">\r\n            <a href=\"javascript:void(0)\" class=\"submitBtn\" id=\"bankDialog-submitBtn\">确认提交</a>\r\n        </div>\r\n    </form>\r\n</div>";

/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/7/11 14:53
	 * Description: 文档在：http://git.12301.io/PFT/PFT_Documents/src/master/%E9%93%B6%E8%A1%8C%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3.md
	 */
	var fn = new Function;
	var Defaults = {
		loading : fn,
		complete : fn,
		success : fn,
		empty : fn,
		fail : fn,
		error : fn
	};
	var Api = {
		url : PFT.Config.Api.get("Finance_Banks")
	};
	module.exports = Api;

/***/ }
/******/ ]);
//# sourceMappingURL=withdraw_bank.all.js.map