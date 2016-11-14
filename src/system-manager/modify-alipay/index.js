/**
 * Created by Administrator on 2016/11/7.
 */
require("./index.scss");
var Validate = require("COMMON/js/util.validate.js");

//引入插件
var Dialog_Aliapy=require("COMMON/modules/dialog-simple");
var Dia_Ali = require("./dialog_content.xtpl");

//主要方法
var AlipayMain = {
    Dialog_Aliapy:null,
    Interval:null,
    newAli:null,
    //初始化
    init:function () {
        var that = this;
        //设置弹窗
        that.Dialog_Aliapy=new Dialog_Aliapy({
            width : 600,
            height : 315,
            closeBtn : true,
            content : Dia_Ali,
            drag : true,
            speed : 200,
            offsetX : 0,
            offsetY : 0,
            overlay : true,
            headerHeightMin : 46,
            /*onCloseAfter:function () {
                window.location.reload();
            },*/
            
            events : {
                //点击下一步
                "click #next_ali":function () {
                    

                    var mobile =AlipayMain.getOldMobile();
                    var Vcode = $("#VcodeOld_ali").val();
                    if(AlipayMain.onCheckVCode(mobile,Vcode)){
                        $(".stepTip_ali").text("2. 绑定新支付宝账号");
                        $("#promptOld_ali").replaceWith("<span id='promptNew_ali'>当前支付宝：</span>");
                        $("#oldPhone_ali").replaceWith("<input id='oldAli_ali' readonly='true' value="+that.getOldAlipay()+">");
                        clearInterval(AlipayMain.Interval);
                        $("#promptCode_ali").text("新的支付宝：");
                        $("#getCodeOld_ali").remove();
                        $("#VcodeOld_ali").replaceWith("<input type='text' id='newAli_ali'>");
                        $("#next_ali").replaceWith("<div id='submit_ali' class='button_modify_ali'>绑定</div>");
                    }
                },



                //点击绑定
                "click #submit_ali":function () {
                    var aliAccount = $("#newAli_ali").val();
                    if(!aliAccount){
                        alert("请输入新的支付宝账号");
                        return false
                    }
                    if(AlipayMain.onChangeAlipay(aliAccount)){
                        $("#content_modify_ali").replaceWith("<div class='successPrompt_ali'>成功绑定新的支付宝 <span id='showPhone'>"+that.newAli+"！</span></div>");
                        $("#submit_ali").replaceWith("<div id='confirm_ali' class='button_modify_ali'>确认</div>");
                    };
                },


                //点击获取验证码(原先的手机)
                "click #getCodeOld_ali":function (e) {
                    var mobile =undefined;//Alipay.getOldMobile();
                    AlipayMain.onGetVCodeBtnClick($(e.target),mobile);
                },

                //点击获取验证码(新的手机)
                /*"click #getCodeNew_ali":function (e) {
                    var mobile =$("#newPhone_ali").val();
                    Alipay.onGetVCodeBtnClick($(e.target),mobile);
                },*/




                //点击确认
                "click #confirm_ali":function () {
                    window.location.reload();
                }
            }

        });

        //绑定事件
        //$("#oldPhone").val(this.getOldMobile());
        that.bindEvents();
        $("#oldPhone_ali").val(that.getOldMobile());
    },

    //绑定事件
    bindEvents:function () {
        var that = this;
        $("#chAli").on("click",function () {
            that.Dialog_Aliapy.open();
           
        });
    },



//获取验证码
    onGetVCodeBtnClick : function(tarBtn,mobile){

        //console.log(mobile);
        var that = this;
        if(tarBtn.hasClass("disable")) return false;

        if(mobile){
            var validate = that.validate_mobile(mobile);
            if(validate) return alert(validate);
        }

        //给发送验证码按钮添加计时器
        var getCodeBtn=tarBtn;
        var t = 60;
        that.Interval = setInterval(function () {
            t=t-1;
            getCodeBtn.addClass("disable").text(t+"s重发");
            if(t==0){
                clearInterval(that.Interval);
                getCodeBtn.removeClass("disable").text("获取验证码")
            }
        },1000);


        $.ajax({
            dataType:"json",
            url: "r/Member_MemberInfo/sendVcode",
            data: { mobile: mobile},
            async: true,
            type: 'POST',
            success:function (data) {


                if(data.code !==200){
                    if(data.code == 102){
                        alert("请先登陆");
                        window.location.href="http://"+window.location.host;
                        return false;
                    }
                    clearInterval(that.Interval);
                    getCodeBtn.removeClass("disable").text("获取验证码")
                    alert(data.msg);

                }else {
                    /* alert(data.msg);*/
                }
            }
        });


        /*$.getJSON("call/jh_mem.php", { action:'SendVcode', stype:'phone', mobile:mobile }, function(json){
         if(json['status']!='ok'){
         alert(json['msg']);
         } else {
         //alert('验证码已发送!');
         }
         })*/
    },


//检验验证码
    onCheckVCode:function (mobile,Vcode) {
        //console.log(mobile);
        //console.log(Vcode);
        var that = this;

        //前端验证码验证

        var validate = that.validate_vcode(Vcode);
        if(validate) return alert(validate);

        var res = $.ajax({
            url: "r/Member_MemberInfo/checkVcode",
            type: 'POST',
            data: { mobile: mobile, code: Vcode,tpl:"check_old_mobile"},
            async: false,
            success:function () {
                //console.log(this.url)
            }
        }).responseText;

        var data = eval("(" + res + ")");

        if (data.code != 200) {
            
            if(data.code == 102){
                alert("请先登陆");
                window.location.href="http://"+window.location.host;
                return false;
            }
            
            alert("验证码错误或已失效");
            //alert(data.msg)

            //200
        } else {
            that.newPhone = mobile ;
            return true;
        }
        return false

    },


//绑定支付宝
    onChangeAlipay:function (aliAccount) {

        var that = this;
        //前端手机号验证
        /*if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
            alert("请填写正确的手机号");
            return false;
        }*/

        if(aliAccount){
            var validate = that.validate_aliAccount(aliAccount);
            if(validate) return alert(validate);
        }


        var res = $.ajax({
            dataType:"json",
            url: "r/Member_MemberInfo/changeAlipay",
            data: { alipay: aliAccount},
            async: false,
            type: 'POST',
            success:function () {
               // console.log(this.url)
            }
        }).responseText;

        var data = eval("(" + res + ")");


        //非200
        if (data.code != 200) {
            
            if(data.code == 102){
                alert("请先登陆");
                window.location.href="http://"+window.location.host;
                return false;
            }
            //201
            if (data.code == 201) {
                //alert("修改失败");
                $("#content_modify_ali").replaceWith("<div class='failPrompt_ali'>修改支付宝账号出错！请重新修改。</div>");
                $("#submit_ali").replaceWith("<div id='confirm_ali' class='button_modify_ali'>确认</div>");
            //406,407
            } else {
                alert(data.msg)
            }
        //200
        } else {
            that.newAli = aliAccount;
            return true;
        }

    },




    //获取旧手机
    getOldMobile : function(){
        return $("#mob").text();
    },

    //获取旧支付宝
    getOldAlipay : function(){
        return $("#ali").text();
    },


    //检验验证码格式
    validate_vcode : function(vcode){
        var error = "";
        if(!vcode || vcode.length!==6) error = "请填写6位数验证码";
        return error;
    },

    //检验支付宝格式
    validate_aliAccount : function(aliAccount){
        var error = "";
        if(!Validate.typePhone(aliAccount) && !Validate.typeEmail(aliAccount)) error = "支付宝格式为手机号或者邮箱号";
        return error;
       /* console.log (Validate.typePhone(aliAccount));
        console.log(Validate.typeEmail(aliAccount));*/
    },

    
    //检验手机格式
    validate_mobile : function(mobile){
        var error = "";
        if(!mobile || !Validate.typePhone(mobile)) error = "请填写正确格式手机号";
        return error;
    },
};


module.exports = AlipayMain;

/*;(function () {
    Alipay.init();
})();*/




