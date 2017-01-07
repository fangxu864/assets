var Common = require("../../utils/common.js");
var app = getApp();
Page({
    data: {
		page : {
			unset : 1,
			history : 0
		},
		pageSize : 6,
		list : {
			unuse : [],
			history : []
		},
		currentTab : "unuse",
		unuse_showRefreshLoading : false,
		history_showRefreshLoading : false,
		unuse_moreLoading : false,
		history_moreLoading : false,
		unuse_hasMore : true,
		history_hasMore : true
    },
	onReady : function(){
		wx.setNavigationBarTitle({title:"我的订单"});
		var that = this;
		var oData = this.data;

		this.queryList({
			type : oData.currentTab,
			page : 1,
			loading : function(){
				Common.showLoading();
				that.setData({unuse_showRefreshLoading:true})
			},
			complete : function(){
				Common.hideLoading();
				that.setData({unuse_showRefreshLoading:false})
			},
			success : function(data){
				var totalPage = data.totalPage;
				var list = data.list;
				var page = data.page;
				that.setData({"list.unuse":list});
				that.setData({unuse_hasMore:page>=totalPage ? false : true});
			},
			empty : function(){},
			error : function(msg,code){
				Common.showError(msg+" 错误代码："+code);
			}
		})
	},
	onImageError : function(e){
		var dataset = e.currentTarget.dataset;
		var ordernum = dataset.ordernum;
		var type = dataset.type;
		var list = this.data.list[type];
		list.forEach(function(item){
			var _ordernum = item.ordernum;
			console.log(_ordernum)
		})
	},
	onTabClick : function(e){
		var that = this;
		var type = e.currentTarget.dataset.tab;
		this.setData({currentTab:type});
		if(type=="history" && this.data.page.history==0){
			this.setData({"page.history":1});
			this.queryList({
				type : type,
				page : 1,
				loading : function(){
					Common.showLoading();
					that.setData({history_showRefreshLoading:true})
				},
				complete : function(){
					Common.hideLoading();
					that.setData({history_showRefreshLoading:false})
				},
				success : function(data){
					var totalPage = data.totalPage;
					var list = data.list;
					var page = data.page;
					that.setData({"list.history":list});
					that.setData({history_hasMore:page>=totalPage ? false : true});
				},
				empty : function(){},
				error : function(msg,code){
					Common.showError(msg+" 错误代码："+code);
				}
			})
		}
	},
	scrollToLower : function(e){
		var that = this;
		var oData = this.data;
		var type = this.data.currentTab;
		if(oData.unuse_showRefreshLoading || oData.history_showRefreshLoading || oData.unuse_moreLoading || oData.history_moreLoading) return false;

		if(type=="unuse" && !oData.unuse_hasMore) return false;
		if(type=="history" && !oData.history_hasMore) return false;

		this.queryList({
			type : type,
			page : oData.page[type] + 1,
			loading : function(){
				if(type=="unuse"){
					that.setData({unuse_moreLoading:true})
				}else{
					that.setData({history_moreLoading:true})
				}
			},
			complete : function(){
				if(type=="unuse"){
					that.setData({unuse_moreLoading:false})
				}else{
					that.setData({history_moreLoading:false})
				}
			},
			success : function(data){
				var totalPage = data.totalPage;
				var list = data.list;
				var page = data.page;
				var listKey = type=="unuse" ? "list.unuse" : "list.history";
				var hasMoreKey = type=="unuse" ? "unuse_hasMore" : "history_hasMore";

				var oldList = oData.list[type];
				var newList = oldList.concat(list);


				var listData = {};
				listData[listKey] = newList;
				var moreData = {};
				moreData[hasMoreKey] = page>=totalPage ? false : true;

				that.setData(listData);
				that.setData(moreData);
			},
			empty : function(){},
			error : function(msg,code){
				Common.showError(msg+" 错误代码："+code);
			}
		})



	},
	queryList : function(opt){
		var fn = function(){};
		var type = opt.type || "unuse";
		var page = opt.page || 1;
		var pageSize = opt.pageSize || this.data.pageSize;
		var beginDate = opt.beginDate || "";
		var endDate = opt.endDate || "";
		var dateType = opt.dateType || "";
		var loading = opt.loading || fn;
		var complete = opt.complete || fn;
		var success = opt.success || fn;
		var empty = opt.empty || fn;
		var error = opt.error || fn;
		Common.request({
			url : "/r/Mall_Member/getOrderList/",
			data : {
				type : type,
				page : page,
				pageSize : pageSize,
				beginDate : beginDate,
				endDate : endDate,
				dateType : dateType
			},
			loading : function(){
				loading();
			},
			complete : function(){
				complete();
			},
			success : function(res){
				var code = res.code;
				var msg = res.msg;
				var data = res.data;
				var list = data.list;
				if(code==200){
					if(list.length>0){
						success(data);
					}else{
						empty(data);
					}
				}else{
					error(msg,code);
				}
			}
		})





	},
	onScroll : function(){

	}

})
