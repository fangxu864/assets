/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tableConTpl = require("./table-con.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

/**
 * 本模块为数据显示模块
 * 负责显示filter传递过来的数据
 */
var tableCon = {
    container: $("<div class='tableCon'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("tableConBox.render",function ( res ) {
            _this.render(res);
        });
        this.CR.pubSub.sub("tableConBox.close",function () {
            _this.close();
        });
        this.container.on("click" ,".btnPrint" ,function () {
            var html = $(this).parents("tbody").html();
            _this.CR.pubSub.pub("print.printOne",html)
        })
    },

    close: function () {
        this.container.hide();
    },

    /**
     * @method 渲染表格内容
     */
    render: function ( res ) {
        var _this = this;
        var ConfigJson = {
            statusInfo: {
                0 : '申请提现',
                1 : '同意提现',
                2 : '成功提现',
                3 : '取消提现',
                4 : '拒绝提现',
                5 : '自动转账中'
            }
        };
        var newData = $.extend({} , res.data , ConfigJson );
        var html = _this.tableConTemplate({data : newData});
        _this.container.html(html).show();
    },

    /**
     * @method 解析模板
     */
    tableConTemplate: ParseTemplate( tableConTpl )







};

module.exports = tableCon;