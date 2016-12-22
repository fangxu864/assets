/**
 * Created by Administrator on 2016/11/14.
 */

//引入css
require("./index.scss");
//引入tpl
var table_tpl=require("./index.xtpl");
var tr_tpl=require("./tr.xtpl");

var Table=PFT.Util.Class({
    container:"#table_box",
    EVENTS:{
        
    },
    init:function () {
        $("#table_box").append(table_tpl)
    },


    dealData:function (ajaxData) {

        $("#table_box tbody tr").remove();
        //没有数据提示
        if(ajaxData.data.length==0){
            console.log(ajaxData.data);
            $("#table_box tbody ").remove();
            $("#table_box table ").append("<tr class='loading'><td></td><td></td><td></td><td></td><td>未找到相关数据。</td><td></td><td></td><td></td></tr>");
        }

        for(var i = 0; i <ajaxData.data.length ; i++){
            var tr = $("<tr>"+
                "<td class='th1'>"+ajaxData.data[i].insertTime+"</td>" + //操作时间
                " <td>"+ajaxData.data[i].oper+"</td> " +          //操作员
                "<td>"+ajaxData.data[i].action+"</td> " +           //操作类型
                "<td>"+ajaxData.data[i].source_name+"</td> " +           //操作终端
                "<td>"+ajaxData.data[i].ordernum+"</td> " +           //订单号
                "<td>"+ajaxData.data[i].land_title+"</td> " +           //产品
                "<td>"+ajaxData.data[i].ticket_title+"</td> " +           //票
                "<td class='tl1'>"+ajaxData.data[i].content+"</td> " +                 //数量
                "</tr>");
            $("#table_box tbody").append(tr);
        };
    },
});

module.exports=Table;
