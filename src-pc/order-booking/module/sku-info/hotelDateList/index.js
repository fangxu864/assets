
require ("./index.scss");
var dateListTpl = require("./index.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

var hotelDateList = {

    __cacheData : null,

    getCacheData : function(){
        return this.__cacheData;
    },

    render: function (opt) {

        this.__cacheData = opt.data;

        var count = (function(data){
            var index = 0;
            for(var i in data) index++;
            return index;
        })(opt.data);


        this.container = typeof opt.container === "string" ? $(opt.container) : opt.container;

        //如果只有一天，就不渲染了
        if(count<=1) return this.container.html("");

        var data = opt.data || this.data;

        var html = this.template({data: data});

        this.container.html(html);

    },

    template: ParseTemplate(dateListTpl),
    
    data: {}
    
};

module.exports = hotelDateList;