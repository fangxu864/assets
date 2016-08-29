/**
 * Author: huangzhiyang
 * Date: 2016/8/25 18:42
 * Description: ""
 */
function Canvas(){
	this.image = null;
	var imgContainer = $('<div id="imgContainer" class="imgContainer"></div>').appendTo($("body"));
	//$("body").append('<canvas id="canvas" class="canvas" width="'+winWidth+'" height="'+winHeight+'">您的浏览器版本过底，不支持canvas</canvas>');
	//this.stage = new Stage("#canvas");
	//this.stage.debug = true;
	////var bmp = new Bitmap("http://static.12301.cc/assets/build/images/dlogin_mg_cpft7.jpg");
	//console.log(this.stage);
}

Canvas.prototype = PFT.Util.Mixin({
	loadImage : function(src,opt) {
		var opt = opt || {};
		var onload = opt.onload || function(){};
		var onerror = opt.onerror || function(){};
		var img = document.createElement("img");
		img.onload = function() {
			onload(src,img);
			img.onreadystatechange = null;
		};
		img.onreadystatechange = function() {
			if (img.readyState == "loaded" || img.readyState == "complete") {
				onload(src,img);
				img.onload = null;
			}
		};
		img.onerror = onerror;
		img.src = src;
		return img;
	},
	drawBg : function(imgDataURL){
		var that = this;

		this.image = this.loadImage(imgDataURL,{
			onload : function(src,image){
				$("#imgContainer").html("").width(image.width).height(image.height).append(image);
			}
		})

		//var stage = this.stage;
		//var bmp = new Bitmap(imgDataURL);
		//bmp.x = 0;
		//bmp.y = 0;
		//bmp.scaleX = 1;
		//bmp.scaleY = 1;
		//bmp.width = this.winWidth;
		//bmp.height = this.winHeight;
		//that.bgImgs[0] && stage.remove(this.bgImgs[0]);
		//that.bgImgs.shift();
		//that.bgImgs.push(bmp);
		//stage.add(bmp);
		//stage.update();
		//new AlloyFinger(bmp, {
		//	multipointStart: function () {
		//
		//	},
		//	rotate: function (evt) {
		//
		//		stage.update();
		//	},
		//	pinch: function (evt) {
		//
		//		stage.update();
		//	},
		//	pressMove: function (evt) {
		//
		//		stage.update();
		//	}
		//});
	},
	reset : function(){
		var imgContainer = document.getElementById("imgContainer");
		this.image = null;
		imgContainer.innerHTML = "";
		imgContainer.style.width = "";
		imgContainer.style.height = "";
	},
	create : function(vcodeImage,vcodePosition){
		var that = this;
		if(!this.image) return false;
		var imgContainer = $("#imgContainer");
		var bgWidth = imgContainer.width();
		var bgHeight = imgContainer.height();
		var canvas = document.createElement("canvas");
		canvas.width = bgWidth;
		canvas.height = bgHeight;
		var cxt = canvas.getContext("2d");
		var image = document.createElement("img");
		// Canvas为了安全性考虑，当绘制了外部图片后它会变成只可写不可读的状态，
		// getImageData、toDataURL之类的试图读取数据的方法全都无法使用
		// 这里设置image的crossOrigin为anonymous,非常重要
		image.crossOrigin = "anonymous";


		image.onload = function(){

			cxt.drawImage(that.image,0,0);

			cxt.drawImage(image,vcodePosition.left,vcodePosition.top,vcodeImage.width,vcodeImage.height);

			var dataURL = canvas.toDataURL("image/png");

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
			that.submitImgData(blob);

		}

		image.src = vcodeImage.src;

	},
	submitImgData : function(imgData){

	}
},PFT.Util.PubSub);

module.exports = Canvas;