/**
 * Created by Administrator on 2016/11/7.
 */
require("./index.scss");
var Validate = require("COMMON/js/util.validate.js");

//引入插件
var Dialog_Mobile=require("COMMON/modules/dialog-simple");
var Dia_Mob = require("./dialog_content.xtpl");






//主要方法
var Mobile = {
        Dialog_Mobile:null,
        Interval:null,
        newPhone:null,

        //初始化
        init:function () {
            var that = this;
            //设置弹窗
            that.Dialog_Mobile=new Dialog_Mobile({
                width : 600,
                height : 315,
                closeBtn : true,
                content : Dia_Mob,
                drag : true,
                speed : 200,
                offsetX : 0,
                offsetY : 0,
                overlay : true,
                headerHeightMin : 46,
               /* onCloseAfter:function () {
                    window.location.reload();
                },*/
                events : {
                    //点击下一步
                    "click #next":function () {
                        var mobile = Mobile.getOldMobile();
                        var Vcode = $("#VcodeOld").val();
                        if(Mobile.onCheckVCode(mobile,Vcode)){
                            $(".stepTip").text("2. 绑定新手机号");
                            $("#promptOld").replaceWith("<span id='promptNew'>新的手机号：</span>");
                            $("#oldPhone").replaceWith("<input id='newPhone'>");
                            clearInterval(Mobile.Interval);
                            $("#getCodeOld").replaceWith("<span id='getCodeNew' class='getVCodeBtn'>获取验证码</span>");
                            $("#VcodeOld").replaceWith("<input type='text' id='VcodeNew'>");
                            $("#next").replaceWith("<div id='submit' class='button_modify'>绑定</div>");
                        }
                    },

                    //点击绑定
                    "click #submit":function () {
                        var mobile = $("#newPhone").val();
                        var Vcode = $("#VcodeNew").val();
                        if(Mobile.onchangeMobile(mobile,Vcode)){
                            $("#content_modify").replaceWith("<div class='successPrompt'>成功绑定手机号 <span>"+that.newPhone+"</span></div>");
                            $("#submit").replaceWith("<div id='confirm' class='button_modify'>确认</div>");
                        };
                    },

                    //点击获取验证码(原先的手机)
                    "click #getCodeOld":function (e) {
                        //var mobile = this.getOldMobile();
                        var mobile = undefined;//Mobile.getOldMobile();
                        Mobile.onGetVCodeBtnClick($(e.target),mobile);
                    },


                    //点击获取验证码(新的手机)
                    "click #getCodeNew":function (e) {
                        var mobile = $("#newPhone").val();
                        if(!mobile){
                            alert("新手机号不能为空");
                            return false
                        }

                        Mobile.onGetVCodeBtnClick($(e.target),mobile);
                    },

                    //点击确认
                    "click #confirm":function () {
                        window.location.reload();
                    }
                }

            });

            //绑定事件
            that.bindEvents();
            $("#oldPhone").val(that.getOldMobile());
        },


        //绑定事件
        bindEvents:function () {
            var that = this;
            $("#chMob").on("click",function () {
                that.Dialog_Mobile.open();
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
                            alert("请先登录");
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
          /*  var tpl;
            if(mobile){
                tpl ="check_new_mobile";
            }else{
                tpl ="check_old_mobile";
            }*/

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
                    alert("请先登录");
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


    
    //绑定
    onchangeMobile:function (mobile,Vcode) {
        //console.log(mobile);
        //console.log(Vcode);

        var that = this;
        //前端手机号验证
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
            alert("请填写正确的手机号");
            return false;
        }

        var res = $.ajax({
            url: "r/Member_MemberInfo/changeMobile",
            type: 'POST',
            data: { mobile: mobile, code: Vcode,tpl:"check_new_mobile"},
            async: false,
            success:function (data) {
                //console.log(this.url);
                //console.log(this.data)
            }
        }).responseText;


        var data = eval("(" + res + ")");
        //非200
        if (data.code != 200) {
            
            if(data.code == 102){
                alert("请先登录" +
                    "");
                window.location.href="http://"+window.location.host;
                return false;
            }

            //201
            if (data.code == 201) {
                //alert("修改失败");
                $("#content_modify_ali").replaceWith("<div class='failPrompt_ali'>修改手机出错！请重新修改。</div>");
                $("#submit_ali").replaceWith("<div id='confirm_ali' class='button_modify_ali'>确认</div>");
                //406,407
            } else {
                alert("验证码错误或已失效");
                //alert(data.msg)
            }
            //200
        } else {
            that.newPhone = mobile ;
            return true;
        }
        return false
    },


        //获取旧手机
        getOldMobile : function(){
            return $("#mob").text();
        },

        //检验验证码格式
        validate_vcode : function(vcode){
            var error = "";
            if(!vcode || vcode.length!==6) error = "请填写6位数验证码";
            return error;
        },

        //检验手机格式
        validate_mobile : function(mobile){
            var error = "";
            if(!mobile || !Validate.typePhone(mobile)) error = "请填写正确格式手机号";
            return error;
        },
    }

module.exports = Mobile;
/*;(function () {
    Mobile.init();
})();*/
















