
/**
 * Created by Administrator on 2017/2/24.
 */

require("./query-state.scss");
var queryingTpl = require("./querying.xtpl");
var errorTpl = require("./error.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");



/**
 * 本模块为查询状态模块
 * 负责显示查询状态
 */
var QueryState = {
    container: $("<div class='queryStateBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        // this.CR.mainBox.append(_this.container);
        this.bind()
    },
    
    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("queryStateBox.querying",function (data) {
            _this.container.insertAfter(data.dom);
            _this.showQuerying();
        });
        this.CR.pubSub.sub("queryStateBox.showError",function (data) {
            _this.container.insertAfter(data.dom);
            _this.showError(data.text);
        });
        this.CR.pubSub.sub("queryStateBox.close",function () {
            _this.close();
        })
    },

    /**
     * @method 关闭查询状态框
     */
    close: function () {
        this.container.hide();
    },

    /**
     * @method 查询中...
     */
    showQuerying: function () {
        this.container.html(queryingTpl).show();
    },

    /**
     * @method 错误情况下
     */
    showError: function (text) {
        var errorHtml = this.errorTemplate({data : { errorText:text }});
        this.container.html(errorHtml).show();
    },
    errorTemplate: ParseTemplate(errorTpl)





};

module.exports = QueryState;