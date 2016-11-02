/**
 * Created by Administrator on 2016/10/28.
 */

//引入css
require("./dialog.scss");
//引入tpl
var dialog_con_tpl=require("./dialog_con.xtpl");
var dialog_querying_tpl=require("./dialog_querying.xtpl");
//引入插件
var DialogSimple=require("COMMON/modules/dialog-simple");

function Dialog(){
    var _this=this;
    this.Dialog_simple=new DialogSimple({
        width : 500,
        height : 500,
        closeBtn : true,
        content : "<div id='dialog_box'></div>",
        drag : true,
        speed : 200,
        offsetX : 0,
        offsetY : 0,
        overlay : true,
        headerHeightMin : 46,
        events : {
            "click .btn_close":function () {
                _this.Dialog_simple.close()
            }
        }
    });
    this.Dialog_box=$("#dialog_box")
}

Dialog.prototype={
    open:function () {
        this.Dialog_simple.open()
    },
    show_dialog_con:function (data) {
        var _this=this;
        var list=data;
        var _this=this;
        var html=_this.template({data:list});
        this.Dialog_box.html(html);
        this.open()
        _this.ajaxGetVcode(list)
    },
    template:PFT.Util.ParseTemplate(dialog_con_tpl),
    ajaxGetVcode:function (data) {
        $.ajax({
            url: data.url,    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: { "id": data.typeid },    //参数值
            type: "post",   //请求方式
            timeout:10000,   //设置超时 10000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                //请求成功时处理
                console.log(res);
                $("#payCode_box").html("");
                new QRCode("payCode_box",{
                    text:res.data.qrUrl,
                    width:200,
                    height:200,
                    colorDark:"#000000",
                    colorLight:"#ffffff",
                    correctLevel:QRCode.CorrectLevel.H
                })
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    alert("请求超时")
                }
            },
            error: function() {
                //请求出错处理
            }
        });
    }
};

module.exports=Dialog;