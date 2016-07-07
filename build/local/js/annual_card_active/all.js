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
	var Api = __webpack_require__(5);
	var ReadPhysicsCard = __webpack_require__(6);
	var CheckExistDialog = __webpack_require__(7);
	var ProvCitySelect = __webpack_require__(18);
	var Fileupload = __webpack_require__(20);
	var MainView = Backbone.View.extend({
		time : 60,  //获取验证码的间隔时间 60s
		timer : null,
		el : $("#cardContainer"),
		events : {
			"click #readCardBtn" : "onReadCardBtnClick",
			"click #getVCodeBtn" : "onGetVCodeBtnClick",
			"click #activateBtn" : "onActiveBtnClick",
			//"blur .textInp" : "onTextInpBlur",
			"focus .textInp" : "onTextInpFocus",
			"keyup #cardInp" : "onCardInpKeyup",
			"click #clearCardInpBtn" : "onClearCardInpBtnClick"
		},
		initialize : function(){
			var that = this;
			this.cardInp = $("#cardInp");
			this.readCardBtn = $("#readCardBtn");
			this.getVCodeBtn = $("#getVCodeBtn");
			this.idCardInp = $("#idNum");
			this.cardInfoBar = $("#cardInfoBar").hide();
			this.mobileInp = $("#mobileInp");
			this.vcodeInp = $("#vcodeInp");
			this.memnameInp = $("#memName");
			this.submitBtn = $("#activateBtn");
			this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
			this.CheckExistDialog = new CheckExistDialog();
			this.CheckExistDialog.on("replaceAndSubmit",function(submitData){
				that.submit("replace");
				this.close();
			})
			this.initSelect();
			this.initFileupload();
		},
		initSelect : function(){
			this.provCitySelect = new ProvCitySelect({
				provId : "#provSelect",
				cityId : "#citySelect",
				onProvChange : function(data){
	
				}
			})
		},
		initFileupload : function(){
			var that = this;
			this.fileupload = new Fileupload({
				container : "#imgUploadBox",
				id : 1,
				action : Api.Url.PublishCardProd.uploadFile,
				loading : function(formControls){},
				complete : function(res){
					that.onImgUploadComplete(res);
				}
			});
		},
		//点击获取验证码
		onGetVCodeBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("unable")) return false;
			var mobile = $.trim(this.mobileInp.val());
			if(!PFT.Util.Validate.typePhone(mobile)) return alert("请填写正确格式手机号");
			this.getVCode(mobile);
		},
		//点击提交激活
		onActiveBtnClick : function(e){
			var tarBtn = $(e.currentTarget);
			if(tarBtn.hasClass("disable")) return false;
			if(this.cardInfoBar.hasClass("error")) return false;
			var physics_no = this.cardInp.val();
			if(!physics_no) return alert("物理卡号不能为空");
			var check_mobile = this.validator.mobile.call(this);
			if(!check_mobile) return false;
			var check_vcode =  this.validator.vcode.call(this);
			if(!check_vcode) return false;
			var check_idCard = this.validator.idCard.call(this);
			if(!check_idCard) return false;
			this.submit();
		},
		onTextInpBlur : function(e){
			var that = this;
			var tarInp = $(e.currentTarget);
			var validate = tarInp.attr("validator");
			if(!validate) return false;
			validate = validate.split("|");
			for(var i in validate){
				var valid = validate[i].split(":");
				var rule = valid[0];
				var args = valid[1] ? valid[1].split(",") : [];
				var handler = that.validator[rule];
				if(handler) handler.apply(that,args);
			}
		},
		onTextInpFocus : function(e){
			var that = this;
			var tarInp = $(e.currentTarget);
			var validate = tarInp.attr("validator");
			if(!validate) return false;
			if(tarInp.attr("id")=="cardInp"){
				$("#cardInfoBar").removeClass("error").hide();
			}else{
				tarInp.siblings(".tip").removeClass("error").hide();
			}
		},
		onClearCardInpBtnClick : function(e){
			this.cardInp.val("").focus();
			$(e.currentTarget).hide();
		},
		onCardInpKeyup : function(e){
			var tarInp = $(e.currentTarget);
			var val = tarInp.val();
			var keycode = e.keyCode;
			var clearBtn = $("#clearCardInpBtn");
			if(keycode!=13) return false;
			val ? clearBtn.show() : clearBtn.hide();
			this.getCardInfo(val,"physics");
		},
		onImgUploadComplete : function(res){
			var res = res || {};
			var code = res.code;
			var data = res.data || {};
			var src = data.src;
			var msg = res.msg || "上传失败";
			if(code==200 && src){
				this.renderThumbList(src);
				PFT.Util.STip("success",'<p style="width:200px">上传成功</p>');
			}else{
				PFT.Util.STip("fail",'<p style="width:200px">'+msg+'</p>');
			}
		},
		renderThumbList : function(src){
			var container = $("#uploadPhotoBox");
			if(container.length==0){
				container = $('<div id="uploadPhotoBox" class="uploadPhotoBox"></div>');
				$("#imgUploadBox").parent().append(container);
			}
			container.html('<table><tr><td><img id="uploadPhotoImg" src="'+src+'" alt=""/></td></tr></table>');
		},
		validator : {
			mobile : function(){
				var mobileInp = this.mobileInp;
				var mobile = $.trim(mobileInp.val());
				var tip = mobileInp.siblings(".tip");
				if(!PFT.Util.Validate.typePhone(mobile)){
					tip.show().addClass("error").text("请填写正确格式手机号");
					return false;
				}else{
					tip.hide().removeClass("error");
					return true;
				}
			},
			vcode : function(){
				var vcodeInp = this.vcodeInp;
				var vcode = $.trim(vcodeInp.val());
				var tip = vcodeInp.siblings(".tip");
				if(!vcode){
					tip.show().addClass("error").text("请填写验证码");
					return false;
				}else{
					tip.hide().removeClass("error");
					return true;
				}
			},
			idCard : function(){
				var idCardInp = this.idCardInp;
				var idCard = $.trim(idCardInp.val());
				var tip = idCardInp.siblings(".tip");
				var is_require = idCardInp.attr("data-require");
				if((idCard && !PFT.Util.Validate.idcard(idCard)) || ((is_require==1) && !idCard)){
					tip.show().addClass("error").text("请填写正确格式身份证");
					return false;
				}else{
					tip.removeClass("error").hide();
					return true;
				}
			}
		},
		getCardInfo : function(card_no,type){
			var that = this;
			var tarBtn = this.readCardBtn;
			var idCardInp = that.idCardInp;
			if(!card_no || !type) return false;
			PFT.Util.Ajax(Api.Url.active.checkCard,{
				params : {
					identify : card_no,
					type : type
				},
				loading : function(){
					tarBtn.addClass("disable");
					idCardInp.val("");
					$("#loadingIcon").show();
				},
				complete : function(){
					tarBtn.removeClass("disable");
					$("#loadingIcon").hide();
				},
				success : function(res){
					res = res || {};
					var data= res.data;
					if(res.code==200){
						var needID = data.need_ID || "";
						var virtual_no = data.virtual_no;
						var physics_no = data.physics_no;
						var card_no = data.card_no;
						idCardInp.attr("validate","idCard:"+needID);
						idCardInp.attr("data-requrie",needID);
						if(needID==1){
							$("#idCard-fontRed").show();
						}else{
							$("#idCard-fontRed").hide();
						}
						that.cardInfoBar.show().removeClass("error").html("实体卡号："+card_no+"<i style='margin:0 10px'></i>虚拟卡号："+virtual_no+"<i style='margin:0 10px'></i>"+"物理ID："+physics_no);
					}else{
						that.cardInfoBar.show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
					}
				}
			})
		},
		getVCode : function(mobile){
			var that = this;
			var getVCodeBtn = this.getVCodeBtn;
			PFT.Util.Ajax(Api.Url.active.getVCode,{
				params : {
					mobile : mobile
				},
				loading : function(){
					getVCodeBtn.addClass("unable").text("请稍后..");
				},
				success : function(res){
					res = res || {};
					if(res.code==200){
						var last = that.time-1;
						that.timer = setInterval(function(){
							last = last-1;
							if(last<=0){
								getVCodeBtn.text("获取验证码").removeClass("unable");
								clearInterval(that.timer);
							}else{
								getVCodeBtn.text(last+"秒后可重新获取");
							}
						},1000)
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		},
		submit : function(replace){
			var that = this;
			var submitBtn = this.submitBtn;
			var cardVal = this.cardInp.val();
			var mobile = this.mobileInp.val();
			var name = this.memnameInp.val();
			var id_card = this.idCardInp.val();
			var vcode = this.vcodeInp.val();
	
			var provCity = this.provCitySelect.getVal();
			var province = provCity.prov;
			var city = provCity.city;
			var address = $("#addressInp").val();
			var head_img = $("#uploadPhotoImg").attr("src") || "";
	
			var data = {
				identify : cardVal,
				type : "physics",  //type="physics"||"other"
				mobile : mobile,
				name : name,
				id_card : id_card,
				vcode : vcode,
				province : province,
				city : city,
				address : address,
				head_img : head_img
			};
	
			if(replace=="replace") data["replace"] = 1;
	
			PFT.Util.Ajax(Api.Url.active.activateForPc,{
				type : "post",
				params : data,
				loading : function(){
					submitBtn.addClass("disable");
				},
				complete : function(){
					submitBtn.removeClass("disable");
				},
				success : function(res){
					res = res || {};
					var data = res.data || {};
					if(res.code==200){
						if(data.exist==1){
							that.CheckExistDialog.open(data);
						}else{
							PFT.Util.STip("success",'<div style="width:200px">激活成功</div>')
						}
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT)
					}
				}
			})
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
/* 6 */
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
				return "";
			}
			if(typeof readCardObj.open!="number" && typeof readCardObj.ICReaderRequest!="string"){
				alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
				return "";
			}
			readCardObj.open();
			var val = readCardObj.ICReaderRequest();
			return val || "";
		}
	};
	module.exports = readPhysicsCard;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/27 18:55
	 * Description: ""
	 */
	__webpack_require__(8);
	var SDialog = __webpack_require__(10);
	var tpl = __webpack_require__(17);
	var Dialog = function(){
		var that = this;
		this.submitData = {};
		this.SDialog = new SDialog({
			width : 680,
			content : tpl,
			drag : true,
			events : {
				"click #replaceBtn" : function(e){
					that.onReplaceBtnClick(e);
				},
				"click #messageBtn" : function(e){
					that.onMessageBtnClick(e);
				}
			}
		});
	};
	Dialog.prototype = {
		open : function(opt){
			opt = opt || {};
			var mobile = opt.mobile;
			var idCard = opt.idCard;
			var name = opt.name;
			var left = opt.left;
			var result = "";
			if(Object.prototype.toString.call(left)=="[object Array]"){
				result = '<p class="pname">'+name+'</p>';
				for(var i in left){
					var lef = left[i];
					var ltitle = lef.ltitle;
					var title = lef.title;
					var left_num = lef.left;
					result += '<p class="lname">'+ltitle+" "+title+'（'+left_num+'）</p>';
				}
			}else{
				result = name+"（"+left+"）";
			}
			this.submitData = opt.submitData;
			this.SDialog.open({
				onBefore : function(){
					$("#existDialog_mobile").text(mobile);
					$("#existDialog_idCard").text(idCard);
					$("#existDialog_name").html(result);
				}
			});
		},
		close : function(){
			this.SDialog.close();
		},
		on : function(type,handler){
			this.SDialog.on(type,handler);
		},
		//替换并且直接下单
		onReplaceBtnClick : function(e){
			this.SDialog.trigger("replaceAndSubmit",this.submitData,this);
		},
		//取消
		onMessageBtnClick : function(e){
			this.close();
		}
	};
	module.exports = Dialog;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/21 10:04
	 * Description: ""
	 */
	__webpack_require__(11);
	var WinWidthHeight = __webpack_require__(13);
	var Drag = __webpack_require__(14);
	var PubSub = __webpack_require__(15);
	var Extend = __webpack_require__(16);
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
		onOpenBefore : fn,
		onOpenAfter : fn,
		onCloseBefore : fn,
		onCloseAfter : fn
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
						target : that.container[0]
					})
				}
			},10)
			this.position();
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
			this.container.show().css({zIndex:9999});
			onBefore();
			this.container.animate({
				top : (winH-containerH)/2 + offsetY
			},speed,function(){
				onAfter();
			})
			if(overlay) this.getMask().fadeIn(function(){
				that.getMask().css("zIndex",9998);
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
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
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
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
/***/ function(module, exports) {

	module.exports = "<div class=\"memberBox\" id=\"memberBox\">\r\n    <p class=\"memP\">会员已存在！是否替换原有卡和套餐？</p>\r\n    <table class=\"memTable border\">\r\n        <thead>\r\n        <tr class=\"font-gray\">\r\n            <th>手机号</th>\r\n            <th>身份证</th>\r\n            <th>卡套餐（已用特权数）</th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr>\r\n            <td><div style=\"padding-right:10px\" id=\"existDialog_mobile\"></div></td>\r\n            <td><div style=\"padding-right:10px\" id=\"existDialog_idCard\"></div></td>\r\n            <td><div id=\"existDialog_name\"></div></td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n    <div class=\"btnBox\">\r\n        <a href=\"javascript:void(0);\" class=\"btn btn-blue\" id=\"replaceBtn\">替换并提交订单</a>\r\n        <a href=\"javascript:void(0);\" class=\"btn btn-border\" id=\"messageBtn\">取消</a>\r\n    </div>\r\n</div>";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 16-4-15.
	 */
	var fn = new Function();
	var Select = function(opt){
		var opt = opt || {};
		this.data = __webpack_require__(19);
		this.provId = opt.provId;
		this.cityId = opt.cityId;
		if(!this.provId || !this.cityId) return false;
		this.provSelect = null;
		this.citySelect = null;
		this.onProvChange = opt.onProvChange || fn;
		this.onCityChange = opt.onCityChange || fn;
		this.defaults = opt.defaults || {};
		this.init();
	};
	Select.prototype = {
		init : function(){
			var that = this;
			this.provSelect = $(this.provId);
			this.citySelect = $(this.cityId);
			this.provSelect.on("change",function(e){
				var prov = $(this).val();
				var citys = that.getCitysByProv(prov);
				if(citys) that.buildCitys(citys);
				that.onProvChange(prov);
			})
			this.citySelect.on("change",function(e){
				var city = $(this).val();
				that.onCityChange(city);
			})
			this.buildProvs(this.data);
		},
		getCitysByProv : function(provid){
			if(!provid) return false;
			var result = null;
			var data = this.data;
			for(var i in data){
				var d = data[i];
				var pid = d["id"];
				var citys = d["city"];
				if(pid==provid){
					result = citys;
					break;
				}
			}
			return result;
		},
		buildCitys : function(citys){
			if(Object.prototype.toString.call(citys)!=="[object Array]") return false;
			var html = "";
			var default_city = this.defaults.city;
			for(var i in citys){
				var city = citys[i];
				var id = city["id"];
				var name = city["name"];
				var pid = city["pid"];
				var selected = (id==default_city && default_city) ? "selected" : "";
				html += '<option '+selected+' data-pid="'+pid+'" value="'+id+'">'+name+'</option>';
			}
			this.citySelect.html(html);
		},
		buildProvs : function(data){
			var that = this;
			var html = "";
			var default_prov = this.defaults.province;
			for(var i in data){
				var d = data[i];
				var pid = d["id"];
				var name = d["name"];
				var selected = pid==default_prov ? "selected" : "";
				html += '<option value="'+pid+'" '+selected+'>'+name+'</option>';
			}
			this.provSelect.html(html);
			setTimeout(function(){
				that.provSelect.trigger("change");
			},10)
		},
		setVal : function(prov,city){
			if(arguments.length==0) return false;
			this.provSelect.val(prov);
			if(city) this.defaults.city = city;
			this.provSelect.trigger("change");
		},
		getVal : function(){
			return{
				prov : this.provSelect.val(),
				city : this.citySelect.val()
			}
		}
	};
	module.exports = Select;

/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/20 14:40
	 * Description: ""
	 */
	module.exports = {"1":{"id":"1","name":"北京市","city":[{"id":"35","name":"东城区","pid":"1"},{"id":"36","name":"西城区","pid":"1"},{"id":"37","name":"崇文区","pid":"1"},{"id":"38","name":"宣武区","pid":"1"},{"id":"39","name":"朝阳区","pid":"1"},{"id":"40","name":"丰台区","pid":"1"},{"id":"41","name":"海淀区","pid":"1"},{"id":"42","name":"房山区","pid":"1"},{"id":"43","name":"通州区","pid":"1"},{"id":"44","name":"顺义区","pid":"1"},{"id":"45","name":"昌平区","pid":"1"},{"id":"46","name":"大兴区","pid":"1"},{"id":"47","name":"怀柔区","pid":"1"},{"id":"48","name":"平谷区","pid":"1"},{"id":"49","name":"密云县","pid":"1"},{"id":"50","name":"延庆县","pid":"1"},{"id":"51","name":"门头沟区","pid":"1"},{"id":"52","name":"石景山区","pid":"1"}]},"2":{"id":"2","name":"天津市","city":[{"id":"53","name":"和平区","pid":"2"},{"id":"54","name":"河东区","pid":"2"},{"id":"55","name":"河西区","pid":"2"},{"id":"56","name":"南开区","pid":"2"},{"id":"57","name":"河北区","pid":"2"},{"id":"58","name":"红桥区","pid":"2"},{"id":"59","name":"塘沽区","pid":"2"},{"id":"60","name":"汉沽区","pid":"2"},{"id":"61","name":"大港区","pid":"2"},{"id":"62","name":"东丽区","pid":"2"},{"id":"63","name":"西青区","pid":"2"},{"id":"64","name":"津南区","pid":"2"},{"id":"65","name":"北辰区","pid":"2"},{"id":"66","name":"武清区","pid":"2"},{"id":"67","name":"宝坻区","pid":"2"},{"id":"68","name":"宁河县","pid":"2"},{"id":"69","name":"静海县","pid":"2"},{"id":"70","name":"蓟县","pid":"2"}]},"3":{"id":"3","name":"上海市","city":[{"id":"516","name":"黄浦区","pid":"3"},{"id":"517","name":"‎卢湾区","pid":"3"},{"id":"518","name":"徐汇区","pid":"3"},{"id":"519","name":"长宁区","pid":"3"},{"id":"520","name":"‎静安区","pid":"3"},{"id":"521","name":"普陀区","pid":"3"},{"id":"522","name":"闸北区","pid":"3"},{"id":"523","name":"虹口区","pid":"3"},{"id":"524","name":"杨浦区","pid":"3"},{"id":"525","name":"闵行区","pid":"3"},{"id":"526","name":"宝山区","pid":"3"},{"id":"527","name":"‎嘉定区","pid":"3"},{"id":"528","name":"金山区","pid":"3"},{"id":"529","name":"‎松江区","pid":"3"},{"id":"530","name":"‎青浦区","pid":"3"},{"id":"531","name":"南汇区","pid":"3"},{"id":"532","name":"奉贤区","pid":"3"},{"id":"533","name":"崇明县","pid":"3"},{"id":"535","name":"浦东新区","pid":"3"}]},"4":{"id":"4","name":"重庆市","city":[{"id":"476","name":"忠县","pid":"4"},{"id":"477","name":"开县","pid":"4"},{"id":"478","name":"綦江县","pid":"4"},{"id":"479","name":"潼南县","pid":"4"},{"id":"480","name":"铜梁县","pid":"4"},{"id":"481","name":"大足县","pid":"4"},{"id":"482","name":"荣昌县","pid":"4"},{"id":"483","name":"璧山县","pid":"4"},{"id":"484","name":"梁平县","pid":"4"},{"id":"485","name":"城口县","pid":"4"},{"id":"486","name":"丰都县","pid":"4"},{"id":"487","name":"垫江县","pid":"4"},{"id":"488","name":"武隆县","pid":"4"},{"id":"489","name":"云阳县","pid":"4"},{"id":"490","name":"奉节县","pid":"4"},{"id":"491","name":"巫山县","pid":"4"},{"id":"492","name":"巫溪县","pid":"4"},{"id":"493","name":"万州区","pid":"4"},{"id":"494","name":"涪陵区","pid":"4"},{"id":"495","name":"渝中区","pid":"4"},{"id":"496","name":"江北区","pid":"4"},{"id":"497","name":"南岸区","pid":"4"},{"id":"498","name":"北碚区","pid":"4"},{"id":"499","name":"万盛区","pid":"4"},{"id":"500","name":"双桥区","pid":"4"},{"id":"501","name":"渝北区","pid":"4"},{"id":"502","name":"巴南区","pid":"4"},{"id":"503","name":"黔江区","pid":"4"},{"id":"504","name":"长寿区","pid":"4"},{"id":"505","name":"江津区","pid":"4"},{"id":"506","name":"合川区","pid":"4"},{"id":"507","name":"永川区","pid":"4"},{"id":"508","name":"南川区","pid":"4"},{"id":"509","name":"大渡口区","pid":"4"},{"id":"510","name":"沙坪坝区","pid":"4"},{"id":"511","name":"九龙坡区","pid":"4"},{"id":"512","name":"石柱土家族自治县","pid":"4"},{"id":"513","name":"秀山土家族苗族自治县","pid":"4"},{"id":"514","name":"酉阳土家族苗族自治县","pid":"4"},{"id":"515","name":"彭水苗族土家族自治县","pid":"4"}]},"5":{"id":"5","name":"河北省","city":[{"id":"465","name":"唐山市","pid":"5"},{"id":"466","name":"邯郸市","pid":"5"},{"id":"467","name":"邢台市","pid":"5"},{"id":"468","name":"保定市","pid":"5"},{"id":"469","name":"承德市","pid":"5"},{"id":"470","name":"沧州市","pid":"5"},{"id":"471","name":"廊坊市","pid":"5"},{"id":"472","name":"衡水市","pid":"5"},{"id":"473","name":"张家口市","pid":"5"},{"id":"474","name":"秦皇岛市","pid":"5"},{"id":"475","name":"石家庄市","pid":"5"}]},"6":{"id":"6","name":"山西省","city":[{"id":"454","name":"太原市","pid":"6"},{"id":"455","name":"大同市","pid":"6"},{"id":"456","name":"阳泉市","pid":"6"},{"id":"457","name":"长治市","pid":"6"},{"id":"458","name":"晋城市","pid":"6"},{"id":"459","name":"朔州市","pid":"6"},{"id":"460","name":"晋中市","pid":"6"},{"id":"461","name":"运城市","pid":"6"},{"id":"462","name":"忻州市","pid":"6"},{"id":"463","name":"临汾市","pid":"6"},{"id":"464","name":"吕梁市","pid":"6"}]},"7":{"id":"7","name":"辽宁省","city":[{"id":"440","name":"沈阳市","pid":"7"},{"id":"441","name":"大连市","pid":"7"},{"id":"442","name":"鞍山市","pid":"7"},{"id":"443","name":"抚顺市","pid":"7"},{"id":"444","name":"本溪市","pid":"7"},{"id":"445","name":"丹东市","pid":"7"},{"id":"446","name":"锦州市","pid":"7"},{"id":"447","name":"营口市","pid":"7"},{"id":"448","name":"阜新市","pid":"7"},{"id":"449","name":"辽阳市","pid":"7"},{"id":"450","name":"盘锦市","pid":"7"},{"id":"451","name":"铁岭市","pid":"7"},{"id":"452","name":"朝阳市","pid":"7"},{"id":"453","name":"葫芦岛市","pid":"7"}]},"8":{"id":"8","name":"吉林省","city":[{"id":"431","name":"长春市","pid":"8"},{"id":"432","name":"吉林市","pid":"8"},{"id":"433","name":"四平市","pid":"8"},{"id":"434","name":"辽源市","pid":"8"},{"id":"435","name":"通化市","pid":"8"},{"id":"436","name":"白山市","pid":"8"},{"id":"437","name":"松原市","pid":"8"},{"id":"438","name":"白城市","pid":"8"},{"id":"439","name":"延边朝鲜族自治州","pid":"8"}]},"9":{"id":"9","name":"江苏省","city":[{"id":"418","name":"南京市","pid":"9"},{"id":"419","name":"无锡市","pid":"9"},{"id":"420","name":"徐州市","pid":"9"},{"id":"421","name":"常州市","pid":"9"},{"id":"422","name":"苏州市","pid":"9"},{"id":"423","name":"南通市","pid":"9"},{"id":"424","name":"淮安市","pid":"9"},{"id":"425","name":"盐城市","pid":"9"},{"id":"426","name":"扬州市","pid":"9"},{"id":"427","name":"镇江市","pid":"9"},{"id":"428","name":"泰州市","pid":"9"},{"id":"429","name":"宿迁市","pid":"9"},{"id":"430","name":"连云港市","pid":"9"}]},"10":{"id":"10","name":"浙江省","city":[{"id":"407","name":"杭州市","pid":"10"},{"id":"408","name":"宁波市","pid":"10"},{"id":"409","name":"温州市","pid":"10"},{"id":"410","name":"嘉兴市","pid":"10"},{"id":"411","name":"湖州市","pid":"10"},{"id":"412","name":"绍兴市","pid":"10"},{"id":"413","name":"金华市","pid":"10"},{"id":"414","name":"衢州市","pid":"10"},{"id":"415","name":"舟山市","pid":"10"},{"id":"416","name":"台州市","pid":"10"},{"id":"417","name":"丽水市","pid":"10"}]},"11":{"id":"11","name":"安徽省","city":[{"id":"390","name":"合肥市","pid":"11"},{"id":"391","name":"芜湖市","pid":"11"},{"id":"392","name":"蚌埠市","pid":"11"},{"id":"393","name":"淮南市","pid":"11"},{"id":"394","name":"淮北市","pid":"11"},{"id":"395","name":"铜陵市","pid":"11"},{"id":"396","name":"安庆市","pid":"11"},{"id":"397","name":"黄山市","pid":"11"},{"id":"398","name":"滁州市","pid":"11"},{"id":"399","name":"阜阳市","pid":"11"},{"id":"400","name":"宿州市","pid":"11"},{"id":"401","name":"巢湖市","pid":"11"},{"id":"402","name":"六安市","pid":"11"},{"id":"403","name":"亳州市","pid":"11"},{"id":"404","name":"池州市","pid":"11"},{"id":"405","name":"宣城市","pid":"11"},{"id":"406","name":"马鞍山市","pid":"11"}]},"12":{"id":"12","name":"福建省","city":[{"id":"381","name":"福州市","pid":"12"},{"id":"382","name":"厦门市","pid":"12"},{"id":"383","name":"莆田市","pid":"12"},{"id":"384","name":"三明市","pid":"12"},{"id":"385","name":"泉州市","pid":"12"},{"id":"386","name":"漳州市","pid":"12"},{"id":"387","name":"南平市","pid":"12"},{"id":"388","name":"龙岩市","pid":"12"},{"id":"389","name":"宁德市","pid":"12"}]},"13":{"id":"13","name":"江西省","city":[{"id":"370","name":"南昌市","pid":"13"},{"id":"371","name":"萍乡市","pid":"13"},{"id":"372","name":"九江市","pid":"13"},{"id":"373","name":"新余市","pid":"13"},{"id":"374","name":"鹰潭市","pid":"13"},{"id":"375","name":"赣州市","pid":"13"},{"id":"376","name":"吉安市","pid":"13"},{"id":"377","name":"宜春市","pid":"13"},{"id":"378","name":"抚州市","pid":"13"},{"id":"379","name":"上饶市","pid":"13"},{"id":"380","name":"景德镇市","pid":"13"}]},"14":{"id":"14","name":"山东省","city":[{"id":"353","name":"济南市","pid":"14"},{"id":"354","name":"青岛市","pid":"14"},{"id":"355","name":"淄博市","pid":"14"},{"id":"356","name":"枣庄市","pid":"14"},{"id":"357","name":"东营市","pid":"14"},{"id":"358","name":"烟台市","pid":"14"},{"id":"359","name":"潍坊市","pid":"14"},{"id":"360","name":"济宁市","pid":"14"},{"id":"361","name":"泰安市","pid":"14"},{"id":"362","name":"威海市","pid":"14"},{"id":"363","name":"日照市","pid":"14"},{"id":"364","name":"莱芜市","pid":"14"},{"id":"365","name":"临沂市","pid":"14"},{"id":"366","name":"德州市","pid":"14"},{"id":"367","name":"聊城市","pid":"14"},{"id":"368","name":"滨州市","pid":"14"},{"id":"369","name":"菏泽市","pid":"14"}]},"15":{"id":"15","name":"河南省","city":[{"id":"335","name":"郑州市","pid":"15"},{"id":"336","name":"开封市","pid":"15"},{"id":"337","name":"洛阳市","pid":"15"},{"id":"338","name":"安阳市","pid":"15"},{"id":"339","name":"鹤壁市","pid":"15"},{"id":"340","name":"新乡市","pid":"15"},{"id":"341","name":"焦作市","pid":"15"},{"id":"342","name":"济源市","pid":"15"},{"id":"343","name":"濮阳市","pid":"15"},{"id":"344","name":"许昌市","pid":"15"},{"id":"345","name":"漯河市","pid":"15"},{"id":"346","name":"南阳市","pid":"15"},{"id":"347","name":"商丘市","pid":"15"},{"id":"348","name":"信阳市","pid":"15"},{"id":"349","name":"周口市","pid":"15"},{"id":"350","name":"驻马店市","pid":"15"},{"id":"351","name":"平顶山市","pid":"15"},{"id":"352","name":"三门峡市","pid":"15"}]},"16":{"id":"16","name":"湖北省","city":[{"id":"318","name":"武汉市","pid":"16"},{"id":"319","name":"黄石市","pid":"16"},{"id":"320","name":"十堰市","pid":"16"},{"id":"321","name":"宜昌市","pid":"16"},{"id":"322","name":"襄樊市","pid":"16"},{"id":"323","name":"鄂州市","pid":"16"},{"id":"324","name":"荆门市","pid":"16"},{"id":"325","name":"孝感市","pid":"16"},{"id":"326","name":"荆州市","pid":"16"},{"id":"327","name":"黄冈市","pid":"16"},{"id":"328","name":"咸宁市","pid":"16"},{"id":"329","name":"随州市","pid":"16"},{"id":"330","name":"仙桃市","pid":"16"},{"id":"331","name":"潜江市","pid":"16"},{"id":"332","name":"天门市","pid":"16"},{"id":"333","name":"神农架林区","pid":"16"},{"id":"334","name":"恩施土家族苗族自治州","pid":"16"}]},"17":{"id":"17","name":"湖南省","city":[{"id":"303","name":"长沙市","pid":"17"},{"id":"304","name":"株洲市","pid":"17"},{"id":"305","name":"湘潭市","pid":"17"},{"id":"306","name":"衡阳市","pid":"17"},{"id":"307","name":"邵阳市","pid":"17"},{"id":"308","name":"岳阳市","pid":"17"},{"id":"309","name":"常德市","pid":"17"},{"id":"310","name":"益阳市","pid":"17"},{"id":"311","name":"郴州市","pid":"17"},{"id":"312","name":"永州市","pid":"17"},{"id":"313","name":"怀化市","pid":"17"},{"id":"314","name":"洪江市","pid":"17"},{"id":"315","name":"娄底市","pid":"17"},{"id":"316","name":"张家界市","pid":"17"},{"id":"317","name":"湘西土家族苗族自治州","pid":"17"}]},"18":{"id":"18","name":"广东省","city":[{"id":"282","name":"广州市","pid":"18"},{"id":"283","name":"韶关市","pid":"18"},{"id":"284","name":"深圳市","pid":"18"},{"id":"285","name":"珠海市","pid":"18"},{"id":"286","name":"汕头市","pid":"18"},{"id":"287","name":"佛山市","pid":"18"},{"id":"288","name":"江门市","pid":"18"},{"id":"289","name":"湛江市","pid":"18"},{"id":"290","name":"茂名市","pid":"18"},{"id":"291","name":"惠州市","pid":"18"},{"id":"292","name":"梅州市","pid":"18"},{"id":"293","name":"汕尾市","pid":"18"},{"id":"294","name":"河源市","pid":"18"},{"id":"295","name":"阳江市","pid":"18"},{"id":"296","name":"清远市","pid":"18"},{"id":"297","name":"东莞市","pid":"18"},{"id":"298","name":"中山市","pid":"18"},{"id":"299","name":"潮州市","pid":"18"},{"id":"300","name":"揭阳市","pid":"18"},{"id":"301","name":"云浮市","pid":"18"},{"id":"302","name":"东沙群岛","pid":"18"},{"id":"3896","name":"肇庆","pid":"18"}]},"19":{"id":"19","name":"海南省","city":[{"id":"255","name":"海口市","pid":"19"},{"id":"256","name":"三亚市","pid":"19"},{"id":"257","name":"琼海市","pid":"19"},{"id":"258","name":"儋州市","pid":"19"},{"id":"259","name":"文昌市","pid":"19"},{"id":"260","name":"万宁市","pid":"19"},{"id":"261","name":"东方市","pid":"19"},{"id":"262","name":"定安县","pid":"19"},{"id":"263","name":"屯昌县","pid":"19"},{"id":"264","name":"澄迈县","pid":"19"},{"id":"265","name":"临高县","pid":"19"},{"id":"266","name":"定安县","pid":"19"},{"id":"267","name":"屯昌县","pid":"19"},{"id":"268","name":"澄迈县","pid":"19"},{"id":"269","name":"临高县","pid":"19"},{"id":"270","name":"五指山市","pid":"19"},{"id":"271","name":"西沙群岛","pid":"19"},{"id":"272","name":"南沙群岛","pid":"19"},{"id":"273","name":"白沙黎族自治县","pid":"19"},{"id":"274","name":"昌江黎族自治县","pid":"19"},{"id":"275","name":"乐东黎族自治县","pid":"19"},{"id":"276","name":"昌江黎族自治县","pid":"19"},{"id":"277","name":"乐东黎族自治县","pid":"19"},{"id":"278","name":"陵水黎族自治县","pid":"19"},{"id":"279","name":"保亭黎族苗族自治县","pid":"19"},{"id":"280","name":"琼中黎族苗族自治县","pid":"19"},{"id":"281","name":"中沙群岛的岛礁及其海域","pid":"19"}]},"20":{"id":"20","name":"四川省","city":[{"id":"234","name":"成都市","pid":"20"},{"id":"235","name":"自贡市","pid":"20"},{"id":"236","name":"泸州市","pid":"20"},{"id":"237","name":"德阳市","pid":"20"},{"id":"238","name":"绵阳市","pid":"20"},{"id":"239","name":"广元市","pid":"20"},{"id":"240","name":"遂宁市","pid":"20"},{"id":"241","name":"内江市","pid":"20"},{"id":"242","name":"乐山市","pid":"20"},{"id":"243","name":"南充市","pid":"20"},{"id":"244","name":"眉山市","pid":"20"},{"id":"245","name":"宜宾市","pid":"20"},{"id":"246","name":"广安市","pid":"20"},{"id":"247","name":"达州市","pid":"20"},{"id":"248","name":"雅安市","pid":"20"},{"id":"249","name":"巴中市","pid":"20"},{"id":"250","name":"资阳市","pid":"20"},{"id":"251","name":"攀枝花市","pid":"20"},{"id":"252","name":"甘孜藏族自治州","pid":"20"},{"id":"253","name":"凉山彝族自治州","pid":"20"},{"id":"254","name":"阿坝藏族羌族自治州","pid":"20"}]},"21":{"id":"21","name":"贵州省","city":[{"id":"225","name":"贵阳市","pid":"21"},{"id":"226","name":"遵义市","pid":"21"},{"id":"227","name":"安顺市","pid":"21"},{"id":"228","name":"六盘水市","pid":"21"},{"id":"229","name":"铜仁地区","pid":"21"},{"id":"230","name":"毕节地区","pid":"21"},{"id":"231","name":"黔东南苗族侗族自治州","pid":"21"},{"id":"232","name":"黔南布依族苗族自治州","pid":"21"},{"id":"233","name":"黔西南布依族苗族自治州","pid":"21"}]},"22":{"id":"22","name":"云南省","city":[{"id":"209","name":"昆明市","pid":"22"},{"id":"210","name":"曲靖市","pid":"22"},{"id":"211","name":"玉溪市","pid":"22"},{"id":"212","name":"保山市","pid":"22"},{"id":"213","name":"昭通市","pid":"22"},{"id":"214","name":"丽江市","pid":"22"},{"id":"215","name":"普洱市","pid":"22"},{"id":"216","name":"临沧市","pid":"22"},{"id":"217","name":"迪庆藏族自治州","pid":"22"},{"id":"218","name":"楚雄彝族自治州","pid":"22"},{"id":"219","name":"大理白族自治州","pid":"22"},{"id":"220","name":"怒江傈僳族自治州","pid":"22"},{"id":"221","name":"西双版纳傣族自治州","pid":"22"},{"id":"222","name":"文山壮族苗族自治州","pid":"22"},{"id":"223","name":"红河哈尼族彝族自治州","pid":"22"},{"id":"224","name":"德宏傣族景颇族自治州","pid":"22"}]},"23":{"id":"23","name":"陕西省","city":[{"id":"199","name":"西安市","pid":"23"},{"id":"200","name":"铜川市","pid":"23"},{"id":"201","name":"宝鸡市","pid":"23"},{"id":"202","name":"咸阳市","pid":"23"},{"id":"203","name":"渭南市","pid":"23"},{"id":"204","name":"延安市","pid":"23"},{"id":"205","name":"汉中市","pid":"23"},{"id":"206","name":"榆林市","pid":"23"},{"id":"207","name":"安康市","pid":"23"},{"id":"208","name":"商洛市","pid":"23"}]},"24":{"id":"24","name":"甘肃省","city":[{"id":"186","name":"兰州市","pid":"24"},{"id":"187","name":"金昌市","pid":"24"},{"id":"188","name":"白银市","pid":"24"},{"id":"189","name":"天水市","pid":"24"},{"id":"190","name":"武威市","pid":"24"},{"id":"191","name":"张掖市","pid":"24"},{"id":"192","name":"平凉市","pid":"24"},{"id":"193","name":"酒泉市","pid":"24"},{"id":"194","name":"庆阳市","pid":"24"},{"id":"195","name":"定西市","pid":"24"},{"id":"196","name":"陇南市","pid":"24"},{"id":"197","name":"临夏回族自治州","pid":"24"},{"id":"198","name":"甘南藏族自治州","pid":"24"}]},"25":{"id":"25","name":"青海省","city":[{"id":"178","name":"西宁市","pid":"25"},{"id":"179","name":"海东地区","pid":"25"},{"id":"180","name":"海北藏族自治州","pid":"25"},{"id":"181","name":"黄南藏族自治州","pid":"25"},{"id":"182","name":"海南藏族自治州","pid":"25"},{"id":"183","name":"果洛藏族自治州","pid":"25"},{"id":"184","name":"玉树藏族自治州","pid":"25"},{"id":"185","name":"海西蒙古族藏族自治州","pid":"25"}]},"26":{"id":"26","name":"黑龙江省","city":[{"id":"165","name":"鸡西市","pid":"26"},{"id":"166","name":"鹤岗市","pid":"26"},{"id":"167","name":"大庆市","pid":"26"},{"id":"168","name":"伊春市","pid":"26"},{"id":"169","name":"黑河市","pid":"26"},{"id":"170","name":"绥化市","pid":"26"},{"id":"171","name":"双鸭山市","pid":"26"},{"id":"172","name":"佳木斯市","pid":"26"},{"id":"173","name":"七台河市","pid":"26"},{"id":"174","name":"牡丹江市","pid":"26"},{"id":"175","name":"哈尔滨市","pid":"26"},{"id":"176","name":"齐齐哈尔市","pid":"26"},{"id":"177","name":"大兴安岭地区","pid":"26"}]},"27":{"id":"27","name":"西藏自治区","city":[{"id":"158","name":"拉萨市","pid":"27"},{"id":"159","name":"昌都地区","pid":"27"},{"id":"160","name":"山南地区","pid":"27"},{"id":"161","name":"那曲地区","pid":"27"},{"id":"162","name":"阿里地区","pid":"27"},{"id":"163","name":"林芝地区","pid":"27"},{"id":"164","name":"日喀则地区","pid":"27"}]},"28":{"id":"28","name":"内蒙古自治区","city":[{"id":"146","name":"包头市","pid":"28"},{"id":"147","name":"乌海市","pid":"28"},{"id":"148","name":"赤峰市","pid":"28"},{"id":"149","name":"通辽市","pid":"28"},{"id":"150","name":"兴安盟","pid":"28"},{"id":"151","name":"阿拉善盟","pid":"28"},{"id":"152","name":"锡林郭勒盟","pid":"28"},{"id":"153","name":"鄂尔多斯市","pid":"28"},{"id":"154","name":"呼伦贝尔市","pid":"28"},{"id":"155","name":"巴彦淖尔市","pid":"28"},{"id":"156","name":"乌兰察布市","pid":"28"},{"id":"157","name":"呼和浩特市","pid":"28"}]},"29":{"id":"29","name":"广西壮族自治区","city":[{"id":"132","name":"南宁市","pid":"29"},{"id":"133","name":"柳州市","pid":"29"},{"id":"134","name":"桂林市","pid":"29"},{"id":"135","name":"梧州市","pid":"29"},{"id":"136","name":"北海市","pid":"29"},{"id":"137","name":"钦州市","pid":"29"},{"id":"138","name":"贵港市","pid":"29"},{"id":"139","name":"玉林市","pid":"29"},{"id":"140","name":"百色市","pid":"29"},{"id":"141","name":"贺州市","pid":"29"},{"id":"142","name":"河池市","pid":"29"},{"id":"143","name":"来宾市","pid":"29"},{"id":"144","name":"崇左市","pid":"29"},{"id":"145","name":"防城港市","pid":"29"}]},"30":{"id":"30","name":"宁夏回族自治区","city":[{"id":"127","name":"银川市","pid":"30"},{"id":"128","name":"吴忠市","pid":"30"},{"id":"129","name":"固原市","pid":"30"},{"id":"130","name":"中卫市","pid":"30"},{"id":"131","name":"石嘴山市","pid":"30"}]},"31":{"id":"31","name":"新疆维吾尔自治区","city":[{"id":"109","name":"喀什地区","pid":"31"},{"id":"110","name":"和田地区","pid":"31"},{"id":"111","name":"哈密地区","pid":"31"},{"id":"112","name":"塔城地区","pid":"31"},{"id":"113","name":"石河子市","pid":"31"},{"id":"114","name":"阿拉尔市","pid":"31"},{"id":"115","name":"五家渠市","pid":"31"},{"id":"116","name":"图木舒克市","pid":"31"},{"id":"117","name":"乌鲁木齐市","pid":"31"},{"id":"118","name":"克拉玛依市","pid":"31"},{"id":"119","name":"吐鲁番地区","pid":"31"},{"id":"120","name":"阿克苏地区","pid":"31"},{"id":"121","name":"阿勒泰地区","pid":"31"},{"id":"122","name":"昌吉回族自治州","pid":"31"},{"id":"123","name":"伊犁哈萨克自治州","pid":"31"},{"id":"124","name":"博尔塔拉蒙古自治州","pid":"31"},{"id":"125","name":"巴音郭楞蒙古自治州","pid":"31"},{"id":"126","name":"克孜勒苏柯尔克孜自治州","pid":"31"}]},"32":{"id":"32","name":"香港","city":[{"id":"103","name":"香港岛","pid":"32"},{"id":"106","name":"九龙","pid":"32"},{"id":"107","name":"新界","pid":"32"}]},"33":{"id":"33","name":"澳门","city":[{"id":"96","name":"花地玛堂区","pid":"33"},{"id":"97","name":"圣安多尼堂区","pid":"33"},{"id":"98","name":"大堂区","pid":"33"},{"id":"99","name":"望德堂区","pid":"33"},{"id":"100","name":"风顺堂区","pid":"33"},{"id":"101","name":"澳门离岛","pid":"33"},{"id":"102","name":"路氹城","pid":"33"}]},"34":{"id":"34","name":"台湾","city":[{"id":"71","name":"基隆市","pid":"34"},{"id":"72","name":"台中市","pid":"34"},{"id":"73","name":"新竹市","pid":"34"},{"id":"74","name":"台南市","pid":"34"},{"id":"75","name":"嘉义市","pid":"34"},{"id":"76","name":"北县","pid":"34"},{"id":"77","name":"台东县","pid":"34"},{"id":"78","name":"澎湖县","pid":"34"},{"id":"79","name":"花莲县","pid":"34"},{"id":"80","name":"屏东县","pid":"34"},{"id":"81","name":"高雄县","pid":"34"},{"id":"82","name":"台南县","pid":"34"},{"id":"83","name":"嘉义县","pid":"34"},{"id":"84","name":"云林县","pid":"34"},{"id":"85","name":"南投县","pid":"34"},{"id":"86","name":"彰化县","pid":"34"},{"id":"87","name":"台中县","pid":"34"},{"id":"88","name":"苗栗县","pid":"34"},{"id":"89","name":"桃园县","pid":"34"},{"id":"90","name":"宜兰县","pid":"34"},{"id":"91","name":"新竹县","pid":"34"},{"id":"92","name":"台北市","pid":"34"},{"id":"93","name":"高雄市","pid":"34"},{"id":"94","name":"马祖县","pid":"34"},{"id":"95","name":"金门县","pid":"34"}]},"99999":{"id":"99999","name":"韩国","city":[]}};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Author: huangzhiyang
	 * Date: 2016/6/1 18:09
	 * Description: ""
	 */
	__webpack_require__(21);
	var tpl = __webpack_require__(23);
	/**
	 * 文件(图片)上传组件
	 * 内嵌iframe，解决无刷新文件上传问题，使用此组件需要跟后端约定好上传结束后数据处理方式
	 * 示例：
	 * var uploador = new Fileupload({
	 * 		container : "#container_id"    必选 组件要显示在哪个容器内，可传容器id或jq对象
	 * 	    action    : "target.php"       必选 文件上传至后端，哪个接口地址处理
	 * 	    id        : 1                  必选 页面上可能有好几个文件上传组件同时存在，用来标显组件唯一id(数字)
	 * 	    loading   : 上传过程中的回调函数   可选
	 * 	    complete  : 上传结束后的回调函数   可选 建议后端返回的数据格式：{code:200,data:{src:"图片src地址"},msg:""}
	 * })
	 * @param opt
	 * @constructor
	 */
	function Fileupload(opt){
		var opt = this.opt = $.extend({},Fileupload.options,opt);
		this.container = opt.container;
		this.action = opt.action;
		this.id = opt.id;
	
		this.init(opt);
	};
	Fileupload.options = {
		container : "",
		id : "",
		action : "",
		loading : function(){},
		complete : function(){}
	};
	Fileupload.prototype = {
		init : function(opt){
			var that = this;
			if(!this.container || !this.id || !this.action) return false;
			if(typeof this.container=="string"){
				this.container = this.container.replace(/#/,"");
				if(!this.container) return false;
				this.container = $("#"+this.container);
			}
			var container = this.container;
			var action = this.action;
			var id = this.id;
			var complete = opt.complete;
	
			if(!window.FileuploadCallbacks) window["FileuploadCallbacks"] = {};
			window["FileuploadCallbacks"][id] = window["FileuploadCallbacks"][id] || [];
			window["FileuploadCallbacks"][id].push(function(){
				$("#fileuploadBtn_upload"+id).removeClass("disable");
			});
			window["FileuploadCallbacks"][id].push(complete);
	
			var iframe = $('<iframe name="iframefileupload_'+id+'" style="display:none" frameborder="0" class="fileupload_iframe"></iframe>');
			container.append(iframe);
			container.append(tpl);
	
			this.form = container.find(".fileuploadForm");
			this.fileInp = container.find(".fileuploadFileInp");
			this.textInp = container.find(".fileuploadTextInp");
			this.browseBtn = container.find(".filebrowseBtn");
			this.submitBtn = container.find(".fileuploadBtn");
			this.callbackHidInp = container.find(".callbackHidInp");
	
			this.form.attr("target","iframefileupload_"+id);
			this.form.attr("action",action);
			this.fileInp.attr("id","fileuploadFileInp_"+id);
			this.fileInp.attr("name","fileuploadFile_"+id);
			this.browseBtn.attr("for","fileuploadFileInp_"+id);
			this.browseBtn.attr("name","fileupload_callback_"+id);
			this.callbackHidInp.val(id);
			this.submitBtn.attr("id","fileuploadBtn_upload"+id);
	
			this.fileInp.on("change",function(e){
				var val = e.target.value;
				val = val.replace(/\C:\\fakepath\\/,"");
				that.textInp.val(val);
			})
			this.submitBtn.on("click",function(e){
				var tarBtn = $(e.currentTarget);
				var file = $.trim(that.fileInp.val());
				var text = $.trim(that.textInp.val());
				if(tarBtn.hasClass("disable") || !file || !text) return false;
				tarBtn.addClass("disable");
				that.opt.loading(that.getFormControl());
				that.form.submit();
			})
		},
		getFormControl : function(){
			return{
				iframe : this.iframe,
				form : this.form,
				fileInp : this.fileInp,
				textInp : this.textInp,
				browseBtn : this.browseBtn,
				submitBtn : this.submitBtn,
				callbackIDInput : this.callbackHidInp
			}
		}
	};
	
	module.exports = Fileupload;

/***/ },
/* 21 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 22 */,
/* 23 */
/***/ function(module, exports) {

	module.exports = "<!-- Author: huangzhiyang -->\r\n<!-- Date: 2016/6/1 18:39 -->\r\n<!-- Description: huangzhiyang -->\r\n<div class=\"fileuploadWrap\">\r\n    <form class=\"fileuploadForm\" enctype=\"multipart/form-data\" method=\"post\" target=\"\">\r\n        <input style=\"display:none\" type=\"file\" class=\"fileuploadFileInp\"/>\r\n        <input type=\"text\" name=\"\" class=\"fileuploadTextInp\"/>\r\n        <label class=\"filebrowseBtn ctrlBtn\"><i class=\"iconfont\">&#xe692;</i><span class=\"t\">选择</span></label>\r\n        <a class=\"fileuploadBtn ctrlBtn\" href=\"javascript:void(0)\"><i class=\"iconfont\">&#xe659;</i><span class=\"t\">上传</span></a>\r\n        <input type=\"hidden\" class=\"callbackHidInp\" name=\"callback_id\" value=\"\"/>\r\n    </form>\r\n</div>";

/***/ }
/******/ ]);
//# sourceMappingURL=all.js.map