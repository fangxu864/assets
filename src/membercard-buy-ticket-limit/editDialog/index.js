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

            var params = {
                pid :　$("#editContainer").attr("data-pid"),
                rid : $("#editContainer").attr("data-rid"),
                daily_limit : daily_limit,
                num_limit : num_limit,
                interval : interval
            };

            if(daily_limit == -1){
                daily_limit = "不限"
            }else{
                var error = _this.validate_typeInit0(daily_limit);
                if(error){
                    alert(error);
                    return false
                }
            };
            if(num_limit == -1){
                num_limit = "不限"
            }else{
                var error = _this.validate_typeInit0(num_limit);
                if(error){
                    alert(error);
                    return false
                }
            };
            if(interval == -1){
                interval = "不限"
            }else{
                var error = _this.validate_typeInit0(interval);
                if(error){
                    alert(error);
                    return false
                }
            };




            $.post("../call/jh_card.php?action=restrict",params,function(data){
                if(data.status=='success'){
                    alert(data.msg);
                    $(".ticketEdit[data-pid="+$("#editContainer").attr("data-pid")+"]").parent()
                        .find(".daily_buy_limit").text(daily_limit).end()
                        .find(".buy_num_limit").text(num_limit).end()
                        .find(".buy_interval").text(interval);
                    _this.Dialog.close()
                }
                else{
                    alert(data.msg);
                }

            },'json');
        })
    },
    validate_typeInit0 : function(input){
        var error = "";
        if(!Validate.typeInit0(input)) {
            error = "请输入正确的数值,不限请输入-1";
        }
        return error;
    },


});

//模块导出
module.exports=editDialog;
