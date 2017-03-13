/**
 * Created by Administrator on 2017/3/1.
 */

require("./second_packDetail.scss");
var second_packDetailModuleTpl = require("./second_packDetail.xtpl");


/**
 * 本模块为第一步的套餐详情模块
 */
var Second_packDetailModule = {
    container: $("<div class='second_packDetailBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( second_packDetailModuleTpl );
        this.bind();
        this.container.hide();


    },

    bind: function () {
        var _this = this;
    }



};

module.exports = Second_packDetailModule;
