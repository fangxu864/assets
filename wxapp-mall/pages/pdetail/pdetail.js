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
        land :{} ,
        ticketList: [] ,
        taoPiaoTicketList: [] ,
        isRenderTaoPiaoList: true
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
    onLoad: function( opt ) {
        console.log(opt);
        var lid = opt.lid;
        var _this = this;
        //banner，景区信息请求
        Common.request({
            url: "/r/Mall_Product/getLandInfo/",
            data: {
                // lid: "2107"
                lid: lid
            },
            loading: function () {
                Common.showLoading()
            },
            complete: function () {
                Common.hideLoading();
            },
            success: function (res) {
                console.log(res);
                var ydTxt = res.data.jqts;
                
                _this.setData({
                    land : res.data,
                })
            }
        });
        //票列表请求
        Common.request({
            url: "/r/Mall_Product/getTicketList/",
            data: {
                // lid: "2107"
                lid: lid
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
                    ticketList : res.data.list,
                })
            }
        });
        //套票数据
        Common.request({
            url: "/r/Mall_Product/getRelatedPackage/",
            data: {
                // lid: "2107"
                lid: lid
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
                    taoPiaoTicketList : res.data
                });
                if(res.data.length == 0){
                    _this.setData({
                        isRenderTaoPiaoList : false
                    })
                }
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


    /**
     * @method  点击预订按钮时
     */
    onBookBtnTap: function (e) {
        wx.navigateTo({
            url: '../booking/booking?aid=' + e.target.dataset.aid + '&pid=' + e.target.dataset.pid
        });
    },


    /**
     * 打开地图查看位置
     */
    openMap: function(){
         wx.openLocation({
            latitude: 26.074508,
            longitude: 119.296494,
            scale: 28
        })
    }
});
