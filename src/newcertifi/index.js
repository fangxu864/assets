
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
        var list=res.data;
        if(res.code===200){
           
                var render = PFT.Util.ParseTemplate(tpl);
                var html = render({list:list});
                $("#memCertifyContainer").append(html);
            
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





