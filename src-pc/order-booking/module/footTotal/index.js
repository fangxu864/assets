require("./index.scss");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);
var FootTotal = PFT.Util.Class({
    init : function(opt){},
    render : function(data,totalInfo){
        
        //判断后端返回的数据里，tickets数组里的每张票
        //如果每张票的storage都为0 则用户无法下单
        //只要有一张票是有库存的，并且库存大于或等于最小购买数，则这个订单是可以下单的

        var canOrder = false;

        var tickets = data.tickets;
        for(var i=0,len=tickets.length; i<len; i++){
            var ticket = tickets[i];
            var storage = ticket.storage * 1;
            var buy_limit_up = ticket.buy_limit_up * 1;
            var buy_limit_low = ticket.buy_limit_low * 1;
            if((storage>0 && storage >= buy_limit_low) || (storage==-1)){
                canOrder = true;
                break;
            }
        }

        totalInfo["canOrder"] = canOrder;

        this.container.html(Template(totalInfo));
        return this;
    },
    disableSubmit : function(){
        $("#submitOrderBtn").addClass("disable");
        return this;
    },
    enableSubmit : function(){
        $("#submitOrderBtn").removeClass("disable");
        return this;
    }
});

module.exports = FootTotal;