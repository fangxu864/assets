

require("./index.scss");
var Dialog = require("pft-ui-component/Mb_Model");
// var Dialog = require("pft-ui-component/src/Component/Mb_Model");
//基本tpl
var main_tpl = require("./index.xtpl");
//订单详情tpl
var orderDetailTpl = require("./orderDetail.xtpl");
//变更记录tpl
var changTpl = require("./change.xtpl");

var ParseTemplate = PFT.Util.ParseTemplate;

var Alert = require("COMMON/Components/Alert-Mobile/v1.0");
var Common = require("../common.js");

var Toast = require("COMMON/Components/Toast-Mobile/v1.0");
var toast = new Toast();



var Detail  = PFT.Util.Class({
    init: function () {
        var _this = this;
        this.dialog = new Dialog({
            content : main_tpl,
            height : "100%",
            cancelBtn : "返回",
            speed:300,
            cache: false,
            EVENTS : {
                "click .tab-title .tab-btn": function (e) {
                    var curBtn = $(e.target);
                    curBtn.addClass("active").siblings().removeClass("active");
                    var curType = curBtn.attr("data-control");
                    var curCon = {};
                    //订单详细
                    if(curType == "1"){
                        //当前要显示的内容框
                        curCon = this.model.find(".tab-con .order-con");
                        curCon.show().siblings().hide();
                        _this.getDetailData(_this.orderNum , curCon);
                    }
                    //变更记录
                    else if(curType == "2"){
                        curCon = this.model.find(".tab-con .change-con");
                        curCon.show().siblings().hide();
                        _this.getChangeData(_this.orderNum , curCon);
                    }
                }
            },
            onOpenAfter : function () {
                this.model.find(".tab-title .lt-btn").click();
            }

        });
    },

    //订单号
    orderNum: '',
    token: Common.getToken(),

    show: function (ordernum) {
        if( ordernum === undefined ){
            Alert("订单号不存在");
            return false;
        }
        this.orderNum = ordernum;
        this.dialog.open();
    },

    //缓存仓库
    cacheHub:{
        detail:{},
        change:{}
    },
    detailTemplate: ParseTemplate( orderDetailTpl ),
    changeTemplate: ParseTemplate( changTpl ),

    /**
     * @method 获取订单详情数据
     * @param ordernum 订单号
     * @param curCon 要将数据渲染在其中的内容框
     */
    getDetailData: function (ordernum , curCon) {
        var _this = this;

        // var params = _this.paramHub;
        var params = {
            token: _this.token,
            ordernum: ordernum
        };
        //看看是否有缓存
        if(_this.cacheHub.detail[$.param(params)]){
            //render
            var res = _this.cacheHub.detail[$.param(params)];
            dealRes( res );
            return false;
        }else{
            //显示查询状态
            toast.show("loading","努力加载中...");
        }
        $.ajax({
            url: Common.api.orderDetail,    //请求的url地址
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
                _this.cacheHub.detail[$.param(params)] = $.extend({},res);
                dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                toast.hide();
                if(status=="timeout"){
                    Alert(PFT.AJAX_TIEMOUT_TEXT);
                }
            },
            error: function() {
                //请求出错处理
                toast.hide();
                Alert(PFT.AJAX_ERROR_TEXT);
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                if(_this.judgeTrue(res.data)){
                    //渲染数据
                    var html = _this.detailTemplate({data: res.data});

                    curCon.html(html);
                    toast.hide();
                }else{
                    toast.hide();
                    Alert("暂无数据");
                }
            }else{
                //通知queryState模块显示错误信息
                toast.hide();
                Alert(res.msg);
            }
        }
    },

    /**
     * @method 获取变更记录数据
     * @param ordernum 订单号
     * @param curCon 要将数据渲染在其中的内容框
     */
    getChangeData: function (ordernum , curCon) {
        var _this = this;
        // var params = _this.paramHub;
        var params = {
            token: _this.token,
            ordernum: ordernum
        };
        //看看是否有缓存
        if(_this.cacheHub.change[$.param(params)]){
            //render
            var res = _this.cacheHub.change[$.param(params)];
            dealRes( res );
            return false;
        }else{
            //显示查询状态
            toast.show("loading","努力加载中...");
        }
        $.ajax({
            url: Common.api.operatingRecord,    //请求的url地址
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
                _this.cacheHub.change[$.param(params)] = $.extend({},res);
                dealRes( res )
            },
            complete: function(res,status) {
                //请求完成的处理
                toast.hide();
                if(status=="timeout"){
                    Alert(PFT.AJAX_TIEMOUT_TEXT);
                }
            },
            error: function() {
                //请求出错处理
                toast.hide();
                Alert(PFT.AJAX_ERROR_TEXT);
            }
        });

        function dealRes( res ) {
            if(res.code == 200 ){
                if(_this.judgeTrue(res.data)){
                    //渲染数据
                    var html = _this.changeTemplate({data: res.data});

                    curCon.html(html);
                    toast.hide();
                }else{
                    toast.hide();
                    Alert("暂无数据");
                }
            }else{
                //通知queryState模块显示错误信息
                toast.hide();
                Alert(res.msg);
            }
        }
    },

    /**
     * @mehtod 判断真假
     */
    judgeTrue: function( param ) {
        var type = Object.prototype.toString.call(param);
        switch (type){
            case '[object Array]':
                return param.length === 0 ?  !1 : !0 ;
                break;
            case '[object Object]':
                var t;
                for (t in param)
                    return !0;
                return !1;
                break;
            case '[object String]':
                return param === '' ? !1 : !0 ;
                break;
            case '[object Number]':
                return param === 0 ? !1 : !0 ;
                break;
            case '[object Boolean]':
                return param === false ? !1 : !0;
                break;
            case '[object Null]':
                return !1;
                break;
            case '[object Undefined]':
                return !1;
                break;
            default :
                return type;
        }
    }
});

module.exports = Detail;