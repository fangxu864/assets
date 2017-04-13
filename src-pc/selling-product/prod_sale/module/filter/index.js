require("./index.scss");

//引入分页器模块
var Pagination = require("../pagination/pagination.js");
var ProvCitySelector = require("COMMON/js/component.city.select2.js");


var Filter = PFT.Util.Class({
    init: function (opt) {
        this.container = $("#M-filter-box");
        this.initProCity();
        this.bind();
    },

    bind: function () {
        var _this = this;
        var Con =  this.container;
        //点击搜索按钮时
        Con.on("click","#serhBtn" ,function () {
            _this.FilterParamHub = $.extend( _this.FilterParamHub , _this.getFilterParams());
            _this.FilterParamHub["page"] = 1;
            //触发filterSearch事件
            _this.trigger("filterSearch" ,_this.FilterParamHub)
        });

        //订阅分页器的page.switch事件
        Pagination.on("page.switch" , function ( toPage , currentPage , totalPage) {
            //更新页数
            _this.FilterParamHub["page"] = toPage;
            //触发filterSearch事件
            _this.trigger("filterSearch" ,_this.FilterParamHub)
        })
    },

    //参数暂存仓库
    FilterParamHub:{
        pageSize: 10
    },
    
    /**
     * @method 获取filter
     */
    getFilterParams: function () {
        var Con =  this.container;
        var param = {};
        param.province = Con.find("#provSelect").val();
        param.city = Con.find("#citySelect").val();
        var cv = Con.find("#conSelect").val();
        var inpVal = Con.find("#serhInp").val();
        if( cv == "1"){ //搜景区
            param["title"] = inpVal;
            param["supplier"] = "";
        }else{ //搜供应商
            param["title"] = "";
            param["supplier"] = inpVal;
        }
        if( param.province =="00")  param.province  = "";
        if( param.city=="000")  param.city = "";
        return  param;
    },

    /**
     * @method 初始化省市联动
     */
    initProCity: function () {
        var selector = new ProvCitySelector({
            provId : "#provSelect",                               //参数为<select></select>省标签的id
            cityId : "#citySelect",                                //参数为<select></select>市标签的id
            onProvChange : function (provId) {                     //当省下拉框变化时执行的回调函数，参数为 省下拉框中 所选省份对应的省份代号
                // $("#province_input").val(provId)
            },
            onCityChange : function (cityId) {                     //当省下拉框变化时执行的回调函数，参数为 市下拉框中 所选城市对应的城市代号
                // $("#city_input").val(cityId)
            }
        });
    }

});

module.exports = new Filter();
