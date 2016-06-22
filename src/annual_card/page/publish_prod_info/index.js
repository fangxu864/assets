/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var Select = require("COMMON/js/component.city.select.js");
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
		this.select = new Select({
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(data){},
			onCityChange : function(data){}
		});
		this.fileupload = new Fileupload({
			container : "#imgUploadBox",
			id : 1,
			action : Api.Url.PublishCardProd.uploadFile,
			loading : function(formControls){},
			complete : function(res){
				that.onImgUploadComplete(res);
			}
		})

		this.lid = PFT.Util.UrlParse()["sid"];
		if(this.lid) this.getInfo(this.lid);

	},
	onImgUploadComplete : function(res){
		var res = res || {};
		var code = res.code;
		var data = res.data || {};
		var src = data.src;
		var msg = res.msg || "上传失败";
		if(code==200 && src){
			this.renderThumbList(src);
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
		if(!prodName) return prodNameInp.parents(".line").addClass("error");
		if(!addr) return addrInp.parents(".line").addClass("error");
		if(!mobile) return mobileInp.parents(".line").addClass("error");
		if(!info) return infoTextarea.parents(".line").addClass("error");
		if(!uploadPhoto) return alert("请上传一张预览图");
		this.submit({
			product_name : prodName,
			product_type : "I",
			address : addr,
			tel : mobile,
			jqts : info,
			province : province,
			city : city,
			img_path : uploadPhoto
		})
	},
	renderThumbList : function(src){
		var container = $("#uploadPhotoBox");
		if(container.length==0){
			container = $('<div id="uploadPhotoBox" class="uploadPhotoBox"></div>');
			$("#imgUploadBox").parent().append(container);
		}
		container.html('<table><tr><td><img id="uploadPhotoImg" src="'+src+'" alt=""/></td></tr></table>');
	},
	//编辑状态，获取年卡产品详情信息
	getInfo : function(lid){
		var that = this;
		if(!lid) return alert("缺少lid");
		PFT.Util.Ajax(Api.Url.PublishCardProd.getInfo,{
			params : {
				lid : lid
			},
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = res || {};
				var data = res.data;
				if(res.code==200){
					that.renderInfo(data);
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//拉取产品信息后，render页面
	renderInfo : function(data){
		var product_name = data.product_name;
		var address = data.address;
		var tel = data.tel;
		var jqts = data.jqts;
		var province = data.province || "";
		var city = data.city || "";
		var img_path = data.img_path;
		$("#prodNameInp").val(product_name);
		$("#addrInp").val(address);
		$("#mobileInp").val(tel);
		$("#infoTextarea").val(jqts);
		this.select.setVal(province,city);
		if(img_path) this.renderThumbList(img_path);
	},
	submit : function(params){
		var submitBtn = $("#submitInfoBtn");
		PFT.Util.Ajax(Api.Url.PublishCardProd.submit,{
			type : "post",
			dataType : "json",
			params : params,
			loading : function(){ submitBtn.addClass("disable")},
			complete : function(){ submitBtn.removeClass("disable")},
			success : function(res){
				var res = res || {};
				var code = res.code;
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
