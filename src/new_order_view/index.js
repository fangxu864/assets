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
                var value = $(targetA).html();
                var returnTxt= $("."+number).html();
                $(targetA).css("positon","relative");
                $(".tbody").css("z-index","10");

                var $strr =$("<p></p>");
                $strr.css({
                    "width":$(targetA).css("width"),
                    "top":$(targetA).offset().top+"px",
                    "left":(($(targetA).offset().left +parseInt($(targetA).css("width")))+"px"),
                    "padding-left":"14px",
                    "background":"#ccc",
                    "z-index":100,
                    "border-radius":"4px",
                    "word-break":"break-all"




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