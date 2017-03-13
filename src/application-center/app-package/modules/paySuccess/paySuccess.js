require("./paySuccess.scss");
var paySuccessModuleTpl = require("./paySuccess.xtpl");


/**
 * 本模块为第一步的套餐选取模块
 */
var paySuccessModule = {
    container: $("<div class='paySuccessBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( paySuccessModuleTpl );
        // this.container.hide();
        this.bind();
    },

    bind: function () {
        var _this = this;
    }



};

module.exports = paySuccessModule;