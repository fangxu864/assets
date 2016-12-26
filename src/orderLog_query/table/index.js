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
        var list=ajaxData.data.list;
        if(list.length==0){
          
            $("#table_box tbody ").remove();
            $("#table_box table ").append("<tr class='loading'><td></td><td></td><td></td><td></td><td>未找到相关数据。</td><td></td><td></td><td></td></tr>");
        }
        for(var i = 0; i <list.length ; i++){
            var tr = "<tr>"+
                "<td class='th1'>"+list[i].insertTime+"</td>" + //操作时间
                " <td>"+list[i].oper+"</td> " +          //操作员
                "<td>"+list[i].action_name+"</td> " +           //操作类型
                "<td>"+list[i].source_name+"</td> " +           //操作终端
                "<td>"+list[i].ordernum+"</td> " +           //订单号
                "<td>"+list[i].land_title+"</td> " +           //产品
                "<td>"+list[i].ticket_title+"</td> " +           //票
                "<td class='tl1'>"+list[i].tnum+"</td> " +                 //数量
                "</tr>";
            $("#table_box tbody").append(tr);
        };
    },
});

module.exports=Table;
