
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
var tableTrTpl = require("./tableTr.xtpl");
//--------modules-----
var renderNav = require("../nav/index.js");
var Message = require("pft-ui-component/Message");
var ParseTemplate = PFT.Util.ParseTemplate;

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
                var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
                    tag : "tr",
                    colspan : 8,
                    height : 200
                });
                _this.render()
            },0);
        });

    },

    //渲染主表
    render: function () {
        var _this = this;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "tr",
            colspan : 8,
            height : 200
        });
        var tbTrTemplate = ParseTemplate(tableTrTpl);
        PFT.Util.Ajax("/r/AppCenter_ModuleList/getPackageList",{
            type : "post",
            params : {page:1 ,size: 20},
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
        PFT.Util.Ajax("：/r/AppCenter_ModuleConfig/upPackageStatus",{
            type : "post",
            params : params,
            loading : function(){
                _this.container.find(".manage-tb tbody").html(loadingStr)
            },
            complete : function(){
                // submitBtn.text(orignText).removeClass("disable")
            },
            success : function(res){
                // var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                // if(res.code == "200"){
                //     var html = tbTrTemplate({data : res.data});
                //     _this.container.find(".manage-tb tbody").html(html);
                // }else{
                //     Message.alert(msg);
                // }
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
            Message.confirm("下架？",function (result) {
                if(result){
                    _this.saleOrNot({
                        id: 1
                    })
                }
            })
        });

        //上架
        this.container.on("click",'.alter-btn', function () {
            Message.confirm("上架？",function (result) {
                console.log(result)
            })
        });
    },

    show: function () {

        this.container.show();
    },
    hide: function () {
        this.container.hide();
    }
    
    
});

module.exports = new Manage();