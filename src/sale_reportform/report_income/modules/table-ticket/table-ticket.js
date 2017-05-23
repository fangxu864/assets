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
                if( e.target.className.indexOf('btn-export-single') != -1 ) {
                    _this.outExcel( $( e.target ).attr('data-url') );
                } else {
                    shrinkBtn.click();
                }
            }
        });

        // 点击对应th，降序排序 added 2017/04/26
        this.container.on('click', '.orderby', function(){
                // 由于目前只有一列排序，所以数据直接后端做排序处理，前端不用添加事件，留着方便后期做多列排序
                // _this.sortTableBy( $(this).attr('data-orderby'), $(this).attr('data-filter') );

        });
    },

    // 表格排序
    sortTableBy: function( orderby, filter_params ){
        var _this = this,
            params = {};
        //判断是否按票查询
        //按票查询
        if( !orderby ) return false;

        switch( orderby ) {
            case 'ticket_num':
                params = this.stringToObject( filter_params );
                params.ticket_orderby = 1;
                console.log(params);
                if( params.searchTicket ){
                    _this.CR.pubSub.pub("DC.getTicketData" , params );
                }
                //默认的查询方式
                else{
                    _this.CR.pubSub.pub("DC.getMainData" , params );
                }
                break;
        }

    },

    stringToObject: function( str ) {
        var tempArr = [],
            params = {},
            i,
            len,
            key,
            val;

        if( str.length ) {
            tempArr = str.split('&');
            for( i=0, len = tempArr.length; i<len; i++ ) {
                key = tempArr[i].split('=')[0];
                val = tempArr[i].split('=')[1] == 'false' ? false :
                        tempArr[i].split('=')[1]=='true' ? true : tempArr[i].split('=')[1];
                params[ key ] = val;
            }
        }

        return params;
    },

    /**
     * @method导出excel
     */
    outExcel:function (downloadUrl) {
        var iframeName="iframe"+new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
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
            obj.firstTrData.id = res.data.list[i].id;

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
        var html = this.tableTicketTemplate({data : listData, export_url: res.export_url, filter_params: res.filter_params });
        this.container.html(html);
        this.container.show();
    },

    /**
     * @method 解析模板
     */
    tableTicketTemplate: ParseTemplate( tableTicketTpl )


};

module.exports = tableTicket;