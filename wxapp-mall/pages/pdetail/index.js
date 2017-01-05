//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        scroll_into_view : "" ,
        isfixed : "" ,
        floor_1_active: "active"
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
        console.log(e);
        if(e.detail.scrollTop >= 214){
            this.setData({
                isfixed : "fixed"
            })
        }else{
            this.setData({
                isfixed : ""
            })
        }
    }
})
