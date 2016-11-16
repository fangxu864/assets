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


    dealData:function (data) {
        $("#tableBox tbody tr").remove();

        for(var i = 0; i <10 ; i++){
            var tr = $("<tr>"+"<td class='th1'></td> <td>XXXXXXX（ID：45646）</td> <td>验证</td> <td>云票务</td> <td>12345635</td> <td>福建特色景区 </td> <td>成人票</td> <td>验证儿童票3张</td>" +"</tr>");
            $("#tableBox tbody ").append(tr);
        }


    },
});

module.exports=Table;
