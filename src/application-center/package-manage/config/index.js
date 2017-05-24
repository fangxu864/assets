
//---------css--------
require("./index.scss");
//---------tpl--------
var frameTpl = require("./index.xtpl");
var moduleListTpl = require("./moduleList.xtpl");
//--------modules-----
var Message = require("pft-ui-component/Message");
var ParseTemplate = PFT.Util.ParseTemplate;
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();

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

        //点击保存
        this.container.on("click",'.save-btn', function () {
            var tarBtn = $(this);
            if(tarBtn.hasClass("disable")) return $(this);
            var result = _this.container.find("#configForm").serialize();
            var params  = deSerialize (result);
            console.log(params);
            //定义一个要检测不能为空的数组
            //名称和介绍的验证
            var testArr = ["name" ,"introduce" ];
            var allOk = true , hostObj;
            for(var i = 0 ; i < testArr.length ;i++){
                if(params[testArr[i]] == ''){
                    if( testArr[i] === "introduce" ){
                        hostObj = $("textarea[name = "+testArr[i]+"]");
                    }else{
                        hostObj = $("input[name = "+testArr[i]+"]");
                    }
                    allOk = false;
                    Tips.closeAllTips();
                    Tips.show({
                        lifetime : 1500 ,
                        direction:'right',
                        hostObj : hostObj ,
                        content : "请正确填写",
                        bgcolor : "#f0c245"
                    });
                    break;
                }
            }
            if(!allOk) return false;

            //套餐时长的验证
            if(!/^[1-9][0-9]+$/.test(params['duration'])){
                allOk = false;
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : $("input[name = duration]") ,
                    content : "必须为正整数",
                    bgcolor : "#f0c245"
                });
            }
            if(!allOk) return false;
            if( Number( params['duration'] ) > 127 ){
                allOk = false;
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : $("input[name = duration]") ,
                    content : "确定要设置这么多月？",
                    bgcolor : "#f0c245"
                });
            }
            if(!allOk) return false;

            //套餐模块的验证
            if(params['module'].length === 0){
                allOk = false;
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : $("#packageModuleBox") ,
                    content : "套餐这么多，怎么也得选一个",
                    bgcolor : "#f0c245"
                });
            }
            if(!allOk) return false;

            //套餐价格的验证
            if(!/^[0-9]+[.]?[0-9]{0,}$/.test(params['price'])){
                allOk = false;
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : $("input[name = price]") ,
                    content : "必须为正数",
                    bgcolor : "#f0c245"
                });
            }
            if(!allOk) return false;


            //用户输入价钱的单位的是元，后端要的是分
            params['price'] = Number( params['price'] ) * 100;

            Message.confirm("确定保存并上架？", function (result) {
                if(result){
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
                }
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

        //点击返回
        this.container.on("click",'.goBack-btn', function () {
            Tips.closeAllTips();
            _this.hide();
            _this.manage.show()
        });

        //点击复选框
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