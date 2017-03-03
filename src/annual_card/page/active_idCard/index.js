/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
var Api = require("../../common/api.js");
var ReadPhysicsCard = require("../../common/readPhysicsCard.js");
var CheckExistDialog = require("../../common/check-exist-dialog");
var ProvCitySelect = require("COMMON/js/component.city.select.js");
var Fileupload = require("COMMON/modules/fileupload");

var Mock = require("mockjs");	

var MainView = Backbone.View.extend({
	time : 60,  //获取验证码的间隔时间 60s
	timer : null,
	el : $("#cardContainer"),
	events : {
		"click #readCardBtn" : "onReadCardBtnClick",
		"click #getVCodeBtn" : "onGetVCodeBtnClick",
		"click #activateBtn" : "onActiveBtnClick",
		//"blur .textInp" : "onTextInpBlur",
		"focus .textInp" : "onTextInpFocus",
		"keyup #cardInp" : "onCardInpKeyup",
		"click #clearCardInpBtn" : "onClearCardInpBtnClick",
		"click #getIdCardInfo" : "handleIdCard"   //身份证阅读器
	},
	initialize : function(){

		var that = this;
		this.cardInp = $("#cardInp");
		this.readCardBtn = $("#readCardBtn");
		this.getVCodeBtn = $("#getVCodeBtn");
		this.idCardInp = $("#idNum");
		this.cardInfoBar = $("#cardInfoBar").hide();
		this.mobileInp = $("#mobileInp");
		this.vcodeInp = $("#vcodeInp");
		this.memnameInp = $("#memName");
		this.submitBtn = $("#activateBtn");
		this.ReadPhysicsCard = new ReadPhysicsCard({id:"readCardObj"});
		this.CheckExistDialog = new CheckExistDialog();
		this.CheckExistDialog.on("replaceAndSubmit",function(submitData){
			that.submit("replace");
			this.close();
		})
		this.initSelect();
		this.initFileupload();
	},

	handleIdCard : function(){

		console.log("身份证阅读器");

		//开始链接控件
		var CertCtl = document.getElementById("CertCtl");
		if(CertCtl.connect){
			var connectResult = CertCtl.connect();
			
			connectResult = JSON.parse(connectResult);	

			if( connectResult.resultFlag == 0 ){

				var readResult = CertCtl.readCert();
				readResult = JSON.parse(readResult);	
				if(readResult.resultFlag == "0"){

					var con = readResult.resultContent;

					var idNum = con.certNumber;
					var pic = con.identityPic;

					$("#idNum").val(idNum);
					$(".fileuploadTextInp").val(pic);
					$("#ImgUpLoadIdCardBox").css("display","none");
					$("#idCardReaderBox").html('<div style="color:red;font-size:20px;">上传中</div>').css("display","block");

					//上传图片
					PFT.Util.Ajax('/r/Resource_ImageUpload/uploadIdCard',{
						type : "post",
						params : {
							id : idNum,
							identify :"annualActive",
							data : pic
						},
						loading : function(){
						},
						success : function(res){
							var code = res.code;
							var msg = res.msg;
							var data = res.data;
							var src = data.src;
							console.log(src);
							$("#ImgUpLoadIdCardBox").remove();
							$("#idCardReaderBox").html('<img id="uploadPhotoImg" src="'+ src +'" ></img>');
							alert("身份证头像上传成功");
						},
						complete : function(){
						},
						fail : function(res){
							$("#ImgUpLoadIdCardBox").css("display","block");
							$("#idCardReaderBox").css("display","none");
							alert("身份证头像上传失败");
						}
					})

				}else{
					alert("身份证信息获取失败，请将身份证放置在读卡器上再点击读取");
				}
				
			}else{
				alert("无法连接读卡器，请打开读卡器开关并插入USB口");
			}

		}else{
			alert("请使用IE浏览器或重新安装插件");
			return false
		}

	},

	initSelect : function(){
		this.provCitySelect = new ProvCitySelect({
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(data){

			}
		})
	},
	initFileupload : function(){
		var that = this;
		this.fileupload = new Fileupload({
			container : "#imgUploadBox",
			id : 1,
			extra     : { identify : "annualActive" },
			action : Api.Url.PublishCardProd.uploadFile,
			loading : function(formControls){},
			complete : function(res){
				that.onImgUploadComplete(res);
			}
		});
	},
	//点击获取验证码
	onGetVCodeBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("unable")) return false;
		var mobile = $.trim(this.mobileInp.val());
		if(!PFT.Util.Validate.typePhone(mobile)) return alert("请填写正确格式手机号");
		this.getVCode(mobile);
	},
	//点击提交激活
	onActiveBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		if(this.cardInfoBar.hasClass("error")) return false;
		var physics_no = this.cardInp.val();
		if(!physics_no) return alert("物理卡号不能为空");
		var check_mobile = this.validator.mobile.call(this);
		if(!check_mobile) return false;
		var check_vcode =  this.validator.vcode.call(this);
		if(!check_vcode) return false;
		var check_idCard = this.validator.idCard.call(this);
		if(!check_idCard) return false;
		this.submit();
	},
	onTextInpBlur : function(e){
		var that = this;
		var tarInp = $(e.currentTarget);
		var validate = tarInp.attr("validator");
		if(!validate) return false;
		validate = validate.split("|");
		for(var i in validate){
			var valid = validate[i].split(":");
			var rule = valid[0];
			var args = valid[1] ? valid[1].split(",") : [];
			var handler = that.validator[rule];
			if(handler) handler.apply(that,args);
		}
	},
	onTextInpFocus : function(e){
		var that = this;
		var tarInp = $(e.currentTarget);
		var validate = tarInp.attr("validator");
		if(!validate) return false;
		if(tarInp.attr("id")=="cardInp"){
			$("#cardInfoBar").removeClass("error").hide();
		}else{
			tarInp.siblings(".tip").removeClass("error").hide();
		}
	},
	onClearCardInpBtnClick : function(e){
		this.cardInp.val("").focus();
		$(e.currentTarget).hide();
	},
	onCardInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var val = tarInp.val();
		var keycode = e.keyCode;
		var clearBtn = $("#clearCardInpBtn");
		if(keycode!=13) return false;
		val ? clearBtn.show() : clearBtn.hide();
		this.getCardInfo(val,"physics");
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
	renderThumbList : function(src){
		var container = $("#uploadPhotoBox");
		if(container.length==0){
			container = $('<div id="uploadPhotoBox" class="uploadPhotoBox"></div>');
			$("#imgUploadBox").parent().append(container);
		}
		container.html('<table><tr><td><img id="uploadPhotoImg" src="'+src+'" alt=""/></td></tr></table>');
	},
	validator : {
		mobile : function(){
			var mobileInp = this.mobileInp;
			var mobile = $.trim(mobileInp.val());
			var tip = mobileInp.siblings(".tip");
			if(!PFT.Util.Validate.typePhone(mobile)){
				tip.show().addClass("error").text("请填写正确格式手机号");
				return false;
			}else{
				tip.hide().removeClass("error");
				return true;
			}
		},
		vcode : function(){
			var vcodeInp = this.vcodeInp;
			var vcode = $.trim(vcodeInp.val());
			var tip = vcodeInp.siblings(".tip");
			if(!vcode){
				tip.show().addClass("error").text("请填写验证码");
				return false;
			}else{
				tip.hide().removeClass("error");
				return true;
			}
		},
		idCard : function(){
			var idCardInp = this.idCardInp;
			var idCard = $.trim(idCardInp.val());
			var tip = idCardInp.siblings(".tip");
			var is_require = idCardInp.attr("data-require");
			if((idCard && !PFT.Util.Validate.idcard(idCard)) || ((is_require==1) && !idCard)){
				tip.show().addClass("error").text("请填写正确格式身份证");
				return false;
			}else{
				tip.removeClass("error").hide();
				return true;
			}
		}
	},
	getCardInfo : function(card_no,type){
		var that = this;
		var tarBtn = this.readCardBtn;
		var idCardInp = that.idCardInp;
		if(!card_no || !type) return false;
		PFT.Util.Ajax(Api.Url.active.checkCard,{
			params : {
				identify : card_no,
				type : type
			},
			loading : function(){
				tarBtn.addClass("disable");
				idCardInp.val("");
				$("#loadingIcon").show();
			},
			complete : function(){
				tarBtn.removeClass("disable");
				$("#loadingIcon").hide();
			},
			success : function(res){
				res = res || {};
				var data= res.data;
				if(res.code==200){
					var needID = data.need_ID || "";
					var virtual_no = data.virtual_no;
					var physics_no = data.physics_no;
					var card_no = data.card_no;
					idCardInp.attr("validate","idCard:"+needID);
					idCardInp.attr("data-requrie",needID);
					if(needID==1){
						$("#idCard-fontRed").show();
					}else{
						$("#idCard-fontRed").hide();
					}
					that.cardInfoBar.show().removeClass("error").html("实体卡号："+card_no+"<i style='margin:0 10px'></i>虚拟卡号："+virtual_no+"<i style='margin:0 10px'></i>"+"物理ID："+physics_no);
				}else{
					that.cardInfoBar.show().html(res.msg || PFT.AJAX_ERROR_TEXT).addClass("error");
				}
			}
		})
	},
	getVCode : function(mobile){
		var that = this;
		var getVCodeBtn = this.getVCodeBtn;
		PFT.Util.Ajax(Api.Url.active.getVCode,{
			params : {
				mobile : mobile
			},
			loading : function(){
				getVCodeBtn.addClass("unable").text("请稍后..");
			},
			success : function(res){
				res = res || {};
				if(res.code==200){
					var last = that.time-1;
					that.timer = setInterval(function(){
						last = last-1;
						if(last<=0){
							getVCodeBtn.text("获取验证码").removeClass("unable");
							clearInterval(that.timer);
						}else{
							getVCodeBtn.text(last+"秒后可重新获取");
						}
					},1000)
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	submit : function(replace){
		var that = this;
		var submitBtn = this.submitBtn;
		var cardVal = this.cardInp.val();
		var mobile = this.mobileInp.val();
		var name = this.memnameInp.val();
		var id_card = this.idCardInp.val();
		var vcode = this.vcodeInp.val();

		var provCity = this.provCitySelect.getVal();
		var province = provCity.prov;
		var city = provCity.city;
		var address = $("#addressInp").val();
		var head_img = $("#uploadPhotoImg").attr("src") || "";

		var data = {
			identify : cardVal,
			type : "physics",  //type="physics"||"other"
			mobile : mobile,
			name : name,
			id_card : id_card,
			vcode : vcode,
			province : province,
			city : city,
			address : address,
			head_img : head_img
		};

		if(replace=="replace") data["replace"] = 1;

		PFT.Util.Ajax(Api.Url.active.activateForPc,{
			type : "post",
			params : data,
			loading : function(){
				submitBtn.addClass("disable");
			},
			complete : function(){
				submitBtn.removeClass("disable");
			},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				if(res.code==200){
					if(data.exist==1){
						that.CheckExistDialog.open(data);
					}else{
						PFT.Util.STip("success",'<div style="width:200px">激活成功</div>')
					}
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT)
				}
			}
		})
	}
});

$(function(){
	new MainView();
})
