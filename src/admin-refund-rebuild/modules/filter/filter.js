/**
 * Created by Administrator on 2017/2/24.
 */

require("./filter.scss");
var tpl = require("./filter.xtpl");


var Filter = {
    container: $("<div class='filterBox'></div>"),
    init: function (State) {
        var _this = this;
        $("#refundApplyWrap ").append(_this.container);
        this.container.html( tpl );
        console.log(++State.common)

    

    }





};

module.exports = Filter;