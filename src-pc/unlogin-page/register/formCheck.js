


var Validate = require("COMMON/js/util.validate.js");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();


var formCheck = PFT.Util.Class({
    init: function () {},
    cacheHub:{},

    checkInp: function (inpSet) {
        var _this = this;
        var allOk = true;
        for(var i = 0; i< inpSet.length; i++){
            var item = inpSet.eq(i);
            var type = item.attr("validate-type");
            var inpVal = item.val();
            var isBreak = false;
            switch (type){
                //不为空
                case "notEmpty":
                    if(inpVal == ''){
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "不能为空哦",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        _this.trigger("formCheck.success" , item);
                    }
                    break;
                //身份证
                case "idCard":
                    if(!Validate.idcard(inpVal)){
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请填写正确的身份证号",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        _this.trigger("formCheck.success" , item);
                    }
                    break;
                //手机号
                case "mobile":
                    if(!/^1[0-9]{10}$/.test(inpVal)){
                        //不正确
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        _this.trigger("mobile.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请填写正确的手机号",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        //手机号正确
                        _this.trigger("mobile.ok" , item)
                    }
                    break;
                //只能中文
                case "chinese":
                    if(!Validate.typeCN(inpVal)){
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "只能为中文",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        _this.trigger("formCheck.success" , item);
                    }
                    break;
                //验证码
                case "vCode":
                    if(!/^[0-9]{6}$/.test(inpVal)){
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请输入正确的手机验证码",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        _this.trigger("formCheck.success" , item);
                    }
                    break;
                //图形验证码
                case "letterAndNumber":
                    if(!/^[a-z0-9]{4}$/i.test(inpVal)){
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        _this.trigger("letterAndNumber.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请输入正确的4位图形验证码",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        _this.trigger("letterAndNumber.ok" , item);
                    }
                    break;
                //密码
                case "pwd":
                    var error = Validate.validatePwd(inpVal)["error"];
                    if(error !== ""){
                        // item.focus();
                        _this.trigger("formCheck.fail" , item);
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : error,
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }else{
                        _this.trigger("formCheck.success" , item);
                    }
                    break;

                default:
                    alert(type);
            }
            if(isBreak){
                allOk = false;
                break;
            }
        }
        return allOk;
}

});




module.exports = formCheck;