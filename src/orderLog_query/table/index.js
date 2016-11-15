/**
 * Created by Administrator on 2016/11/14.
 */

//引入css
require("./index.scss");
//引入tpl
var table_tpl=require("./index.xtpl");

var Table=PFT.Util.Class({
    container:"#table_box",
    EVENTS:{
        
    },
    init:function () {
        $("#table_box").append(table_tpl)
    },
    dealData:function (data) {
        
    }
});

module.exports=Table;
