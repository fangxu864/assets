/**
 * Created by Administrator on 2017/3/1.
 */

require("./first_packDetail.scss");
var first_packDetailModuleTpl = require("./first_packDetail.xtpl");


/**
 * 本模块为第一步的套餐详情模块
 */
var First_packDetailModule = {
    container: $("<div class='first_packDetailBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( first_packDetailModuleTpl );
        this.bind();
        this.container.hide();


    },

    bind: function () {
        var _this = this;
    }



};

module.exports = First_packDetailModule;
