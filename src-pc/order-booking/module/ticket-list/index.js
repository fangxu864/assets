require("./index.scss");
var Message = require("pft-ui-component/Message");
var TicketModel = require("./ticket-model.js");

var IndexTpl = require("./index.xtpl");
var ListXtpl = require("./list.xtpl");
var TaoPiaoXtpl = require("./taopiaoList.xtpl");

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
        var addBtn = tarInp.siblings(".add");
        var minuBtn = tarInp.siblings(".minu");
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
        if(val*1>storage && storage!=-1) return goBack("预订数量不能超过库存数");

        if(val*1>buy_limit_up && buy_limit_up!=0) return goBack("最多只能预订"+buy_limit_up+"张");


        //以上校验通过后，说明用户此次的输入是合法可用的，此时还需要判断用户输入的数字与最大值最小值对比
        //以此来决定加减按钮的状态
        val = val * 1;
        var max, min;
        if(storage==-1 && buy_limit_up==0){ //如果库存、限购数都为不限
            max = -1;
        }else if(storage!=-1 && buy_limit_up!=0){ //如果两者都不为不限
            max = Math.min(storage,buy_limit_up);
        }else{ //如果只有一方有限制，另一方不限
            max = storage!=-1 ? storage : buy_limit_up;
        }
        min = isMain=="true" ? buy_limit_low : 0;

        addBtn.removeClass("disable");
        minuBtn.removeClass("disable");
        if(val==1 & isMain=="true") minuBtn.addClass("disable");
        if(val==0) minuBtn.addClass("disable");

        if(val>=max && max!=-1) addBtn.addClass("disable");
        if(val<=min) minuBtn.addClass("disable");

        
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
            js : 0,
            canOrder : false
        };
        var numberToFixed = PFT.Util.numberToFixed;
        var moneyFixed = this._moneyFixed;
        this.container.find(".ticketItem").each(function(){
            var item = $(this);
            var tid = item.attr("data-tid");
            var countInp = item.find(".countInp");
            var count = countInp.val();
            count = $.trim(count) * 1;
            var storage = countInp.attr("data-storage") * 1;
            var buy_limit_low = countInp.attr("data-buylimitlow") * 1;
            var price = that.getTicketMoney(tid);
            var ls = price.ls * 1;
            var js = price.js * 1;

            //判断这个订单是否可以预订 
            //如果每张票的storage都为0 则用户无法下单
            //只要有一张票是有库存的，并且库存大于或等于最小购买数，则这个订单是可以下单的
            
            if(that.checkCanOrderByTicket(count,storage,buy_limit_low)){
                result.count = result.count + count;
                result.ls = result.ls + ls;
                result.js = result.js + js;
                result.canOrder = true;
            }
        })
        return {
            canOrder : result.canOrder,
            count : result.count,
            ls : numberToFixed(result.ls,2),
            js : numberToFixed(result.js,2)
        };
    },
    /**
     * 判断某张票是否可以购买下单
     * @count {number} 购买数
     * @storage {number} 库存数
     * @buy_limit_low {number} 起购数
     */
    checkCanOrderByTicket : function(count,storage,buy_limit_low){
        if(count<=0) return false;  
        if(storage==0) return false;
        if(buy_limit_low>storage && storage!=-1) return false;
        return true;
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
        this.container.find(".ticketListTable_tbody").html(this.template(data));
        if(data.p_type=="F"){
            var html = PFT.Util.ParseTemplate(TaoPiaoXtpl)(data);
            this.container.append(html);
        }
    },
    refresh : function(date){
        console.log(date);
    },
    /**
     * 当切换开始时间或结束时间时,刷新价格跟库存
     * data = {
     *      tid : {
     *          storage : "",
     *          price : ""
     *      },
     *      tid : {
     *          storage : "",
     *          price : ""
     *      }
     * }
     */
    refreshTicketListData : function(data){
        var originData = this.originData;

        var newTickets = PFT.Util.Clone(originData.tickets,true);

        for(var i=0,len=newTickets.length; i<len; i++){
            var ticket = newTickets[i];
            var tid = ticket.tid;
            if(data[tid]){
                ticket.storage = data[tid].storage;
                ticket.ls = data[tid].ls;
                ticket.js = data[tid].js;
                var extra = ticket.extra || (ticket["extra"]={});
                extra["ls"] = ticket.ls;
                extra["js"] = ticket.js;
            }
        }

        console.log(newTickets);

    },
    render : function(data){
        //测试
        // var tickets = data.tickets;
        // for(var i=0,len=tickets.length; i<len; i++){
        //     if(i==0){
        //         tickets[i]["storage"] = 5;
        //         tickets[i]["buy_limit_low"] = 10;
        //         tickets[i]["buy_limit_up"] = 0;
        //     }else{
        //         tickets[i]["storage"] = 15;
        //         tickets[i]["buy_limit_low"] = 3;
        //         tickets[i]["buy_limit_up"] = 20;
        //     }
            
        // }

        var tickets = data.tickets;
        if(PFT.Util.isArray(tickets) && tickets.length>0){
            this.originData = data;
            this.container.html(IndexTpl);
            this.renderList(data);
        }else{
            Message.alert("您暂时没有权限预订此产品，页面将在1秒后返回","",{
                onOpenAfter : function(){
                    setTimeout(function(){
                        var refer = document.referrer;
                        if(!refer) refer = PFT_DOMAIN + "plist.html";
                        window.location.href = refer;
                    },1000)
                }
            });
        }
        
        return this;
    }
});

module.exports = TicketList;