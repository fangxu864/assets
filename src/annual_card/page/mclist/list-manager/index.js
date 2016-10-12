/**
 * Author: huangzhiyang
 * Date: 2016/6/29 16:29
 * Description: ""
 */
var itemContainerTpl = require("./item-container-tpl.xtpl");
var LoadingPc = require("COMMON/js/util.loading.pc.js");
var Api = require("../../../common/api.js");
var itemTpl = require("./list-item-tpl.xtpl");
var Pagination = require("COMMON/modules/pagination-simple");
var State = require("../state.js");
var TabHeader = require("./tab-header");
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
		if(!listData) this.getList(toStatus,1);
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
			var tarBtn=e.currentTarget;
			console.log(this.getParams(tarBtn))
		},
		inavail : function(e){ //禁用
			var tarBtn=e.currentTarget;
			var param=this.getParams(tarBtn);
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

					},
					success: function(res) {//请求成功时处理
						console.log(res);
						if(res.code=="200"){
							PFT.Util.STip("success","禁用成功")
						}else{
							PFT.Util.STip("fail","禁用失败")
						}
					},
					complete: function() {//请求完成的处理

					},
					error: function() {//请求出错处理

					}
				});
			}
		},
		buka:function (e) {//补卡
			var tarBtn=e.currentTarget;
			console.log(this.getParams(tarBtn))
		},
		huifu : function(e){ //恢复
			var tarBtn=e.currentTarget;
			console.log(this.getParams(tarBtn))
		}
	},
	getParams:function (tarBtn) {
		var param={};
		param["memberid"]=$(tarBtn).parent().attr("memberid");
		param["id"]=$(tarBtn).parent().attr("canid");
		param["sid"]=$(tarBtn).parent().attr("sid");
		param["status"]=$(tarBtn).parent().attr("status");
		param["card_no"]=$(tarBtn).parent().attr("card_no");
		param["virtual_no"]=$(tarBtn).parent().attr("virtual_no");
		return param;
	}
});



module.exports = Manager;