/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tableConTpl = require("./table-con.xtpl");
var tableLtTpl = require("./table-lt.xtpl");
var tableRtTpl = require("./table-rt.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
require("COMMON/modules/DragConOver")($);
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

        this.CR.pubSub.sub("tableConBox.close",function () {
            _this.close();
        });
        this.CR.pubSub.sub("tableConBox.render",function (res) {
            _this.render(res);
        });

        //表格右侧拖动
        this.container.find('.table-rt').DragConOver({
            direction:"x",
            callBack:function(dValue){
            }
        });

        //表格伸展收缩按钮
        this.container.on("click",".un-shrink",function () {
            $(this).toggleClass("shrink");
            var dataIndex = $(this).parents("tr").attr('data-index');
            _this.container.find('tr[data-index ='+dataIndex+' ]').siblings("tr").fadeToggle(0);
        })

    },

    close: function () {
        this.container.hide();
    },

    /**
     * @method 渲染表格内容
     */
    render: function ( res ) {
        var tableLtHtml = this.tableLtTemplate({data : res });
        var tableRtHtml = this.tableRtTemplate({data : res });
        this.container.find(".table-lt").html(tableLtHtml);
        this.container.find(".table-rt").html(tableRtHtml);
        this.container.show();
    },

    /**
     * @method 解析模板
     */
    tableLtTemplate: ParseTemplate( tableLtTpl ),
    tableRtTemplate: ParseTemplate( tableRtTpl )


};

module.exports = tableCon;