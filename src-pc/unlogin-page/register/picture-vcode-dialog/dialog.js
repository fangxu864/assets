/**
 * Created by Administrator on 2017/3/1.
 */
//-------------css--------------
require("./dialog.scss");

//-------------tpl--------------
var editTpl = require("./edit.xtpl");

//-----------modules------------
var Dialog=require("COMMON/modules/dialog-simple");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Message = require("pft-ui-component/Message");
var ImgCodeUrl = PFT.Config.Api.get("Login","getCode");
var FormCheck = require("../formCheck.js");
var formCheck = new FormCheck();
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();

var pvCodeDialog = PFT.Util.Class({
    container: $("<div class='picture-vcode-dialog'></div>"),
    init: function (opt) {
        var _this = this;
        this.token = PFT.Util.getToken();
        this.dial = new Dialog({
            width : 500,
            offsetY : -80,
            closeBtn : true,
            content : "",
            drag : true,
            speed : 100,
            onCloseAfter : function(){
                Tips.closeAllTips();
            }
        });
        this.dial.container.find(".gSimpleDialog-content").append(_this.container);
        this.container.html(editTpl);
        this.bind();
    },

    show:function (curMobileNum) {
        this.curMobileNum = curMobileNum;
        this.dial.open();
        this.container.find(".vcode-img").prop("src",ImgCodeUrl)
    },
    curMobileNum: "",

    bind: function () {
        var _this = this;
        //正则校验通过
        formCheck.on("letterAndNumber.ok" , function (item) {
            console.log(_this.curMobileNum);
            var params = {
                mobile: _this.curMobileNum,
                token: _this.token,
                auth_code:item.val()
            };
            PFT.Util.Ajax("/r/Member_Register/regVcode/", {
                type: "post",
                params: params,
                loading: function () {
                    // curContainer.html(loadingStr)
                },
                complete: function () {
                    // curContainer.html(loadingStr)
                    _this.container.find(".ok-btn").removeClass("disabled");
                },
                success: function (res) {
                    // _this.cacheHub[paramsKey] = $.extend({},res);
                    // dealRes(res)
                    if(res.code == 200 ){
                        _this.trigger("pictrueVcode.ok");
                        _this.dial.close();
                    }else{
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : res.msg,
                            bgcolor : "#f0c245"
                        });
                        _this.updateVcode();
                    }
                },
                tiemout: function () {
                    Message.error(PFT.AJAX_TIMEOUT_TEXT)
                },
                serverError: function () {
                    Message.error(PFT.AJAX_ERROR_TEXT)
                }
            });

        });
        formCheck.on("letterAndNumber.fail" , function (item) {
            _this.container.find(".ok-btn").removeClass("disabled");
        });
        //点击图片验证码
        this.container.on("click" , ".vcode-img" ,function () {
           _this.updateVcode();
        });
        //点击确定按钮
        this.container.on("click" , ".ok-btn" ,function () {
            if($(this).hasClass("disabled")) return false;
            $(this).addClass("disabled");
            formCheck.checkInp(_this.container.find(".vcode-inp"))
        });
    },

    updateVcode: function () {
        this.container.find(".vcode-img").prop("src",ImgCodeUrl );
    }

});

module.exports =  pvCodeDialog;
