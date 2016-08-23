/**
 * Created by Administrator on 2016/8/23.
 */
var recoverBtn;
recoverBtn={
    sendRrcoverBtn:function(){
              $(".set_state").each(function () {
                $(this).click(function () {
                    if($(this).attr("data-state")==7){
                        var data=$(this).attr("data-pid");
                        $.ajax({
                            type:"post",
                            dataType:"json",
                            data:{
                                data:data
                            },
                            url:"",
                            success:function(data){
                                alert(data.info);
                            },
                            error:function(xrh,msg){
                                alert(msg);
                            }
                        })
                        return false;

                    }
                    else{
                        return false;
                    }
                   
                })
            })



    }

}




$(function () {
    recoverBtn .sendRrcoverBtn();
})