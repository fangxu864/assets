
/**
 * Created by Administrator on 2017/2/24.
 */

var tpl = require("./print.xtpl");


/**
 * 本模块为打印模块
 */
var Print = {
    container: $("<iframe style='display: none'></iframe>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        // this.container.html( tpl );
        this.bind()
    },

    bind: function () {
        var _this = this;
        _this.CR.pubSub.sub("print.print" , function () {
            _this.print();
        })

    },

    /**
     * @method 打印iframe内容;
     */
    print: function () {
        var frame = this.container.get(0);
        frame.contentWindow.document.write(tpl);
        frame.contentWindow.document.close();
        frame.contentWindow.close();
        frame.contentWindow.focus();
        frame.contentWindow.print();
    }

};

module.exports = Print;
