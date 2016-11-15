



var Postercrop =function(){

	this.piccon = $(".piccon");
	this.dpic = $(".defaultpic");
	this.selpic = $(".selectedpic");
	this.QRcode = $(".QRcode");
	this.inputposter = $(".inputposter");
	this.savechange = $(".savechange");
	this.cancelchange = $(".cancelchange");
	this.crop = $(".crop");
	this.crop.hide();


	this.bind();

}

Postercrop.prototype = {

	
	bind:function(){

		var that = this;

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
					zoomable:false   	//图片不可放大
				});

			}
			that.crop.show();
			$(".inputposterlabel").hide();
			that.savechange.hide();
			that.cancelchange.hide();
		})
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

			var bgdata = posterdata.bgcanvas;  //背景图数据
			var formbgdata = that.filterURL(bgdata);  //生成背景图form数据
 			var canvasdata = posterdata.formcanvas;   //合成图数据
			var formcanvasdata = that.filterURL(canvasdata);	//生成合成图form数据
			var qrx = parseInt(that.QRcode.css("left"));  //二维码x坐标
			var qry = parseInt(that.QRcode.css("top"));  //二维码y坐标
			var qrdata ={
				"x":qrx,
				"y":qry
			}
		
			
			//先保存微商城海报请求
			var url1 = "/r/Mall_Poster/saveMallPoster/";
			that.submitImgformData(formcanvasdata,url1,qrdata);
			//后保存微商城 海报背景图请求
			var url2 = "/r/Mall_Poster/saveMallPosterBg/";
			that.submitImgformData(formbgdata,url2);
			
			
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

			cxt.drawImage(this.QRcode[0],0,0,nw,nh,ql,qt,100,100);

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

			ctx.drawImage(this.QRcode[0],0,0,nw,nh,ql,qt,100,100);  //绘制二维码

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

	submitImgformData:function(formdata,uploadurl,qrdata){   //上传图片form数据到服务器
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
						that.sendQRInfo(url,qrdata);   //传二维码坐标与url
						console.log("发送xy坐标");
					}else{
						alert(msg + "发送背景");
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

	sendQRInfo:function(url,qrdata){  //传二维码坐标与url

		var x = qrdata.x;
		var y = qrdata.y;

		$.ajax({
			url:"/r/Mall_Poster/saveXY/",
			type:"POST",
			dataType:"json",
			data:{
				"x":x,
				"y":y,
				"url":url
			},
			success:function(res){
				res = res || {};
				if(res.code==200){
					window.location.href = "http://www.12301.local/new/posterimgupload_index.html";
				}else{
					alert(res.msg);
				}
			}

		});

	}

}


$(function(){
	var newposter = new Postercrop();
});














































