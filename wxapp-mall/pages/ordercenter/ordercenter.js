var Common = require("../../utils/common.js");
var app = getApp();
var _data = {
	"ltitle": "【测试】每周五测试套票",
	"ttitle": "普通票",
	"ordernum": "3327471",
	"code": "461387",
	"begintime": "2016-08-23",
	"endtime": "2016-09-22",
	"tnum": "1",
	"paystatus": "1", //1已支付，2未支付,
	"ptype": "F",
	"tickets": [    //联票才有
		{
			"title": "测试新票2",
			"num": "1"
		},
		{
			"title": "测试新票1",
			"num": "1"
		}
	],
	"cancel" : 1//1可取消,0不可取消
};
Page({
    data: {

		list : {
			unset : []
		},
		unuse_hidden : "hidden",
		history_hidden : "",
		unuse_showRefreshLoading : false,
		history_showRefreshLoading : false,
		unuse_hasMore : true,
		history_hasMore : true
    },
	onReady : function(){
		wx.setNavigationBarTitle({title:"我的订单"});
		var data = [];
		for(var i=0; i<10; i++) data.push(_data);

		this.setData({
			"list.unset" : data
		})
	},
	scrollToLower : function(e){

	},
	onScroll : function(){

	}

})
