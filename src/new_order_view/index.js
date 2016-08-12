/**
 * Created by Administrator on 2016/8/12.
 */
require("./index.xtpl");
require("index.scss");
var  suspension ;
  suspension={
   findObj:function(){
       $(".tbody").on("mouseover",".colorBlue",function(e){
         var targetA= $(e).currentTarget;
         var value = targetA.val();
        var returnTxt= this.featchData(value);
           
       })
   },
   featchData:function(value){
        $(ajax)({
            type:"post",
            from:"#",
            url:"#",
            value:"value",
            success:function(msg){
                msg = msg||{};
                return msg.text;
            },
            error:function(){

            }


        })
   }
}


$(function(){
    suspension.findObj();
})