/**
 * Author: ZhengJiashen
 * Date: 2016/11/30 10:10
 * Description: ""
 */
var notice_tpl = require("./notice_tpl.xtpl");

//块级写法：
var system_notice = {
    init:function () {

        $("#system-notice").append(notice_tpl)
    }
}

window.onload = function () {
    system_notice.init()
}

//模块导出
module.exports=system_notice;