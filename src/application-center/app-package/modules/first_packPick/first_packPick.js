/**
 * Created by Administrator on 2017/3/1.
 */

require("./first_packPick.scss");
var first_packPickModuleTpl = require("./first_packPick.xtpl");


/**
 * 本模块为第一步的套餐选取模块
 */
var First_packPickModule = {
    container: $("<div class='first_packPickBox clearfix'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( first_packPickModuleTpl );
        // this.container.hide();
        this.bind();
    },

    bind: function () {
        var _this = this;
    }



};

module.exports = First_packPickModule;
