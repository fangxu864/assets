/**
 * Created by Administrator on 2016/7/27.
 */
// require("bank_card.html");
require("./index.scss");
var tpl = require("./index.xtpl");
var tpl2 = require("./checkor_improve.xtpl");
// var Checkor = {
//     // 加载html文件
//     checkor_click:function() {
//         var checkorTpl=document.getElementById("checkorTpl");
//         checkorTpl.innerHTML=tpl;
//         var checkorTpl2 = document.getElementById("checkorTpl2");
//         checkorTpl2.innerHTML=tpl2;
//         // var that = this;
//         // this.dialogs = new Dialogs({
//         //     width : 753,
//         //     // content : dialog_content,
//         //     drag : true,
//         //     speed : 100,
//         //     event:{
//         //         "click .porve" : function(e){
//         //             alert("123465");
//         //         }
//         //     }
//         // })
//       },
// // 判断输入金额是否相同，从而做出处理
    function openCheckor() {


        var _this =this;
        var checkor = document.getElementById("bankCheckDialogContainer");
        var enSure = document.getElementsByClassName("bankCheckorEnsure")[0];
        var bankP =document.getElementById("bankCheckor_input");
        var check_Btn_test= document.getElementById("check_Btn_test");
        var Fault = document.getElementsByClassName("bankCheckorFault")[0];
        var bankCheckorOk =checkor.getElementsByClassName("bankCheckorOk")[0];

        // var checkor_input = document.getElementById("checkor_input");
        // var Fault = document.getElementById("Fault");
        var keyword = bankP.value;
        var callback_date =fetchDate(keyword);
        check_Btn_test.onclick=function () {
            if (callback_date==keyword)
            {
                enSure.style.display = "none"
                bankCheckorOk.style.display = "block";

            }
            else
            {
                enSure.style.display = "none"
                Fault.style.display = "block"


            }
            bankP.value =""
        }

    }
// //获取后端数据
    function fetchDate(keyword) {
            return 123;
        // $.ajax({
        //     type:"post",
        //     dataType:"json",
        //     data:{val1:keyword},
        //     url:"data.ashx",
        //     success:function (data) {
        //           var  callBack =data.value;
        //             return callback;
        //     },
        //     error:function (msg) {
        //         alert
        //     }
        // });
    }
// //点击按钮关闭当前窗口
//     Btnclose:function () {
//            //    var BTn = document.getElementsByTagName("button");
//            //    var oDiv = document.getElementsByTagName("div");
//            //    // BTn[0].onclick=function(){
//            //    //   alert("123");
//            //    // }
//            // for (var i=0;i<BTn.length;i++) {
//            //      BTn[i].index = i;
//            //     BTn[i].onclick=function(){
//            //      oDiv[this.index].style.display = "none";
//            //
//            //     }
//            // };
//         // }
//          var checkor = document.getElementById("checkor");
//         var check_Btn_test = document.getElementById("check_Btn_test");
//         var ensure = document.getElementById("ensure");
//         var Fault = document.getElementById("Fault");
//         var check_Btn_sure =document.getElementById("check_Btn_sure");
//         var check_Btn_sure2 =document.getElementById("check_Btn_sure2");
//         check_Btn_test.onclick=function () {
//             checkor.style.display = "none";
//
//         }
//         check_Btn_sure.onclick = function () {
//             ensure.style.display = "none";
//
//         }
//         check_Btn_sure2.onclick= function () {
//             Fault.style.display = "none";
//
//
//
//         }
//     },
//     //删除银行卡
//     Listener:function(){
//        var Delete = document.getElementsByClassName("delete")[0];
//         var that = this;
//         var Btn_delete = document.getElementById("Btn_delete");
//         var Btn_delete2 = document.getElementsByClassName("Btn_delete2")[0];
//         var checkorTpl2 = document.getElementById("checkorTpl2");
//         var Delete_C =document.getElementById("Delete_C");
//         var returnNum = 0;
//         Delete_C.style.display="block";
//
//             that.Hiddiv(Btn_delete2);
//            that.Hiddiv(Btn_delete);
//
//     },
//     //为对象增加关闭窗口的功能
//     function hideWindows(e) {
//         var Parent =e.parentNode;
//         Parent.style.display = "none";
        //   e.addEventListener("click",function(){
        //     var Parent =e.parentNode;
        //     Parent.style.display = "none";
        // },false)
    // }
//
// //点击验证打开验证窗口
//     Open_checkor:function () {
//         document.getElementById("checkor").style.display="block";
//     },
//
//
//     //银行卡增加遮罩层
    function Shell(obj){
        var obj = document.getElementById(obj)
        var e=document.createElement("div");
        e.style.height =obj.offsetHeight+"px";
        e.style.width = obj.offsetWidth+"px";
        e.className = "checkor_shell_div";
        e.style.opacity ="0.90";
        e.style.background = "red";
        e.style.zIndex="999";
        // e.style.position="absolute";
        // e.style.top="0";
        e.innerHTML="<span class='checkor_shell_span'>未验证</span>";
        e.innerHTML+="<input   type='button' id='bank_checkor_delete' class='checkor_shell_btn' value = '删除'/>";
        e.innerHTML +="<input   type='button' id='bank_checkor_setting' class='checkor_shell_btn' value = '验证'/>";
        e.innerHTML +="<input  type='button' id='bank_checkor_setting' class='checkor_shell_btn' value ='修改'/>";
        e.style.background="#cacacf";
        obj.appendChild(e);

}

//判断判断银行卡验证次数
function judgement(){
    var that= this;
    var abc = that.fetchdate(12311);
    var  aSet = document.getElementById("bank_checkor_setting");
    var  aChange = document.getElementById("bank_checkor_change");
    if (abc==123) {
        aSet.style.display = "none";
        aChange.style.display = "none";
    }
}
//关闭整个背景遮罩层
function closeContain() {
    var gSimpleDialog =document.getElementById("gSimpleDialog-mask");
    var bankCheckDialogContainer = document.getElementById("bankCheckDialogContainer");
    bankCheckDialogContainer.style.display = "none";
    gSimpleDialog.style.display = "none";
}

var Mixin = require("COMMON/js/util.mix");
var Pubsub = require("COMMON/js/util.pubsub");
var BankCheckor = function(opt){
    this.init(opt)
};
BankCheckor.prototype = Mixin({
    init : function(opt){
         var that = this;

        this.dialog = new opt.Dialog({
            width : 600,
            content : tpl,
            drag : true,
            speed : 100,
            events : {
               "click #bankDialog-submitBtn" : function(e){
                    that.onSubmitBtnClick(e);

                },
                "click #check_Btn_test":function(){
                    console.log("123");
                      openCheckor();
                    Shell("accountItem_alipay");


                },
                "click #check_Btn_sure1":function () {
                    closeContain();
                  },
                "click #check_Btn_sure2":function () {
                    closeContain();
                },
                "click #ensure_bankcard_delete":function () {
                    closeContain();
                },
                "click #cancel_deBankC_Btn":function () {
                    closeContain();
                }
            },
            onReady : function(){

            }
        })
    },
    open : function(){
        this.dialog.open({

        })
    },
    shell:function(obj){
        var obj = document.getElementById(obj)
        var e=document.createElement("div");
        e.style.height =obj.offsetHeight+"px";
        e.style.width = obj.offsetWidth+"px";

        var obj_left = obj.offsetLeft;
        var obj_top = obj.offsetTop;
        e.className = "checkor_shell_div";
        e.style.opacity ="0.90";
        e.style.background = "red";
        e.style.zIndex="999";
        e.style.position="absolute";
        e.style.left = obj_left+"px";
        e.style.top =obj_top +"px";
        e.innerHTML="<span class='checkor_shell_span'>未验证</span>";
        e.innerHTML+="<input   type='button' id='bank_checkor_delete' class='checkor_shell_btn' value = '删除'/>";
        e.innerHTML +="<input   type='button' id='bank_checkor_setting' class='checkor_shell_btn' value = '验证'/>";
        e.innerHTML +="<input  type='button' id='bank_checkor_setting' class='checkor_shell_btn' value ='修改'/>";
        e.style.background="#cacacf";
        obj.appendChild(e);
    }

},Pubsub);











module.exports = BankCheckor;
























