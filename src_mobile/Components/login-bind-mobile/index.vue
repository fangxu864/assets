<template>
    <div id="loginPage" class="loginPage page">
        <div class="mainCon">
            <div class="form-group top mobile">
                <div class="inputBox">
                    <input v-model="mobile" class="mobile" type="text" name="" id="mobileInp" placeholder="手机号"/>
                </div>
                <span class="icon mobile"><i class="uicon uicon-shouji"></i></span>
            </div>
            <div class="form-group bottom checkMa">
                <div class="inputBox"><input v-model="code" class="checkMa" type="number" name="" id="checkMaInp" placeholder="验证码"/></div>
                <span class="icon pwd"><i class="uicon uicon-key-sin"></i></span>
                <a id="getCheckMaBtn" class="getCheckMaBtn" href="javascript:void(0)">获取验证码</a>
            </div>
            <a id="submitBtn_mobile" @click="" class="submitBtn submitBtn_mobile mobile" href="javascript:void(0)">绑定</a>
            <p id="errorTip_mobile" class="errorTip mobile"></p>
            <div id="customLoginBox" class="customLoginBox">
                <a class="bLoginBox wx" href="javascript:void(0)"><i class="iconfont">&#xe670;</i></a>
                <a class="bLoginBox qq" onclick="onQQLoginClick()" href="javascript:void(0)"><i class="iconfont">&#xe66f;</i></a>
            </div>
            <div id="botTipBox" class="botTipBox">
                <p class="p2"><i style="margin-right:2px; vertical-align:middle" class="uicon uicon-pft"></i><span class="t">票付通-技术支持</span></p>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    const Login = require("SERVICE_M/mall-member-smslogin");
    export default {
        data(){
            return{
                mobile : "",
                code : ""
            }
        },
        mothods : {
            onSubmit(e){
                var submitBtn = e.target;
                if(submitBtn.classList.contains("disable")) return false;
                var mobile = this.mobile;
                var code = this.code;
                if(!mobile) return alert("请填写手机号");
                if(!code) return alert("请填写验证码");
                if(!PFT.Util.Validate.typePhone(mobile)) return alert("手机号格式有误");

            }
        }
    }
</script>
<style lang="sass">
    @import "COMMON/css/base/core/variables";
    #loginPage{ position:fixed; top:0; left:0; right:0; bottom:0;
        background:url("http://wx.12301.cc/mall/modules/common/login2/images/bg.jpg") no-repeat center center;
        background-size:cover;
        -webkit-background-size:cover;
    }
    .loginPage .mainCon{ margin:50px 20px 0}
    .loginPage .form-group{ position:relative; border-bottom:1px solid #efefef; background:#fff}
    .loginPage .form-group .inputBox{ margin-left:40px; overflow:hidden}
    .loginPage .form-group.pwd .inputBox{ margin-right:45px;}
    .loginPage .form-group.checkMa .inputBox{ margin-right:100px;}
    .loginPage .form-group input{ display:block; width:100%; line-height:22px; font-size:0.35rem; padding:15px 0; margin:0; border:0 none}
    .loginPage .form-group input:focus{ color:#f37138}
    .loginPage .form-group .icon{ position:absolute; left:12px;}
    .loginPage .form-group .uicon{ font-size:18px; color:$gray50}
    .loginPage .form-group .icon.pwd{ top:17px; left:10px;}
    .loginPage .form-group .icon.mobile{ top:17px;}
    .loginPage .form-group .icon.pwd .iconfont{ font-size:22px;}
    .loginPage .form-group .forgetPwdBtn{ position:absolute; top:11px; right:10px;}
    .loginPage .form-group .forgetPwdBtn .iconfont{ font-size:22px;}
    .loginPage .form-group .getCheckMaBtn{ position:absolute; top:14px; right:10px; padding:7px; background:#f07844; color:#fff; text-align:center;}
    .loginPage .form-group .getCheckMaBtn:active{ background:#cd6335}
    .loginPage .form-group .getCheckMaBtn.disable{ background:#ababab}
    .loginPage .submitBtn{ display:block; width:100%; height:42px; line-height:42px; font-size:0.35rem; margin-top:5px; text-align:center; background:#15b6fe; color:#fff;}
    .loginPage .errorTip{ display:none; height:30px; line-height:30px; background:#fffde6; color:#f37138; padding-left:8px;}
    .loginPage .customLoginBox{ display:none; margin-top:20px; font-size:0; text-align:center;}
    .loginPage .customLoginBox .bLoginBox{ display:inline-block; width:50px; height:50px; line-height:50px; text-align:center; border-radius:50%; background:#fff}
    .loginPage .customLoginBox .bLoginBox .iconfont{ font-size:30px;}
    .loginPage .customLoginBox .bLoginBox.wx .iconfont{ color:#3eba40}
    .loginPage .customLoginBox .bLoginBox.qq .iconfont{ color:#0897d9}
    .loginPage .customLoginBox .bLoginBox.wx{ margin-right:10px;}
    .loginPage .customLoginBox .bLoginBox.qq{ }
    .loginPage .customLoginBox .bLoginBox.qq .iconfont{ top:-1px}
    .loginPage .botTipBox{ position:absolute; left:0; right:0; bottom:15px; text-align:center; color:rgba(255,255,255,0.9)}
    .loginPage .botTipBox .regBtn{ margin-left:5px; padding:3px 6px; background:#0897d9; color:#fff; border-radius:4px;}
    .loginPage .botTipBox .p1{ margin-bottom:5px;}
    .loginPage .botTipBox .p2 .iconfont{ top:2px; margin-right:3px;}

    .loginPage .topBtn{ position:absolute; top:13px; color:#fff;}
    .loginPage .topBtn.back{ left:20px;}
    .loginPage .topBtn.home{ right:20px;}
    .loginPage .topBtn:active{ background:rgba(0,0,0,0.5)}

    .loginPage .loginTip{ color:#fff; padding:0 10px 8px 5px; font-size:12px}

</style>