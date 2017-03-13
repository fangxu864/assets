/**
 * Created by Administrator on 2017/3/1.
 */

require("./adBox.scss");
var adBoxTpl = require("./adBox.xtpl");


/**
 * 本模块为顶部广告显示模块
 */
var AdBoxModule = {
    container: $("<div class='adBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html( adBoxTpl );
        // this.container.hide();
    }
    

};

module.exports = AdBoxModule;
