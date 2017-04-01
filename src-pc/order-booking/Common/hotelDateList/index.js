
require ("./index.scss");
var dateListTpl = require("./index.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");

var hotelDateList = {

    render: function (opt) {

        this.container = typeof opt.container === "string" ? $(opt.container) : opt.container;

        var data = opt.data || this.data;

        var html = this.template({data: data});

        this.container.html(html);

    },

    template: ParseTemplate(dateListTpl),


    data: [
        {
            date: '2017-04-01',
            storage: 66 ,
            price: 666
        },
        {
            date: '2017-04-02',
            storage: 55 ,
            price: 666
        },
        {
            date: '2017-04-03',
            storage:63 ,
            price: 666
        },
        {
            date: '2017-04-04',
            storage: 88 ,
            price: 666
        }
    ]


    
};

module.exports = hotelDateList;