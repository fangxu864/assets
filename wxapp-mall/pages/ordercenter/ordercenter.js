var Common = require("../../utils/common.js");
var app = getApp();
Page({
    data: {
		showRefreshLoading : true
    },
	onReady : function(){
		wx.setNavigationBarTitle({title:"我的订单"})
	}
})
