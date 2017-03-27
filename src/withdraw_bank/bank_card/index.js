/**
 * Created by Administrator on 2016/7/27.
 */
// require("bank_card.html");
require("./index.scss");
var tpl = require("./index.xtpl");

var Mixin = require("COMMON/js/util.mixin");
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
            var checkor  ="#checkor_bankCard_"+i;
                       if(!($(checkor)==null||$(checkor)==undefined)){
                       if($(checkor).val()==2||$(checkor).val()==3){
                       var $e=$("<div></div>");
                           $(checkor).css("position","relative");

                           $e.css({
                               "position":"absolute",
                               "left":"0",
                               "top":"0",
                               "opacity":"0.80",
                               "z-index":"100",
                               "background":"#dcdcdc",
                               "height":$(checkor).outerHeight()+"px",
                               "width":$(checkor).outerWidth()+"px"
                           });
                           if($(checkor).val()==2){
                               $e.html(
                                        "<span class='checkor_shell_span'>需验证后使用!</span>"+
                                        "<input   type='button' class='checkor_shell_btn1' value = '删除'/>"+
                                        "<input   type='button'  class='checkor_shell_btn2' value = '验证'/>"+
                                        "<input  type='button'  class='checkor_shell_btn3' value ='修改'/>"
                                      )

                           }
                       else{

                               $e.html("<span class='checkor_shell_span1'>无法验证?</span>"+"<span  class='checkor_shell_span3'>"+"可能出现的情形："+"</span>"+"</br>"+"<span class='checkor_shell_span3'>"+"1.输入验证信息错误超过3次；"+"</span>"+"</br>"+"<span class='checkor_shell_span3'>"+"2.票付通打款到该卡失败；"+"</span>"+"</br>"+"<input   type='button' class='checkor_shell_btn1' value = '删除'/>")

                           }
                           var  carId =$("#"+$(checkor).attr("id"));
                           carId.append($e);
                       }
                   else{

                   }
               }
        }
    },
    judge:function () {
//删除银行卡
        $("#bankListUl").on("click",".checkor_shell_btn1",function(e){
            var tarBtn = $(e.currentTarget);
            var li = tarBtn.parents(".click_li");
            var Span =li.children(".wid7");
            var childS = Span.children(".delete");
            var bankName =childS.attr("bankname");
            if(!confirm("确定要删除该银行卡？")) return false;
            that.deleteCard(bankName,childS);
        })

 //验证银行卡
        var that = this;
        $("#bankListUl").on("click",".checkor_shell_btn2",function (e) {
            var tarCheckBtn = $(e.currentTarget);
            var li = tarCheckBtn.parents(".click_li");
            var type = li.attr("data-type");
            that.type = type;
            that.open();

        })
  //修改银行卡 填充
  //       $("#bankListUl").on("click",".checkor_shell_btn3",function(e){
  //           var tarCheckBtn = $(e.currentTarget);
  //           var li = tarCheckBtn.parents(".click_li");
  //           var Span =li.children(".wid4");
  //           // var Span2 = li.children(".wid3");
  //           var  htmlSum = Span.html();
  //           var paddleft = htmlSum.replace(/[^0-9]/ig, "");
  //           $("#bankCardNumInp").val(paddleft);
  //           // $("#bankCopyBox").css("display","block")
  //       })
  //





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
                }
                else if(res.outcome ==-1){
                  alert(res.msg);
                    window.location.reload();
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
        url:"call/handle.php",
        success:function (data) {
          if(data.outcome==2){
            alert("验证成功");
             window.location.reload(true);
          }
          else{
              alert(data.msg);
          }
        },
        error:function (xhr,msg) {
            alert(msg);
        }
    });


}


},Pubsub);











module.exports = BankCheckor;
























