/**
 * Created by Administrator on 2017/4/28.
 */
require("./index.scss");
var titData = require("./titleData.js");
var navTpl = require("./index.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

/**
 * 创建nav
 * @param actTit 当前所在的标题对应的编号
 * @param container 依托对象
 */
function renderNav(actTit , container ) {
    //检测参数
    if(!titData[actTit]){
        throw new Error("请传入正确的titleID");
    }
    //依托对象
    var relyInp  = typeof container === 'string' ? $(container) : container;
    var TitData = $.extend({},titData);
    TitData[actTit]["active"] = "href-active";
    TitData[actTit]["href"] = "javascript:void(0)";
    var template = ParseTemplate(navTpl);
    var html = template({data : TitData});
    relyInp.html(html);
}
module.exports = renderNav;