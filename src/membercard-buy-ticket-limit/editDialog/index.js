/**
 * Created by Administrator on 2016/12/20.
 */
require("./index.scss");
var tpl = require("./editDialog.xtpl");
var Dialog_Mobile=require("COMMON/modules/dialog-simple");
var Validate = require("COMMON/js/util.validate.js");
//块级写法：
var editDialog=PFT.Util.Class({
    //放入容器
    container:"#editContainer",

//绑定事件


    //init()方法在实例化以后会默认执行
    init:function(){
        this.dialogInit();
        this.eventInit();
    },

    //事件调用方法1
    dialogInit:function(){
        
        var _this = this;
//实例化插件并设置基本参数
        _this.Dialog=new Dialog_Mobile({
            width: 550,
            height: 380,
            closeBtn: true,
            content: tpl,
            drag: true,
            speed: 200,
            offsetX: 0,
            offsetY: 0,
            overlay: true,
            headerHeightMin: 46,
            /* onCloseAfter:function () {
             window.location.reload();
             },*/

//绑定事件
            events: {}
        })

    },
    eventInit:function(){
        var _this = this;

        $("#cancel").on("click",function () {
            _this.Dialog.close()
        });
        $("#edit").on("click",function () {

            var daily_limit = $("#daily_limit").val();
            var num_limit = $("#num_limit").val();
            var interval = $("#interval").val();
            if(!daily_limit){
                daily_limit = 0;
            }
            if(!num_limit){
                num_limit = 0;
            }
            if(!interval){
                interval = 0;
            }

            var params = {
                pid :　$("#editContainer").attr("data-pid"),
                rid : $("#editContainer").attr("data-rid"),
                daily_limit : daily_limit,
                num_limit : num_limit,
                interval : interval
            };

            if(_this.validate_number(params.num_limit)){
                alert(_this.validate_number(params.num_limit));
                return false
            }

            if(_this.validate_number(params.daily_limit)){
                alert(_this.validate_number(params.daily_limit));
                return false
            }

            if(_this.validate_number(params.interval)){
                alert(_this.validate_number(params.interval));
                return false
            }



            $.post("../call/jh_card.php?action=restrict",params,function(data){
                if(data.status=='success'){
                    alert(data.msg);
                    $(".ticketEdit[data-pid="+$("#editContainer").attr("data-pid")+"]").parent()
                        .find(".daily_buy_limit").text(params.daily_limit).end()
                        .find(".buy_num_limit").text(params.num_limit).end()
                        .find(".buy_interval").text(params.interval);
                    _this.Dialog.close()
                }
                else{
                    alert(data.msg);
                }

            },'json');
        })
    },
    validate_number : function(input){
        var error = "";
        if(!Validate.typeNum(input)) {
            error = "请输入正确的数字";
        }
        return error;
    },


});

//模块导出
module.exports=editDialog;
