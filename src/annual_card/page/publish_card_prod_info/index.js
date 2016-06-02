/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var AllCitys = require("COMMON/js/config.province.city.js");
var SSelect = require("COMMON/js/component.city.select.simple.js");
var Fileupload = require("COMMON/modules/fileupload");
var MainView = Backbone.View.extend({
	el : $("#cardContainer"),
	events : {
		"focus .textInp" : "onTextInpFocus",
		"blur .textInp" : "onTextInpBlur"
	},
	initialize : function(){
		var that = this;
		this.select = new SSelect({
			data : AllCitys,
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(data){

			},
			onCityChange : function(data){

			}
		})

		this.fileupload = new Fileupload({
			container : "#imgUploadBox",
			id : 1,
			action : "/upload",
			loading : function(formControls){
				console.log("loading");
			},
			complete : function(res){
				that.onImgUploadComplete(res);
			}
		})

	},
	onImgUploadComplete : function(res){
		var res = res || {};
		var code = res.code;
		var data = res.data || {};
		var src = data.src;
		var msg = res.msg || "上传失败";
		if(code==200 && src){
			var container = $("#uploadPhotoBox");
			if(container.length==0){
				container = $('<div id="uploadPhotoBox" class="uploadPhotoBox"></div>');
				$("#imgUploadBox").parent().append(container);
			}
			container.html('<table><tr><td><img src="'+src+'" alt=""/></td></tr></table>');
		}else{

		}
	},
	onTextInpFocus : function(e){
		var tarInp = $(e.currentTarget);
		tarInp.parents(".line").removeClass("error");
	},
	onTextInpBlur : function(e){
		var tarInp = $(e.currentTarget);
		var val = $.trim(tarInp.val());
		var parent = tarInp.parents(".line");
		if(!val) return parent.addClass("error");
		if(tarInp.hasClass("mobileInp") && !PFT.Util.Validate.typePhone(val)){
			parent.addClass("error");
		}
	}
});

$(function(){
	new MainView();
})
