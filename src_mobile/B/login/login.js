require("./index.scss");
var Alert = PFT.Mobile.Alert;
var Toast = new PFT.Mobile.Toast();
var Main =PFT.Util.Class({
    container:"#bodyContainer",
    EVENTS:{
        "click #loginBtn":"onLoginBtnClick"
    },
    init: function() {
       
    },
    onLoginBtnClick: function(){
        var _this=this;
        var loginInpVal=$.trim($("#loginInp").val());
        var pwdInpVal=$.trim($("#pwdInp").val());
        var regx= /\S/;
        var regxx=/^[1-9]\d*$/;
        if(regx.test(loginInpVal)&&regx.test(pwdInpVal)){
           if(!regxx.test(loginInpVal)){
               return Alert("请输入正确的手机号!");
            }
            _this.subLoginReq($.trim(loginInpVal),$.trim(pwdInpVal));
        }else{
             Alert("账号和密码不能为空!")
        }
    },
    subLoginReq: function(mobile,pwd){
        PFT.Util.Ajax("/r/MicroPlat_Member/login",{
            type:"POST",
            params:{
                token:PFT.Util.getToken(),
                mobile:mobile,
                password:hex_md5(pwd)
            },
            dataType:"json",
            loading: function(){
                Toast.show("loading","请稍后...");
            },
            complete: function(){
                Toast.hide("loading","请稍后...");
            },
            success: function(res){
                if(res.code!=200){
                    Alert(res.msg);
                }
            }
        })
    }
})

$(function(){
    new Main();
})