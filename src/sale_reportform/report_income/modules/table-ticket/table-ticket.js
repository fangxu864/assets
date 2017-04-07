/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-ticket.scss");
var tableTicketTpl = require("./table-ticket.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Tip = require("COMMON/modules/tips");
var Tips = new Tip();

/**
 * 本模块为按票查询时表格数据显示模块
 * 负责显示DC数据中心传递过来的数据
 */
var tableTicket = {
    container: $("<div class='tableTicket'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);

        this.sub();
        this.bind();
    },

    //订阅
    sub: function () {
        var _this = this;

        this.CR.pubSub.sub("tableTicket.close",function () {
            _this.close();
        });
        this.CR.pubSub.sub("tableTicket.render",function (res) {
            _this.render(res);
        });
    },

    bind: function () {
        var _this = this;


        //表格伸展收缩按钮
        this.container.on("click",".un-shrink",function (e) {
            e.stopPropagation();
            $(this).toggleClass("shrink");
            $(this).parents("tr").siblings("tr").fadeToggle(0);
        });

        this.container.on("click" , ".parent-tr" , function (e) {
            var shrinkBtn = $(this).find('.un-shrink');
            if(shrinkBtn){
                shrinkBtn.click();
            }
        })

    },

    close: function () {
        this.container.hide();
    },

    /**
     * @method 渲染表格内容
     */
    render: function ( res ) {
        var listData = {
            pay_list: res.data.pay_list,
            list:[],
            total_info: {},
            Jtype: res.data.Jtype
        };
        for( var number in res.data.total_info){
            listData.total_info[number] = Number( res.data.total_info[number] )
        }
        for(var i in res.data.list ){
            var obj = (function () {
                return {
                    firstTrData:{
                        cancel_money: 0,
                        cancel_order_num: 0,
                        cancel_ticket_num: 0,
                        order_num: 0,
                        pid_pay_way: "13",
                        real_money: 0,
                        real_num: 0,
                        sale_money: 0,
                        service_money: 0,
                        ticket_num: 0
                    },
                    childListData:[]
                };
            }());
            obj.firstTrData.name = res.data.list[i].name;

            for(var j in res.data.list[i]['pay_way']){
                obj.firstTrData.cancel_money += Number( res.data.list[i]['pay_way'][j]['cancel_money'] );
                obj.firstTrData.cancel_order_num += Number( res.data.list[i]['pay_way'][j]['cancel_order_num'] );
                obj.firstTrData.cancel_ticket_num += Number( res.data.list[i]['pay_way'][j]['cancel_ticket_num'] );
                obj.firstTrData.order_num += Number( res.data.list[i]['pay_way'][j]['order_num'] );
                obj.firstTrData.real_money += Number( res.data.list[i]['pay_way'][j]['real_money'] );
                obj.firstTrData.real_num += Number( res.data.list[i]['pay_way'][j]['real_num'] );
                obj.firstTrData.sale_money += Number( res.data.list[i]['pay_way'][j]['sale_money'] );
                obj.firstTrData.service_money += Number( res.data.list[i]['pay_way'][j]['service_money'] );
                obj.firstTrData.ticket_num += Number( res.data.list[i]['pay_way'][j]['ticket_num'] );
                obj.childListData.push(res.data.list[i]['pay_way'][j])
            }
            listData.list.push(obj)
        }
        var html = this.tableTicketTemplate({data : listData });
        this.container.html(html);
        this.container.show();
    },

    /**
     * @method 解析模板
     */
    tableTicketTemplate: ParseTemplate( tableTicketTpl )


};

module.exports = tableTicket;