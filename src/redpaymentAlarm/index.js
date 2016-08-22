/**
 * Created by Administrator on 2016/8/16.
 */
var tpl=require("./index.xtpl")
require("./index.scss")
var Dialog = require("COMMON/modules/dialog-simple");
var Mixin = require("COMMON/js/util.mix");
var Pubsub =require("COMMON/js/util.pubsub");
//更改授信预警阀值部分
var RedpaymentAlarm =function () {
     this.init();

};
RedpaymentAlarm.prototype = Mixin({
     type:"",
    init:function () {
        var that = this;
        this.dialog = new Dialog({
            width:450,
            height:330,
            content:tpl,
            drag:true,
            speed:100,
            events:{
                "click .repayAlarmSure" : function () {
                  that.dialog.close();

                },
                "click .repayAlarmCancel":function(){
                  that.dialog.close() ;
                }

            },
            onReady:function () {

            }
        })
           this.dialog.open();



    },

    // open:function (opt) {
    //     var that =this;
    //     this.dialog.open({
    //         onAfter:function () {
    //             var dialog_submitBtn =$("#repaymentAlarmBtn");
    //             dialog_submitBtn.attr("data-typenum",that.type)
    //         }
    //
    //     })
    // }
},Pubsub );
//授信预警按钮部分
var addFunction= {
    RGBtoHEX:function (str) {
        var that =  this;
        if(str.substring(0, 3) == 'rgb'){
            var arr = str.split(",");
            var r = arr[0].replace('rgb(','').trim();
            var g = arr[1].trim();
            var b = arr[2].replace(')','').trim();
            var hex =[
             that.toHex(r),
             that.toHex(g),
             that.toHex(b)
            ];
            return "#"+hex.join('');

        }
        else{
            return str;
        }
        
    },
    toHex:function (N) {
        if(N==null) return "00";
        N = parseInt(N);
        if(N==0||isNaN(N)) return"00";
        N=Math.max(0,N);
        N = Math.min(N,255);
        N = Math.round(N);
        return "0123456789abcdef".charAt((N-N%16)/16)+"0123456789abcdef".charAt(N%16);
        //　return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);  //大写
        
    },
    changeColor:function(){
        var that =this;
        $("#AlarmChangeColorBlack").click(function(){
            var color = that.RGBtoHEX($('#AlarmChangeColorBlack').css("backgroundColor"));
            if(color =='#cccccc'){
                $(this).css("background-color","red");
                $("#AlarmChangeColorRed").css("backgroundColor","#cccccc");

            }
            else{
                $(this).css("backgroundColor","#cccccc");
                $("#AlarmChangeColorRed").css("backgroundColor","black")
            }
        })
        $("#AlarmChangeColorRed").click(function(){
            var color =that.RGBtoHEX($('#AlarmChangeColorRed').css("backgroundColor"));
            if(color =='#cccccc'){
                $(this).css("background-color","black");
                $("#AlarmChangeColorBlack").css("backgroundColor","#cccccc")
            }
            else{
                $(this).css("backgroundColor","#cccccc");
                $("#AlarmChangeColorBlack").css("backgroundColor","red")
            }
        })
    },
    judugement:function(type,aid,fid){
           $.ajax({
                type:"post",
                dataType:"json",
                data:{
                    aid:aid,
                    fid:fid,
                   type:type
                },
                url:"/r/member_ThresHold/getBalance",
                success:function (data) {
                    if(data.type==2){
                        $("#AlarmChangeColorRed").css("background","black")
                       $("#AlarmChangeColorBlack").css("background","#cccccc")
                    }
                    else if(date.type==1){
                        $("#AlarmChangeColorBlack").css("background","red")
                        $("#AlarmChangeColorRed").css("background","#cccccc")
                    }
                },
                error:function (xhr,msg) {
                    alert(msg);
                }
            });


        },
    getDate:function(){
        var that = this;
        var type=$("#type").attr("value");
        var aid=$("#parent_id ").attr("value");
        var fid=$("#son_id").attr("value");
        that.judugement(type,aid,fid);
        console.log(type+aid+fid);
    }



}


$(function () {
    addFunction.getDate();
   addFunction.changeColor();
  $("#repaymentAlarm").click(function(){
       new RedpaymentAlarm()
})




})