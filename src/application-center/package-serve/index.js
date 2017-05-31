/**
 * Created by Administrator on 2017/5/4.
 */

//---------css--------
require("./index.scss");

//---------tpl--------
var indexTpl = require("./tpl/index.xtpl");
var mainListTrTpl = require("./tpl/mainListTr.xtpl");
//-------通用模块-----
var Message = require("pft-ui-component/Message");
var ParseTemplate = PFT.Util.ParseTemplate;
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
//-------自建模块-----
var renderNav = require("./nav/index.js");
var Detail = require("./detail/index.js");
var Update = require("./update/index.js");

var packServe = PFT.Util.Class({

    init: function () {
        var _this = this;
        this.container = $("#G-package-serve-wrap");
        this.container.html(indexTpl);
        renderNav("6" , _this.container.find(".sec-nav-box"));
        this.getListData();
        this.bind();
    },

    bind: function () {
        var _this = this;
        var CON = this.container;
        //点击详情
        CON.on("click" , ".main-tb .btn-detail" ,function () {
            var packageId = $(this).attr("data-id");
            if(!_this.detail){
                _this.detail = new Detail();
                _this.detail.render(packageId );
            }else{
                _this.detail.render(packageId );
            }
        });

        //点击升级
        CON.on("click" , ".main-tb .btn-update" ,function () {
            if(!_this.update){
                _this.update = new Update();
                _this.update.on("updateDetailBtnClick" ,function (packageId) {
                    if(!_this.detail){
                        _this.detail = new Detail();
                        _this.detail.render(packageId );
                    }else{
                        _this.detail.render(packageId );
                    }
                });
                _this.update.render();

            }else{
                _this.update.render();
            }
        })
        
    },
    
    getListData: function () {
        var _this = this;
        var curContainer =  this.container.find(".main-tb-box .main-tb tbody");
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "tr",
            colspan : 8,
            height : 200
        });
        PFT.Util.Ajax("/r/AppCenter_ModuleList/getPackageUseLogList",{
            type : "post",
            params : {page: 1 ,size: 100},
            loading : function(){
                curContainer.html(loadingStr)
            },
            complete : function(){
                // curContainer.html(loadingStr)
            },
            success : function(res){
                if(res.code == 200 ){
                    if(_this.judgeTrue(res.data)){
                        var html = _this.indexTemplate({data: res.data});
                        curContainer.html(html);
                    }else{
                        var msg = "暂无数据，请稍候重试。";
                        curContainer.html('<tr><td colspan="8" style="line-height: 200px;font-size: 14px;color: orangered">'+msg+'</td></tr>');
                    }
                }else{
                    curContainer.html('<tr><td colspan="8" style="line-height: 200px;font-size: 14px;color: orangered">'+res.msg+'</td></tr>');
                }
            },
            tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    },

    indexTemplate: ParseTemplate(mainListTrTpl),

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

$(function () {
    new packServe();
});
