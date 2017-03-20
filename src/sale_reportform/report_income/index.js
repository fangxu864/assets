/**
 * Created by fx on 2017/2/17.
 */
require("./index.scss");

var Filter = require("./modules/filter/filter.js");
var TableCon = require("./modules/table-con/table-con.js");
var Pagination = require("./modules/pagination/pagination.js");
var QueryState = require("./modules/query-state/query-state.js");
var Print = require("./modules/print/print.js");
var Dialog = require("./modules/dialog/dialog.js");

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
        var CR = createCR("#refundApplyWrap");
        //title
        if(/chrome/i.test(navigator.userAgent)){
            CR.mainBox.append('<div class="topTitleBox"><span>提现申请列表</span></div>');
        }else{
            CR.mainBox.append(
                '<div class="topTitleBox">' +
                '<span>提现申请列表</span>' +
                '<span class="tip">* 操作本页建议使用chrome(谷歌)浏览器,可以进行打印预览</span>' +
                '</div>'
            );
        }
        //filter
        Filter.init(CR);
        //tableCon
        TableCon.init(CR);
        //queryState
        QueryState.init(CR);
        //pagination
        Pagination.init(CR);
        //print
        Print.init(CR);
        //dialog
        Dialog.init(CR);
    }
};

$(function () {
    Main.init();
});
