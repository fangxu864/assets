require("./index.scss");


var ProvCitySelector = require("COMMON/js/component.city.select.js");


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
            var province = Con.find("#provSelect").val();
            var city = Con.find("#citySelect").val();
            var cv = Con.find("#conSelect").val();
            var inpVal = Con.find("#serhInp").val();
            console.log(cv);
            if(cv == "1"){ //搜景区
                var title = inpVal;
                var supplier = "";
            }else{ //搜供应商
                var title = "";
                var supplier = inpVal;
            }
            if(province=="00") province = "";
            if(city=="000") city = "";
        })
    },

    //参数暂存仓库
    FilterParamHub:{},

    /**
     * @method 初始化省市联动
     */
    initProCity: function () {
        var selector = new ProvCitySelector({
            provId : "#provSelect",                               //参数为<select></select>省标签的id
            cityId : "#citySelect",                                //参数为<select></select>市标签的id
            onProvChange : function (provId) {                     //当省下拉框变化时执行的回调函数，参数为 省下拉框中 所选省份对应的省份代号
                console.log(provId);
                // $("#province_input").val(provId)
            },
            onCityChange : function (cityId) {                     //当省下拉框变化时执行的回调函数，参数为 市下拉框中 所选城市对应的城市代号
                console.log(cityId);
                // $("#city_input").val(cityId)
            }
        });

    }

});

module.exports = Filter;
