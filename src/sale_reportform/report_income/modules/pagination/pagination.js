/**
 * Created by Administrator on 2017/2/27.
 */

require("./pagination.scss");
var Pagination = require("COMMON/modules/pagination-x");

/**
 * 本模块为分页器模块
 */
var Pag = {
    container: $("<div class='paginationBox'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        //分页器部分
        this.pagination = new Pagination({
            container : _this.container , //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });
        this.bind();
        console.log(this.pagination)
    },

    bind:function () {
        var _this = this;
        this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            // var params = {};
            // params["page"] = toPage ;
            // _this.CR.pubSub.pub("DC.getMainData" , params);
            _this.CR.pubSub.pub("filterBox.clickQBtn", toPage);
            // _this.filterParamsBox["page"]=toPage;
            // var cacheKey=_this.JsonStringify(_this.filterParamsBox);
            // if(_this.dataContainer[cacheKey]){
            //     _this.dealReqData(_this.dataContainer[cacheKey]);
            // }else{
            //     _this.ajaxGetData({
            //         "params":_this.filterParamsBox,
            //         "isCacheData":true,
            //         "cacheKey":cacheKey,
            //         "isInitPagination":false
            //     });
            // }
        });
        this.CR.pubSub.sub("paginationBox.Render",function( obj ){
            _this.pagination.render({current:obj.currentPage,total:obj.totalPage});
        });
        this.CR.pubSub.sub("paginationBox.close",function(){
            _this.close();
        });
        this.CR.pubSub.sub("paginationBox.open",function(){
            _this.open();
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
    }
};

module.exports = Pag;