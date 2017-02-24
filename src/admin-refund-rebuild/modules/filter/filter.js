/**
 * Created by Administrator on 2017/2/24.
 */

require("./filter.scss");
var tpl = require("./filter.xtpl");


var Filter = {
    container: $("<div class='filterBox'></div>"),
    init: function () {
        var _this = this;
        $("#refundApplyWrap ").append(_this.container);
        this.container.html( tpl );


    }





};

module.exports = Filter;