/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tableConTpl = require("./table-con.xtpl"),
    tableLtTpl = require("./table-lt.xtpl"),
    tableRtTpl = require("./table-rt.xtpl"),
    tableOperateTpl = require("./table-operate.xtpl");
var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
require("COMMON/modules/DragConOver")($);
var Tip = require("COMMON/modules/tips");
var Tips = new Tip();

/**
 * 本模块为数据显示模块
 * 负责显示filter传递过来的数据
 */
var tableCon = {
    container: $("<div class='tableCon clearfix'></div>"),
    init: function (CR) {
        var _this = this;
        this.CR = CR;
        this.CR.mainBox.append(_this.container);
        this.container.html(tableConTpl);
        this.bind();
    },

    bind: function () {
        var _this = this;

        this.CR.pubSub.sub("tableConBox.close",function () {
            _this.close();
        });
        this.CR.pubSub.sub("tableConBox.render",function (res) {
            _this.render(res);
        });

        //表格右侧拖动
        this.container.find('.table-rt').DragConOver({
            direction:"x",
            callBack:function(dValue){
            }
        });

        //表格伸展收缩按钮
        this.container.on("click",".un-shrink",function (e) {
            e.stopPropagation();
            $(this).toggleClass("shrink");
            var dataIndex = $(this).parents("tr").attr('data-index');
            _this.container.find('tr[data-index ='+dataIndex+' ]').siblings("tr").fadeToggle(0);
        });

        this.container.on("click" , ".parent-tr" , function (e) {
            var shrinkBtn = $(this).find('.un-shrink');
            if(shrinkBtn){
                shrinkBtn.click();
            }
        });

        // 点击对应th，降序排序 added 2017/04/26
        this.container.on('click', '.orderby', function(){
                // 由于目前只有一列排序，所以数据直接后端做排序处理，前端不用添加事件，留着方便后期做多列排序
                // _this.sortTableBy( $(this).attr('data-orderby'), $(this).attr('data-filter') );

        }).on('click', '.btn-export-single', function(){
            _this.outExcel( $(this).attr('data-url') );
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
            case 'member_ticket':
                params = this.stringToObject( filter_params );
                params.ticket_orderby = 1;

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
        var payListLen = (function(){
            var i = 0;
            for(var key in res.data.pay_list){i++};
            return i;
        })();
        var rtData = {
            keyC:{},
            pay_list: res.data.pay_list,
            total: new Array(payListLen),
            list:[]
        };
        //keyC 为键值对应的列数{ 0: 0, 12 : 5}
        var keyC_key_index = 0;
        for(var keyC_key in res.data.pay_list){
            rtData.keyC[keyC_key] = keyC_key_index++
        }

        //合计
        for(var key in res.data.pay_way_money){
            if( rtData.keyC[key] === undefined ) continue;
            rtData.total[ rtData.keyC[key] ] = res.data.pay_way_money[key]

        }
        for(var i= 0; i< res.data.list.length; i++){
            var obj = (function () {
                return {
                    parentTr:new Array(payListLen),
                    childTr:[]
                };
            }());
            //parentTr
            for( var tkey in res.data.list[i].pay_way_money ){
                if( rtData.keyC[tkey] === undefined ) continue;
                obj.parentTr[rtData.keyC[tkey]] = Number(res.data.list[i].pay_way_money[tkey])

            }
            for(var j= 0; j< res.data.list[i].product_list.length; j++){
                //得出支付方式集合

                var arr = (function(){return new Array(payListLen)})();


                for(var k= 0; k< res.data.list[i].product_list[j].payway_list.length; k++){
                    var curObj = res.data.list[i].product_list[j].payway_list[k];
                    if( rtData.keyC[curObj.pay_way] === undefined ) continue;
                    arr[rtData.keyC[curObj.pay_way]] = Number(curObj.sale_money) - Number(curObj.cancel_money) + Number(curObj.service_money);

                }

                obj.childTr.push(arr);
            }
            rtData.list.push(obj)
        }

        // console.log( res )
        var tableLtHtml = this.tableLtTemplate({data : res, filter_params: res.filter_params });
        var tableRtHtml = this.tableRtTemplate({data : rtData });
        var tableOperateHtml = this.tableOperateTemplate({data : res, export_url: res.export_url });

        this.container.find(".table-lt").html(tableLtHtml);
        this.container.find(".table-rt").html(tableRtHtml);
        this.container.find(".table-operate").html(tableOperateHtml);
        this.container.find(".rt-con .table-rt").css("left",0);
        this.container.show();
    },

    /**
     * @method 解析模板
     */
    tableLtTemplate: ParseTemplate( tableLtTpl ),
    tableRtTemplate: ParseTemplate( tableRtTpl ),
    tableOperateTemplate: ParseTemplate( tableOperateTpl )


};

module.exports = tableCon;