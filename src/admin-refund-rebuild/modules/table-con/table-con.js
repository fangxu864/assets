/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tpl = require("./table-con.xtpl");

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
        this.CR.pubSub.sub("tableConBox.render",function () {
            
            _this.container.html( tpl ).hide().fadeIn();
        });
        this.CR.pubSub.sub("tableConBox.close",function () {
            _this.close();
        })
    },

    close: function () {
        this.container.hide();
    }





};

module.exports = tableCon;