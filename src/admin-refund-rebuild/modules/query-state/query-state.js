
/**
 * Created by Administrator on 2017/2/24.
 */

require("./query-state.scss");
var querying = require("./querying.xtpl");


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
        this.bind()
    },
    
    bind: function () {
        var _this = this;
        this.CR.pubSub.sub("queryStateBox.querying",function () {
            _this.showQuerying();
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
        this.container.html(querying).fadeIn();
    }





};

module.exports = QueryState;