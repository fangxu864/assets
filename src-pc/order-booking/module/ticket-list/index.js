require("./index.scss");
var Message = require("pft-ui-component/Message");
var TicketModel = require("./ticket-model.js");

var IndexTpl = require("./index.xtpl");
var ListXtpl = require("./list.xtpl");

var TicketList = PFT.Util.Class({
    model : new TicketModel(),
    template : PFT.Util.ParseTemplate(ListXtpl),
    originData : null,
    _moneyFixed : 2,
    init : function(){
        var that = this;
    },
    EVENTS : {
        "click .countBox .cBtn" : "onCountBtnClick",
        "focus .countBox .countInp" : "onCountInpFocus",
        "blur .countBox .countInp" : "onCountInpBlur",
        "blur .buyPriceInput" : "onBuyPriceInpBlur",
        "focus .buyPriceInput" : "onBuyPriceInpFocus"
    },
    onCountBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        var tarInp = tarBtn.siblings(".countInp");
        var addBtn = null;
        var minuBtn = null;
        if(tarBtn.hasClass("disable")) return false;
        if(tarBtn.hasClass("add")){ //加
            minuBtn = tarBtn.siblings(".minu");
            addBtn = tarBtn;
            this.addCount(tarInp,addBtn,minuBtn);
        }else{//减
            addBtn = tarBtn.siblings(".add");
            minuBtn = tarBtn;
            this.minuCount(tarInp,addBtn,minuBtn);
        }
    },
    onCountInpFocus : function(e){
        var tarInp = $(e.currentTarget);
        if(tarInp.hasClass("disable")) return false;
        var val = $.trim(tarInp.val());
        tarInp.attr("data-orignval",val);
    },
    //手动输入票数
    onCountInpBlur : function(e){
        var tarInp = $(e.currentTarget);
        if(tarInp.hasClass("disable")) return false;
        var tid = tarInp.attr("data-tid");
        var val = $.trim(tarInp.val());
        val = String(val*1);
        tarInp.val(val);
        var oldVal = tarInp.attr("data-orignval");
        var isMain = tarInp.attr("data-ismain");
        var buy_limit_up = tarInp.attr("data-buylimitup") * 1;
        var buy_limit_low = tarInp.attr("data-buylimitlow") * 1;
        var storage = tarInp.attr("data-storage")*1;
        var goBack = function(stip){
            stip = stip || (isMain=="true" ? "票数请填写不为0的整数" : "票数请填写整数，可以为0");
            Message.error(stip);
            tarInp.val(oldVal);
            return false;
        }


        if(isNaN(val)) return goBack();

        //主票不为0
        if(isMain=="true" && !PFT.Util.Validate.typeInit(val)) return goBack();

        if(isMain=="false" && !PFT.Util.Validate.typeInit0(val)) return goBack();

        //主票不能为0
        if(val==0 && isMain=="true") return goBack();

        // 最小购买数
        if(val*1<buy_limit_low && val!=0) return goBack("票数"+buy_limit_low+"张起订");

        //不能超出库存
        if(val*1>storage) return goBack("预订数量不能超过库存数");

        if(val*1>buy_limit_up && buy_limit_up!=0) return goBack("最多只能预订"+buy_limit_up+"张");
        
        this.renderTicketMoney(tid);

        this.trigger("change",this.getTotalInfo());

    },
    onBuyPriceInpFocus : function(e){
        var tarInp = $(e.currentTarget);
        var val = $.trim(tarInp.val());
        if(tarInp.hasClass("disable")) return false;
        tarInp.attr("data-orignval",val);
    }, 
    onBuyPriceInpBlur : function(e){
        var tarInp = $(e.currentTarget);
        var val = $.trim(tarInp.val());
        var oldVal = tarInp.attr("data-orignval");
        var jsprice = tarInp.attr("data-jsprice")*1;
        var tid = tarInp.attr("data-tid");
        if(tarInp.hasClass("disable")) return false;
        var goBack = function(tip){
            tip = tip || "";
            Message.error(tip);
            tarInp.val(oldVal);
        };
        if(val=="") return tarInp.val(oldVal);

        if(isNaN(val)) return goBack("请输入数字，单位为元，可精确到分，如：0.01");

        var sp = val.split(".");
        if(sp.length==2 && sp[1].length>2) return goBack("只能精确到分，如：0.01");

        if(val*1<jsprice) return goBack("输入的售价不能小于结算价");

        this.renderTicketMoney(tid);
        this.trigger("change",this.getTotalInfo());

    },
    /**
     * 增加票数，点击加号按钮
     */
    addCount : function(tarInp,addBtn,minuBtn){
        var oldVal = $.trim(tarInp.val()) * 1;
        var newVal = oldVal + 1;
        var storage = tarInp.attr("data-storage") * 1;
        var buy_limit_up = tarInp.attr("data-buylimitup") * 1;
        var buy_limit_low = tarInp.attr("data-buylimitlow") * 1;
        var tid = tarInp.attr("data-tid");

        //buy_limit_up==0 => 不限
        if(newVal>=buy_limit_up && buy_limit_up!=0){
            newVal = buy_limit_up;
            addBtn.addClass("disable");
        }
        //storage==-1 => 不限
        if(newVal>=storage && storage!=-1){
            newVal = storage;
            addBtn.addClass("disable");
        }

        if(newVal<buy_limit_low){
            newVal = buy_limit_low;
        }

        tarInp.val(newVal);
        minuBtn.removeClass("disable");

        this.renderTicketMoney(tid);
        this.trigger("change",this.getTotalInfo());

    },
    /**
     * 减少票数，点击减号按钮
     */
    minuCount : function(tarInp,addBtn,minuBtn){
        var isMain = tarInp.attr("data-ismain");
        var oldVal = $.trim(tarInp.val()) * 1;
        var newVal = oldVal - 1;
        var buy_limit_low = tarInp.attr("data-buylimitlow") * 1;
        var tid = tarInp.attr("data-tid");

        if(newVal<=buy_limit_low){//小于最小购买数
            if(isMain=="true"){ //如果是主票，不允许购买数为0
                newVal = buy_limit_low;
                minuBtn.addClass("disable");
            }else{ //非主票可以为0，即不买
                if(newVal<buy_limit_low){
                     newVal = 0;
                     minuBtn.addClass("disable");
                }
            }
        }

        tarInp.val(newVal);
        addBtn.removeClass("disable");
        this.renderTicketMoney(tid);
        this.trigger("change",this.getTotalInfo());

    },
    //刷新某张票的价格小计
    renderTicketMoney : function(tid){
        var price = this.getTicketMoney(tid);
        $("#jsTotalMoneyNum_"+tid).text(price.js);
        $("#lsTotalMoneyNum_"+tid).text(price.ls);
    },
    //计算单张票的应改与应付
    getTicketMoney : function(tid){
        var ls = $.trim($("#buyPriceInput_"+tid).val());
        var js = $("#jsMoneyNum_"+tid).text();
        var count = $.trim($("#countInp_"+tid).val());
        var numberToFixed = PFT.Util.numberToFixed;
        var moneyFixed = this._moneyFixed;
        return{
            ls : numberToFixed(ls*count,moneyFixed),
            js : numberToFixed(js*count,moneyFixed)
        }
    },
    //计算汇总信息
    getTotalInfo : function(){
        var that = this;
        var result = {
            count : 0,
            ls : 0,
            js : 0
        };
        var numberToFixed = PFT.Util.numberToFixed;
        var moneyFixed = this._moneyFixed;
        this.container.find(".ticketItem").each(function(){
            var item = $(this);
            var tid = item.attr("data-tid");
            var count = item.find(".countInp").val();
            count = $.trim(count) * 1;
            var price = that.getTicketMoney(tid);
            var ls = price.ls * 1;
            var js = price.js * 1;

            result.count = result.count + count;
            result.ls = numberToFixed(result.ls + ls,moneyFixed);
            result.js = numberToFixed(result.js + js,moneyFixed);

        })
        return result;
    },
    /**
     * 更新列表 data = {...,tickets:[{item},{item},..]};
     * 
     * item为object, 格式为:
     * 
     * item = {
     *      buy_limit_low : 1,
     *      buy_limit_up : 0,
     *      js : 0.2,
     *      ls : 1,
     *      pid : 123423,
     *      tid : 03453,
     *      storage : 1,
     *      title : "sdfsdfsdf"
     *      extra : {
     *          js : "0.01",
     *          ls : "0.01",
     *          reb : "0元"
     *      }
     * }
     */
    renderList : function(data){
        console.log(data);
        this.container.find(".ticketListTable_tbody").html(this.template(data));
    },
    render : function(data){
        // var tickets = data.tickets;
        // for(var i=0,len=tickets.length; i<len; i++){
        //     tickets[i]["storage"] = 15;
        //     tickets[i]["buy_limit_low"] = 3;
        //     tickets[i]["buy_limit_up"] = 20;
        // }




        this.originData = data;
        this.container.html(IndexTpl);
        this.renderList(data);
    }
});

module.exports = TicketList;