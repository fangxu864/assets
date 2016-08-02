/**
 * Created by Administrator on 2016/7/27.
 */
// require("bank_card.html");
require("./index.scss");
var tpl=require("./index.xtpl");
var Dialogs = require("COMMON/modules/dialog-simple");
var tpl2=require("./checkor_improve.xtpl");
/**
 module.exports = Bank;/**
 * Created by Administrator on 2016/7/27.
 */

var Checkor ;
Checkor = {
    // 加载html文件
    checkor_click:function() {
        var checkorTpl=document.getElementById("checkorTpl");
        checkorTpl.innerHTML=tpl;
        var checkorTpl2 = document.getElementById("checkorTpl2");
        checkorTpl2.innerHTML=tpl2;
        // var that = this;
        // this.dialogs = new Dialogs({
        //     width : 753,
        //     // content : dialog_content,
        //     drag : true,
        //     speed : 100,
        //     event:{
        //         "click .porve" : function(e){
        //             alert("123465");
        //         }
        //     }
        // })
      },
// 判断输入金额是否相同，从而做出处理
    openDialog:function() {
        var shell = document.getElementById("shell");
        var _this =this;
        var checkor = document.getElementById("checkor");
        var checkor_input = document.getElementById("checkor_input");
        var check_Btn_test = document.getElementById("check_Btn_test");
        var ensure = document.getElementById("ensure");
        var Fault = document.getElementById("Fault");

        check_Btn_test.addEventListener("click", function () {
            var keyword = checkor_input.value;
            var callback_date = _this.fetchdate(keyword);

            if (callback_date==keyword)
            {
                ensure.style.display = "block"

            }
            else
            {
                Fault.style.display = "block"

            }
            checkor_input.value =""
        }, false)
    },
//获取后端数据,大写的问号
    fetchdate:function(keyword){
        Ajax
    },
//点击按钮关闭当前窗口
    Btnclose:function () {
           //    var BTn = document.getElementsByTagName("button");
           //    var oDiv = document.getElementsByTagName("div");
           //    // BTn[0].onclick=function(){
           //    //   alert("123");
           //    // }
           // for (var i=0;i<BTn.length;i++) {
           //      BTn[i].index = i;
           //     BTn[i].onclick=function(){
           //      oDiv[this.index].style.display = "none";
           //
           //     }
           // };
        // }
         var checkor = document.getElementById("checkor");
        var check_Btn_test = document.getElementById("check_Btn_test");
        var ensure = document.getElementById("ensure");
        var Fault = document.getElementById("Fault");
        var check_Btn_sure =document.getElementById("check_Btn_sure");
        var check_Btn_sure2 =document.getElementById("check_Btn_sure2");
        check_Btn_test.onclick=function () {
            checkor.style.display = "none";

        }
        check_Btn_sure.onclick = function () {
            ensure.style.display = "none";

        }
        check_Btn_sure2.onclick= function () {
            Fault.style.display = "none";



        }
    },
    //删除银行卡
    Listener:function(){
       var Delete = document.getElementsByClassName("delete")[0];
        var that = this;
        var Btn_delete = document.getElementById("Btn_delete");
        var Btn_delete2 = document.getElementsByClassName("Btn_delete2")[0];
        var checkorTpl2 = document.getElementById("checkorTpl2");
        var Delete_C =document.getElementById("Delete_C");
        var returnNum = 0;
        Delete_C.style.display="block";

            that.Hiddiv(Btn_delete2);
           that.Hiddiv(Btn_delete);

    },
    //为对象增加关闭窗口的功能
    Hiddiv:function(e){
        e.addEventListener("click",function(){
            var Parent =Btn_delete.parentNode;
            Parent.style.display = "none";
        },false)
    },

//点击验证打开验证窗口
    Open_checkor:function () {
        document.getElementById("checkor").style.display="block";
    },


    //银行卡增加遮罩层
    Shell : function(obj){
        var e=document.createElement("div");
        e.style.height =obj.offsetHeight+"px";
        e.style.width = obj.offsetWidth+"px";
        e.style.opacity ="0.5";
        e.style.zIndex="999";
        e.style.position="absolute";
        e.style.top="0";
        e.innerHTML="<button   type='button' class='btnCh'>"+"删除"+"</button>";
        var btnch = e.getElementsByTagName("button")[0];
        btnch.style.background= "yellow";
        btnch.style.position="absolute";
        btnch.style.margin ="45px auto";
        e.style.background="silver";
        obj.appendChild(e);

    }
    //增加一个验证标签
    // addProve:function () {
    //     // var checkorTpl=document.getElementById("checkorTpl");
    //     // checkorTpl.innerHTML=tpl;
    //     // var that = this;
    //     // var wid7 = document.getElementsByClassName("wid7")[0];
    //     // var e = document.createElement("a");
    //     // e.style.color = "blue";
    //     // e.innerHTML = "| 验证";
    //     // e.className = "porve";
    //     // wid7.appendChild(e);
    //     var checkor = document.getElementById("checkor");
    //     var porve = document.getElementsByClassName("porve")[0];
    //     checkor.style.display="block";
    //     porve.addEventListener("click",function () {
    //         that.openDialog();
    //         that.fetchdate();
    //         that.Btnclose();
    //         },false)
    //
    //
    // }
}

module.exports = Checkor;