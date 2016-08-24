/**
 * Created by Administrator on 2016/8/23.
 */
var recoverBtn;
recoverBtn={
    sendRrcoverBtn:function(){
        $(".set_state").click(function () {
         if($(this).attr("data-state")==7){
         var data= $(this).attr("data-pid")

              $.ajax({
                     type:"post",
                     dataType:"json",
                     data:{
                         id:data
                     },
                     url:"/r/product_ticket/resumed",
                     success:function(data){
                         if(data.flag==1){
                             window.location.reload();
                         }
                     },
                     error:function(xrh,msg){
                         alert(msg);
                     }
              })

         }



        })






    }

}




$(function () {
    recoverBtn .sendRrcoverBtn();
})