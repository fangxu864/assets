



var cropper=require("./cropper/cropper.js");




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
			console.log("aaa");
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
		this.QRcode[0].ondragstart = function(){
			return false;
		}
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
		//保存修改
		this.savechange.on("click",function(){
			that.formposter();
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

			cxt.drawImage(this.QRcode[0],0,0,nw,nh,ql,qt,100,100);
			this.QRcode.css("display","none");
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
			ctx.drawImage(this.QRcode[0],0,0,nw,nh,ql,qt,100,100);  //绘制二维码

			this.dpic.remove();
			this.QRcode.remove();
			this.piccon.append(poster);
		}



	}

}


$(function(){
	var newposter = new Postercrop();
});














































