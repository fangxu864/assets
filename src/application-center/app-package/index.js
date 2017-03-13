/**
 * Created by fx on 2017/2/17.
 */
require("./index.scss");

var DC = require("./modules/dataCenter/dataCenter.js");
var AdBoxModule = require("./modules/adBox/adBox.js");
var ProgressModule = require("./modules/progress/progress.js");
var First_packPickModule = require("./modules/first_packPick/first_packPick.js");
var First_packDetailModule = require("./modules/first_packDetail/first_packDetail.js");
var Second_packDetailModule = require("./modules/second_packDetail/second_packDetail.js");
var PaySuccessModuleModule = require("./modules/paySuccess/paySuccess.js");
var QueryStateModule = require("./modules/query-state/query-state.js");

/**
 * @method 创建各子模块公共资源的方法
 * @param mainBox
 * @returns {{mainBox: *, common: number, pubSub: {storage: {}, pub: pubSub.pub, sub: pubSub.sub, removeSub: pubSub.removeSub}}}
 */
function createCR( mainBox ) {
    var container = typeof mainBox=="string" ? $(mainBox) : mainBox;
    return {
        //公共的父容器
        mainBox: container,
        //公用的观察者
        pubSub: {
            
            storage: {},
            
            pub: function (events, arg) {
                var arr = this.storage[events];
                var len = Object.prototype.toString.call(arr) === '[object Array]' ? arr.length : 0;
                if (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        arr[i](arg);
                    }
                }
            },
            
            sub: function (events, fn) {
                if (!this.storage[events])
                    this.storage[events] = [];
                this.storage[events].push(fn)
            },
            
            removeSub: function (events) {
                delete this.storage[events];
            }

        }
    };
}

/**
 * 本模块为主模块
 * 主模块中有一个CR对象，是各个模块的公用资源
 * 在初始化各子模块的时候注入CR对象
 */
var Main = {
    init : function () {
        //CR(Common resource)公共资源，即各个模块的公用资源
        var CR = createCR("#appPackageWrap");
        //dataCenter
        DC.init(CR);
        //qurery-State
        QueryStateModule.init(CR);
        //adBox
        AdBoxModule.init(CR);
        //progress  进度模块
        ProgressModule.init(CR);
        // first_packPick 第一步中的套餐选择模块
        First_packPickModule.init(CR);
        // second_packDetailModule 第1步中的套餐详情模块
        First_packDetailModule.init(CR);
        // second_packDetailModule 第2步中的套餐详情模块
        Second_packDetailModule.init(CR);
        //支付成功模块
        PaySuccessModuleModule.init(CR)

    }
};

$(function () {
    Main.init();
});

