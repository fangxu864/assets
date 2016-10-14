/**
 * Author: huangzhiyang
 * Date: 2016/6/29 16:29
 * Description: ""
 */
var itemContainerTpl = require("./item-container-tpl.xtpl");
var dialog_loss_tpl=require("./dialog_loss.xtpl");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
var Api = require("../../../common/api.js");
var itemTpl = require("./list-item-tpl.xtpl");
var Pagination = require("COMMON/modules/pagination-simple");
var State = require("../state.js");
var TabHeader = require("./tab-header");
var Dialog_simple=require("COMMON/modules/dialog-simple");

var Manager = Backbone.View.extend({
	el : $("#listSlideContainer"),
	events : {
		"click .doBtn" : "onDoBtnClick"
	},
	paginations : {},
	tableTh : {
		//激活状态
		1 : ["会员姓名","手机号", "虚拟卡号","实体卡号","发卡商户","激活情况","操作"],
		//未激活状态
		0 : ["售出时间","虚拟卡号","实体卡号","发卡商户","激活情况","操作"],
		//禁用状态
		2 : ["会员姓名","手机号","虚拟卡号","实体卡号","发卡商户","激活情况","操作"],
		//挂失状态
		4 : ["会员姓名","手机号","虚拟卡号","实体卡号","发卡商户","激活情况","操作"],
		//全部
		5 : ["会员姓名","手机号","售出时间","实体卡号","发卡商户","激活情况","操作"]
	},
	PAGE_SIZE : 15,
	initialize : function(opt){
		opt = opt || {};
		var that = this;
		// $(".dialog_loss").on("click",".btn_sendCode",function (e) {
		// 	console.log(e.currentTarget)
		// });
		this.state = State;
		this.itemWidth = this.$el.width();
		this.TabHeader = this.initTabHeader();
		this.TabHeader.on("switch",function(data){
			var fromStatus = data.fromStatus;
			var toStatus = data.toStatus;
			that.active(fromStatus,toStatus);
		});
		this.TabHeader.on("searchBtnClick",function(data){
			var searchBtn = data.searchBtn;
			if(searchBtn.hasClass("disable")) return false;
			var status = this.getCurrentState();
			var keyword = this.getKeyword();
			that.getList(status,1,keyword);
		});
		this.statusArr = this.TabHeader.getStatus();
		this.slideUl = this.$el.find(".slideUl");
		this.slideUl.width(this.itemWidth*this.statusArr.length);
		this.buildSlideItem(this.statusArr);
		this.TabHeader.active(5);
		this.Dialog_loss=new Dialog_simple({
			width : 510,
			height :"" ,
			closeBtn : true,
			content :'<div class="dialog_loss"></div>',
			drag : true,
			speed : 200,
			offsetX : 0,
			offsetY : 0,
			overlay : true,
			headerHeightMin :46,
			events : {
				"click .btn_sendCode":function (e) {
					var tarBtn=$(e.currentTarget);
					if(!tarBtn.hasClass("valid")) return false;
					var param=that.getParams(tarBtn.parents(".dialog_loss_con"));
					param["type"]=0;
					param["mobile"]=tarBtn.parents(".dialog_loss_con").attr("mobile");
					$.ajax({
						url: "../r/product_AnnualCard/sendcardVcode/",    //请求的url地址
						dataType: "json",   //返回格式为json
						async: true, //请求是否异步，默认为异步，这也是ajax重要特性
						data: param,    //参数值
						type: "post",   //请求方式
						beforeSend: function() {//请求前的处理
							$(tarBtn).text("60秒后可重新获取...").toggleClass("valid disabled");
							var num=61;
							CountTime();
							function CountTime(){
								num--;
								$(tarBtn).text(num+"秒后可重新获取...");
								if(num>0){
									setTimeout(arguments.callee,1000)
								}else{
									$(tarBtn).text("重新获取短信验证码").toggleClass("valid disabled");
								}
							}
						},
						success: function(res) {//请求成功时处理
							console.log(res);
							if(res.code=="200"){
							   $(".dialog_loss .line2_1").html('<span class="success">'+res.msg+'</span>').slideDown(200)
							}else{
								$(".dialog_loss .line2_1").html('<span class="fail">'+res.msg+'</span>').slideDown(200)
							}
						},
						complete: function() {//请求完成的处理

						},
						error: function() {//请求出错处理
							$(".dialog_loss .line2_1").html('<span class="fail">'+"请求出错"+'</span>').slideDown(200)
						}
					});
				},
				"click .btn_yes":function (e) {
					var tarBtn=$(e.currentTarget);
					if(!tarBtn.hasClass("valid")) return false;
					var param=that.getParams(tarBtn.parents(".dialog_loss_con"));
					param["type"]=0;
					param["mobile"]=tarBtn.parents(".dialog_loss_con").attr("mobile");
					console.log(tarBtn.parents(".dialog_loss_con"));
					var vcode=tarBtn.parents(".dialog_loss_con").find("input.vcode").val();
					param["vcode"]=tarBtn.parents(".dialog_loss_con").find("input.vcode").val();
					var re=/^\d{6}$/;
					if(!re.test(vcode)){
						$(".dialog_loss .line2_1").html('<span class="fail">'+"请输入正确的验证码"+'</span>').slideDown(200);
						tarBtn.parents(".dialog_loss_con").find("input.vcode").focus();
						return false
					}else{
						$(".dialog_loss .line2_1").slideUp(200)
					}
					console.log(param);
					$.ajax({
						url: "../r/product_AnnualCard/sendcardVcode/",    //请求的url地址
						dataType: "json",   //返回格式为json
						async: true, //请求是否异步，默认为异步，这也是ajax重要特性
						data: param,    //参数值
						type: "post",   //请求方式
						beforeSend: function() {//请求前的处理
							$(tarBtn).toggleClass("valid disabled");
						},
						success: function(res) {//请求成功时处理
							console.log(res);
							if(res.code=="200"){
								$(".dialog_loss .line2_1").html('<span class="success">'+res.msg+'</span>').slideDown(200);
								setTimeout(function () {
									that.Dialog_loss.close();
									$(".cardType.active").click()
								},2000)
							}else{
								$(".dialog_loss .line2_1").html('<span class="fail">'+res.msg+'</span>').slideDown(200)
							}
						},
						complete: function() {//请求完成的处理

						},
						error: function() {//请求出错处理
							$(".dialog_loss .line2_1").html('<span class="fail">'+"挂失失败"+'</span>').slideDown(200)
						}
					});
				},
				"click .btn_no":function () {
					that.Dialog_loss.close();
				}
			}
		});
	},
	template : _.template(itemTpl),
	initTabHeader : function(){
		this.TabHeader = new TabHeader({state:State});
		return this.TabHeader;
	},
	//初始化各个pannel的pagination
	initPagination : function(status){
		var that = this;
		for(var i in status){
			var sta = status[i];
			that.paginations[sta] = new Pagination({
				container : "#paginationContainer_"+sta,
				keyup : false,
				onNavigation : function(data){
					var dir = data.dir;
					var fromPage = data.fromPage;
					var toPage = data.toPage;
					var keyword = that.TabHeader.getKeyword();
					var curState = that.TabHeader.getCurrentState();
					that.getList(curState,toPage,keyword);
				}
			});
		}
	},
	onDoBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		if(tarBtn.hasClass("loss")){//挂失
			this.doAction.loss.call(this,e);
		}else if(tarBtn.hasClass("inavail")){ //禁用
			this.doAction.inavail.call(this,e);
		}
		else if(tarBtn.hasClass("buka")){ //补卡
			this.doAction.buka.call(this,e);
		}
		else if(tarBtn.hasClass("huifu")){ //恢复
			this.doAction.huifu.call(this,e);
		}
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
		that.initPagination(status);
	},
	//要切换(激活哪个slide item)
	active : function(fromStatus,toStatus){
		var tarItem = $("#listItemLi_"+toStatus);
		var index = tarItem.index();
		var fromState = this.state[fromStatus];
		var toState = this.state[toStatus] || (this.state[toStatus]={});
		var supply = this.TabHeader.getSupplySelectVal();
		var keyword = this.TabHeader.getKeyword();
		var listData = toState.listData;
		//切换之前，先把当前pannel里的状态保存到state里
		if(fromState) fromState["supply"] = supply;
		if(fromState) fromState["keyword"] = keyword;
		var new_supply = toState.supply;
		var new_keyword = toState.keyword || "";
		this.TabHeader.setKeyword(new_keyword);
		this.TabHeader.setSupplySelectVal(new_supply);
		new_keyword ? $("#clearSearchBtn").show() : $("#clearSearchBtn").hide();
		// if(!listData) this.getList(toStatus,1);
		this.getList(toStatus,1);
		this.slideUl.animate({left:-1*this.itemWidth*index},300);
	},
	getList : function(status,page,keyword){
		var that = this;
		var container = $("#listItemLi_"+status).find(".tbody");
		PFT.Util.Ajax(Api.Url.mclist.getList,{
			params : {
				status : status,
				page : page,
				page_size : that.PAGE_SIZE,
				identify : keyword
			},
			loading : function(){
				var height = 300;
				if(page!=1) height = container.height() || 300;
				var loading = LoadingPc("努力加载中，请稍后..",{
					tag : "tr",
					height : height,
					colspan : that.tableTh[status].length,
					css : {
						"text-align" : "center"
					}
				});
				container.html(loading);
				that.paginations[status].render(null);
			},
			complete : function(){},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					var list = data.list;
					if(list){
						that.state[status] = that.state[status] || (that.state[status]={});
						that.state[status]["listData"] = 1; //标识已请求过
						var html = that.template({data:{
							status : status,
							list : list,
							colspan : that.tableTh[status].length
						}});
						$("#tbody_"+status).html(html);
						
					}else{
						alert("请求出错，缺少list对象");
					}
					var currentPage = data.page;
					var totalPage = data.total_page;
					var total = data.total || 0;
					that.TabHeader.setCount(status,total);
					that.paginations[status].render({current:currentPage,total:totalPage});
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	doAction : {
		loss : function(e){ //挂失
			var _this=this;
			var tarBtn=e.currentTarget;
			if($(tarBtn).hasClass("disabled")){
				return false;
			}
			var template=_.template(dialog_loss_tpl);
			var html=template({data:{
				"memberid":$(tarBtn).parent().attr("memberid"),
				"account":$(tarBtn).parent().attr("account"),
				"id":$(tarBtn).parent().attr("canid"),
				"sid":$(tarBtn).parent().attr("sid"),
				"status":$(tarBtn).parent().attr("status"),
				"card_no":$(tarBtn).parent().attr("card_no"),
				"virtual_no":$(tarBtn).parent().attr("virtual_no"),
				"mobile":$(tarBtn).parent().attr("mobile")
			}});
			$(".dialog_loss").html(html);
			this.Dialog_loss.open();
			// var isForbid=confirm("是否挂失“"+$(tarBtn).parent().attr("account")+"”的会员卡");
			// if(isForbid){
			// 	$.ajax({
			// 		url: "../r/product_AnnualCard/sendcardVcode/",    //请求的url地址
			// 		dataType: "json",   //返回格式为json
			// 		async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			// 		data: param,    //参数值
			// 		type: "post",   //请求方式
			// 		beforeSend: function() {//请求前的处理
			// 			$(tarBtn).text("挂失中...").toggleClass("valid disabled")
			// 		},
			// 		success: function(res) {//请求成功时处理
			// 			console.log(res);
			// 			// if(res.code=="200"){
			// 			// 	PFT.Util.STip("success","禁用成功");
			// 			// 	// $(tarBtn).parent().siblings(".status").text("禁用");
			// 			// 	// $(tarBtn).parent().html(_this.changedHtml("jinyong",$(tarBtn).parent().attr("memberid")))
			// 			// 	$(".cardType.active").click()
			// 			// }else{
			// 			// 	PFT.Util.STip("fail","禁用失败");
			// 			// 	$(tarBtn).text("禁用").toggleClass("valid disabled")
			// 			// }
			// 		},
			// 		complete: function() {//请求完成的处理
			//
			// 		},
			// 		error: function() {//请求出错处理
			// 			PFT.Util.STip("fail","挂失失败");
			// 			$(tarBtn).text("挂失").toggleClass("valid disabled")
			// 		}
			// 	});
			// }
		},
		inavail : function(e){ //禁用
			var _this=this;
			var tarBtn=$(e.currentTarget);
			if($(tarBtn).hasClass("disabled")){
				return false;
			}
			var param=this.getParams(tarBtn.parent());
			param["type"]=1;
			var isForbid=confirm("是否禁用“"+$(tarBtn).parent().attr("account")+"”的会员卡");
			if(isForbid){
				$.ajax({
					url: "../r/product_AnnualCard/operationAnnual/",    //请求的url地址
					dataType: "json",   //返回格式为json
					async: true, //请求是否异步，默认为异步，这也是ajax重要特性
					data: param,    //参数值
					type: "post",   //请求方式
					beforeSend: function() {//请求前的处理
						$(tarBtn).text("禁用中...").toggleClass("valid disabled")
					},
					success: function(res) {//请求成功时处理
						if(res.code=="200"){
							PFT.Util.STip("success","禁用成功");
							// $(tarBtn).parent().siblings(".status").text("禁用");
							// $(tarBtn).parent().html(_this.changedHtml("jinyong",$(tarBtn).parent().attr("memberid")))
							$(".cardType.active").click()
						}else{
							PFT.Util.STip("fail","禁用失败");
							$(tarBtn).text("禁用").toggleClass("valid disabled")
						}
					},
					complete: function() {//请求完成的处理

					},
					error: function() {//请求出错处理
						PFT.Util.STip("fail","禁用失败");
						$(tarBtn).text("禁用").toggleClass("valid disabled")
					}
				});
			}
		},
		buka:function (e) {//补卡
			var tarBtn=e.currentTarget;
		},
		huifu : function(e){ //恢复
			var _this=this;
			var tarBtn=$(e.currentTarget);
			if($(tarBtn).hasClass("disabled")){
				return false;
			}
			var param=this.getParams(tarBtn.parent());
			param["type"]=3;
			var isHuifu=confirm("是否恢复“"+$(tarBtn).parent().attr("account")+"”的会员卡");
			if(isHuifu){
				$.ajax({
					url: "../r/product_AnnualCard/operationAnnual/",    //请求的url地址
					dataType: "json",   //返回格式为json
					async: true, //请求是否异步，默认为异步，这也是ajax重要特性
					data: param,    //参数值
					type: "post",   //请求方式
					beforeSend: function() {//请求前的处理
						$(tarBtn).text("恢复中...").toggleClass("valid disabled")
					},
					success: function(res) {//请求成功时处理
						if(res.code=="200"){
							PFT.Util.STip("success","恢复成功");
							// $(tarBtn).parent().siblings(".status").text("正常");
							// $(tarBtn).parent().html(_this.changedHtml("normal",$(tarBtn).parent().attr("memberid")))
							$(".cardType.active").click()
						}else if(res.code=="501"){
							var isconfirm=confirm('一个手机号只能激活一张年卡，现在【'+res.msg+'】年卡已激活， 需要禁用此卡，激活【'+$(tarBtn).parent().attr("virtual_no")+'】吗?')
							if(isconfirm){
								param["confirm"]=1;
								$.ajax({
									url: "../r/product_AnnualCard/operationAnnual/",    //请求的url地址
									dataType: "json",   //返回格式为json
									async: true, //请求是否异步，默认为异步，这也是ajax重要特性
									data: param,    //参数值
									type: "post",   //请求方式
									beforeSend: function() {
										//请求前的处理
									},
									success: function(res) {//请求成功时处理
										if(res.code=="200"){
											PFT.Util.STip("success","恢复成功");
											// $(tarBtn).parent().siblings(".status").text("正常");
											// $(tarBtn).parent().html(_this.changedHtml("normal",$(tarBtn).parent().attr("memberid")))
											$(".cardType.active").click()
										}else{
											PFT.Util.STip("fail","恢复失败");
											$(tarBtn).text("恢复").toggleClass("valid disabled")
										}
									},
									complete: function() {
										//请求完成的处理
									},
									error: function() {
										//请求出错处理
										PFT.Util.STip("fail","恢复失败");
										$(tarBtn).text("恢复").toggleClass("valid disabled")
									}
								});
							}
							else{
								PFT.Util.STip("fail","恢复取消");
								$(tarBtn).text("恢复").toggleClass("valid disabled")
							}
						}else{
							PFT.Util.STip("fail","恢复失败");
							$(tarBtn).text("恢复").toggleClass("valid disabled")
						}
					},
					complete: function() {//请求完成的处理

					},
					error: function() {//请求出错处理
						PFT.Util.STip("fail","恢复失败");
						$(tarBtn).text("恢复").toggleClass("valid disabled")
					}
				});
			}
		}
	},
	getParams:function (tarBtn) {
		var param={};
		param["memberid"]=tarBtn.attr("memberid");
		param["id"]=tarBtn.attr("canid");
		param["sid"]=tarBtn.attr("sid");
		param["status"]=tarBtn.attr("status");
		param["card_no"]=tarBtn.attr("card_no");
		param["virtual_no"]=tarBtn.attr("virtual_no");
		param["confirm"]=0;
		return param;
	},
	changedHtml:function(type,memberid) {
		switch (type) {
			case "jinyong":{
				return '  <a style="margin-right:8px" class="doBtn detail" target="_blank" href="annual_memdetail.html?id='+memberid+'">查看</a> <a style="margin-right:8px" class="doBtn loss valid" href="javascript:void(0);">挂失</a> <a  href="javascript:void(0);" class="doBtn huifu valid">恢复</a>'
				break;
			}
			case "loss":{
				return '  <a style="margin-right:8px" class="doBtn detail" target="_blank" href="annual_memdetail.html?id='+memberid+'">查看</a><a style="margin-right:8px" class="doBtn buka valid" href="javascript:void(0);">补卡</a> <a  href="javascript:void(0);" class="doBtn inavail valid">禁用</a>'
				break;
			}
			case "normal":{
				return '  <a style="margin-right:8px" class="doBtn detail" target="_blank" href="annual_memdetail.html?id='+memberid+'">查看</a> <a style="margin-right:8px" class="doBtn loss valid" href="javascript:void(0);">挂失</a> <a  href="javascript:void(0);" class="doBtn inavail valid">禁用</a>'
				break;
			}
			default:{
				alert("参数错误");
			}
		}
	}
});



module.exports = Manager;