/**
 * Created by Administrator on 2017/5/4.
 */

//---------css--------
require("./index.scss");

//---------tpl--------
var indexTpl = require("./index.xtpl");

//-------通用模块-----
var Message = require("pft-ui-component/Message");
var ParseTemplate = PFT.Util.ParseTemplate;
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
//-------自建模块-----


/**
 * 套餐升级模块
 */
var update = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#G-package-serve-wrap .package-update-box");
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.container.on("click" , ".btn-detail" ,function () {
            var packageId = $(this).attr("data-id");
            console.log(packageId);
            _this.trigger("updateDetailBtnClick" , packageId)
        });
        //上一步
        this.container.on("click" , ".prevBtn" ,function () {
            _this.container.hide();
            $("#G-package-serve-wrap .main-tb-box").show();
        });

        //点击套餐计算差价
        this.container.on("click" , ".newGroup .package-block" ,function () {
            $(this).addClass("active").siblings().removeClass("active");
            var packageId =  $(this).attr("data-id");
            var loadingBox = _this.container.find(".package-update-bottom .loading-box");
            var priceBox = _this.container.find(".package-update-bottom .update-price");
            var loadingStr = PFT.Util.LoadingPc("差价计算中...",{
                tag : "span",
                height: 50
            });
            var params = {
                after_id : packageId
            };
            var paramsKey = $.param(params);

            //判断缓存，有的话就不发请求了
            if(_this.cacheHub[paramsKey]){
                dealRes(_this.cacheHub[paramsKey]);
                return ;
            }
            PFT.Util.Ajax("/r/AppCenter_ModuleList/getUpDifference",{
                type : "post",
                params : params,
                loading : function(){
                    loadingBox.html(loadingStr);
                },
                complete : function(){
                    loadingBox.html("");
                },
                success : function(res){
                    _this.cacheHub[paramsKey] = $.extend({},res);
                    dealRes(res);
                },
                tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
                serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
            });

            function dealRes(res){
                if(res.code == "200"){
                    priceBox.val(res.data);
                }else{
                    Message.error(res.msg);
                }
            }
        });

        this.container.on("mouseenter" , ".newGroup .package-block .tooLong",function (e) {
            var tarTextBox =$(this);
            _this.tipsTimer = setTimeout(function () {
                Tips.closeAllTips();
                Tips.show({
                    lifetime : -1 ,
                    direction:'right',
                    hostObj : tarTextBox ,
                    content : tarTextBox.attr("data-title"),
                    bgcolor : "#0897d9"
                });
            },200);
        });
        this.container.on("mouseout" , ".newGroup .package-block .tooLong",function (e) {
            var tarTextBox =$(this);
            clearTimeout(_this.tipsTimer);
            Tips.closeAllTips();
        })

    },

    render: function () {
        var _this = this;
        $("#G-package-serve-wrap .main-tb-box").hide();
        _this.container.show();
        var _this = this;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "div",
            height : 200
        });
        PFT.Util.Ajax("/r/AppCenter_ModuleList/getUpgradePackageList",{
            type : "post",
            params : {page: 1 ,size: 100},
            loading : function(){
                _this.container.html(loadingStr)
            },
            complete : function(){
                // curContainer.html(loadingStr)
            },
            success : function(res){
                console.log(res);
                newPackage = [];
                curPackage = [];
                for(var i in res.data){
                    if(res.data[i]["is_use"] == 0){
                        newPackage.push(res.data[i])
                    }else{
                        curPackage.push(res.data[i])
                    }
                }
                var html = _this.indexTemplate ({data :{newPackage:newPackage ,curPackage:curPackage}});
                _this.container = _this.container.html(html)

            },
            tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    },

    indexTemplate: ParseTemplate(indexTpl),

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
    },
    cacheHub:{}

});

module.exports = update;