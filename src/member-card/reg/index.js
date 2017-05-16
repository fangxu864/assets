/**
 * Created by Administrator on 2016/7/28.
 */
require("./index.scss");
var KeyupTimeout = null;
var Debug = false;
var Query_Info = require("SERVICE/MemcardReg/Query_Info");
var Query_MobileLogup = require("SERVICE/MemcardReg/Query_MobileLogup");
var Query_Vcode = require("SERVICE/MemcardReg/Query_Vcode");
var Query_CarList = require("SERVICE/MemcardReg/Query_car_list");
var Update_Info = require("SERVICE/MemcardReg/Update_Info");
var Loading = require("COMMON/js/util.loading.pc.js");
var ProvCity = require("COMMON/Components/ProvCitySelect");
var Fileupload = require("COMMON/modules/fileupload");
var Validate = require("COMMON/Components/Validator/v1.0");
var ValidateRule = Validate.Rules;


//引入通用Dialog组件
var Dialog = require("pft-ui-component/Dialog");
//引入通用消息提示组件
var Message = require("pft-ui-component/Message");

var Tpl = {
	index : PFT.Util.ParseTemplate(require("./Tpl/index.xtpl")),
	mobileDialog : require("./Tpl/modify-mobile-dialog.xtpl")
};


//huangzy 2017/04/25
//新增写入卡信息功能
var WriteCardInfo = require("./write-card-info");



var Main = PFT.Util.Class({
	container : $("#memberCardContainer"),
	EVENTS : {
		"keyup #mobileInp" : "onMobileInpKeyup",
		"click #getCheckmaBtn" : "onGetCheckMaBtnClick",
		"click #famleWrap .fe" : "onFamleFeClick",
		"mouseenter .uploadResultImg" : "onPhotoMouseEnter",
		"mouseleave .uploadResultImg" : "onPhotoMouseLeave",
		"click .removePhotoBtn" : "onRemovePhotoBtnClick",
		"click .saveBtn" : "onFormSubmit",
		"click #readwuKa" : "readwuKa",
		"click #modifyMobileBtn" : "onModifyMobileBtnClick",
		"click #writeCardBtn" : "onWriteCardBtnClick"
	},
	validator : {},
	CarList : "5座 7座 9座 11座 15座 15座以上 飞马出租 弘瑞出租 天行出租 盛捷出租 海棠湾出租 智慧快的出租",
	readKaMode : "new",  //可选值：  "ie"   "new"
	init : function(){

		var that = this;

		//this.fid = PFT.Util.UrlParse()["fid"] || "";  //这样做不安全，容易被攻击
		//涉及比较敏感的信息  或者需要从页面url里取参数，
		//然后把得到的参数做为ajax请求的参数发给后端的，最好还是有获取隐藏域的方式
		this.fid = $("#fidHidInp").val() || "";  //fidHidInp隐藏域里用php获取url里的参数：<?=I('fid')?>  更安全
		
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
					this.render(data);
					$("#dname_hidInp").val(data.dname);
					that.WriteCardInfo = new WriteCardInfo({
						idCard : data.id_card_no,    //身份证
						card_no : data.card_no,   //实体卡号
						mobile : data.mobile,     //手机号
						phy_no : data.phy_no      //物理卡号
					});
				},
				error : function(msg,code){
					this.container.html('<div style="height:600px; line-height:600px; color:#777; text-align:center">'+msg+'</div>');
				}
			})
		}else{ //新建模式
			this.render();
			that.WriteCardInfo = new WriteCardInfo();
		}
	},
	onRemovePhotoBtnClick : function(e){
		$(e.currentTarget).parents(".uploadResultImg").remove();
	},
	onPhotoMouseEnter : function(e){
		var tarBox = $(e.currentTarget);
		var width = tarBox.width();
		var height = tarBox.height();
		tarBox.css("position","relative");
		var innerBox = $('<div class="innerBox"/>').css({
			position : "absolute",
			top : 0,
			right : 0,
			left : 0,
			bottom : 0,
			width : width,
			height : height,
			backgroundColor : "#000",
			opacity : 0.6,
			overflow:"hidden"
		});
		var btn = $('<span class="removePhotoBtn"/>').css({
			position : "absolute",
			top : "50%",
			left : "50%",
			width : 70,
			height : 26,
			margin : "-13px 0 0 -35px",
			lineHeight : "26px",
			textAlign : "center",
			backgroundColor : "#0796d8",
			color : "#fff",
			cursor : "pointer",
			fontSize : 12
		}).text("删除");
		tarBox.append(innerBox);
		tarBox.append(btn);
	},
	//点击修改手机号
	onModifyMobileBtnClick : function(e){
		var that = this;
		this.dialog = this.dialog || new Dialog({
			cache : true,
			top : 200,
			title : "修改会员手机号",
			content : function(){
				return Tpl.mobileDialog;
			},
			cancelBtn : false,
			yesBtn :  false,
			EVENTS : {
				"click .btnGup .mdBtn" : function(e){

					//18250155562
					var tarBtn = $(e.currentTarget);
					if(tarBtn.hasClass("disable")) return false;
					if(tarBtn.hasClass("cancel")) return this.close();

					var pwdInp = $("#mdPwdInp");
					var mobileInp = $("#mdMobileInp");

					var pwd = $.trim(pwdInp.val());
					var mobile = $.trim(mobileInp.val());

					if(!pwd) return Message.error("请输入密码",2000);
					if(!mobile) return Message.error("请输入手机号",2000);
					
					var res = ValidateRule.mobile(mobile);
					if(!res.isOk) return Message.error(res.errMsg);

					PFT.Util.Ajax("/r/product_MemberCardBasic/modifyPhone/",{
						type : "post",
						params : {
							fid : that.fid,
							phone : mobile,
							password : pwd
						},
						loading : function(){ tarBtn.addClass("disable").text("请稍后...")},
						complete : function(){ tarBtn.removeClass("disable").text("确定")},
						success : function(res){
							var code = res.code;
							var msg = res.msg || PFT.AJAX_ERROR_TEXT;
							if(code==200){
								Message.success("修改成功");
								$("#mobileInp").val(mobile);
							}else{
								Message.error(msg);
							}
						},
						timeout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT)},
						serverError : function(){ Message.error(PFT.AJAX_ERROR_TEXT)}
					});

				}
			}
		});
		this.dialog.open();
	},
	onPhotoMouseLeave : function(e){
		var tarBox = $(e.currentTarget);
		tarBox.find(".removePhotoBtn").remove();
		tarBox.find(".innerBox").remove();
	},
	//手机号检测
	onMobileInpKeyup : function(e){
		var tarInp = $(e.currentTarget);
		var mobile = $.trim(tarInp.val());
		if(mobile.length!==11) return false;
		clearTimeout(KeyupTimeout);
		KeyupTimeout = setTimeout(function(){
			if(Validate.Rules.mobile(mobile).isOk){ //如果输入的是合法手机号
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
		if(!Validate.Rules.mobile(mobile).isOk) return alert("请输入正确格式手机号");
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
				Message.success("验证码已发送至您填写的手机号，请留意查收");
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
	onValifyInpBlur : function(e){
		var tarDom = $(e.currentTarget);
		var val = tarDom.val();
		if(tarDom.hasClass("mobileInp")){
			this.validateMobile(tarDom,val);
		}
	},
	onWriteCardBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		this.WriteCardInfo.write();
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
	validateDname : function(){
		var dnameInp = $("#cnameInp");
		return Validate({
			target : dnameInp,
			event : "blur",
			rule : ["require"],
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
	validateCardNo : function(){
		var cardNoInp = $("#card_no_inp");
		return Validate({
			target : cardNoInp,
			event : "blur",
			rule : ["require"],
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
		var province = data.province || "1";
		var city = data.city || "";
		var ProvCitySelect = this.ProvCitySelect = new ProvCity({
			provId : "#provSelect",
			cityId : "#citySelect",
			onProvChange : function(provId){},
			onCityChange : function(cityId){}
		})
		setTimeout(function(){
			if(province){
				ProvCitySelect.setVal(province,city)
			}
		},50)

	},
	//初始化图片上传
	initImgUpload : function(data){
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
					Message.success("文件上传成功！");
				}else{
					alert(data.msg || "error");
				}
				container.find(".uploadResultImg").remove();
				container.append('<div class="uploadResultImg"><img src="'+data.data.src+'"/></div>');
			}
		});
		var headphoto = data.headphoto;
		if(headphoto){
			setTimeout(function(){
				var def = "//static.12301.cc/assets/build/images/defaultThum.jpg";
				container.append('<div class="uploadResultImg"><img onerror="this.src=\'//static.12301.cc/assets/build/images/defaultThum.jpg\'; this.onerror=null" src="'+headphoto+'"/></div>');
			},20)
		}
	},
	//请求车辆信息列表
	fetchCarList : function(select_car_id){
		Query_CarList({
			debug : false,
			cxt : this,
			loading : function(){},
			complete : function(){ 
				$("#carInfoBox").html("");
			},
			success : function(data){
				var select = $('<select id="carListSelect" class="carListSelect" name="car"></select>');
				var option = "";
				for(var i=0, len=data.length; i<len; i++){
					var car = data[i];
					var selected = (select_car_id && car.type==select_car_id) ? "selected" : "";
					option += '<option value="'+car.type+'" '+selected+'>'+car.name+'</option>';
				}
				select.append(option);
				$("#carInfoBox").html("").append(select);
			},
			error : function(code,msg){
				alert(msg);
			}
		})
	},
	render : function(data){
		var that = this;
		var carList = this.carList;
		var _data = $.extend({
			fid : this.fid,
			mobile : "",                 //手机号
			id_card_no : "",             //身份证
			dname : "",                  //姓名
			province : "",
			city : "",
			address : "",
			headphoto : "",
			car : "",
			remarks : "",
			phy_no : "",
			card_no : "",
			notice_type	 : "1",
			open_name : "",
			sex : "M",
			cid : ""
		},data || {});

		_data["editMode"] = this.editMode;

		var html = Tpl.index(_data);
		this.container.html(html);
		setTimeout(function(){
			that.initProvCity(_data);
			that.initImgUpload(_data);
			if($("#mobileInp").attr("readonly")!=="readonly"){
				that.validator["mobile"] = that.validateMobile();
			}
			if(!that.editMode) that.validator["vcode"] = that.validateVCode();
			if($("#idcardInp").attr("readonly")!=="readonly"){
				that.validator["idcard"] = that.validateIDCard();
			}
			if($("#cnameInp").attr("readonly")!=="readonly"){
				that.validator["dname"] = that.validateDname();
			}

			that.validator["cardNo"] = that.validateCardNo();

			that.fetchCarList(_data.car);

		},10)
	},
	readwuKa : function(e){
		if(this.readKaMode=="ie"){ //用IE读卡
			var helloBossma = document.getElementById("helloBossma");
			if(!helloBossma){
				alert("请使用IE浏览器读物理卡号");
				return false;
			}
			if(typeof helloBossma.open!="number" && typeof helloBossma.ICReaderRequest!="string"){
				alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
				return false;
			}
			helloBossma.open();
			var val = helloBossma.ICReaderRequest();
			$("#phy_no_inp").val(val);
		}else{ //用新的方式读卡，支持谷歌浏览器，websocket方式
			this.readWuKa_New();
		}
	},
	readWuKa_New : function(e){
		this.WriteCardInfo.readKa();
	},
	onFormSubmit : function(e){
		e.preventDefault();
		var tarBtn = $(e.currentTarget);
		var orignText = tarBtn.text();
		if(tarBtn.hasClass("disable")) return false;

		var validator = this.validator;
		var canSubmit = true;

		for(var i in validator){
			var valid = validator[i];
			if(typeof valid=="function"){
				var result = valid();
				if(!result.isOk){
					canSubmit = false;
					break;
				}
			}
		}

		if(!canSubmit) return false;

		var phy_no = $("#phy_no_inp").val();
		if(!phy_no) return alert("物理卡号为必填项，请用读卡器请取物理卡号");


		var submitData = {
			mobile : $.trim($("#mobileInp").val()),
			id_card_no : $.trim($("#idcardInp").val()),
			card_no : $.trim($("#card_no_inp").val()),
			phy_no : $.trim($("#phy_no_inp").val()),
			dname : $.trim($("#cnameInp").val()),
			sex : $("#famleWrap").children(".active").attr("data-type"),
			province : $("#provSelect").val(),
			city : $("#citySelect").val(),
			address : $.trim($("#addressInp").val()),
			headImg : $("#up_img_box").find(".uploadResultImg img").attr("src") || "",
			carInfo : $("#carListSelect").val(),
			remarks : $("#remarksTextarea").val(),
			notice_type : $("#sendTypeBox").find("input:checked").val()
		};

		//2017-03-02 添加cid参数  编辑时传   开卡时不传
		var cid = tarBtn.attr("data-cid");
		if(cid!="") submitData["cid"] = cid; 

		if(!this.editMode){ //新建模式需要vcode  编辑模式不需要vcode 
			submitData["vcode"] = $.trim($("#checkmaInp").val());
		}

		if(this.fid){
			submitData["card"] = 0;
			submitData["fid"] = this.fid;

		}else{
			submitData["card"] = 1;
		}

		Update_Info({
			cxt : this,
			params : submitData,
			loading : function(){
				tarBtn.text("请稍后...").addClass("disable");
			},
			complete : function(){
				tarBtn.text(orignText).removeClass("disable");
			},
			success : function(data){
				Message.success(this.fid ? "修改成功" : "开卡成功");

				if(!this.fid){ //如果是开卡，开卡成功后，后端会返回memberID跟dname
					var fid = data.fid;  //fid就是memberID
					var dname = data.dname;
					$("#memberID_hidInp").val(fid);
					$("#dname_hidInp").val(dname);
				}

				this.WriteCardInfo.refreshInfo({
					idCard : submitData.id_card_no, //身份证
					card_no : submitData.card_no,   //实体卡号
					mobile : submitData.mobile,      //手机号
					phy_no : submitData.phy_no      //物理卡号
				});
				this.WriteCardInfo.write();
				
			},
			error : function(msg,code){
				Message.alert(msg);
			}
		})

	}
});



$(function(){ new Main });