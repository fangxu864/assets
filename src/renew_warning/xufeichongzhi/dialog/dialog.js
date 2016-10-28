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
        var list=data;
        var _this=this;
        var html=_this.template({data:list});
        this.Dialog_box.html(html);
        this.open()
    },
    template:PFT.Util.ParseTemplate(dialog_con_tpl)
};

module.exports=Dialog;