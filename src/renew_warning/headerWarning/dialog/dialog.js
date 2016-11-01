/**
 * Created by Administrator on 2016/10/28.
 */

//引入css
require("./dialog.scss");
//引入tpl
var dialog_con_tpl=require("./dialog_con.xtpl");
//引入插件
var DialogSimple=require("COMMON/modules/dialog-simple");
var ParseTemplate=require("COMMON/js/util.parseTemplate.js");

function Dialog(){
    var _this=this;
    this.Dialog_simple=new DialogSimple({
        width : 500,
        closeBtn : false,
        content : "<div id='dialog_box_headerWarning'></div>",
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
    this.Dialog_box=$("#dialog_box_headerWarning")
}

Dialog.prototype={
    open:function () {
        this.Dialog_simple.open()
    },
    show_dialog_con:function (data) {
        var list=data;
        var _this=this;
        var html=_this.template({data:list});
        this.Dialog_box.html(html);
        this.open()
    },
    template:ParseTemplate(dialog_con_tpl)
};

module.exports=Dialog;