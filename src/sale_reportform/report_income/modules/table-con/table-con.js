/**
 * Created by Administrator on 2017/2/24.
 */

require("./table-con.scss");
var tableConTpl = require("./table-con.xtpl");
var tableLtTpl = require("./table-lt.xtpl");
var tableRtTpl = require("./table-rt.xtpl");
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
        this.container.on("click",".un-shrink",function () {
            $(this).toggleClass("shrink");
            var dataIndex = $(this).parents("tr").attr('data-index');
            _this.container.find('tr[data-index ='+dataIndex+' ]').siblings("tr").fadeToggle(0);
        })

    },

    close: function () {
        this.container.hide();
    },

    /**
     * @method 渲染表格内容
     */
    render: function ( res ) {
        var payListLen = res.data.pay_list.length;
        var rtData = {
            pay_list: res.data.pay_list,
            total: new Array(payListLen),
            list:[]
        };
        //合计
        for(var key in res.data.pay_way_money){
            rtData.total[key] = res.data.pay_way_money[key]
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
                obj.parentTr[tkey] = Number( res.data.list[i].pay_way_money[tkey] )
            }
            for(var j= 0; j< res.data.list[i].product_list.length; j++){
                //得出支付方式集合
                var arr = new Array(payListLen);
                for(var k= 0; k< res.data.list[i].product_list[j].payway_list.length; k++){
                    arr[res.data.list[i].product_list[j].payway_list[k].pay_way] = Number( res.data.list[i].product_list[j].payway_list[k].sale_money );
                }
                obj.childTr.push(arr);
            }
            rtData.list.push(obj)
        }
        var tableLtHtml = this.tableLtTemplate({data : res });
        var tableRtHtml = this.tableRtTemplate({data : rtData });
        this.container.find(".table-lt").html(tableLtHtml);
        this.container.find(".table-rt").html(tableRtHtml);
        this.container.show();
    },

    /**
     * @method 解析模板
     */
    tableLtTemplate: ParseTemplate( tableLtTpl ),
    tableRtTemplate: ParseTemplate( tableRtTpl )


};

module.exports = tableCon;