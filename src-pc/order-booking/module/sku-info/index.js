require("./index.scss");
var Tpl = require("./index.xtpl");

var Datepicker = require("../../Common/Datepicker");
var datepicker = new Datepicker();
var ChangciSelect = require("./changciSelect");

var SukInfo = PFT.Util.Class({
    EVENTS : {
        "click .datepickerInp" : "onDatepickerInputClick"
    },
    template : PFT.Util.ParseTemplate(Tpl),
    init : function(opt){
        var that = this;
        this.data = opt.data;
        this.render(this.data);

        if(this.data.p_type=="H"){//演出类产品时，引入场次选择模块
            var changciSelect = this.changciSelect = new ChangciSelect({startDate:this.data.startDate});
            changciSelect.on("change",function(data){
                $("#iShowBeginTimeInp").val(data.time);
            })
            changciSelect.on("empty",function(){
                $("#iShowBeginTimeInp").val("该日期暂无场次安排");
            })
        }

        datepicker.on("datePick",function(data){
            data["p_type"] = that.data.p_type;
            var tarInp = data.relyInp;
            if(tarInp.attr("id")=="beginTimeInput"){ //开始时间
                that.trigger("change:beginDate",data);
            }
        })
    },
    onDatepickerInputClick : function(e){
        var that = this;
        var tarInp = $(e.currentTarget);
        var date = tarInp.val();
        var id = tarInp.attr("id");
        var pType = this.data.p_type.toUpperCase();
        if(pType=="H"){ //演出类
            this.changciSelect.open();
            return false;
        }
        if(pType=="C"){

            //return false;
        }
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