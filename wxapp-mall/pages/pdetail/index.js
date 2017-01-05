//index.js
//获取应用实例
var Common = require("../../utils/common.js");
var app = getApp();
Page({
    data: {
        scroll_into_view : "" ,
        isfixed : "" ,
        floor_1_active: "active" ,
        title : "产品详情页",
        land :{}
    },


    /**
     * @method 当点击tab时
     * @param e
     */
    onTabTitleTap: function (e) {
        this.setData({
            scroll_into_view: e.target.dataset.type,
            isfixed : "fixed"
        });
        switch (e.target.dataset.type){
            case "floor_1" :
                this.setData({
                    floor_1_active: "active",
                    floor_2_active: "",
                    floor_3_active: ""
                });
                break;
            case "floor_2" :
                this.setData({
                    floor_1_active: "",
                    floor_2_active: "active",
                    floor_3_active: ""
                });
                break;
            case "floor_3" :
                this.setData({
                    floor_1_active: "",
                    floor_2_active: "",
                    floor_3_active: "active"
                });
                break;
        }
    },


    /**
     * @method 页面滚动时
     * @param e
     */
    onScroll: function (e) {
        var _this = this ;
        if(e.detail.scrollTop >= 214){
            _this.setData({
                isfixed : "fixed"
            })
        }else{
            _this.setData({
                isfixed : ""
            })
        }
    },


    /**
     *  初始化页面
     */
    onLoad: function() {
        var _this = this;
        Common.request({
            url: "/r/Mall_Product/getLandInfo/",
            data: {
                lid: "8264"
            },
            loading: function () {
                Common.showLoading()
            },
            complete: function () {
                Common.hideLoading();
            },
            success: function (res) {
                console.log(res);
                _this.setData({
                    land : res.data
                })
            }
        })
    },


    /**
     * onReady
     */
    onReady : function(){
        let that = this;
        wx.setNavigationBarTitle({
            title: that.data.title
        });
    },
});
