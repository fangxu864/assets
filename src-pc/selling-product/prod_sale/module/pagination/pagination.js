/**
 * Created by Administrator on 2017/2/27.
 */

require("./pagination.scss");
var Pagination = require("COMMON/modules/pagination-x");

/**
 * 本模块为分页器模块
 */
var Pag = PFT.Util.Class({
    container: $("#M-pag"),
    init: function (CR) {
        var _this = this;
        //分页器部分
        this.pagination = new Pagination({
            container : _this.container , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.bind();
    },

    bind:function () {
        var _this = this;
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.trigger("page.switch" , toPage , currentPage , totalPage)
        });
    },

    /**
     * @method 关闭分页器
     */
    close: function () {
        this.container.hide();
    },

    /**
     * @method 显示分页器
     */
    open: function () {
        this.container.show();
    },

    /**
     * @method 渲染分页器
     */
    render: function (currentPage , totalPage) {
        this.pagination.render({current : currentPage , total : totalPage});
    }
});

module.exports = Pag;