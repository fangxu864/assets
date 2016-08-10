/**
 * Created by Administrator on 2016/7/27.
 */
// require("bank_card.html");
require("./index.scss");
var tpl = require("./index.xtpl");
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
        // check_Btn_test.onclick=function () {
        //     if (callback_date==keyword)
        //     {
        //         enSure.style.display = "none"
        //         bankCheckorOk.style.display = "block";
        //
        //     }
        //     else
        //     {
        //         enSure.style.display = "none"
        //         Fault.style.display = "block"
        //
        //
        //     }
        //     bankP.value =""
        // }

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
    type : "",
    init : function(opt){



         var that = this;
        this.dialog = new opt.Dialog({
            width : 600,
            content : tpl,
            drag : true,
            speed : 100,
            events : {
                "click #check_Btn_test" : function (e) {
                    var type = $(e.currentTarget).attr("data-typenum");
                    var money = $("#bankCheckor_input").val();
                    that.fetchDate(money,type);
                }

            },
            onReady : function(){

            }
        })
    },
    open : function(){
        var that = this;
        this.dialog.open({
            onAfter : function () {
                var dialog_submitBtn = $("#check_Btn_test");
                dialog_submitBtn.attr("data-typenum",that.type);
            }
        })
    },
    shell:function(){
           for(var i=1;i<10;i++){
            var checkor  ="checkor_bankCard_"+i;
             var Ch= document.getElementById(checkor);
                 if(!(Ch==null||Ch==undefined)){
                       if(Ch.value==2){
                       var e=document.createElement("div");
                       Ch.style.position = "relative";
                       e.style.height =Ch.offsetHeight+"px";
                       e.style.width = Ch.offsetWidth+"px";
                       e.style.opacity ="0.90";
                       e.style.zIndex="100";
                       e.className = "shellDiv"
                       e.style.position="absolute";
                       e.style.left = 0;
                       e.style.top =0;
                       e.innerHTML="<span class='checkor_shell_span'>未验证</span>";
                       e.innerHTML+="<input   type='button' class='checkor_shell_btn1' value = '删除'/>";
                       e.innerHTML +="<input   type='button'  class='checkor_shell_btn2' value = '验证'/>";
                       e.innerHTML +="<input  type='button'  class='checkor_shell_btn3' value ='修改'/>";
                       e.style.background="#cacacf";
                           var  carId = document.getElementById(Ch.id)
                       carId.appendChild(e);

                       }
                   else{

                   }
               }
        }
    },
    judge:function () {

        $("#bankListUl").on("click",".checkor_shell_btn1",function(e){
            var tarBtn = $(e.currentTarget);
            var li = tarBtn.parents(".click_li");
           var bankName =li.attr("data-id");
            if(!confirm("确定要删除该银行卡？")) return false;
            that.deleteCard(bankName,tarBtn);
        })
        var that = this;
        $("#bankListUl").on("click",".checkor_shell_btn2",function (e) {
            var tarCheckBtn = $(e.currentTarget);
            var li = tarCheckBtn.parents(".click_li");
            var type = li.attr("data-type")||10;
            that.type = type;
            that.open();
        })




    },
    deleteCard : function(bankname,tarBtn){
        if(!bankname) return false;
        var url = "call/handle.php?from=withdraw_dele&bankaccount="+bankname;
        PFT.Util.Ajax(url,{
            loading : function(){
                tarBtn.addClass("disable").text("正在删除...");
            },
            complete : function(){
                tarBtn.removeClass("disable").text("删除");
            },
            success : function(res){
                res = res || {};
                if(res.outcome==1){
                    window.location.reload();
                }else{
                    alert("删除失败");
                }
            }
        })
    },
    fetchDate : function(money,type) {
    if(!money || !type) return false;
    $.ajax({
        type:"post",
        dataType:"json",
        data:{
            from : "withdraw_verifyvt",
            money : money,
            type : type
        },
        url:"/call/handle.php",
        success:function (data) {
          if(data.outcome==2){
            alert("验证成功")
          }
          else{
              alert(data.msg);
          }
        },
        error:function (xhr,msg) {
            alert(msg)
        }
    });
}


},Pubsub);











module.exports = BankCheckor;
























