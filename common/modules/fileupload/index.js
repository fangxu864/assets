/**
 * Author: huangzhiyang
 * Date: 2016/6/1 18:09
 * Description: ""
 */
require("./style.css");
var tpl = require("./tpl.html");
var Browser = require("COMMON/js/util.platform.js");
/**
 * 文件(图片)上传组件
 * 内嵌iframe，解决无刷新文件上传问题，使用此组件需要跟后端约定好上传结束后数据处理方式
 * 示例：
 * var uploador = new Fileupload({
 * 		container : "#container_id"    必选 组件要显示在哪个容器内，可传容器id或jq对象
 * 	    action    : "target.php"       必选 文件上传至后端，哪个接口地址处理
 * 	    id        : 1                  必选 页面上可能有好几个文件上传组件同时存在，用来标显组件唯一id(数字)
 * 		extra     : {}                 可选 上传图片时，除了图片，还可以附带传一些参数给后端  例如：extra : {from:"plist",needId:false}
 * 	    loading   : function(){}       可选 上传过程中的回调函数   
 * 	    complete  : function(res){}    可选 上传结束后的回调函数  上传是否成功，可以在参数res里去判断   建议后端返回的数据格式：{code:200,data:{src:"图片src地址"},msg:""}
 * })
 * @param opt
 * @constructor
 */
function Fileupload(opt){
	var opt = this.opt = $.extend({},Fileupload.options,opt);
	this.container = opt.container;
	this.action = opt.action;
	this.id = opt.id;

	this.init(opt);
};
Fileupload.options = {
	container : "",
	id : "",
	action : "",
	extra : {},
	loading : function(){},
	complete : function(){}
};
Fileupload.prototype = {
	init : function(opt){
		var that = this;
		if(!this.container || !this.id || !this.action) return false;
		if(typeof this.container=="string"){
			this.container = this.container.replace(/#/,"");
			if(!this.container) return false;
			this.container = $("#"+this.container);
		}
		var container = this.container;
		var action = this.action;
		var id = this.id;
		var complete = opt.complete;
		var extra = opt.extra || {};

		if(!window.FileuploadCallbacks) window["FileuploadCallbacks"] = {};
		window["FileuploadCallbacks"][id] = window["FileuploadCallbacks"][id] || [];
		window["FileuploadCallbacks"][id].push(function(){
			$("#fileuploadBtn_upload"+id).removeClass("disable");
		});
		window["FileuploadCallbacks"][id].push(complete);

		var iframe = $('<iframe name="iframefileupload_'+id+'" style="display:none" frameborder="0" class="fileupload_iframe"></iframe>');
		
		var extraInput = (function(extra){
			var arr = [];
			for(var i in extra){
				arr.push(i + "=" + extra[i]);
			}
			arr = arr.join("&")
			
			var input = '<input type="hidden" name="extra" value="'+arr+'"/>';

			return input;

		})(extra);


		container.append(iframe);
		container.append(tpl);
		container.find(".fileuploadForm").append(extraInput)

		this.form = container.find(".fileuploadForm");
		this.fileInp = container.find(".fileuploadFileInp");
		this.textInp = container.find(".fileuploadTextInp");
		this.browseBtn = container.find(".filebrowseBtn");
		this.submitBtn = container.find(".fileuploadBtn");
		this.callbackHidInp = container.find(".callbackHidInp");
		if(Browser.ie){
			this.fileInp.addClass("ie_"+Browser.ieVersion);
		}
		this.form.attr("target","iframefileupload_"+id);
		this.form.attr("action",action);
		this.fileInp.attr("id","fileuploadFileInp_"+id);
		this.fileInp.attr("name","fileuploadFile_"+id);
		this.browseBtn.attr("for","fileuploadFileInp_"+id);
		this.browseBtn.attr("name","fileupload_callback_"+id);
		this.callbackHidInp.val(id);
		this.submitBtn.attr("id","fileuploadBtn_upload"+id);

		this.fileInp.on("change",function(e){
			var val = e.target.value;
			val = val.replace(/\C:\\fakepath\\/,"");
			that.textInp.val(val);
		})
		this.submitBtn.on("click",function(e){
			var tarBtn = $(e.currentTarget);
			var file = $.trim(that.fileInp.val());
			var text = $.trim(that.textInp.val());
			if(tarBtn.hasClass("disable") || !file || !text) return false;
			tarBtn.addClass("disable");
			that.opt.loading(that.getFormControl());
			that.form.submit();
		})
	},
	getFormControl : function(){
		return{
			iframe : this.iframe,
			form : this.form,
			fileInp : this.fileInp,
			textInp : this.textInp,
			browseBtn : this.browseBtn,
			submitBtn : this.submitBtn,
			callbackIDInput : this.callbackHidInp
		}
	}
};

module.exports = Fileupload;