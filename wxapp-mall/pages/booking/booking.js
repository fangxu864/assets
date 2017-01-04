//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        date : "2016-11-20",
        title : "产品预订页"
    },
    onReady : function(){
        var that = this;
        wx.setNavigationBarTitle({
          title: that.data.title
        })
    },
    bindDateChange : function(date){
		date = date.detail.value;
		this.setData({date : date})

    },
    onLoad: function () {
        console.log("booking onLoad...")
    }
})
