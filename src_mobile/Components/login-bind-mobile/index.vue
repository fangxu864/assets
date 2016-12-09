<template>
    <div id="loginPage" class="loginPage page">
        <div class="mainCon">
            <div class="form-group top mobile">
                <div class="inputBox">
                    <input v-model="mobile" @blur="onMobileInpBlur" class="mobile" type="text" name="" autocomplete="off" id="mobileInp" placeholder="手机号"/>
                </div>
                <span class="icon mobile"><i class="uicon uicon-shouji"></i></span>
            </div>
            <div class="form-group bottom checkMa">
                <div class="inputBox"><input v-model="code" class="checkMa" type="number" autocomplete="off" name="" id="checkMaInp" placeholder="验证码"/></div>
                <span class="icon pwd"><i class="uicon uicon-key-sin"></i></span>
                <a id="getCheckMaBtn" @click="onGetCheckMaBtnClick" class="getCheckMaBtn disable" :class="vcodeClass" href="javascript:void(0)" v-text="vcodeBtnText"></a>
            </div>
            <a id="submitBtn_mobile" @click="onSubmit" class="submitBtn submitBtn_mobile mobile" href="javascript:void(0)">绑定</a>
            <p id="errorTip_mobile" class="errorTip mobile"></p>
            <div id="customLoginBox" class="customLoginBox">
                <a class="bLoginBox wx" href="javascript:void(0)"><i class="iconfont">&#xe670;</i></a>
                <a class="bLoginBox qq" onclick="onQQLoginClick()" href="javascript:void(0)"><i class="iconfont">&#xe66f;</i></a>
            </div>
            <div id="botTipBox" class="botTipBox">
                <p class="p2"><i style="margin-right:2px; vertical-align:middle" class="uicon uicon-pft"></i><span class="t">票付通-技术支持</span></p>
            </div>
            <div class="dialog_mask" v-if="dialogStatus"></div>
            <div class="dialog_con"  v-if="dialogStatus">
                <p class="tips">微商城仅开放给散客进行快速购票，您手机绑定的是平台用户，您可以选择：</p>
                <p v-if="isWXBrowser" @click="onWxTest" class="href">无需登录以散客身份继续购票<span class="arrow">》</span></p>
                <a href="../mall/login.html"><p class="href">使用账号密码登录到个人中心<span class="arrow">》</span></p></a>
                <p class="btn_close" @click="onDialogMaskClick" style="text-align: center">关闭</p>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    const Login = require("SERVICE_M/mall-member-smslogin");
    const VCODE_INTER_TIME = 60; //验证码获取时间间隔60s
    let timer = null;
    export default {
        data(){
            return{
                isWXBrowser : /micromessenger/.test(navigator.userAgent.toLowerCase()),  //是否为微信内置浏览器
                mobile : "",
                code : "",
                time : -1,
                vcodeState : "",
                dialogStatus:false
            };

        },
        props : {
            to : {
                type : String,
                default : ""
            }
        },
        ready(){
            this.Toast = new PFT.Toast();
            this.Alert = PFT.Mobile.Alert;
        },
        computed : {
            vcodeClass(){
                var cls = { disable : false };
                if(this.time!=-1 || (this.time==-1 && this.vcodeState=="loading")) cls.disable = true;
                return cls
            },
            vcodeBtnText(){
                if(this.time!==-1) return this.time+" s";
                if(this.vcodeState=="loading") return "请稍后..";
                return "获取验证码";
            }
        },
        methods : {
            onDialogMaskClick(){
                this.dialogStatus=false
            },
            onMobileInpBlur(){
                var _this=this;
                var Alert = this.Alert;
                var mobile = this.mobile;
                if(!mobile) return Alert("请填写手机号");
                if(!PFT.Util.Validate.typePhone(mobile)) {
                    $("#getCheckMaBtn").addClass("disable")
                    return Alert("手机号格式有误")
                };
                $.ajax({
                url: "/r/Mall_Member/isAvalidAccount/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: {
                    "mobile": mobile,
                    token : PFT.Util.getToken()
                },    //参数值
                type: "post",   //请求方式
                timeout:10000,   //设置超时 10000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.code==200){
                        if(res.data.avalid==1){
                            $("#getCheckMaBtn").removeClass("disable")
                        }else{
                            $("#getCheckMaBtn").addClass("disable");
                            _this.dialogStatus=true
                        }
                    }else{
                        Alert(res.msg)
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout"){
                        alert("请求超时")
                    }
                },
                error: function() {
                    //请求出错处理
                }
            });
            },
            onWxTest(e){
                var tarBtn = e.target;
                var Alert = this.Alert;
                $.ajax({
                url: "http://www.12301.cc/r/mall_Member/resellerUseSankeAccountLogin/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: {},    //参数值
                type: "POST",   //请求方式
                timeout:10000,   //设置超时 10000毫秒
                beforeSend: function() {
                    //请求前的处理
                    $(tarBtn).html("跳转中，请稍候..." + "<span class='arrow'>》</span>")
                },
                success: function(res) {
                    //请求成功时处理
                    if(res.code == 200){
                        if( res.data.url && res.data.url != "" ){
                            window.location.href = res.data.url ;
                        }else{
                             Alert(res.msg);
                        }
                    }else if(res.code == 401){
                        Alert(res.msg)
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout"){
                        Alert("请求超时")
                    }
                },
                error: function() {
                    //请求出错处理
                }
            });
            },
            onSubmit(e){
                var submitBtn = e.target;
                var Alert = this.Alert;
                if(submitBtn.classList.contains("disable")) return false;
                var mobile = this.mobile;
                var code = this.code;
//                if(!mobile) return Alert("请填写手机号");
//                if(!PFT.Util.Validate.typePhone(mobile)) return Alert("手机号格式有误");
                if(!code) return Alert("请填写验证码");
                if(isNaN(code) || code.length!==6) return Alert("请填写6位数数字验证码");
                Login({mobile:mobile,code:code},{
                    loading : () => {
                        submitBtn.classList.add("disable");
                        this.Toast.show("loading","努力加载中..");
                    },
                    complete : () => {
                        submitBtn.classList.remove("disable");
                        this.Toast.hide();
                    },
                    success : () => {
                        let to = this.to;
                        to = to ? decodeURI(to) : "usercenter.html";
                        window.location.href = to;
                    },
                    fail : (msg) => {
                        this.Alert(msg)
                    }
                });
            },
            onGetCheckMaBtnClick(e){
                var tarBtn = e.target;
                var mobile = this.mobile;
                if(tarBtn.classList.contains("disable")) return false;
                if(!mobile) return this.Alert("请填写手机号");
                if(!PFT.Util.Validate.typePhone(mobile)) return this.Alert("手机号格式有误");

                Login.getVCode(mobile,{
                    loading : () => { this.vcodeState = "loading" },
                    complete : () => { this.vcodeState = "" },
                    success : () => {
                        this.Alert("验证码已发送到您所填写的手机，请注意查收");
                        window.clearInterval(timer);
                        var _time = 0;
                        this.time = VCODE_INTER_TIME;
                        timer = window.setInterval(()=>{
                            _time = _time + 1;
                            this.time = VCODE_INTER_TIME - _time;
                            if(this.time==-1){
                                clearInterval(timer);
                            }
                        },1000)
                    },
                    fail : (msg) => { this.Alert(msg) }
                })


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
    .dialog_mask{
        height: 100%;
        width: 100%;
        background-color: black;
        opacity: 0.5;
        position: fixed;
        top: 0;
        left: 0;
    }
    .dialog_con{
        width: 100%;
        bottom: 0;
        background-color: #fff;
        position: fixed;
        left: 0;
        p.tips{
            font-size: 14px;
            padding: 10px 8px;
            line-height: 20px;
        }
        p.href{
            padding:0px 5px;
            font-size: 14px;
            line-height: 40px;
            color: white;
            margin: 10px 8px;
            background: #15b6fe;
            span.arrow{
                float:right
            }
        }
        p.btn_close{
            font-size: 14px;
            line-height: 30px;
            color: #0f7cb7;
            margin: 20px 35%;
            border: 1px solid  #0f7cb7;
            width: 30%;
        }
    }

</style>