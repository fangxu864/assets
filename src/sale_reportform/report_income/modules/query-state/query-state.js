
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
        this.CR.mainBox.append(_this.container);
        this.bind();
        this.container.html('<div style="text-align: center;line-height: 200px;font-size: 16px;color: #c3c3c3;">请选择查询条件再点击查询按钮进行查询</div>').show();
    },
    
    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("queryStateBox.querying",function () {
            _this.showQuerying();
        });
        this.CR.pubSub.sub("queryStateBox.showError",function (text) {
            _this.showError(text);
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