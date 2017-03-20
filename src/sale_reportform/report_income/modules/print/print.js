
/**
 * Created by Administrator on 2017/2/24.
 */

var tpl = require("./print.xtpl");
var onePrintTpl = require("./onePrint.xtpl");
var listPrintTpl = require("./listPrint.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



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
        this.CR.pubSub.sub("print.printOne" , function (innerHtml) {
            _this.printOne(innerHtml);
        });
        this.CR.pubSub.sub("print.printList" , function (data) {
            _this.printList(data);
        })
    },

    /**
     * @method 打印一项
     */
    printOne: function (innerHtml) {
        var html = this.onePrintTplTemplate({ data:{ innerHtml:innerHtml } });
        this.print(html);
    },
    onePrintTplTemplate: ParseTemplate(onePrintTpl),

    /**
     * @method 打印清单
     */
    printList: function (data) {
        var html = this.listPrintTplTemplate({ data : data });
        this.print(html);
    },
    listPrintTplTemplate: ParseTemplate(listPrintTpl),

    /**
     * @method 打印iframe内容;
     */
    print: function (tpl) {
        var frame = this.container.get(0);
        frame.contentWindow.document.write(tpl);
        frame.contentWindow.document.close();
        frame.contentWindow.close();
        frame.contentWindow.focus();
        frame.contentWindow.print();
    }

};

module.exports = Print;