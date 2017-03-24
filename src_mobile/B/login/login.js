require("./index.scss");
var Alert = PFT.Mobile.Alert;
var Toast = new PFT.Mobile.Toast();
var Main = PFT.Util.Class({
    container: "#bodyContainer",
    EVENTS: {
        "click #loginBtn": "onLoginBtnClick"
    },
    init: function () {
        var urlParams = PFT.Util.UrlParse();
        var noAuto = urlParams["noAuto"];
        var _this = this;
        var search = window.location.search;
        if (!noAuto) {
            _this.loadJudge(search);
        }
    },
    loadJudge: function (search) {
        var urlParams = PFT.Util.UrlParse();
        PFT.Util.Ajax("/r/MicroPlat_Member/beforeLogin",
            {
                type: "POST",
                dataType: "json",
                params: {
                    c: 'MicroPlat_Member',
                    a: 'beforeLogin',
                    token: PFT.Util.getToken(),
                    appid: urlParams["appid"],
                    fid: urlParams["fid"],
                    m: urlParams["m"],
                    p_type: urlParams["p_type"],
                    account: urlParams["account"],
                    ctype: urlParams["ctype"],
                    ctx: urlParams["ctx"]
                },
                success: function(res){
                    if(res.code==200){
                        if(res.data.url){
                            window.location.href=res.data.url+search;
                        }else{
                            window.location.href="plist.html"+search;
                        }
                    }
                }

            })

    },
    onLoginBtnClick: function () {
        var _this = this;
        var loginInpVal = $.trim($("#loginInp").val());
        var pwdInpVal = $.trim($("#pwdInp").val());
        var regx = /\S/;
        var regxx = /^[1-9]\d*$/;
        if (regx.test(loginInpVal) && regx.test(pwdInpVal)) {
            //    if(!regxx.test(loginInpVal)){
            //        return Alert("请输入正确的手机号!");
            //     }
            _this.subLoginReq($.trim(loginInpVal), $.trim(pwdInpVal));
        } else {
            Alert("账号和密码不能为空!")
        }
    },
    subLoginReq: function (mobile, pwd) {
        PFT.Util.Ajax("/r/MicroPlat_Member/login", {
            type: "POST",
            params: {
                token: PFT.Util.getToken(),
                mobile: mobile,
                password: hex_md5(pwd),
                c: "MicroPlat_Member",
                a: "login"
            },
            dataType: "json",
            loading: function () {
                Toast.show("loading", "请稍后...");
            },
            complete: function () {
                Toast.hide("loading", "请稍后...");
            },
            success: function (res) {
                if (res.code == 200) {
                     var Url = res.data.url;
                    var search = window.location.search;
                    var Nurl = "plist.html";
                    if (Url.length > 1) {
                        window.location.href = Url + search;
                    } else {
                        window.location.href = Nurl + search;
                    }
                }else if(res.code==401){
                     Toast.show("loading",res.msg,3000,function(){
                         window.location.reload();
                     });
                }else {
                    Alert(res.msg);
                   
                }
            }
        })
    }
})

$(function () {
    new Main();
})