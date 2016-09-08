/**
 * Author: huangzhiyang
 * Date: 2016/8/25 18:42
 * Description: ""
 */
function Canvas(){
	this.image = null;
	this.toast = new PFT.Toast();
	var imgContainer = $('<div id="imgContainer" class="imgContainer"></div>').appendTo($("body"));
}
Canvas.prototype = PFT.Util.Mixin({
	loadImage : function(src,opt) {
		var opt = opt || {};
		var crossOrigin = opt.crossOrigin;
		var onload = opt.onload || function(){};
		var onerror = opt.onerror || function(){};
		var img = document.createElement("img");
		if(crossOrigin) img.crossOrigin = "anonymous";
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
		//var image = document.createElement("img");

		this.addLoading();
		// Canvas为了安全性考虑，当绘制了外部图片后它会变成只可写不可读的状态，
		// getImageData、toDataURL之类的试图读取数据的方法全都无法使用
		// 这里设置image的crossOrigin为anonymous,非常重要
		//image.crossOrigin = "anonymous";

		cxt.drawImage(that.image,0,0);

		cxt.drawImage(vcodeImage.image,vcodePosition.left,vcodePosition.top,vcodeImage.width,vcodeImage.height);

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



		that.submitImgData(blob,vcodeImage,vcodePosition);


	},
	//上传裁剪后的图片至服务器
	submitImgData : function(imgData,vcodeImage,vcodePosition){
		var that = this;
		if(window.FormData){
			var formData = new FormData();
			formData.append("image",imgData,"image.png");
			var xhr = new XMLHttpRequest();
			xhr.open("POST","/r/Mall_Common/uploadForPoster");
			xhr.onload = function(res){
				if(xhr.status==200){
					res = res.srcElement.responseText;
					res = JSON.parse(res);
					var code = res.code;
					var data = res.data || {};
					var url = data.url;
					var msg = res.msg || PFT.AJAX_ERROR_TEXT;
					if(code==200 && url){
						that.savePosterInfo(url,vcodeImage,vcodePosition)
					}else{
						that.removeLoading();
						alert(msg);
					}
				}else if(xhr.status==413){
					that.removeLoading();
					alert("您上传的图片过大");
				}else{
					that.removeLoading();
					alert(xhr.status);
				}
			}
			xhr.send(formData);
		}else{
			alert("您的浏览器不支持FormData对象");
		}
	},
	//上传二维码坐标位置至服务器
	savePosterInfo : function(url,vcodeImage,vcodePosition){
		var that = this;
		PFT.Util.Ajax("/r/Mall_Common/savePosterInfo/",{
			type : "post",
			params : {
				qrWidth : vcodeImage.width,
				qrHeight : vcodeImage.height,
				xDistance : vcodePosition.left,
				yDistance : vcodePosition.top
			},
			loading : function(){},
			success : function(res){
				res = res || {};
				if(res.code==200){
					window.location.href = "poster_create_success.html?url="+encodeURI(url)+"&flag=create";
				}else{
					that.removeLoading();
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	addLoading : function(){
		var createBtn = document.querySelector("#fixBarContainer .createBtn");
		createBtn.classList.add("disable");
		this.toast.show("loading","正在生成海报...");
	},
	removeLoading : function(){
		var createBtn = document.querySelector("#fixBarContainer .createBtn");
		createBtn.classList.remove("disable");
		this.toast.hide();
	}
},PFT.Util.PubSub);

module.exports = Canvas;