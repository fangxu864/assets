/**
 * Created by Administrator on 2016/7/14.
 */
//引入filter过滤模块
var Filter = require("./filter");
Filter.initialize();
//引入conContainer模块
var conContainer = require("./content");
conContainer.init();
//引入Pagination分页插件
var Pagination = require("COMMON/modules/pagination");
var pagination=new Pagination({
    "id":"navigationBar",//分页器盒子的容器
    "data_total_num":100,//数据总数量
    "per_page_num":10,//每页显示的数据条数
    "present_page":1,//当前页数
    "callBack":function (present_page) {

    }
})




