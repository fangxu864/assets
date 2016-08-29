/**
 * Created by Administrator on 2016/8/23.
 */
var recoverBtn;
recoverBtn={
    sendRrcoverBtn:function(){
        $(".resumd").click(function () {
          if($(this).attr("state")==7){
         var data= $(this).attr("pid");
              var  r=confirm("你确定恢复吗？");
             if(r==true){
                 $.ajax({
                     type:"post",
                     dataType:"json",
                     data:{
                         id:data
                     },
                     url:"/r/product_ticket/resumed/",
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






    }

}




$(function () {
    recoverBtn .sendRrcoverBtn();
})