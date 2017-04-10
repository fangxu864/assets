require("./index.scss");
var Tpl = require("./index.xtpl");

var Datepicker = require("../../Common/Datepicker");
var datepicker = new Datepicker();


var SukInfo = PFT.Util.Class({
    EVENTS : {
        "click .datepickerInp" : "onDatepickerInputClick"
    },
    template : PFT.Util.ParseTemplate(Tpl),
    init : function(opt){
        var data = opt.data;
        
    },
    onDatepickerInputClick : function(e){
        var that = this;
        var tarInp = $(e.currentTarget);
        var date = tarInp.val();
        datepicker.show(date,{
            relyInp: tarInp,
            min : that.data.startDate
        });
    },
    render : function(data){
        this.data = data;
        this.container.html(this.template(data));
        return this;
    }
});

module.exports = SukInfo;