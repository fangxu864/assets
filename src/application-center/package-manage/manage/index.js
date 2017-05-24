
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
var tableTrTpl = require("./tableTr.xtpl");
//--------modules-----
var renderNav = require("../nav/index.js");
var Message = require("pft-ui-component/Message");
var ParseTemplate = PFT.Util.ParseTemplate;
var Dialog = require("../dialog/dialog.js");
var dialog = new Dialog();


//套餐管理模块
var Manage = PFT.Util.Class({
    

    init: function () {
        var _this =  this;

        $(function () {
            _this.container = $("#G-package-manage-wrap");
            _this.container.html(frameTpl);
            renderNav("1",_this.container.find(".title-box"));
            setTimeout(function () {
                _this.bind();
                _this.render();
            },0);
        });

    },

    //渲染主表
    render: function () {
        var _this = this;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "tr",
            colspan : 9,
            height : 200
        });
        var tbTrTemplate = ParseTemplate(tableTrTpl);
        PFT.Util.Ajax("/r/AppCenter_ModuleList/getPackageList",{
            type : "post",
            params : {page:1 ,size: 100},
            loading : function(){
                // submitBtn.text("请稍后..").addClass("disable")
                _this.container.find(".manage-tb tbody").html(loadingStr)
            },
            complete : function(){
                // submitBtn.text(orignText).removeClass("disable")
            },
            success : function(res){
                var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                if(res.code == "200"){
                    var html = tbTrTemplate({data : res.data});
                    _this.container.find(".manage-tb tbody").html(html);
                }else{
                    Message.alert(msg);
                }
                console.log(res)
            },
            tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    },

    //上下架
    saleOrNot : function (params) {
        var _this =  this ;
        PFT.Util.Ajax("/r/AppCenter_ModuleConfig/upPackageStatus",{
            type : "post",
            params : params,
            loading : function(){
                // _this.container.find(".manage-tb tbody").html(loadingStr)
            },
            complete : function(){
                // submitBtn.text(orignText).removeClass("disable")
            },
            success : function(res){
                if(res.code == "200"){
                    Message.success(res.msg);
                    _this.render();
                }else{
                    Message.error(res.msg)
                }
                console.log(res)
            },
            tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    },

    bind: function () {
        var _this = this;
        _this.config = require("../config/index.js");

        //新增
        this.container.on("click",'.add-btn', function () {
            _this.hide();
            _this.config.show();
        });

        //下架
        this.container.on("click" ,".delete-btn" ,function () {
            var tarId = $(this).attr("data-id");
            Message.confirm("下架？",function (result) {
                if(result){
                    _this.saleOrNot({
                        id: tarId,
                        status: 2
                    })
                }
            })
        });

        //上架
        this.container.on("click",'.alter-btn', function () {
            var tarId = $(this).attr("data-id");
            Message.confirm("上架？",function (result) {
                if(result){
                    _this.saleOrNot({
                        id: tarId,
                        status: 1
                    })
                }
            })
        });

        //详情
        this.container.on("click",'.detail-btn', function () {
            var tarId = $(this).attr("data-id");
            var tarName = $(this).attr("data-name");
            var params = {package_id: tarId};
            var paramsKey = $.param(params);
            //判断缓存，有的话就不发请求了
            if(_this.cacheHub[paramsKey]){
                dealRes(_this.cacheHub[paramsKey]);
                return ;
            }
            PFT.Util.Ajax("/r/AppCenter_ModuleList/getAppModuleByPackage",{
                type : "post",
                params : params,
                loading : function(){
                    // _this.container.find(".manage-tb tbody").html(loadingStr)
                },
                complete : function(){
                    // submitBtn.text(orignText).removeClass("disable")
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
                    var data = {
                        name: tarName ,
                        detail: res.data
                    };
                    dialog.render(data)
                }else{
                    Message.error(res.msg)
                }
            }
        });
    },

    show: function () {

        this.container.show();
    },
    hide: function () {
        this.container.hide();
    },

    cacheHub: {}
    
    
});

module.exports = new Manage();