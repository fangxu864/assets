/**
 * Created by Administrator on 2016/11/14.
 */

//引入modules
var Filter=require("./filter");
var Table=require("./table");
var Pagination=require("./filter_box");





var Main={
    init:function () {
        this.filer=new Filter;
        this.table=new Table;
    },
    talk:function () {
        var _this=this;
        this.filer.on("table_box_dealdata",function (data) {
            _this.table.dealData();
        })
    }

}