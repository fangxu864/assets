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
        this.bind();
    },

    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("paySuccessModule.render" , function () {
            _this.render();
        })
    },

    render: function () {
        this.container.html( paySuccessModuleTpl );
        this.container.show();
    }



};

module.exports = paySuccessModule;