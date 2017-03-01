require("./index.scss");

/**
 * Created by Administrator on 16-4-18.
 */
var Dialog = require("COMMON/modules/easydialog");
var VCode = require("COMMON/js/util.vcode.js");
var Validate = require("COMMON/js/util.validate.js");
var AJAX_ERROR_TEXT = "请求出错，请稍后重试";

var tpl = require("./modify_mobileBinded.html");
var Main = {
    timer : null,
    INTERVAL : 60, //60秒后重新获取验证码
    init : function(){
        this.modifyMobileTrigger = $("#modify_mobileBindedBtn");
        this.bindEvents();
    },
    bindEvents : function(){
        var that = this;
        this.modifyMobileTrigger.on("click",function(e){
            Dialog.open({
                container : {
                    header : '修改绑定手机号',
                    content : tpl
                },
                offsetY : -50,
                overlay : false,
                events : {
                    "focus #modifyDialogBox .textInp" : function(e){
                        var tarInp = $(e.currentTarget);
                        that.onTextInpFocus(tarInp);
                    },
                    "click #modifyDialogBox .submitBtn" : function(e){
                        that.onSubmitBtnClick(e);
                    },
                    "click #modifyDialogBox .getVCodeBtn" : function(e){
                        that.onGetVCodeBtnClick($(e.target));
                    }
                },
                drag : true
            },function(){
                $("#mobileInp_old").val(that.getOldMobile());
            })
        })
    },
    getOldMobile : function(){
        return $("#mob").text();
    },
    getNewMobile : function(){
        return $.trim($("#mobileInp_new").val());
    },
    getOldVCode : function(){
        return $.trim($("#vcodeInpOld").val());
    },
    getNewVCode : function(){
        return $.trim($("#vcodeInpNew").val());
    },
    validate_vcode : function(vcode){
        var error = "";
        if(!vcode || vcode.length!==6) error = "请填写6位数验证码";
        return error;
    },
    validate_mobile : function(mobile){
        var error = "";
        if(!mobile || !Validate.typePhone(mobile)) error = "请填写正确格式手机号";
        return error;
    },
    //获取验证码
    onGetVCodeBtnClick : function(tarBtn){
        var that = this;
        if(tarBtn.hasClass("disable")) return false;
        var mobile = tarBtn.hasClass("old") ? this.getOldMobile() : this.getNewMobile();
        var validate = this.validate_mobile(mobile);
        if(validate) return alert(validate);
        var orign_text = tarBtn.text();
        var interval = that.INTERVAL-1;
        VCode.get(mobile,{
            loading : function(){ tarBtn.addClass("disable").text("正在获取...");},
            complete : function(){
                tarBtn.removeClass("disable").text(orign_text);
            },
            success : function(res){
                tarBtn.addClass("disable");
                clearInterval(that.timer);
                that.timer = setInterval(function(){
                    interval=interval-1;
                    if(interval==0){
                        clearInterval(that.timer);
                        tarBtn.removeClass("disable").text(orign_text);
                    }else{
                        tarBtn.text("验证码已发送，"+interval+"秒后可重新获取");
                    }
                },1000)
            }
        })
    },
    onTextInpFocus : function(tarInp){
        tarInp.parents(".rt").removeClass("error");
    },
    onSubmitBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        if(tarBtn.hasClass("disable")) return false;
        var mobile = tarBtn.hasClass("old") ? this.getOldMobile() : this.getNewMobile();
        var vcode = tarBtn.hasClass("old") ? this.getOldVCode() : this.getNewVCode();
        if(tarBtn.hasClass("old")){
            this.checkVCode(vcode,tarBtn,function(vcode){
                var slideContainer = $("#slideContainer");
                slideContainer.animate({left:-slideContainer.children().first().width()},200)
            })
        }else if(tarBtn.hasClass("new")){
            var validate_mobile = this.validate_mobile(mobile);
            var validate_vcode = this.validate_vcode(vcode);
            if(validate_mobile) return alert(validate_mobile);
            if(validate_vcode) return alert(validate_vcode);
        }
    },
    //核对验证码
    checkVCode : function(vcode,tarBtn,callback){
        var validate = this.validate_vcode(vcode);
        if(validate) return alert(validate);
        VCode.check(vcode,{
            loading : function(){
                tarBtn.addClass("disable");
            },
            complete : function(){
                tarBtn.removeClass("disable");
            },
            success : function(res){
                var res = res || {};
                var code = res.code;
                if(code==200){
                    callback && callback(vcode);
                }else{
                    alert(res.msg || AJAX_ERROR_TEXT);
                }
            }
        })
    }
}

var dialogtplModAlipay = require("./modify_alipay.html");
var dialogModAlipay = {
    timer : null,
    INTERVAL : 60, //60秒后重新获取验证码
    btnShowDialog: $("#btnModifyAlipay"),
    init : function(){
        this.bindEvents();
    },
    bindEvents : function(){
        var that = this;
        this.btnShowDialog.on("click",function(e){
            Dialog.open({
                container : {
                    header : '修改支付宝账号',
                    content : dialogtplModAlipay
                },
                offsetY : -50,
                overlay : false,
                events : {
                    "focus #modifyAlipay .inp-text" : function(e){
                        var tarInp = $(e.currentTarget);
                        that.onTextInpFocus(tarInp);
                    },
                    "click #modifyAlipay .submitBtn" : function(e){
                        that.onSubmitBtnClick(e);
                    },
                    "click #modifyAlipay .getVCodeBtn" : function(e){
                        that.onGetVCodeBtnClick($(e.target));
                    },
                    "click #modifyAlipay .btnVerifyAlipay" : function(e){
                        var mob=$('#mobile').val();
                        if(mob){
                            window.open('rerified.html?ali='+mob,'_blank');
                        }
                        else{
                            alert('请填写新支付宝账号');
                        }
                    }
                },
                drag : true
            },function(){
                $("#dialogPhone").text(that.getBindMobile());
            })
        })
    },
    getBindMobile : function(){
        return $("#mob").text();
    },
    getVCode : function(){
        return $.trim($("#modAlipayVcode").val());
    },
    validate_vcode : function(vcode){
        var error = "";
        if(!vcode || vcode.length!==6) error = "请填写6位数验证码";
        return error;
    },
    validate_mobile : function(mobile){
        var error = "";
        if(!mobile || !Validate.typePhone(mobile)) error = "请填写正确格式手机号";
        return error;
    },
    //获取验证码
    onGetVCodeBtnClick : function(tarBtn){
        var that = this;

        if(tarBtn.hasClass("disable")) {
            return false;
        }

        var mobile = this.getBindMobile();
        var validate = this.validate_mobile(mobile);
        if(validate) {
            return alert(validate);
        }
        var orign_text = tarBtn.text();
        var interval = that.INTERVAL-1;
        VCode.get(mobile,{
            loading : function(){ tarBtn.addClass("disable").text("正在获取...");},
            complete : function(){
                tarBtn.removeClass("disable").text(orign_text);
            },
            success : function(res){
                tarBtn.addClass("disable");
                clearInterval(that.timer);
                that.timer = setInterval(function(){
                    interval=interval-1;
                    if(interval==0){
                        clearInterval(that.timer);
                        tarBtn.removeClass("disable").text(orign_text);
                    }else{
                        tarBtn.text("验证码已发送，"+interval+"秒后可重新获取");
                    }
                },1000);
            }
        })
    },
    onTextInpFocus : function(tarInp){
        tarInp.closest(".form-group").removeClass("error");
    },
    onSubmitBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        if(tarBtn.hasClass("disable")) {
            return false;
        }

        var mobile = this.getBindMobile();
        var vcode = this.getVCode();

        this.checkVCode(vcode,tarBtn,function(vcode){});
    },
    //核对验证码
    checkVCode : function(vcode,tarBtn,callback){
        var validate = this.validate_vcode(vcode);
        if(validate) {
            return alert(validate);
        }

        VCode.check(vcode,{
            loading : function(){
                tarBtn.addClass("disable");
            },
            complete : function(){
                tarBtn.removeClass("disable");
            },
            success : function(res){
                var res = res || {};
                var code = res.code;
                if(code==200){
                    callback && callback(vcode);
                }else{
                    alert(res.msg || AJAX_ERROR_TEXT);
                }
            }
        })
    }
}

$(function(){
    Main.init();
    dialogModAlipay.init();
})