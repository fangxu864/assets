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

        console.log(ajaxData.data.length);
        $("#table_box tbody tr").remove();
        for(var i = 0; i <ajaxData.data.length ; i++){
            var tr = $("<tr>"+
                "<td class='th1'>"+ajaxData.data[i].insertTime+"</td>" + //操作时间
                " <td>"+ajaxData.data[i].oper+"</td> " +          //操作员
                "<td>"+ajaxData.data[i].action+"</td> " +           //操作类型
                "<td>"+ajaxData.data[i].source_name+"</td> " +           //操作终端
                "<td>"+ajaxData.data[i].ordernum+"</td> " +           //订单号
                "<td>"+ajaxData.data[i].land_title+"</td> " +           //产品
                "<td>"+ajaxData.data[i].ticket_title+"</td> " +           //票
                "<td>"+ajaxData.data[i].content+"</td> " +                 //操作内容
                "</tr>");
            $("#table_box tbody").append(tr);
        };
    },
});

module.exports=Table;
