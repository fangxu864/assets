/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tableConTpl = require("./table-con.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Tip = require("COMMON/modules/tips");
var Tips = new Tip();

/**
 * 本模块为数据显示模块
 * 负责显示filter传递过来的数据
 */
var tableCon = {
    container: $("<div class='tableCon clearfix'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html(tableConTpl);
        this.bind();
    },

    bind: function () {
        var _this = this;
    },

    close: function () {
        this.container.hide();
    },

    /**
     * @method 渲染表格内容
     */
    render: function ( res ) {

    },

    /**
     * @method 解析模板
     */
    tableConTemplate: ParseTemplate( tableConTpl )


};

module.exports = tableCon;