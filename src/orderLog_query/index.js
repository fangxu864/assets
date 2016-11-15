/**
 * Created by Administrator on 2016/11/14.
 */

//引入modules
var Filter=require("./filter");
var Table=require("./table");
require("./pagination");



var Main={
    //初始化
    init:function () {
        var _this=this;
        _this.filter=new Filter;
                //1.点击搜索，获得ajax数据，发布label的数据填充事件
                //2.点击导出，访问ajax，返回XLS
        _this.table=new Table;
        _this.talkArea();
    },
    //模块交流区
    talkArea:function () {
        var _this=this;
        _this.filter.on("getTable",function (data) {
            //_this.table.dealData(data)
            alert("get")
        })
    }

};


$(function () {
    Main.init()
});