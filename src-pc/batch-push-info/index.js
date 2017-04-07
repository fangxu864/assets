
require("./index.scss");

var Datapicker = require("./datepicker");  //精确到秒的日历组件

var Main = PFT.Util.Class({
    container : "#editContainer",
    EVENTS : {
    },
    init : function(){
        var that = this ;
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
        //日历 
        var nowDate = this.getNowFormatDate();
        this.datapicker = new Datapicker();
        $("#setTimePush").on("click",function(){
            that.datapicker.open( nowDate ,{
				picker : $("#setTimePush")
			});
        });
        $(".inputExcel").change(function(){
            var file = this.files[0];
            var reader=new FileReader();
            reader.readAsBinaryString(file);
            reader.onload=function(){
                var url=reader.result;
                console.log("读取成功");
                console.log(url);
            }
        });

    },
    //获得当天的时间
	getNowFormatDate : function(){
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours() ;
		var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() ;
		var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds() ;
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
				+ " " + hours + seperator2 + min
				+ seperator2 + second ;
		return currentdate;
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
            var type = target.attr("data-type");
            var className = target.attr("class");              
            if( className == "radioIcon disable"){
                console.log("disable");
                return false
            }
            if( type == "infoReceiver1"){
                $("#infoReceiverInput").css("display","none");                
                $("#inFromExcel").css("display","none");                
                $(".infoReceiver").attr("data-type",type);
            }else if( type == "infoReceiver2" ){
                $("#infoReceiverInput").css("display","inline-block");              
                $("#inFromExcel").css("display","inline-block");                
                $(".infoReceiver").attr("data-type",type);
            }else if( type == "pushWay1" ){
                $(".pushWay").attr("data-type",type);
            }else if( type == "pushWay2" ){
                $(".pushWay").attr("data-type",type);
            }else if( type == "pushWay3" ){
                $(".pushWay").attr("data-type",type);
            }
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
            var type = target.attr("data-type");

            if( type == "1" || type == "3"){//通用提醒和生日祝福
                var text = "尊敬的[会员名称]，";
                $(".infoText .fiexdText").text(text);
            }else if( type == "2" ){//礼券到期
                var text = "尊敬的[会员名称]，您有[礼券名称]*[数量]，将于[过期时间]过期。";
                $(".infoText .fiexdText").text(text);
            }
            if( type == "1" ){//通用提醒
                $(".radioIcon[data-type=pushWay3]").removeClass("active").addClass("disable");
                $(".radioIcon[data-type=pushWay1]").removeClass("disable").addClass("active");
                $(".radioIcon[data-type=pushWay2]").removeClass("disable");
                $(".pushWay").attr("data-type","pushWay1");
            }else if( type == "2" || type == "3"){//礼券到期和生日祝福
                $(".radioIcon[data-type=pushWay1],.radioIcon[data-type=pushWay2]").removeClass("active").addClass("disable");
                $(".radioIcon[data-type=pushWay3]").removeClass("disable").addClass("active");
                $(".pushWay").attr("data-type","pushWay3");
            }
            input.val(t);
            input.attr("data-type",type);
            ul.css("display","none");      
            arrBox.find("i.icon").removeClass("icon-arrowup").addClass("icon-arrowdown");
        });
    }

})

$(function(){
    new Main();
})