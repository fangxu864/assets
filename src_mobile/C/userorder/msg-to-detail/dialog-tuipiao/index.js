
/**
 * Created by Administrator on 2016/11/10.
 */
//引入tpl
var dialog_tuipiao_tpl=require("./dialog-tuipiao.xtpl");
//引入css
require("./index.scss");

var Dialog_tuipiao=PFT.Util.Class({
    container : "#dialog_tuipiao",
    EVENTS : {

    },
    init : function(opt){
        $("body").append(dialog_tuipiao_tpl);


    },
    open:function () {
        var Con=this.container;
        Con.find(".mask").fadeIn(200)
            .find(".dialog_con").animate({"bottom":"-300px"},200,swing)
    }
});


module.exports=Dialog_tuipiao;