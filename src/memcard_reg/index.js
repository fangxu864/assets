/**
 * Created by Administrator on 2016/7/28.
 */
require("./index.css");
var KeyupTimeout = null;
var Debug = true;
var Query_Info = require("SERVICE/MemcardReg/Query_Info");
var Query_MobileLogup = require("SERVICE/MemcardReg/Query_MobileLogup");
var Query_Vcode = require("SERVICE/MemcardReg/Query_Vcode");
var Loading = require("COMMON/js/util.loading.pc.js");
var ProvCity = require("COMMON/Components/ProvCitySelect");
var Fileupload = require("COMMON/modules/fileupload");
var Validate = require("COMMON/Components/Validator");
var Tpl = {
	index : PFT.Util.ParseTemplate(require("./Tpl/index.xtpl"))
};
var Main = PFT.Util.Class({
	container : $("#memberCardContainer"),
	EVENTS : {
		"keyup #mobileInp" : "onMobileInpKeyup",
		"click #getCheckmaBtn" : "onGetCheckMaBtnClick",
		"click #famleWrap .fe" : "onFamleFeClick",
		"click #saveBtn" : "onSaveBtnClick"
	},
	validator : {},
	init : function(){
		this.fid = PFT.Util.UrlParse()["fid"] || "";
		this.editMode = this.fid!=="undefined" && this.fid!==""; //编辑模式

		if(this.editMode){ //如果是编辑模式
			Query_Info({
				debug : Debug,
				params : {
					fid : this.fid
				},
				cxt : this,
				loading : function(){
					var loading = Loading("努力加载中，请稍后...",{
						height : 600
					});
					this.container.html(loading);
				},
				complete : function(){
					this.container.html("");
				},
				success : function(data){
					this.render(data)
				},
				error : function(code,msg){
					alert(msg);
				}
			})
		}else{ //新建模式
			this.render();
		}
	},
	//手机号检测
	onMobileInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var mobile = $.trim(tarInp.val());
		if(mobile.length!==11) return false;
		clearTimeout(KeyupTimeout);
		KeyupTimeout = setTimeout(function(){
			if(Validate.Rules.mobile(mobile).isOk==1){ //如果输入的是合法手机号
				Query_MobileLogup({
					debug : Debug,
					params : {
						mobile : mobile
					},
					success : function(res){
						//code: 100存在   101不存在   102散客   103此帐号已被禁用或删除
						var code = res.code;
						var data = res.data;
						var dtype = data.dtype;
						if(code==100 && dtype!==1){
							alert("供应商手机号不能开卡，请更换手机号");
						}else if(code==103){
							alert("此帐号已被禁用或删除，请更换手机号");
						}else{ //可以开卡

						}
					}
				})
			}
		},KeyupTimeout)
	},
	//点击获取验证码按钮
	onGetCheckMaBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var originText = tarBtn.text();
		if(tarBtn.hasClass("disable")) return false;
		var mobileInp = $("#mobileInp");
		var mobile = $.trim(mobileInp.val());
		if(!mobile) return alert("请输入手机号");
		if(Validate.Rules.mobile(mobile).isOk!==1) return alert("请输入正确格式手机号");
		Query_Vcode({
			debug : Debug,
			params : {
				type : "get",
				mobile : mobile
			},
			loading : function(){
				tarBtn.addClass("disable").text("请稍后...");
			},
			complete : function(){
				tarBtn.removeClass("disable").text(originText);
			},
			success : function(res){
				PFT.Util.STip("success","验证码已发送至您填写的手机号，请留意查收");
			},
			error : function(text,status){
				alert(text);
			}
		})
	},
	//点击性别
	onFamleFeClick : function(e){
		$(e.currentTarget).addClass("active").siblings().removeClass("active");
	},
	//点击提交按钮
	onSaveBtnClick : function(e){

	},
	onValifyInpBlur : function(e){
		var tarDom = $(e.currentTarget);
		var val = tarDom.val();
		if(tarDom.hasClass("mobileInp")){
			this.validateMobile(tarDom,val);
		}
	},
	//验证手机号
	validateMobile : function(){
		var mobileInp = $("#mobileInp");
		return Validate({
			target : mobileInp,
			event : "blur",
			rule : ["require","mobile"],
			callback : function(rule,isOk,errMsg,errCode,target,value){
				var errTip = $("#mobileInpErrorTxt");
				if(isOk){
					target.removeClass("error");
					errTip.hide();
				}else{
					errMsg = errMsg || "请填写手机号";
					target.addClass("error");
					errTip.show().text(errMsg)
				}
			}
		});
	},
	//验证短信验证码
	validateVCode : function(){
		var checkmaInp = $("#checkmaInp");
		return Validate({
			target : checkmaInp,
			event : "blur",
			rule : ["require","typeNum",{
				"max6" : function(val){
					return{
						isOk : val.length==6 ? 1 : 0,
						errMsg : val.length==6 ? "" : "请输入6位数验证码"
					}
				}
			}],
			callback : function(rule,isOk,errMsg,errCode,target,value){
				var errTip = target.siblings(".errortip");
				if(isOk){
					target.removeClass("error");
					errTip.hide();
				}else{
					errMsg = errMsg || "请输入验证码";
					target.addClass("error");
					errTip.show().text(errMsg);
				}
			}
		});
	},
	//验证身份证
	validateIDCard : function(){
		var idCardInp = $("#idcardInp");
		return Validate({
			target : idCardInp,
			event : "blur",
			rule : ["require","idcard"],
			callback : function(rule,isOk,errMsg,errCode,target,value){
				var errortip = target.siblings(".errortip");
				if(isOk){
					target.removeClass("error");
					errortip.hide();
				}else{
					target.addClass("error");
					errortip.show().text(errMsg);
				}
			}
		})
	},
	//初始化省市联动
	initProvCity : function(data){
		var province = data.province || "";
		var city = data.city || "";
		var ProvCitySelect = this.ProvCitySelect = new ProvCity({
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(provId){},
			onCityChange : function(cityId){}
		})
		setTimeout(function(){
			ProvCitySelect.setVal(province,city)
		},50)

	},
	//初始化图片上传
	initImgUpload : function(){
		var container = $("#up_img_box");
		this.fileupload = new Fileupload({
			container : $("#up_img_box"),                    //必选 组件要显示在哪个容器内，可传容器id或jq对象
			action    : "/r/product_AnnualCard/uploadImg/",   //必选 文件上传至后端，哪个接口地址处理
			id        : 1 ,                                     //必选 页面上可能有好几个文件上传组件同时存在，用来标显组件唯一id(数字)
			loading   :  function(doms){ 							//上传过程中的回调函数   可选 *
				container.find(".fileuploadBtn").html("上传中...");
			} ,
			complete  : function(data){                       //上传结束后的回调函数   可选 建议后端返回的数据格式：{code:200,data:{src:"图片src地址"},msg:""}
				container.find(".fileuploadBtn").html('<i class="iconfont">&#xe659;</i><span class="t">上传</span>');
				var code = data.code;
				if(code==200){
					$("#photo_src_hidden_input").val(data.data.src);
					PFT.Util.STip("success","文件上传成功！");
				}else{
					alert(data.msg || "error");
				}
				container.find(".uploadResultImg").remove();
				container.append('<div class="uploadResultImg"><img src="'+data.data.src+'"/></div>');
			}
		})
	},
	render : function(data){
		var that = this;
		data = $.extend({
			fid : this.fid,
			mobile : "",                 //手机号
			id_card_no : "",             //身份证
			dname : "",                  //姓名
			province : "",
			city : "",
			address : "",
			headphoto : "",
			car : "",
			remakes : "",
			phy_no : "",
			card_no : "",
			notice_type	 : "",
			sex : "M"
		},data || {});
		var html = Tpl.index(data);
		this.container.html(html);
		setTimeout(function(){
			that.initProvCity(data);
			that.initImgUpload();
			that.validator["mobile"] = that.validateMobile();
			that.validator["vcode"] = that.validateVCode();
			that.validator["idcard"] = that.validateIDCard();
		},10)
	}

});



$(function(){ new Main });