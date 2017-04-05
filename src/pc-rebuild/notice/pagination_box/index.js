/**
 * Created by Administrator on 2016/11/15.
 */

var Pagination = require("COMMON/modules/pagination-x");

var changePage=PFT.Util.Class({
    container:"#pagination",
    EVENTS:{

    },
    init:function(){
        var _this = this;
        _this.pagination = new Pagination({
            container: "#pagination",  //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });

        _this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
            _this.pagination.render({current:toPage,total:totalPage});
            _this.trigger("pageChange",toPage);
             
        });
    },
    
    //用于在外部渲染页面
    render:function (toPage,totalPage) {
        var toPageInt = parseInt(toPage);
        var totalPageInt = parseInt(totalPage);
        this.pagination.render({current:toPageInt,total:totalPageInt});
    }
});


module.exports=changePage;




