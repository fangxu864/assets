/**
 * Author: huangzhiyang
 * Date: 2016/10/12 17:19
 * Description: ""
 */
require("./index.scss");
var Toast = new PFT.Mobile.Toast();
var Alert = PFT.Mobile.Alert;
var Confirm = PFT.Mobile.Confirm;
var XScroll = require("vux-xscroll/build/cmd/xscroll");
var Pullup = require("vux-xscroll/build/cmd/plugins/pullup");
var Service = require("SERVICE_M/mall-member-user-order");
var Tpl = {
	unuse : require("./tpl/unuse.item.xtpl"),
	history : require("./tpl/history.item.xtpl")
};
var Detail = require("./orderdetail");

var Search = require("./search");

var Main = PFT.Util.Class({
	container : "#bodyContainer",
	EVENTS : {
		"click .fixHeader .tabItem" : "onTabTriggerClick",
		"click .unuseItem .btn" : "onActionBtnClick",
		"click #history-searchBar .searchBtn" : "onHistorySearchBtnClick",
		"click #history-searchBar .clearBtn" : "onHistoryClearBtnClick"
	},
	template : {
		unuse : PFT.Util.ParseTemplate(Tpl.unuse),
		history : PFT.Util.ParseTemplate(Tpl.history)
	},
	scroll : {},
	pullup : {},
	PAGE_SIZE : 10,
	page : {
		unuse : {
			current : 0,
			total : 0
		},
		history : {
			current : 0,
			total : 0
		}
	},
	init : function(){
		var that = this;
		this.tabPannelWrap = $("#tabPannelWrap");
		this.fixTabHead = $("#fixTabHead");
		this.fixTabHead.children().first().trigger("click");
		this.Detail = new Detail({Service:Service});
		this.Detail.on("btn.click",function(e){
			that.onActionBtnClick(e,"detail");
		})
		this.initRouter();

		this.initSearch();




	},
	initScroll : function(type){
		var that = this;
		var scroll = this.scroll;
		var pullup = this.pullup;
		var scrollRendTo = type=="unuse" ? "#unusePannel .scrollWrap" : "#historyPannel .scrollWrap";
		scroll[type] = new XScroll({
			renderTo : scrollRendTo,
			scrollbarX : false,
			scrollbarY : true,
			//touchAction : "touchend",
			lockY : false
		});
		pullup[type] = new Pullup({
			content : "上拉加载更多...",
			upContent:"上拉加载更多...",
			downContent:"释放加载数据...",
			loadingContent:"努力加载中...",
			bufferHeight:0
		});
		scroll[type].plug(pullup[type]);
		pullup[type].on("loading",function(){
			that.onPullupLoading(type);
		});

		//unuseScroll.render();

	},
	initSearch : function(){
		var that = this;
		var searchBar = this.searchBar = $("#history-searchBar");
		var searchText = this.searchText = searchBar.find(".searchText");
		var clearBtn = searchBar.find(".clearBtn");
		this.search = new Search();
		this.search.on("search",function(data){
			searchText.text(data.beginDate+" 至 "+data.endDate);
			clearBtn.css({display:"inline-block"});
			that.fetchData("history",1,{
				beginDate : data.beginDate,
				endDate : data.endDate,
				dateType : data.type
			},"refreshScroll")
		});
		this.search.on("reset",function(){
			searchText.text("搜索订单");
			clearBtn.css({display:"none"});
			that.fetchData("history",1,{},"refreshScroll");
		})
	},
	initRouter : function(){
		var that = this;
		var Router = Backbone.Router.extend({
			routes : {
				"" : "home",
				"detail/:ordernum" : "detail"
			},
			initialize : function(){

			},
			home : function(){
				that.Detail.close();
			},
			detail : function(ordernum){
				that.Detail.show(ordernum)
			}
		})
		this.router = new Router;
		Backbone.history.start();
	},
	/**
	 * 获取订单列表核心方法
	 * @param    type {string}  "unuse"或"history"
	 * @param    page {number}
	 * @returns {boolean}
	 */
	fetchData : function(type,page,params,refreshScroll){
		if(!type || !page) return false;
		var scroll = this.scroll[type];
		var pullup = this.pullup[type];
		var pageData = this.page[type];
		var listUl = $("#listUl-"+type);
		params = params || {};
		params["type"] = type;
		params["page"] = page;
		params["pageSize"] = this.PAGE_SIZE;
		Service.list(params,{
			loading : function(){
				if(page!=1) return false;
				Toast.show("loading","努力加载中...");
			},
			complete : function(){
				if(page!=1) return false;
				Toast.hide();
			},
			empty : function(data){
				pageData["current"] = page;
				if(page==1){
					this.renderList(type,page,"empty");
				}else if(page>1){
					this.renderList(type,page,"noMore");
				}
			},
			success : function(data){
				var totalPage = data.totalPage;
				pageData["current"] = page;
				pageData["total"] = totalPage;
				this.renderList(type,page,data.list);
				if(page==1){ //第一次加载时
					if(!refreshScroll){
						this.initScroll(type);
					}else{
						scroll.render();
						scroll.scrollTop(0);
					}
					if(page==totalPage){ //所有数据只有一页，此时须禁用掉加载更多
						this.scroll[type].unplug(this.pullup[type]);
					}
				}else{ //加载更多时
					pullup && pullup.complete();
					if(page==totalPage){ //当加载到最后一页时，没有更多可加载时需disable pullup
						scroll.unplug(pullup);
						this.renderList(type,page,"noMore");
					}
					scroll.render();
				}
			},
			fail : function(msg,code){
				Alert("提示",msg);
				if(code==102){ //未登录
					window.location.href = "usercenter.html";
				}
			}
		},this)
	},
	renderList : function(type,page,data){
		var html = "";
		if(data=="empty"){
			html = '<li class="sta empty">暂无相关订单...</li>';
		}else if(data=="noMore"){
			html = '<li class="noMore empty">没有更多了...</li>';
		}else{
			html = this.template[type] ? this.template[type]({data:data}) : "";
		}
		var listUl = $("#listUl-"+type);
		if(page==1){
			listUl.html(html);
		}else if(page>1){
			listUl.append(html);
		}
	},
	onHistorySearchBtnClick : function(e){
		var searchText = $("#history-searchBar").find(".searchText").text();
		var beginDate = "";
		var endDate = "";
		if(searchText.indexOf("至")>-1){
			searchText = searchText.split("至");
			beginDate = $.trim(searchText[0]);
			endDate = $.trim(searchText[1]);
		}
		this.search.show(beginDate,endDate);
	},
	onPullupLoading : function(type){

		if(type=="history"){
			var con = $("#searchSheetContainer");
			console.log($("#beginDateInp"))
			var beginDate = $("#beginDateInp").val();
			var endDate = $("#endDateInp").val();
			var _type = con.find(".dateTypeGroup .active").attr("data-type");
			this.fetchData("history",this.page[type]["current"],{
				beginDate : beginDate,
				endDate : endDate,
				dateType : _type
			});
		}else{
			this.fetchData(type,this.page[type]["current"]+1);
		}

		//this.fetchData(type,this.page[type]["current"]+1);
	},
	onTabTriggerClick : function(e){
		var tarTab = $(e.currentTarget);
		var type = tarTab.attr("data-type");
		if(tarTab.hasClass("active")) return false;
		tarTab.addClass("active").siblings().removeClass("active");

		var tarPannel = this.tabPannelWrap[0].querySelector("[data-type="+type+"]");
		tarPannel = $(tarPannel);
		tarPannel.show().siblings().hide();

		if(this.page[type]["current"]==0) this.fetchData(type,1);

	},
	onHistoryClearBtnClick : function(e){
		this.search.reset();
	},
	onActionBtnClick : function(e,type){
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var ordernum = tarBtn.attr("data-ordernum");
		if(!ordernum) return false;
		if(tarBtn.hasClass("pay")){ //支付
			var host = "";
			var hostname = window.location.hostname;
			if(hostname.split(".")[0]=="wx"){
				host = hostname;
			}else{
				host = hostname + "/wx";
			}
			window.location.href="http://"+host+"/html/order_pay_c.html?ordernum="+ordernum+'&h='+hostname;
		}else if(tarBtn.hasClass("cancel")){ //取消订单
			Confirm("确定要取消订单吗？",function(resulst){
				console.log(resulst);
				if(resulst==false) return false;
				Service.cancel(ordernum,{
					loading : function(){ tarBtn.text("取消中...").addClass("disable")},
					complete : function(){ tarBtn.text("取消订单").removeClass("disable")},
					success : function(res,code){
						var msg = res.msg || "取消成功";
						// this.Detail.clearCache(ordernum);
						Alert(msg);
						var status_text = code==200 ? "已取消" : "退票中";
						if(type=="detail"){
							that.Detail.fetchDetailInfo(ordernum,function(data){
								$("#orderItem-"+ordernum).find(".btnGroup .cancel").text(status_text).addClass("disable");
							});
						}else{
							tarBtn.text(status_text).addClass("disable");
						}
					},
					fail : function(msg){
						Alert(msg);
					}
				},this)
			})

		}
	}
});


$(function(){
	new Main;
})


