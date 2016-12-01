



// 平台-前后端分离-操作日志模块 

require("./index.scss");


var Toast = require("COMMON/modules/toast");
var getlist = require("./service_record.js");
var Pagination = require("COMMON/modules/pagination-x");

//原来的js
$("#excel").click(function () {
    var checkRes = checkPeriod();
    if (checkRes[0]) {
        $("#act").val("Export");
        $("#searchBox").submit();
        $("#act").val("");
    } else {
        alert(checkRes[1]);
    }

});

//导出Excel前时间段验证，避免导出全表数据
function checkPeriod() {
    var btime = $("#btime").val();
    var etime = $("#etime").val();
    if (btime) {
        var bDate = getDateFromStr(btime);
    } else {
        return new Array(0, '请选择开始时间');
    }

    if (etime) {
        var eDate = getDateFromStr(etime);
    } else {
        var eDate = new Date();
    }
    var time = eDate.getTime() - bDate.getTime();
    var days = parseInt(time / (1000 * 60 * 60 * 24));
    if (days < 0) {
        return new Array(0, '请选择正确的时段');
    }
    //限制导出的时间段为3个月
    if (days > 90) {
        return new Array(0, '请选择不超过3个月的时间段');
    }

    return new Array(1, '');
}

function getDateFromStr(dateStr) {
    var date = new Date(dateStr.replace(/-/g, '/'));
    return date;
}


//新js









var toast = new Toast();
getlist({
            loading : function(){
                toast.show("loading","努力加载中...")
            },
            complete : function(){
                toast.hide()
            },
            success : function(data){

                console.log(data);
                var code = data.code;
                var msg = data.msg;
                var list = data.list;
                console.log(list);
                var temp = "";
                //动态dom
                for(var i = 0;i<list.length;i++){
                    temp += 
                    '<tr>' +
                        '<td>'+list[i].time+'</td>' +
                        '<td>'+list[i].name+'</td>' +
                        '<td>'+list[i].content+'</td>'
                    '</tr>' ;
                }
                $("table.records").append(temp);
                console.log("请求成功");
            },
            fail : function(msg){
                alert(msg);
            }
        });    



$(function(){
	pagination = new Pagination({
	    container : "#pagination_wrap" , //必须，组件容器id
	    count : 7,                //可选  连续显示分页数 建议奇数7或9
	    showTotal : true,         //可选  是否显示总页数
	    jump : true               //可选  是否显示跳到第几页
	});
	pagination.render({current:1,total:5});

	console.log(pagination);
})

