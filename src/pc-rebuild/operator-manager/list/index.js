/**
 * Author: huangzhiyang
 * Date: 2016/11/30 10:10
 * Description: ""
 */


 // 平台-前后端分离-员工管理模块

 require("./index.scss");
 var loadingHTML = require("COMMON/js/util.loading.pc.js");
 var getlistajax = require("./service_list.js");
 var Pagination = require("COMMON/modules/pagination-x");


 //原有页面js

//搜索框变蓝效果
 // function cl(c){
 // 	if(c.value=="请输入员工名称\\账号\\手机"){
 // 		c.value="";
 // 		c.style.color="#000";
 // 		return;
 // 	}
 // 	if(c.value==""){
 // 		c.value="请输入员工名称\\账号\\手机";
 // 		c.style.color="#888";
 // 		return;
 // 	}
 // }
 //删除按钮
 // function break_off(id){
 // 	if(confirm('确定删除？')){
 // 		$.getJSON("call/jh_mem.php", { action:"clearAccount",mid:id}, function(json){
 // 			if(json['status']=='success'){
 // 				$.getJSON("call/chRela.php", { dtype:0, id:id}, function(json){
 // 					if(json['status']!='ok'){alert(json['msg']);}
 // 					else{alert('删除成功!');window.location.reload();}
 // 				});
 // 			}else{
 // 				alert(json['msg']);
 // 			}
 // 		});
 // 	}
 // }
 //禁用按钮
 // function disStatus(id,sta){
 //     var s=sta==0?1:0;
 //     $.ajax({
 //         url: "call/jh_mem.php",
 //         data: { action:'SetDisMemStatus', status:s, mid:id, rm_stuff:true},
 //         dataType: "json",
 //         success: function(json){
 //             if(json['status']!='ok'){alert(json['msg']);}
 //             else{alert((sta==0?"禁用":"启用")+"成功!");window.location.reload();}
 //         },
 //         type: "post"
 //     });
 // }


 //新加js


var operatorManagerList = {

    init : function(){

        var that = this;
        //分页器
        pagination = new Pagination({
            container : "#pagination_wrap" , //必须，组件容器id
            // count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true               //可选  是否显示跳到第几页
        });
        
        this.showList(1);   //初始化渲染第一页
            
        //绑定事件
        this.bind();

    },

    bind : function(){
        var that = this;
        $(".txtinpt").on("focus",function(){
            that.cl($(this)[0]);
        });
        $(".txtinpt").on("blur",function(){
            that.cl($(this)[0]);
        });

        pagination.on("page.switch",function(toPage,currentPage,totalPage){
            // toPage :      要switch到第几页
            // currentPage : 当前所处第几页
            // totalPage :   当前共有几页 

            $("#pagination_wrap").hide();

            that.showList(toPage);


        })
    },

    //禁用按钮
    disStatus : function(id,sta){   //id与sta为php变量，无法获得
        var s=sta==0?1:0;
        $.ajax({
            url: "call/jh_mem.php",
            data: { action:'SetDisMemStatus', status:s, mid:id, rm_stuff:true},
            dataType: "json",
            success: function(json){
                if(json['status']!='ok'){alert(json['msg']);}
                else{alert((sta==0?"禁用":"启用")+"成功!");window.location.reload();}
            },
            type: "post"
        });
    },

    //删除按钮
    break_off : function(id){   //id为php变量

        if(confirm('确定删除？')){
            $.getJSON("call/jh_mem.php", { action:"clearAccount",mid:id}, function(json){
                if(json['status']=='success'){
                    $.getJSON("call/chRela.php", { dtype:0, id:id}, function(json){
                        if(json['status']!='ok'){alert(json['msg']);}
                        else{alert('删除成功!');window.location.reload();}
                    });
                }else{
                    alert(json['msg']);
                }
            });
        }

    },


    //搜索框也用ajax  //未做
    cl : function(c){

        if(c.value=="请输入员工名称\\账号\\手机"){
            c.value="";
            c.style.color="#000";
            return;
        }
        if(c.value==""){
            c.value="请输入员工名称\\账号\\手机";
            c.style.color="#888";
            return;
        }

    },


    showList : function(topage){  //第几页
        getlistajax({
            loading : function(){
                var loadingHtml = loadingHTML("请稍后...",{
                    tag : "tr",
                    colspan : 5
                });
                $(".perlistabBody").html(loadingHtml);
            },
            complete : function(){
            },
            success : function(data){

                var code = data.code;
                var msg = data.msg;
                var list = data.list;
                var totalPage = data.totalPage;
                var tbody = $(".perlistab tbody.perlistabBody");
                var temp = "";
                //动态dom
                for(var i = 0;i<list.length;i++){
                    temp += 
                    '<tr>' +
                        '<td class="txtlf">'+list[i].name+'</td>' +
                        '<td>'+list[i].telNumber+'</td>' +
                        '<td class="colgrn">'+list[i].status+'</td>' +
                        '<td>'+list[i].lastLogin+'</td>'+
                        '<td>'+
                            '<a href="#" >禁用</a> | '+
                            '<a href="#">删除</a> | '+
                            '<a href="#">权限管理</a> | '+
                            '<a href="#">密码重设</a>'+
                        '</td>'+
                    '</tr>' ;
                }
                tbody.html(temp);
                pagination.render({current:topage,total:totalPage});
            },
            fail : function(msg){
                alert(msg);
            }
        },topage);
    }

    

}


$(function(){
    operatorManagerList.init();
});


 