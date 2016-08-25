/**
 * Created by Administrator on 2016/8/12.
 */
require("./index.scss")

var  suspension ;
suspension={
    findObj:function(){
        var timer = null;
        $(".tbody").on("mouseover",".colorBlue",function(e){
            var targetA= e.currentTarget;
            var number = $(targetA).attr("number");
            if($(".addPart").length==0){
                var returnTxt= $("."+number).html();
                if(returnTxt==""||returnTxt=="undefine") return false;
                $(targetA).css("positon","relative");
                $(".tbody").css("z-index","100");

                var $strr =$("<p></p>");
                $strr.css({

                    "font-size":"14px",
                    "position":"absolute",
                    "left":"500px",
                    "max-width":"450px",
                    "height":"auto",
                    "border":"1px solid red",
                    "background":"white",
                    "z-index":"999999",
                    "margin-top":"20px",
                    "text-align":"left",
                    "padding":"10px"




                })
                $strr.addClass("addPart")
                var $contain = returnTxt;
                $strr.append($contain);
                $(targetA).append($strr);



            }
            else{
                return false}

        })


        $(".tbody").on("mouseout",".colorBlue",function(){
            $(".addPart").remove();


        })
    },

}


$(function(){
    suspension.findObj();
})