require('./cropper.css');
require('./cropper.js');

var Select = require("COMMON/modules/select");     //选择产品框
var Dialog = require("COMMON/modules/dialog-simple");  //遮罩框
require('./index.scss');

var productposter =function(nowurl){

    this.piccon = $(".piccon");
    this.dpic = $(".defaultpic");
    this.selpic = $(".selectedpic");
    this.QRcode = $(".QRcode");
    this.inputposter = $(".inputposter");
    this.savechange = $(".savechange");
    this.cancelchange = $(".cancelchange");
    this.crop = $(".crop");
    this.crop.hide();

    this.idBox = [];//存放lid与sid
    this.selectTpl =   '<div class="selectwrap">'+
                    '<span class="selectText">选择产品:</span>'+
                '<input type="" name="" id="selectInput" placeholder="请输入产品名称">'+
                '<button class="selectEnter selectBtn">确定</button>'+
                '<button class="selectCancel selectBtn">取消</button>'+
                '</div>';
    this.urlsave = []; //保存海报url与背景图url以用于请求

    this.nowurl = nowurl;




    this.init();

}

productposter.prototype = {

    init:function(){
        var that = this;

        //初始化遮罩框
        this.dialog = new Dialog({
            width : 600,
            height : 600,
            closeBtn : true,
            content : that.selectTpl,
            drag : true,
            speed : 200,
            offsetX : 0,
            offsetY : 0,
            overlay : true,
            headerHeightMin : 46
        });

        var tips = this.getNowLidAndSid(this.nowurl);
        if(tips == "添加产品海报"){
            console.log("什么都不做");
        }else{
            var dPicSrc = '/r/Mall_Poster/proPosterBg/'+ '?lid='+that.idBox[0]+'&sid='+that.idBox[1];
            var QRPicSrc = '/r/Mall_Poster/proPosterQrCode/'+ '?lid='+that.idBox[0]+'&sid='+that.idBox[1];
            $(".defaultpic").attr("src",dPicSrc);
            $(".QRcode").attr("src",QRPicSrc);
            $(".tip").css("display","none");
            $(".posterShow").css("display","block");
            $(".inputposterlabel").css("display","block");
            $.ajax({
                url:"/r/Mall_Poster/getProductName/",
                type:"POST",
                dataType:"json",
                data:{
                    "lid":that.idBox[0]
                },
                success:function(res){
                    var data = res.data;
                    var title = data.productName;
                    $(".choose_complete").text('已选择'+title+'产品');
                }
            });
        }


        this.bind();

    },


    bind:function(){

        var that = this;

        //打开遮罩层
        $("#choose_poster_btn").on("click",function(){
            that.dialog.open();  //打开dialog
            //初始化搜索框
            var select1 = new Select({
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
                trigger : $("#selectInput"),
                filter : true,
                adaptor : function(res){

                    var reslut = { code:200};
                    var list=res.data.list;
                    if(!list){
                        return reslut;
                    }
                    var newList=[];
                    for(var i=0;i<list.length;i++){
                        list[i].id="id="+list[i].id+","+"sid="+list[i].sapply_sid;
                        newList.push(list[i])
                    }
                    reslut["data"] = newList
                    return reslut;
                }
            });
        });

        //确定产品
        $(".selectEnter").on("click",function(){



            //再次修改 清空idBox
            if(that.idBox.length == 2){
                that.idBox.length = 0;
            }
            //获取lid与sid
            var a = $("#selectInput").attr("data-id");
            if(a&&that.idBox.length == 0){
                var b = a.split(",");
                for(var i = 0;i<b.length;i++){
                    var c = b[i].split("=");
                    var d = c[1];
                    that.idBox.push(d);
                }
            }else{
                alert("请选择产品");
                return
            }

            if(that.idBox.length == 2){
                var productTitle = $("#selectInput").attr("data-title");
                $(".choose_complete").text("已选择"+productTitle+"产品");

                var dPicSrc = '/r/Mall_Poster/proPosterBg/'+ '?lid='+that.idBox[0]+'&sid='+that.idBox[1];   //修改默认背景图
                var QRPicSrc = '/r/Mall_Poster/proPosterQrCode/'+ '?lid='+that.idBox[0]+'&sid='+that.idBox[1];  // 修改默认二维码

                $(".defaultpic").attr("src",dPicSrc);
                $(".QRcode").attr("src",QRPicSrc);

                $(".tip").css("display","none");
                $(".posterShow").css("display","block");
                $(".inputposterlabel").css("display","block");

                that.dialog.close();  //关闭dialog
            }


        });

        $(".selectCancel").on("click",function(){
            that.dialog.close();  //关闭dialog
        })

        //获取自定义海报文件
        this.inputposter.change(function(){
            var file = this.files[0];
            var reader=new FileReader();
            reader.readAsDataURL(file);
            reader.onload=function(){
                var url=reader.result;

                that.selpic.css("width","100%");
                that.selpic.attr("src",url);
                that.dpic.css("display","none");
                that.QRcode.css("display","none");

                that.selpic.cropper({
                    aspectRatio: 4/6,   //裁剪框比例为4:6
                    zoomable:false      //图片不可放大
                });

            }
            that.crop.show();
            $(".inputposterlabel").hide();
            that.savechange.hide();
            that.cancelchange.hide();
        });
        //二维码拖拽事件绑定
        this.QRcode.on('mousedown',function(event){
            that.getOffset(event);
        });
        this.QRcode.on('mousemove',function(event){
            if(!that.lastPoint)return;
            var offset=that.getOffset(event);
            that.moveFrames(offset);
        });
        this.QRcode.on('mouseup',function(event){
            that.lastPoint=null;
        });

        //防止图片被拖拽
        this.QRcode.on("dragstart",function(){
            return false;
        });
        //裁剪动作
        $(".crop").on("click",function(){
            var CroppedCanvas=that.selpic.cropper("getCroppedCanvas",{
                width:500
            });

            Ccanvas = $(CroppedCanvas);
            Ccanvas.addClass("aftercrop");

            that.piccon.append(Ccanvas);
            that.selpic.cropper("destroy").css("display","none");

            that.QRcode.css("display","block");

            $(this).hide();
            that.savechange.show();
            that.cancelchange.show();

        });
        //保存修改,发送请求
        this.savechange.on("click",function(){

            var posterdata = that.formposter();   //生成合成图,返回数据

            var bgdata = posterdata.bgcanvas;
            var formbgdata = that.filterURL(bgdata);  //背景图form数据
            var canvasdata = posterdata.formcanvas;
            var formcanvasdata = that.filterURL(canvasdata);    //合成图form数据
            var qrx = parseInt(that.QRcode.css("left"));  //二维码x坐标
            var qry = parseInt(that.QRcode.css("top"));  //二维码y坐标
            var qrdata ={
                "x":qrx,
                "y":qry
            }


            //先保存产品 海报背景图请求   //手动传，不和保存产品海报一起
            var url2 = "/r/Mall_Poster/saveProPosterBg/";
            // that.submitImgformData(formbgdata,url2);
            if(window.FormData){
                var xhr1 = new XMLHttpRequest();
                xhr1.open("POST",url2);
                var url = "";
                xhr1.onload = function(e){
                    var e = e? e : window.e;
                    var target = e.srcElement ? e.srcElement : e.target;
                    if(xhr1.status==200){
                        res = target.responseText;
                        res = JSON.parse(res);
                        var code = res.code;
                        var data = res.data || {};
                        url = data.url;
                        var msg = res.msg
                        if(code==200 && url){

                            that.urlsave.push(url);

                            //在海报背景图保存成功以后保存产品海报
                            var url1 = "/r/Mall_Poster/saveProPoster/";
                            that.submitImgformData(formcanvasdata,url1,qrdata);

                        }else{
                            alert(msg);
                        }
                    }else if(xhr.status==413){
                        alert("您上传的图片过大");
                    }else{
                        alert(xhr.status);
                    }
                }
                xhr1.send(formbgdata);
            }else{
                alert("您的浏览器不支持FormData对象");
            }


        });

        //取消修改  （单纯的刷新页面）
        this.cancelchange.on("click",function(){
            that.reset();
        });

    },
    //取消修改
    reset:function(){
        window.location.reload();   //是否有更好的办法
    },

    getNowLidAndSid:function(nowurl){

        var a=nowurl.indexOf("lid");

        if(a == -1){
            var tips = "添加产品海报";
            return tips;
        }else{
            var id = nowurl.split("?");
            var ids = id[1].split("&");
            var lid = ids[0].split("=");
            var sid = ids[1].split("=");
            lid = lid[1];
            sid = sid[1];

            this.idBox.push(lid);
            this.idBox.push(sid);

            var tips = "编辑";
            return tips;


        }

    },

    getOffset:function(event){

            event=event.originalEvent;

            var x,y;
            x=event.clientX;
            y=event.clientY;
            if(!this.lastPoint){
                this.lastPoint={   //保存上次的位置
                    x:x,
                    y:y
                };
            }

            var offset={    //上一次移动与下一次移动的偏差
                    x:x-this.lastPoint.x,
                    y:y-this.lastPoint.y
            }
            this.lastPoint={
                x:x,
                y:y
            };


            return offset;//将这次与上次的偏差返回


    },

    moveFrames:function(offset){
        var x = offset.x;
        var y = offset.y;

        var wd = parseInt(this.piccon.css("width"))-parseInt(this.QRcode.css("width"));
        var hd = parseInt(this.piccon.css("height"))-parseInt(this.QRcode.css("height"));
        var nl = parseInt(this.QRcode.css("left"));
        var nt = parseInt(this.QRcode.css("top"));
        nl += x;
        nt += y;
        //防止超出边框
        if(nl<0){
            nl = 1;
        }
        if(nt<0){
            nt = 1;
        }
        if(nl>wd){
            nl = wd-1;
        }
        if(nt>hd){
            nt = hd-1;
        }

        this.QRcode.css({
            "left":nl+'px',
            "top":nt+'px'
        });
    },
    formposter:function(){

        var ql = parseInt(this.QRcode.css("left"));
        var qt = parseInt(this.QRcode.css("top"));
        var nw = this.QRcode[0].naturalWidth;
        var nh = this.QRcode[0].naturalHeight;

        if(this.dpic.css("display") == "none"){
            var aftercrop = $(".aftercrop");
            var cxt = aftercrop[0].getContext("2d");

            var bgcanvas = aftercrop[0].toDataURL();    //获得背景图片的数据

            cxt.drawImage(this.QRcode[0],0,0,nw,nh,ql,qt,150,150);

            var formcanvas = aftercrop[0].toDataURL();    //获得合成图片的数据

            this.QRcode.css("display","none");

            return {
                "bgcanvas":bgcanvas,
                "formcanvas":formcanvas
            }
        }else{
            var poster=document.createElement('canvas');
            var ctx=poster.getContext('2d');

            //默认图片的宽高
            var dpicw = parseInt(this.dpic.css("width"));
            var dpich = parseInt(this.dpic.css("height"));

            post = $(poster);
            post.attr("width",dpicw);
            post.attr("height",dpich);
            post.addClass('poster');

            var dnw = this.dpic[0].naturalWidth;
            var dnh = this.dpic[0].naturalHeight;
            var qw = parseInt(this.QRcode.css("width"));
            var qh = parseInt(this.QRcode.css("height"));

            ctx.drawImage(this.dpic[0],0,0,dnw,dnh,0,0,dpicw,dpich);   //绘制背景图片

            var bgcanvas = poster.toDataURL();    //获得背景图片的数据

            ctx.drawImage(this.QRcode[0],0,0,nw,nh,ql,qt,150,150);  //绘制二维码

            var formcanvas = poster.toDataURL();    //获得合成图片的数据

            this.dpic.remove();
            this.QRcode.css("display","none");
            this.piccon.append(poster);

            return {
                "bgcanvas":bgcanvas,
                "formcanvas":formcanvas
            }
        }



    },


    filterURL:function(dataURL){

        // dataURL 的格式为 “data:image/png;base64,****”,
        // 逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
        dataURL = dataURL.split(",")[1];


        // 用 toDataURL 就可以转换成上面用到的 DataURL 。
        // 然后取出其中 base64 信息，再用 window.atob 转换成由二进制字符串。
        // 但 window.atob 转换后的结果仍然是字符串，直接给 Blob 还是会出错。
        // 所以又要用 Uint8Array 转换一下
        var imgData = window.atob(dataURL);
        var ia = new Uint8Array(imgData.length);
        for (var i = 0; i < imgData.length; i++) {
            ia[i] = imgData.charCodeAt(i);
        };

        // canvas.toDataURL 返回的默认格式就是 image/png
        // 这时候裁剪后的文件就储存在 blob 里了,
        // 可以把它当作是普通文件一样，加入到 FormData 里，并上传至服务器了
        var blob = new Blob([ia], {type:"image/png"});

        var formData = new FormData();
        formData.append("image",blob,"image.png");

        return formData;

    },

    submitImgformData:function(formdata,uploadurl,qrdata){   //传图片form数据到服务器
        var that = this;
        if(window.FormData){
            var xhr = new XMLHttpRequest();
            xhr.open("POST",uploadurl);
            var url = "";
            xhr.onload = function(res){
                if(xhr.status==200){
                    res = res.srcElement.responseText;
                    res = JSON.parse(res);
                    var code = res.code;
                    var data = res.data || {};
                    url = data.url;
                    var msg = res.msg
                    if(code==200 && url){

                        that.urlsave.push(url);
                        if(that.urlsave.length == 2&&qrdata){
                            that.sendQRInfo(that.urlsave,qrdata,that.idBox);   //传二维码坐标与url
                        }

                    }else{
                        alert(msg);
                    }
                }else if(xhr.status==413){
                    alert("您上传的图片过大");
                }else{
                    alert(xhr.status);
                }
            }
            xhr.send(formdata);
        }else{
            alert("您的浏览器不支持FormData对象");
        }
    },

    sendQRInfo:function(url,qrdata,idbox){  //传二维码坐标与url

        var that = this;

        var proBgUrl = url[0];
        var proUrl = url[1];
        var x = qrdata.x;
        var y = qrdata.y;
        var id = idbox[0]; //id
        var sid = idbox[1]; //sid


        $.ajax({
            url:"/r/Mall_Poster/saveProXY/",
            type:"POST",
            dataType:"json",
            data:{
                "lid":id,
                "sid":sid,
                "x":x,
                "y":y,
                "proUrl":proUrl,
                "proBgUrl":proBgUrl
            },
            success:function(res){
                res = res || {};
                if(res.code==200){
                    alert("保存成功");
                    window.location.href = "/new/posterimgupload_myposter.html";
                }else{
                    alert(res.msg);
                }
            }

        });

    }

}



$(function(){


    var nowurl = window.location.href;
    var newproductposter = new productposter(nowurl);
});
































































