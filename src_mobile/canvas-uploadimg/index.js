/**
 * Author: huangzhiyang
 * Date: 2016/8/25 17:56
 * Description: ""
 */
require("./index.scss");
var FileInp = require("./file-input");
var Canvas = require("./canvas");
var VCode = require("./vcode");
var Main = function(){
	var fileInp = new FileInp();
	var canvas = new Canvas();
	var vcode = new VCode();
	var fixBar = $("#fixBarContainer");
	fixBar.on("click",".reuploadBtn",function(e){ //重新上传
		canvas.reset();
		vcode.setState("");
		fileInp.show();
	}).on("click",".createBtn" ,function(e){
		if($(e.currentTarget).hasClass("disable")) return false;
		var vcode_position = vcode.getPosition();
		var vcode_image = vcode.getImage();
		canvas.create(vcode_image,vcode_position)
	});
	fileInp.on("image.loaded",function(url){
		vcode.setState("moveing");
		canvas.drawBg(url);
		fileInp.hide();
	})
};
window.onload = Main;