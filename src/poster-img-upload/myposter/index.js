











console.log("我的产品页面");



var Select = require("COMMON/modules/select");
var Dialog = require("COMMON/modules/dialog-simple");





    var select1=new Select({
        source : "/r/Mall_Poster/getProducts/",
        ajaxType : "post",
        ajaxParams : {
          
        },
        isFillContent:false,
        filterType : "ajax",  //指定过滤方式为ajax
        field : {
            id : "id",
            name : "title",
            keyword : "keyword"
        },
        trigger : $("#testinput"),

        filter : true,
        adaptor : function(res){
            var reslut = { code:200};
            var list=res.data.list;
            var newList=[];
            for(var i=0;i<list.length;i++){
                list[i].id="id="+list[i].id+","+"sid="+list[i].sapply_sid;
                newList.push(list[i])
            }
            reslut["data"] = newList
            return reslut;
        }
    });

    var id ={};

    $(".test").on("click",function(){
        var a = $("#testinput").attr("data-id");
        var b = a.split(",");
        console.log(b);
        for(var i = 0;i<b.length;i++){
            var c = b[i].split("=");
            var d = c[1];
            console.log(d);
        }
    });




    // var dialog = new Dialog({
    //     width : 500,
    //     height : 500,
    //     closeBtn : true,
    //     content : "",
    //     drag : true,
    //     speed : 200,
    //     offsetX : 0,
    //     offsetY : 0,
    //     overlay : true,
    //     headerHeightMin : 46
    //     events : {},
    //     onReady : fn,
    //     onOpenBefore : fn,
    //     onOpenAfter : fn,
    //     onCloseBefore : fn,
    //     onCloseAfter : fn,
    //     onDragBefore : fn,
    //     onDrag : fn,
    //     onDragAfter : fn
    // });
    // dialog.open();  //打开



    



    



    







