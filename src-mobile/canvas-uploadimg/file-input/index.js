/**
 * Author: huangzhiyang
 * Date: 2016/8/25 17:58
 * Description: ""
 */
require("./index.scss");
var tpl = require("./index.xtpl");
function FileInp(){
	var that = this;
	$("body").append(tpl);
	this.container = $("#fileInpContainer");
	this.fileInp = $("#fileInp");
	this.fileInp.change(function(e){
		that.onFileInpChange(e);
	})
}
FileInp.prototype = PFT.Util.Mixin({
	onFileInpChange : function(e){
		var that = this;
		var file = e.target.files[0];
		var reader = new FileReader();
		document.getElementById("fileInp").value = "";
		reader.onload = function(){
			var url = reader.result;
			that.fire("image.loaded",url);
		};
		reader.onerror = function(e){

		};
		reader.onabort = function(e){

		};
		reader.onprogress = function(e){

		};
		reader.readAsDataURL(file);
	},
	show : function(){
		this.container.show();
	},
	hide : function(){
		this.container.hide();
	}
},PFT.Util.PubSub);

module.exports = FileInp;