/**
 * Author: huangzhiyang
 * Date: 2016/6/1 18:09
 * Description: ""
 */
var tpl = require("./tpl.html");
function Upload(opt){
	var opt = this.opt = $.extend({},Upload.options,opt);

	this.container = opt.container;
	this.action = opt.action;
	this.id = opt.id;

	this.init(opt);
};
Upload.options = {
	container : "",
	id : "",
	action : "",
	loading : function(){},
	complete : function(){}
};
Upload.prototype = {
	init : function(opt){
		var that = this;
		if(!this.container || !this.id || !this.action) return false;
		if(typeof this.container=="string"){
			this.container = this.container.replace(/#/,"");
			if(!this.container) return false;
			this.container = $("#"+this.container);
		}

		this.container.append(tpl);

		var container = this.container;
		var action = this.action;
		var id = this.id;
		var complete = opt.complete;

		if(!window.FileuploadCallbacks) window["FileuploadCallbacks"] = {};
		window["FileuploadCallbacks"][id] = complete;

		this.iframe = container.find(".fileupload_iframe");
		this.form = container.find(".fileuploadForm");
		this.fileInp = container.find(".fileuploadFileInp");
		this.textInp = container.find(".fileuploadTextInp");
		this.browseBtn = container.find(".filebrowseBtn");
		this.submitBtn = container.find(".fileuploadBtn");


		this.iframe.attr("name","fileupload_iframe_"+id);
		this.form.attr("target","fileupload_iframe_"+id);
		this.form.attr("action",action);
		this.fileInp.attr("id","fileuploadFileInp_"+id);
		this.browseBtn.attr("for","fileuploadFileInp_"+id);

		this.fileInp.on("change",function(e){
			var val = e.target.value;
			that.textInp.val(val);
		})
		this.submitBtn.on("click",function(e){
			that.opt.loading();
			that.form.submit();
		})
	}
};

module.exports = Upload;