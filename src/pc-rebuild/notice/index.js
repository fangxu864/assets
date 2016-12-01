/**
 * Author: ZhengJiashen
 * Date: 2016/11/30 10:10
 * Description: ""
 */
require("./index.scss");
require("./ajax.js");
var notice_tpl = require("./notice_tpl.xtpl");
var CHANGE_PAGE = require("./pagination_box/index.js");
var MESSAGE_BOX = require("./message_box/index.js");

var Main={
    //初始化
    init:function () {

        var _this = this;

        //导入基础模版
        $(".system-notice").append(notice_tpl);

        //实例化各个模块
        _this.pagination = new CHANGE_PAGE();
        _this.message_box = new MESSAGE_BOX();


        //缓存后台数据
        _this.ajax = ajax;
        _this.ajax({
            url:"#",
            method:"POST",
            data:null
        }).then(function (xhr) {

        }).catch(function (error) {
            console.log(error.errorType)
        })

        //分页器渲染
        _this.pagination.render(1,5);


//运行模块交流部分
        this.CommunicateArea()
    },

//所有模块的交流区域
    CommunicateArea:function(){

    },

    PublicFuction:{
        Function1:function(){}

}

}


$(function () {
    Main.init()
});


//模块导出
//module.exports=system_notice;