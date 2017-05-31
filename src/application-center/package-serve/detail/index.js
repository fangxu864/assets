/**
 * Created by Administrator on 2017/3/1.
 */


//---------css--------
require("./index.scss");

//---------tpl--------
var indexTpl = require("./index.xtpl");

//--------modules-----
var Dialog = require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Message = require("pft-ui-component/Message");

var detail = PFT.Util.Class({

    init: function () {
        this.dial = new Dialog({
            width : 700,
            height: 500,
            offsetY : -80,
            closeBtn : true,
            content : "",
            drag : true,
            speed : 100,
            onCloseAfter : function(){
            }
        });
        this.container = this.dial.container.find(".gSimpleDialog-content");
        this.bind()
    },

    bind: function () {
        var _this = this;
        //表格伸展收缩按钮
        this.container.on("click",".parentTr",function (e) {
            $(this).find(".un-shrink").toggleClass("shrink");
            $(this).siblings("tr").fadeToggle(0);
        });

    },

    render: function (packageId) {
        this.dial.open();
        var _this = this;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "div",
            height : 500
        });
        var params = {
            target_id : packageId
        };
        var paramsKey = $.param(params);

        //判断缓存，有的话就不发请求了
        if(_this.cacheHub[paramsKey]){
            dealRes(_this.cacheHub[paramsKey]);
            return ;
        }
        PFT.Util.Ajax("/r/AppCenter_ModuleList/getPackageModuleInfo",{
            type : "post",
            params : params,
            loading : function(){
                _this.container.html(loadingStr)
            },
            complete : function(){
                // _this.CR.pubSub.pub("queryStateBox.close");
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
                var html = _this.detailTeplate({data : res.data});
                _this.container.html(html);
            }else{
                Message.error(res.msg);
            }
        }
        
    },
    detailTeplate: ParseTemplate(indexTpl),
    
    cacheHub: {}
});



module.exports = detail;
