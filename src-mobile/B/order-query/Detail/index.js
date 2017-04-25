

require("./index.scss");
// var Dialog = require("pft-ui-component/Mb_Model");
var Dialog = require("pft-ui-component/src/Component/Mb_Model");
var main_tpl = require("./index.xtpl");

var Common = require("../common.js");



var Detail  = PFT.Util.Class({
    init: function () {
        console.log(111);
        this.dialog = new Dialog({
            content : main_tpl,
            height : "auto",
            cancelBtn : "返回",
            speed:300,
            cache: false,
            EVENTS : {
                "click .tab-title .tab-btn": function (e) {
                    var curBtn = $(e.target);
                    curBtn.addClass("active").siblings().removeClass("active");
                    var curCon = curBtn.attr("data-control");
                    this.model.find(".tab-con ." + curCon).show().siblings().hide();
                }
            }
        });

        this.open();
        this.getData();
    },


    open: function () {
        this.dialog.open();
        this.dialog.model.css("height" , '100%');
    },

    /**
     * @method 获取数据
     */
    getData: function () {
        var _this = this;

        // var params = _this.paramHub;
        var params = {
            token: Common.getToken(),
            ordernum: 4007774
        };
        //看看是否有缓存
        // if(_this.cacheHub[$.param(_this.paramHub)]){
        //     //render
        //     setTimeout(function () {
        //         var res = _this.cacheHub[$.param(params)];
        //         dealRes( res )
        //     },100);
        //     return false;
        // }else{
        //     //显示查询状态
        //     _this.showLoading('loading');
        // }
        $.ajax({
            url: "/r/MicroPlat_Order/orderDetail",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: params,    //参数值
            type: "POST",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                //缓存数据
                console.log(res)

                //所端返回的所有与钱有关的，都是分为单位，所以前端需要除100
                // var numberToFixed = PFT.Util.numberToFixed;
                // var data = res.data;
                // for(var i in data){
                //     var item = data[i];
                //     var ls = numberToFixed(item.ls/100,2);
                //     var js = numberToFixed(item.js/100,2);
                //     item["js"] = js;
                //     item["ls"] = ls;
                // }
                //
                //
                // _this.cacheHub[$.param(params)] = $.extend({},res);
                // dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                _this.hideLoading();
                if(status=="timeout"){
                    Message.error(PFT.AJAX_TIEMOUT_TEXT);
                }
            },
            error: function() {
                //请求出错处理
                _this.hideLoading();
                Message.error(PFT.AJAX_ERROR_TEXT);
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                if(Util.judgeTrue(res.data)){
                    //渲染价格显示
                    var tbody = _this.container.find('.calendar-tb tbody');
                    var curPrice = {};
                    var curTd = {};

                    for(var key in res.data){
                        curPrice =  tbody.find('td[data-date = '+ key +'] .price');
                        curTd = tbody.find('td[data-date = '+ key +']');
                        //test
                        // if(/5$/.test(key)){
                        //     res.data[key].storage = 0
                        // }

                        if(res.data[key].storage == 0){
                            curPrice.text('售罄');
                        }else{
                            curPrice.text('¥' + res.data[key].js);
                            curTd.removeClass("disable").addClass("usable");
                            curTd.attr("data-storage",res.data[key].storage);
                            curPrice.prop("title" , '¥' + res.data[key].js);
                            curPrice.attr("data-js" , res.data[key].js);
                            curPrice.attr("data-ls" , res.data[key].ls);
                        }
                    }
                    _this.hideLoading();
                }else{
                    _this.hideLoading();
                    // _this.showLoading("error","暂无价格数据");
                }
            }else{
                //通知queryState模块显示错误信息
                _this.showLoading("error",res.msg);
            }
        }
    },

    showLoading: function (type , text) {
        var _this = this;
        var box = _this.container.find('.loading-box');
        var loadingStr = '<img src="http://static.12301.cc/images/icons/gloading.gif" alt="加载中..."/>';
        switch (type){
            case 'loading':
                box.html(loadingStr)
                    .show();
                break;
            case 'error':
                box.html(text)
                    .show();
                break;
            default:
                box.html(loadingStr)
                    .show();
                break;
        }
    },




});

module.exports = Detail;