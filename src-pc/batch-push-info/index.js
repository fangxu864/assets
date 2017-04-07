
require("./index.scss");

var Main = PFT.Util.Class({
    container : "#editContainer",
    EVENTS : {
    },
    init : function(){
        console.log("发布编辑");

        //下拉框
        this.handleSelect();
        // 单选radio
        this.handleRadio({
            fa : $(".infoReceiver"),
            ori : "rows"
        });
        this.handleRadio({
            fa : $(".pushWay"),
            ori : "columns"
        });
        // 多选checkbox
        this.handleCheckBox();

        


    },
    handleCheckBox : function(){
        var that = this;
       $(".checkIcon").on("click",function(e){
            var target = $(e.target);
            if( target.attr("class") == "checkIcon active" ){
                target.removeClass("active");        
            }else{
                target.addClass("active");        
            }
       });     

    },    

    handleRadio : function(opt){
        var that = this;
        var fa = opt.fa;
        var ori = opt.ori;
        var icons = fa.find(".radioIcon"); 
        if(ori == "rows"){
            icons.each(function(i,item){
                var nowItem = $(item).parent();
                nowItem.css("float","left");
            });
        }else if( ori == "columns" ){
            icons.each(function(i,item){
                var nowItem = $(item).parent();
                nowItem.css("float","none");
            });
        }
        icons.on("click",function(e){
            var target = $(e.target);
            target.addClass("active");
            var sib = target.parent().siblings();
            var bro = sib.find(".radioIcon");
            bro.removeClass("active");
        });
    },
    handleSelect : function(){
        var input = $("#infoTypeInput");
        var inputH = input.css("height");
        var inputW = input.outerWidth();
        var offset = input.offset();
        var fa = $(".selectBox").parent();
        fa.css("position","relative");
        $(".selectBox").css("top",parseFloat(inputH));
        $(".selectBox").css("left","150px"); //写死了,怎么办
        $(".selectBox").css("width", inputW); 
        var arrBox = $(".selectBox").find(".arrBox");
        var ul = $(".selectBox").find("ul");
        arrBox.css("position","absolute");
        arrBox.css("top","-" + inputH );
        arrBox.css("right","0px" );
        input.on("click",function(){
            var icon = arrBox.find("i.icon");
            if( icon.attr("class") == "icon icon-u-bold icon-arrowdown" ){
                arrBox.find("i.icon").removeClass("icon-arrowdown").addClass("icon-arrowup");
            }else{
                arrBox.find("i.icon").removeClass("icon-arrowup").addClass("icon-arrowdown");
            }
            if( ul.css("display") == "none" ){
                ul.css("display","block");
            }else{
                ul.css("display","none");
            }
        });
        ul.find("li.selectItem").on("click",function(e){
            var target = $(e.target);
            var t = target.text();
            input.val(t);
            ul.css("display","none");      
            arrBox.find("i.icon").removeClass("icon-arrowup").addClass("icon-arrowdown");
        });
    }

})

$(function(){
    new Main();
})