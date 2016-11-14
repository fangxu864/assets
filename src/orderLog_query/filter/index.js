/**
 * Created by Administrator on 2016/11/14.
 */

//引入css
require("./index.scss");
//引入tpl
var filer_tpl=require("./index.xtpl");

var Filter=PFT.Util.Class({
    container:"#filer_box",
    EVENTS:{
        "click .btn_query":"onQuery"

    },
    init:function () {

    },
    onQuery:function () {
        
        $.ajax({
            
        });
        var b=2
        
        
    },
    dealData:function () {
        
        trigger("table_box_dealdata",data);
        trigger("pagination_box_init",data)
    }

});

module.exports=Filter;