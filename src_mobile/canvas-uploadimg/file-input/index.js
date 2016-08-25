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
		reader.onload = function(){
			var url = reader.result;
			that.fire("image.loaded",url);
		};
		reader.readAsDataURL(file);
	}
},PFT.Util.PubSub);

module.exports = FileInp;