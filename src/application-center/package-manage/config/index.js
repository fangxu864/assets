
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
var moduleListTpl = require("./moduleList.xtpl");
//--------modules-----
var Message = require("pft-ui-component/Message");
var ParseTemplate = PFT.Util.ParseTemplate;

//套餐配置模块
var Config = PFT.Util.Class({

    init: function () {
        var _this =  this;
        $(function () {
            _this.container = $("#G-package-config-wrap");
            _this.container.html(frameTpl);
            setTimeout(function () {
                _this.bind();
            },0);
        });
    },
    
    bind: function () {
        var _this = this;
        _this.manage = require("../manage/index.js");
        
        this.container.on("click",'.save-btn', function () {
            var tarBtn = $(this);
            if(tarBtn.hasClass("disable")) return $(this);
            var result = _this.container.find("#configForm").serialize();
            console.log(deSerialize ( decodeURIComponent(result) ));
            var params  = deSerialize (result);

            PFT.Util.Ajax("/r/AppCenter_ModuleConfig/mealAlloca",{
                type : "post",
                params : params,
                loading : function(){
                    tarBtn.addClass("disable").html("保存中...")
                },
                complete : function(){
                    tarBtn.removeClass("disable").text("保存并上架")
                },
                success : function(res){
                    if(res.code == 200){
                        Message.success("保存成功");
                        _this.hide();
                        _this.manage.show();
                        _this.manage.render();
                    }else{
                        Message.error(res.msg)
                    }
                    console.log(res)
                },
                tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
                serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
            });
            /**
             * @method 对象化序列参数
             */
            function deSerialize ( str ) {
                var arr = str.split("&");
                var obj = {
                    module: []
                };
                for( var i= 0 ; i< arr.length ;i++ ){
                    var key = decodeURIComponent( arr[i].split("=")[0] );
                    var value = decodeURIComponent(arr[i].split("=")[1]);
                    if(/^module\[]$/.test(key)){
                        obj.module.push(value);
                    }else{
                        obj[ key ] = value;
                    }
                }
                return obj;
            }
        });
        this.container.on("click",'.goBack-btn', function () {
            _this.hide();
            _this.manage.show()
        });
        this.container.on("click" , ".self-checkbox" ,function (e) {
            $(this).toggleClass("checked");
            var curState = $(this).children("input[type = checkbox]").prop("checked");
            $(this).children("input[type = checkbox]").prop("checked" , !curState)
        })
    },

    show: function () {
        var _this = this;
        if(!this.cacheHub.moduleData){
            var template = ParseTemplate(moduleListTpl);
            PFT.Util.Ajax("/r/AppCenter_ModuleList/getAllModuleName",{
                type : "post",
                params : {},
                loading : function(){
                    // _this.container.find(".manage-tb tbody").html(loadingStr)
                },
                complete : function(){
                    // submitBtn.text(orignText).removeClass("disable")
                },
                success : function(res){
                    _this.cacheHub.moduleData = res;
                    var html = template({data: res.data});
                    _this.container.find(".module-select .rt").html(html);
                    console.log(res)
                },
                tiemout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
                serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
            })
        }

        this.container.show();
    },

    hide: function () {
        this.container.hide();
    },

    cacheHub:{}
    
});

module.exports = new Config();