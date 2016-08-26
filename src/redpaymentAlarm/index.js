/**
 * Created by Administrator on 2016/8/16.
 */
var __Data = {};
var tpl=require("./index.xtpl")
require("./index.scss")
var Dialog = require("COMMON/modules/dialog-simple");
var Mixin = require("COMMON/js/util.mix");
var Pubsub =require("COMMON/js/util.pubsub");
//更改授信预警阀值部分
var RedpaymentAlarm =function () {
    var that = this;
    this.init();
    var type=$("#type").attr("value");
    var aid=$("#parent_id ").attr("value");
    var fid=$("#son_id").attr("value");

        $("#repaymentAlarm").click(function(){
            addFunction.Dateinit();
            that.dialog.open();
            Pubsub.on("ajax.success",function (data) {
                var data = data;
                $(".repayAlarmInp").val(data);
            })

        })

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
                    var type=$("#type").attr("value");
                    var aid=$("#parent_id ").attr("value");
                    var fid=$("#son_id").attr("value");
                    var money = $(".repayAlarmInp").val();
                    if(money=="") return false;
                    $.ajax({
                        type:"post",
                        dataType:"json",
                        data:{
                            aid:aid,
                            fid:fid,
                            type:type,
                            money:money

                        },
                        url:"/r/Member_ThresHold/setThreshold",
                        success:function (data) {
                            if(data.flag==-1){
                                alert(data.info);
                            }

                        },
                        error:function (xhr,msg) {

                        }
                    });
                  addFunction.Dateinit();
                  that.dialog.close();

                },
                "click .repayAlarmCancel":function(){
                  that.dialog.close() ;

                }

            },
            onReady:function () {


            }



        })

        // Pubsub.on("ajax.success",function (data) {
        //     $(".repayAlarmInp").val(data);
        //
        // })
    }


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
                var state =1;
                that.returnDate(state);
                Pubsub.on("ajax.success",function (data){
                    if(data!=-2){
                        $("#AlarmChangeColorBlack").css("background-color","red");
                        $("#AlarmChangeColorRed").css("backgroundColor","#cccccc");
                    }
                })
            }
            else{
                var state=0;
                that.returnDate(state);
                $("#AlarmChangeColorBlack").css("backgroundColor","#cccccc");
                $("#AlarmChangeColorRed").css("backgroundColor","black")


            }
        })
        $("#AlarmChangeColorRed").click(function(){

            var color =that.RGBtoHEX($('#AlarmChangeColorRed').css("backgroundColor"));
            if(color =='#cccccc'){
                var state=0;
                that.returnDate(state);
                Pubsub.on("ajax.success",function (data){
                    if(data!=-2){
                        $("#AlarmChangeColorRed").css("background-color","black");
                        $("#AlarmChangeColorBlack").css("backgroundColor","#cccccc")
                    }
                })
            }
            else{
                var state =1;
                that.returnDate(state);
                $("#AlarmChangeColorRed").css("backgroundColor","#cccccc");
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
                url:"/r/Member_ThresHold/getBalance",
                success:function (data) {
                    Pubsub.trigger("ajax.success",data.balance);
                    if(data.flag== -1){
                      alert(data.info);
                    }
                   else if(data.flag ==1){
                     if(data.state== 1 ){
                           //开关为开启状态
                           $("#AlarmChangeColorBlack").css("background","red")
                           $("#AlarmChangeColorRed").css("background","#cccccc")
                       }
                       else if(data.state== 0 ){
                           //开关为关闭状态
                           $("#AlarmChangeColorRed").css("background","black");
                           $("#AlarmChangeColorBlack").css("background","#cccccc")
                       }
                   }


                },
                error:function (xhr,msg) {
                    alert(msg)
                }

            })

        },
    Dateinit:function(){
        var that = this;
        var type=$("#type").attr("value");
        var aid=$("#parent_id ").attr("value");
        var fid=$("#son_id").attr("value");
        that.judugement(type,aid,fid);





    },
    returnDate:function(state){
        var state = state;
        var type=$("#type").attr("value");
        var aid=$("#parent_id ").attr("value");
        var fid=$("#son_id").attr("value");
        $.ajax({
            type:"post",
            dataType:"json",
            data: {
                aid: aid,
                fid: fid,
                type: type,
                state:state
            },
        url:"/r/Member_ThresHold/setState",
            success:function(data){
                Pubsub.trigger("ajax.success",data.flag);
               if(data.flag==1){
                    alert("设置成功！")
               }
               else if(data.flag== -1){
                   alert("设置失败！")
               }
               else if(data.flag ==-2){
                   alert("请先设置！");

               }
            },
            error:function(xrh,msg){
                alert(msg)
            }

        })
    }


}


$(function () {
   addFunction.Dateinit();
   addFunction.changeColor();
    var a = new RedpaymentAlarm();




})