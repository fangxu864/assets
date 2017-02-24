/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tpl = require("./table-con.xtpl");


var tableCon = {
    container: $("<div class='tableCon'></div>"),
    init: function (State) {
        var _this = this;
        $("#refundApplyWrap ").append(_this.container);
        this.container.html( tpl );
        console.log(++State.common);


    }





};

module.exports = tableCon;