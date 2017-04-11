
require("./index.scss");

require("./jq.ajaxform");
var Datapicker = require("./datepicker");  //精确到秒的日历组件



var Main = PFT.Util.Class({
    container : "#editContainer",
    EVENTS : {
        "click #saveNow" : "save"
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

        console.log("1111");

        $(".inputExcel").change(function(){
            $("#excelUpLoadText").text("读取中");
            var file = this.files[0];
            var reader=new FileReader();
            reader.readAsBinaryString(file);
            reader.onload=function(){
                var url=reader.result;
                $("#excelUpLoadText").text("读取成功");

            }
        });

    },

    save : function(){
        //异步表单上传
        $("#excelUpLoad").ajaxSubmit({
            data : {
                identify : "batSendMsg"
            },
            beforeSubmit : function(a,b,c){
                $("#excelUpLoadText").text("上传中");
            },
            success: function (data) {
                $("#excelUpLoadText").text("上传成功");
                console.log(data);
            }
        })  

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
            if( type == "infoReceiver1"){  //系统自动筛选
                // $("#infoReceiverInput").css("display","none");                
                // $("#excelUpLoad").css("display","none");                
                // $("#excelUpLoadText").css("display","none");
                $(".memberBox").css("display","none");
                $(".infoReceiver").attr("data-type",type);
                //判断推送方式
                var infoType = $("#infoTypeInput").attr("data-type");
                if( infoType == "1"){ //通用提醒
                    that.pushWaySelect(1);
                }else if( infoType == "2" ){ //礼劵到期
                    that.pushWaySelect(2);
                }else if( infoType == "3" ){ //生日祝福
                    that.pushWaySelect(2);
                }
            }else if( type == "infoReceiver2" ){   //指定会员
                // $("#infoReceiverInput").css("display","inline-block");              
                // $("#excelUpLoad").css("display","inline-block");                
                // $("#excelUpLoadText").css("display","inline-block");
                $(".memberBox").css("display","block");
                $(".infoReceiver").attr("data-type",type);
                //判断推送方式
                var infoType = $("#infoTypeInput").attr("data-type");
                if( infoType ){ //指定会员所有情况都是只能选动态推送
                    that.pushWaySelect(1);
                }
            }else if( type == "pushWay1" ){  //启动时立即推送
                $(".pushWay").attr("data-type",type);
            }else if( type == "pushWay2" ){   //定时推送
                $(".pushWay").attr("data-type",type);
            }else if( type == "pushWay3" ){   //动态推送
                $(".pushWay").attr("data-type",type);
            }
            target.addClass("active");
            var sib = target.parent().siblings();
            var bro = sib.find(".radioIcon");
            bro.removeClass("active");
        });
    },
    handleSelect : function(){
        var that = this;
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
                that.pushWaySelect(1);
                $(".pushWay").attr("data-type","pushWay1");
            }else if( type == "2" || type == "3"){//礼券到期和生日祝福
                if( $(".infoReceiver").attr("data-type") == "infoReceiver1"){
                    that.pushWaySelect(2);
                    $(".pushWay").attr("data-type","pushWay3");
                }else{
                    that.pushWaySelect(1);
                    $(".pushWay").attr("data-type","pushWay1");
                }
            }
            input.val(t);
            input.attr("data-type",type);
            ul.css("display","none");      
            arrBox.find("i.icon").removeClass("icon-arrowup").addClass("icon-arrowdown");
        });
    },

    pushWaySelect : function(way){
        if(way == 1){
            //生日、礼券到期 选择 指定会员 时 可以选上面两种推送，不能选动态
            $(".radioIcon[data-type=pushWay1]").removeClass("disable").addClass("active");//默认选1
            $(".radioIcon[data-type=pushWay2]").removeClass("disable");
            $(".radioIcon[data-type=pushWay3]").removeClass("active").addClass("disable");
        }else if(way == 2){
            // 生日、礼券到期 选择 系统自动筛选时，仅可选动态推送
            $(".radioIcon[data-type=pushWay1],.radioIcon[data-type=pushWay2]").removeClass("active").addClass("disable");
            $(".radioIcon[data-type=pushWay3]").removeClass("disable").addClass("active");
        }

    }

})

$(function(){
    new Main();
})