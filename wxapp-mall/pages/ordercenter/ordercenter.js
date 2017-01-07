var Common = require("../../utils/common.js");
var app = getApp();
Page({
    data: {
		showRefreshLoading : true,
		list : []
    },
	onReady : function(){
		wx.setNavigationBarTitle({title:"我的订单"});
	},
	onScrollLower : function(){

	},
	onScroll : function(){

	}

})
