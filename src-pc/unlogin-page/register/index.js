/**
 * Created by fangxu on 2017/5/19.
 */

//-------------css--------------
require("./index.scss");
//-------------tpl--------------
var indexTpl = require("./index.xtpl");
//-----------通用插件-----------
var Message = require("pft-ui-component/Message");
var Pagination = require("COMMON/modules/pagination-x");
var Select = require("COMMON/modules/select");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var DatePicker = require("COMMON/modules/datepicker");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();
var ProvCitySelector = require("COMMON/Components/ProvCitySelect");

//-----------自建模块-----------
var FormCheck = require("./formCheck.js");
var formCheck = new FormCheck();
var pvCodeDialog = require("./picture-vcode-dialog/dialog.js");
var pvCodeDial = new pvCodeDialog();

var register = PFT.Util.Class({
    init: function () {
        this.container = $("#registerWrap .register-bottom");
        this.container.html(indexTpl);
        this.token = PFT.Util.getToken();
        this.selfModSub();
        this.bind();
        var selector = new ProvCitySelector({

            provId: "#provSelect",                               //参数为<select></select>省标签的id
            cityId: "#citySelect",                               //参数为<select></select>市标签的id
            onProvChange: function (provId) {                     //当省下拉框变化时执行的回调函数，参数为 省下拉框中 所选省份对应的省份代号

                // $("#province_input").val(provId)
            },
            onCityChange: function (cityId) {                     //当省下拉框变化时执行的回调函数，参数为 市下拉框中 所选城市对应的城市代号
                // $("#city_input").val(cityId)
            }
        });
    },

    //手机号校验状态，默认0表示没填或不正确，1表示已被注册过，2表示手机号正确
    mobileSuccess: 0,

    //订阅自建模块事件
    selfModSub: function () {
        var _this = this;
        var CON = this.container;
        //当手机校验成功时，进行查重校验
        formCheck.on("mobile.ok", function (curInp) {
            var params = {mobile: curInp.val(), token: _this.token};
            var paramsKey = $.param(params);

            //判断缓存，有的话就不发请求了
            if (_this.cacheHub[paramsKey]) {
                dealRes(_this.cacheHub[paramsKey]);
                return;
            }
            PFT.Util.Ajax("/r/Member_Register/checkMobile/", {
                type: "post",
                params: params,
                loading: function () {
                    // curContainer.html(loadingStr)
                },
                complete: function () {
                    // curContainer.html(loadingStr)
                },
                success: function (res) {
                    _this.cacheHub[paramsKey] = $.extend({},res);
                    dealRes(res)
                },
                tiemout: function () {
                    Message.error(PFT.AJAX_TIMEOUT_TEXT)
                },
                serverError: function () {
                    Message.error(PFT.AJAX_ERROR_TEXT)
                }
            });

            function dealRes(res){
                if (res.code == 200) {
                    //1 已经注册 0 未注册
                    if (res.data.is_register == 1) {
                        curInp.siblings(".valid-flag").hide();
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime: 1500,
                            direction: 'right',
                            hostObj: curInp,
                            content: "该号码已被注册，请更换",
                            bgcolor: "#f0c245"
                        });
                        _this.mobileSuccess = 1;
                        CON.find(".send-vcode").hide();
                    } else if (res.data.is_register == 0) {
                        curInp.siblings(".valid-flag").show();
                        _this.mobileSuccess = 2;
                        CON.find(".send-vcode").show();
                    }
                }
            }
        });
        //当手机校验失败时
        formCheck.on("mobile.fail" , function (curInp) {
            _this.mobileSuccess = 0;
            CON.find(".send-vcode").hide();
        });
        formCheck.on("formCheck.success", function (curInp) {
            curInp.siblings(".valid-flag").show();
        });
        formCheck.on("formCheck.fail", function (curInp) {
            curInp.siblings(".valid-flag").hide();
        });
        //当验证码发送成功时
        pvCodeDial.on("pictrueVcode.ok",function () {
            var curBtn = CON.find(".send-vcode");
            _this.countDown(curBtn ,60 ,'发送校验码');
            Message.success("短信验证码已发送，注意查收");
        });
    },

    bind: function () {
        var _this = this;
        var CON = this.container;

        //radio
        CON.on("click", ".register-bottom .self-radio", function () {
            $(this).addClass("checked").siblings(".self-radio").removeClass("checked");
            $(this).children("input[type = radio]").prop("checked", true)
        });

        //checkbox
        CON.on("click", ".register-bottom .self-checkbox", function (e) {
            $(this).toggleClass("checked");
            var curState = $(this).children("input[type = checkbox]").prop("checked");
            $(this).children("input[type = checkbox]").prop("checked", !curState)
        });

        //点击每一行时
        CON.on("click", ".line", function () {
            var curLine = $(this);
            curLine.addClass("active").siblings(".line").removeClass("active");
            curLine.children(".need-focus").focus();
        });

        //需要校验的表单发生blur事件
        CON.on("blur", ".checkInp", function () {
            formCheck.checkInp($(this));
        });

        //发送校验码
        CON.on("click" , ".send-vcode" , function () {
            var curBtn = $(this);
            var mobileInp = _this.container.find("input[name = mobile]");
            //如果手机号未填写完整
            if(_this.mobileSuccess === 0 || _this.mobileSuccess === 1 ){
                var text = _this.mobileSuccess === 0 ? "请填写正确的手机号" : "该号码已被注册，请更换";
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : mobileInp ,
                    content : text,
                    bgcolor : "#f0c245"
                });
                return false;
            }
            var curMobileNum = mobileInp.val();
            if(curBtn.hasClass("disabled")) return;
            pvCodeDial.show(curMobileNum)
        });

        //点击确认注册按钮
        CON.on("click", ".register-btn", function () {

            var inputSet = CON.find(".checkInp");
            if (!formCheck.checkInp(inputSet)) return $(this);

            /**
             * @method 对象化序列参数
             */
            function deSerialize(str) {
                var arr = str.split("&");
                var obj = {};
                for (var i = 0; i < arr.length; i++) {
                    obj[arr[i].split("=")[0]] = decodeURIComponent(arr[i].split("=")[1])
                }
                return obj;
            }

            var params = deSerialize( $("#register-form").serialize() );
            params["token"] = _this.token;
            console.log(params);

            PFT.Util.Ajax("/r/Member_Register/accountFromPc/", {
                type: "post",
                params: params,
                loading: function () {
                    // curContainer.html(loadingStr)
                },
                complete: function () {
                    // curContainer.html(loadingStr)
                },
                success: function (res) {
                    // _this.cacheHub[paramsKey] = $.extend({},res);
                    dealRes(res)
                },
                tiemout: function () {
                    Message.error(PFT.AJAX_TIMEOUT_TEXT)
                },
                serverError: function () {
                    Message.error(PFT.AJAX_ERROR_TEXT)
                }
            });


        });
    },

    //计时按钮
    countDown: function (tarBtn ,time ,initialText) {
        var num = Number(time);
        tarBtn.addClass("disabled").text(num+"秒后重发");
        clearInterval(timer);
        var timer=setInterval(function () {
            if(num>0){
                num--;
                tarBtn.text(num+"秒后重发")
            }else{
                clearInterval(timer);
                tarBtn.removeClass("disabled").text(initialText);
            }
        },1000)
    },

    cacheHub: {}
});
    


$(function () {
   new register();
});