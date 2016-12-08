var template=require("art-template");
var tpl=require("./index.xtpl");

$(document).ready(function(){ 
$.ajax({
    url:'/r/Member_MemberCertifi/getCertifiInfo',
    type:'POST', //GET
    async:true,    //或false,是否异步
    timeout:5000,    //超时时间
    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
    beforeSend:function(xhr){
        console.log(xhr)
        console.log('发送前')
    },
    success:function(res){
        var data=res.data;
        if(res.code===200){
            if(data.info.com_type==="其他"){
                templdate(tpl,data);
                $("#memCertifyContainer .formContainer").html(tpl);
            }
        }
    },
    error:function(xhr,textStatus){
        console.log('错误')
        console.log(xhr)
        console.log(textStatus)
    },
    complete:function(){
        console.log('结束')
    }
})

    })





