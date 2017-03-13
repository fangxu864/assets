
var DataCenter = {
    init: function (CR) {
        var _this = this;
        this.CR = CR;
    },
    
    bind: function () {
        var _this = this;
        // 获取首页的套餐情况
        this.CR.pubSub.sub("DC.getPackageList", function () {
            _this.getPackageList();
        })

    },

    /**
     * @method 获取首页的套餐情况
     */
    getPackageList: function () {

    }

};


module.exports = DataCenter;