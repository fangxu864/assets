
require("./index.scss");
//组件
require("./jq.ajaxform");
var Datapicker = require("./datepicker");  //精确到秒的日历组件
var Message = require("pft-ui-component/Message");
//service
var Save_service = require("./service/save");

var Main = PFT.Util.Class({
    container : "#editContainer",
    EVENTS : {
        "click #saveNow" : "save"
    },
    init : function(){
        var that = this ;
        this.excelUrl = "";    
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
            $("#excelUpLoadText").text("读取中");
            var file = this.files[0];
            var reader=new FileReader();
            reader.readAsBinaryString(file);
            reader.onload=function(){
                var url=reader.result;
                var fileName = $("#excelUp").val();
                fileName = fileName.split("\\");
                fileName = fileName[fileName.length-1]
                $("#excelUpLoadText").text("文件（" + fileName + "）读取成功").css("color","#3dba3f");
                //异步表单上传
                $("#excelUpLoadForm").ajaxSubmit({
                    data : {
                        identify : "batSendMsg"                  
                    },
                    beforeSubmit : function(a,b,c){
                        $("#excelUpLoadText").text("上传中");
                    },
                    success: function (res) {
                        var code = res.code;
                        var msg = res.msg;
                        var data = res.data;
                        var src = data.src;
                        if(code == 200){
                            $("#excelUpLoadText").text("上传成功");
                            that.excelUrl = src ;
                        }else{
                            $("#excelUpLoadText").text(msg).css("color","#e12424");                            
                        }
                    },
                    fail : function(){
                        $("#excelUpLoadText").text("上传失败").css("color","#e12424");
                    }
                })                

            }
        });

        $(".selectBox .selectItem").first().trigger("click");


    },
    //保存
    save : function(){
        var that = this;

        if($("#saveNow").attr("data-sending") == "true"){
            return false
        }

        //判断填写为空先去掉//后面再加

        var title = $("#infoNameInput").val();   //消息名称
        // if( title == "" ){
        //      Message.alert("请填写消息名称");           
        //      return false
        // }
        var msg_type = $("#infoTypeInput").attr("data-type"); //消息类型
        var content = $("#infoTextInput").val(); //消息内容
        // if( content == "" ){
        //      Message.alert("请填写内容");           
        //      return false
        // }
     
        var rec_type = $("#infoReceiver").attr("data-type");//接收类型
        if( rec_type == "infoReceiver1" ){
            rec_type = "0";
        }else if( rec_type == "infoReceiver2" ){
            if( $("#excelUp").val() == "" && $(".memberBox").css("display") != "none" ){
                Message.alert("请导入excel文件");           
                return false
            }
            rec_type = "1";
        }
        var channel = [];//推送渠道
        $(".checkBoxList .checkIcon").each(function(i,item){
            item = $(item);
            var itemName = item.attr("class");
            var itemtype = item.attr("data-type");
            if( itemName == "checkIcon active" ){
                channel.push(itemtype);
            }
        });
        //推送类型
        var pushWay = $("#pushWay").attr("data-type");
        var send_type = "" ;  //推送类型
        var send_time = "" ;  //发送时间
        if( pushWay == "pushWay1" ){ //启动时立即推送
            send_type = "0";
            send_time = "0";   
        }else if( pushWay == "pushWay2" ){ //定时推送
            send_type = "1";
            send_time = $("#setTimePush").val();
            // if( send_time == "" ){
            //     Message.alert("请填写日期");
            //     return false
            // }
        }else if( pushWay == "pushWay3" ){ //动态推送
            send_type = "2";
            send_time = $("#pushDay").val();
            // if( send_time == "" ){
            //     Message.alert("请填写天数");
            //     return false
            // }
        }

        if( rec_type == "1" ){
            if( this.excelUrl == ""){
                Message.alert("请导入excel文件");           
                return false
            }
        }
        Save_service({
            title : title, //消息名称
            msg_type : msg_type,  //消息类型
            content : content,  //消息内容
            rec_type : rec_type,  //接收类型[系统自动0，指定会员1]
            channel : channel,  //推送渠道[短信1微信0]
            send_type : send_type, //推送类型[立即推送0，定时推送1，动态推送2]
            send_time : send_time, //发送时间[立即推送0，定时推送日期精确到分，动态推送单位天数]
            excel : that.excelUrl, //保存excel
            save_type : "1" //保存类型  保存0，保存并执行1   //先写死   
        },{
            loading : function(){
                $("#saveNow").text("正在发送");
                $("#saveNow").attr("data-sending","true");
            },
            complete : function(){
                $("#saveNow").text("保存,立即启动");
                $("#saveNow").attr("data-sending","false");
            },
            success : function(data){
                Message.alert("保存成功,请等待刷新");
                setTimeout(function(){
                    location.reload();
                },2000);
            },
            fail : function(msg,code){
                Message.alert(code + msg);
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
            }else if(target.attr("class") == "checkIcon"){
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
                return false
            }
            if( type == "infoReceiver1"){  //系统自动筛选
                $(".memberBox").css("display","none");
                $(".infoReceiver").attr("data-type",type);
                //判断推送方式
                // var infoType = $("#infoTypeInput").attr("data-type");
                // if( infoType == "0"){ //通用提醒
                //     that.pushWaySelect(1);
                // }else if( infoType == "2" ){ //礼劵到期
                //     that.pushWaySelect(2);
                // }else if( infoType == "1" ){ //生日祝福
                //     that.pushWaySelect(2);
                // }

                $("#pushWay").find(".radioIcon[data-type=pushWay3]").removeClass("disable").addClass("active");
                $("#pushWay").find(".radioIcon[data-type=pushWay1]").addClass("disable").removeClass("active");
                $("#pushWay").find(".radioIcon[data-type=pushWay2]").addClass("disable").removeClass("active");
                $(".pushWay").attr("data-type","pushWay3");

            }else if( type == "infoReceiver2" ){   //指定会员
                $(".memberBox").css("display","block");
                $(".infoReceiver").attr("data-type",type);

                $("#pushWay").find(".radioIcon[data-type=pushWay3]").addClass("disable").removeClass("active");
                $("#pushWay").find(".radioIcon[data-type=pushWay1]").removeClass("disable").addClass("active");
                $("#pushWay").find(".radioIcon[data-type=pushWay2]").removeClass("disable");

                //判断推送方式
                // var infoType = $("#infoTypeInput").attr("data-type");
                // if( infoType ){ //指定会员所有情况都是只能选动态推送
                //     that.pushWaySelect(1);
                // }
            }else if( type == "pushWay1" ){   //启动时立即推送
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
        $(".selectBox").css("left","150px"); 
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
            if( type == "0" || type == "1"){//通用提醒和生日祝福
                var text = "尊敬的[会员名称]，";
                $(".infoText .fiexdText").text(text);
            }else if( type == "2" ){//礼券到期
                var text = "尊敬的[会员名称]，您有[礼券名称]*[数量]，将于[过期时间]过期。";
                $(".infoText .fiexdText").text(text);
            }
            if( type == "0" ){//通用提醒
                that.pushWaySelect(1);
                $(".pushWay").attr("data-type","pushWay1");
            }else if( type == "1" || type == "2"){//礼券到期和生日祝福
                if( $(".infoReceiver").attr("data-type") == "infoReceiver1"){
                    that.pushWaySelect(2);
                    $(".pushWay").attr("data-type","pushWay3");
                }else{
                    that.pushWaySelect(1);
                    $(".pushWay").attr("data-type","pushWay1");
                }
            }

            var radioList = $(".radioList");

            if(type=="0"){ //通用
                radioList.find(".radioIcon[data-type=infoReceiver1]").addClass("disable");
                radioList.find(".radioIcon[data-type=infoReceiver2]").removeClass("disable").trigger("click");
            }else if(type=="2"){ //礼券
                radioList.find(".radioIcon[data-type=infoReceiver1]").removeClass("disable").trigger("click");
                radioList.find(".radioIcon[data-type=infoReceiver2]").addClass("disable");
            }else if(type=="1"){ //生日祝福
                radioList.find(".radioIcon[data-type=infoReceiver1]").removeClass("disable");
                radioList.find(".radioIcon[data-type=infoReceiver2]").removeClass("disable");
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
            $(".radioIcon[data-type=pushWay2]").removeClass("disable").removeClass("active");
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