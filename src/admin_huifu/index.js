/**
 * Created by Administrator on 2016/8/23.
 */
require("./admin_huifu.scss");
var recoverBtn;
recoverBtn={
    sendRrcoverBtn:function(Target,Url,judge){
        var judge=judge;
        var Target =Target;
        var Url = Url;
         $(Target).click(function () {
          if($(this).attr("state")==7){
         var data= $(this).attr(judge);
              var  r=confirm("你确定恢复吗？");
             if(r==true){
                 $.ajax({
                         type:"post",
                         dataType:"json",
                         data:{
                             id:data
                         },
                         url:Url,
                         success:function(data){
                             if(data.flag==1){
                                 window.location.reload();
                             }
                         },
                         error:function(xrh,msg){

                         }
                    })
             }
          }



        })


    },
    sendRrcoverBtnTwo:function(){

        $(".makingTick").click(function () {

                var data= $(this).attr("data-sid");
                var  r=confirm("你确定恢复吗?");
                if(r==true){
                    $.ajax({
                        type:"post",
                        dataType:"json",
                        data:{
                            id:data
                        },
                        url:"/r/product_Product/resumed/",
                        success:function(data){
                            if(data.flag==1){
                                window.location.reload();
                            }
                        },
                        error:function(xrh,msg){

                        }
                    })
                }




        })


}





};





$(function () {
    // recoverBtn.makingTick();
    recoverBtn .sendRrcoverBtn(".resumd","/r/product_ticket/resumed/","pid");
    recoverBtn.sendRrcoverBtnTwo();
})