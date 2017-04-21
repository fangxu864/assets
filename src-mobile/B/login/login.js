require("./index.scss");
var Alert = PFT.Mobile.Alert;
var Toast = new PFT.Mobile.Toast();

var ParseTemplate = PFT.Util.ParseTemplate;

var tpls = {
    account: ParseTemplate( require('./account.xtpl') ),
    phone: ParseTemplate( require('./phone.xtpl') )
};

/*var Toast = PFT.Mobile.Toast*/
var Main = PFT.Util.Class({
    container: "#bodyContainer",

    dom: {
        loginTab: '#loginTab',
        loginTabCon: '#loginTabCon'
    },

    EVENTS: {
        "click #btnLogin": "onLoginBtnClick",
        'tap #btnSendCode': 'onBtnSendCodeTap'
    },

    TOTAL_COUNTDOWN: 60,

    init: function () {
        var urlParams = PFT.Util.UrlParse();
        var noAuto = urlParams["noAuto"];
        var _this = this;
        var search = window.location.search;
        if ( noAuto ) {
            _this.loadJudge(search);
        }

        this.render();

        this.bindTap();

        $( this.dom.loginTab ).find('li:first').trigger( 'tap' );
    },

    render: function() {
        var htmlAccount = tpls.account(),
            htmlPhone = tpls.phone();

        $('<div />', {
            class: 'login-tab-con'
        }).html( htmlAccount ).appendTo( $( this.dom.loginTabCon ) );

        $('<div />', {
            class: 'login-tab-con',
            css:{ display: 'none' }
        }).html( htmlPhone ).appendTo( $( this.dom.loginTabCon ) );
    },

    bindTap: function() {
        var _this = this;

        $( this.dom.loginTab ).on('tap', 'li', function( e ){
            var target = $( e.target ),
                i = target.index();

            target.addClass('active').siblings().removeClass('active');

            $( _this.dom.loginTabCon ).children('.login-tab-con').hide().eq( i ).fadeIn();
        })
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
                success: function (res) {
                    if (res.code == 200) {
                        if (res.data.url) {
                            window.location.href = res.data.url + search;
                        } else {
                            window.location.href = "plist.html" + search;
                        }
                    }
                }
            })

    },

    onLoginBtnClick: function () {
        var _this = this;

        var type = $('#loginTab .active').attr('data-login');

        switch( type ) {
            case 'account':
                _this.loginViaAccount();
                break;
            case 'phone':
                _this.loginViaPhone();
        }
    },

    loginViaAccount: function() {
        var loginInpVal = $.trim($("#inpAccount").val());
        var pwdInpVal = $.trim($("#inpPassword").val());
        var regx = /\S/;
        var regxx = /^[1-9]\d*$/;
        if (regx.test(loginInpVal) && regx.test(pwdInpVal)) {
            //    if(!regxx.test(loginInpVal)){
            //        return Alert("请输入正确的手机号!");
            //     }
            this.subLoginReq($.trim(loginInpVal), $.trim(pwdInpVal));
        } else {
            Alert("账号和密码不能为空!")
        }
    },

    loginViaPhone: function() {
        var mobile = $.trim( $('#inpPhone').val() ),
            vcode = $.trim( $('#inpCode').val() );

        if( !mobile || !vcode ) {
            Alert('手机号和验证码不能为空！');
            return false;
        }

        PFT.Util.Ajax("/r/MicroPlat_Member/loginByVocde", {
            type: 'post',

            params: {
                token: PFT.Util.getToken(),
                mobile: mobile,
                vcode: vcode
            },

            loading: function(){
                Toast.show("loading", "请稍后...");
            },

            complete: function () {
                Toast.hide("loading", "请稍后...");
            },

            success: function ( res ) {
                if (res.code == 200) {
                    var Url = res.data.url;
                    var search = window.location.search;
                    var Nurl = "plist.html";
                    if (Url.length > 1) {
                        window.location.href = Url + search;
                    } else {
                        window.location.href = Nurl + search;
                    }
                } else if (res.code == 401) {
                    Toast.show("loading", res.msg);
                    (function () {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    })()


                } else {
                    Alert(res.msg);

                }
            }
        })
    },

    subLoginReq: function (mobile, pwd) {
        var _this=this;
        PFT.Util.Ajax("/r/MicroPlat_Member/login", {
            type: "POST",
            params: {
                token: PFT.Util.getToken(),
                mobile: mobile,
                password: hex_md5(pwd),
                c: "MicroPlat_Member",
                a: "login",
                authCode:$("#verifyInp").val()
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
                } else if (res.code == 401) {
                    Toast.show("loading", res.msg);
                    (function () {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    })()


                } else if (res.code == 203) {
                    Alert(res.msg);
                    _this.veryfiyCode();
                } else {
                    Alert(res.msg);

                }
            }
        })
    },

    veryfiyCode: function () {
        var _this=this;
        var vImg = $("#verifyImg");
        var vBox=$("#verifyBox");
        var nhost = window.location.host;
        var link;
        vBox.show();
        nhost = nhost.indexOf("wx") > -1 ? nhost : nhost + "/wx";
        link="http://"+nhost+"/api/index.php?c=MicroPlat_Member&a=getImgCode&"+ Math.random();
        vImg.attr("src",link);
        _this.refreshCode();
    },

    refreshCode:function(){
        var _this=this;
        var rBtn = $("#refBtn");
        rBtn.on("click",function(){
            _this.veryfiyCode();
        })
    },

    onBtnSendCodeTap: function( e ) {
        var target = $( e.target );

        if( !target.is('.disabled') ) {
            var mobile = $.trim( $('#inpPhone').val() ),
                countdown = this.TOTAL_COUNTDOWN,
                timer = null;

            target.addClass('disabled');

            PFT.Util.Ajax("/r/MicroPlat_Member/sendVcode", {

                type: "POST",

                params: {
                    token: PFT.Util.getToken(),
                    mobile: mobile
                },

                loading: function () {
                    Toast.show("loading", "请稍后...");
                },

                complete: function () {
                    Toast.hide("loading", "请稍后...");
                },

                success: function (res) {
                    if (res.code == 200) {

                        timer = setInterval(function(){
                            countdown--;
                            if( countdown!=0 ) {
                                target.html( countdown + '秒后重发');
                            } else {
                                target.html( '获取验证码' ).removeClass('disabled');
                                clearInterval( timer );
                            }
                        }, 1000);

                    } else {
                        target.removeClass('disabled');
                        Alert(res.msg);

                    }
                }
            })

        }
    }

})

$(function () {
    new Main();
})