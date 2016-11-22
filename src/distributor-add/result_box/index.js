/**
 * Created by Administrator on 2016/11/21.
 */
/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
var tpl = require("./result_box.xtpl");

//块级写法\
var RESULT_BOX=PFT.Util.Class({
    //放入容器
    container:"#result_box",

//绑定事件
    EVENTS:{
        // "click #id1":"event1",
        // "click .class1":"event2"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        $("#result_box").append(tpl)
    },

//事件调用方法1
    showResult:function(req){
        $("table tbody tr").remove();
        if(req.length){
            for(var i =0 ;i<req.length;i++){
                var operation = "添加";

                if(req[i].created){
                    operation = "已添加|配置价格"
                }
                var tr = $("<tr><td class='col_first'>["+req[i].passport+"]"+req[i].dname+"</td><td>"+req[i].com_type+"</td><td>"+req[i].cname+"["+req[i].mobile+"]</td><td>"+operation+"</td></tr>");
                $("table tbody").append(tr);
            }
        }
    },

    quickAdd:function (req) {
        var operation = "添加";

        if(req.created){
            operation = "已添加|配置价格"
        }
        var tr = $("<tr><td class='col_first'>["+req.passport+"]"+req.dname+"</td><td>"+req.com_type+"</td><td>"+req.cname+"["+req.mobile+"]</td><td>"+operation+"</td></tr>");
        var data = $("table tbody .col_first");
        for(var i =0 ; i< data.length ; i++){
            if(data[i].innerHTML == "["+req.passport+"]"+req.dname){
                return false
            }
        }

        $("table tbody").append(tr);
    },
//事件调用方法2
    event2:function(){
    },

//用于函数内部自我调用的方法
    selfFunctionCall1:function(){
    }
});

//模块导出
module.exports=RESULT_BOX;