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
		"blur .textInp" : "onTextInpBlur",
		"focus .infoTextarea" : "onTextInpFocus",
		"blur .infoTextarea" : "onTextInpBlur",
		"click #submitInfoBtn" : "onSubmitBtnClick"
	},
	initialize : function(){
		var that = this;
		this.select = new SSelect({
			data : AllCitys,
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(data){},
			onCityChange : function(data){}
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
			container.html('<table><tr><td><img id="uploadPhotoImg" src="'+src+'" alt=""/></td></tr></table>');
			PFT.Util.STip("success",'<p style="width:200px">上传成功</p>');
		}else{
			PFT.Util.STip("fail",'<p style="width:200px">'+msg+'</p>');
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
	},
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var prodNameInp = $("#prodNameInp");
		var addrInp = $("#addrInp");
		var mobileInp = $("#mobileInp");
		var infoTextarea = $("#infoTextarea");
		var prodName = $.trim(prodNameInp.val());
		var addr = $.trim(addrInp.val());
		var mobile = $.trim(mobileInp.val());
		var info = $.trim(infoTextarea.val());
		var area = this.select.getVal();
		var province = area.prov;
		var city = area.city;
		var uploadPhoto = $("#uploadPhotoImg").attr("src");
		return this.submit({
			name : prodName,
			addr : addr,
			mobile : mobile,
			info : info,
			province : province,
			city : city,
			thumb_src : uploadPhoto
		});
		if(!prodName) return prodNameInp.parents(".line").addClass("error");
		if(!addr) return addrInp.parents(".line").addClass("error");
		if(!mobile) return mobileInp.parents(".line").addClass("error");
		if(!info) return infoTextarea.parents(".line").addClass("error");
		if(!uploadPhoto) return alert("请上传一张预览图");
		this.submit({
			name : prodName,
			addr : addr,
			mobile : mobile,
			info : info,
			province : province,
			city : city,
			thumb_src : uploadPhoto
		})
	},
	submit : function(params){
		PFT.Util.Ajax("/r/publish_prod_info/submit",{
			type : "post",
			dataType : "json",
			params : {},
			loading : function(){},
			complete : function(){},
			success : function(res){
				var res = res || {};
				var code = res.code;
				var data = res.data || {};
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					PFT.Util.STip("success",'<p style="width:200px">保存成功</p>');
				}else{
					alert(msg);
				}
			}
		})
	}
});

$(function(){
	new MainView();
})
