require("./index.scss");
var Select = require("./select");
var STip = require("COMMON/js/util.simple.tip");
var Datepicker = require("COMMON/modules/datepicker");
var Fileupload = require("COMMON/modules/fileupload");
var ListTpl = require("./index.xtpl");

//第145 key:getActivityDetail   第317

var Main = PFT.Util.Class({
	

	container: "#bodyContainer",
	EVENTS: {
		"click #typeBox label": "changeShareType",
		"focus #couponNumber": "checkCouponNum",
		"click .inp-date": "initDatePicker",
		"click #saveBtn": "saveAddNewActivity",
		"change #typeFourCouponNum": "changeCouponNumber",
		"change .fileuploadFileInp": "changefile"
	},
	init: function () {
		this.shareTypeFourParams = {
			id : 0,
			num : 0,
		};
		this.initPage();
		this.datepicker = new Datepicker();
	},

	//初始化页面显示
	initPage: function () {
		var _this = this;
		var urlParams = PFT.Util.UrlParse();
		var spid = urlParams["did"] || "";
		var CalendarCore = Datepicker.CalendarCore;
		var date = CalendarCore.gettoday() + " ";
		var emptyData = {
			title: "",
			share_type: "1",
			coupon_id: "",
			coupon_num: "",
			relation_pid: "",
			content: "",
			image_path: "",
			red_pack_money: "0",
			mkid: "",
			beginDate: "",
			endDate: "",
			only_member: "0"
		};

		if (spid.length < 1) {
			_this.renderActivityPage(emptyData);
			//	console.log(emptyData["beginDate"])
		} else {
			_this.getSpidActivity(spid);

		}
	

	},
	//初始化富文本编辑器
	initUeditor: function (id,content,share_type) {
		window.UEDITOR_CONFIG.initialFrameWidth = 600;
		switch (id) {
			case 1:
				var ue1=this.ue1 = UE.getEditor('content_1');
				if(content&&share_type==1){
					ue1.addListener('ready', function () {
					ue1.setContent(content);  
				});
				}
				
				break;
			case 2:
				var ue2=this.ue2 = UE.getEditor('content_2');
				if(content&&share_type==2){
				ue2.addListener('ready', function () {
					ue2.setContent(content);  
				});

				}
				break;
		}
	},
	//初始化日历
	initDatePicker: function (e) {
		var datepicker = this.datepicker;
		var tarInp = $(e.currentTarget);
		var CalendarCore = Datepicker.CalendarCore;
		var date = tarInp.val();
		var time = tarInp.hasClass("begin") ? "00:00" : "23:59";
		if (!date) {
			date = CalendarCore.gettoday() + " " + time;
		}
		console.log(date, time)
		datepicker.show(date, {
			picker: tarInp,              //必选
			top: 0,                     //可选，相对偏移量
			left: 0,                    //可选，相对偏移量
			todayBeforeDisable: false,  //可选，今天之前的日期都不显示
			todayAfterDisable: false    //可选，今天之后的日期都不显示
		})

	},
	//初始化图片上传插件
	initImgUpload: function () {
		var uploader = new Fileupload({
			container: '#imgUploadWrap',
			id: 1,  //唯一
			extra: { identify: "coupon" },
			action: '/r/Resource_ImageUpload/upload',
			loading: function (formControls) {
				STip("success", '<p style="width:160px;">正在上传图片,请稍后</p>', 3000);
			},
			complete: function (res) {
				console.log(res)
				if (res.code == 200) {
					$('#imagePath').attr({ "src": res.data.src, "data-path": res.data.src });
					STip("success", '<p style="width:160px;">上传图片成功</p>');
				} else {
					STip("fail", '<p style="width:220px;">' + res.msg + '</p>');
				}
			}
		});

		var uploader_2 = new Fileupload({
			container: '#imgUploadWrap_2',
			id: 2,  //唯一
			extra: { identify: "coupon" },
			action: '/r/Resource_ImageUpload/upload',
			loading: function (formControls) {
				STip("success", '<p style="width:160px;">正在上传图片,请稍后</p>', 3000);
			},
			complete: function (res) {
				console.log(res)
				if (res.code == 200) {
					$('#imagePath_2').attr({ "src": res.data.src, "data-path": res.data.src })
					STip("success", '<p style="width:160px;">上传图片成功</p>');
				} else {
					STip("fail", '<p style="width:220px;">' + res.msg + '</p>');
				}
			}
		});
	},
	excelUpLoad:function(){
		console.log("excel");
		var uploader_3 = new Fileupload({
			container: '#excelUploadWrap',
			id: 3,  //唯一
			fileNameAttr: "file_coupon",
			uploadBtnShow : false,
			userDefinedUpBtn : '#saveBtn',
			extra: { coupon_id :this.shareTypeFourParams.id, coupon_num :this.shareTypeFourParams.num  },
			action: '/r/product_Coupon/sendBYBatch',
			loading: function (formControls) {
				STip("success", '<p style="width:160px;">正在上传,请稍后</p>', 3000);
			},
			complete: function (res) {
				console.log(res);
				// if (res.code == 200) {
			
				// 	STip("success", '<p style="width:160px;">上传成功</p>');
				// } else {
				// 	STip("fail", '<p style="width:220px;">' + res.msg + '</p>');
				// }
			}
		});
	},
	//根据spid获取活动详细
	getSpidActivity: function (spid) {
		var _this = this;
		PFT.Util.Ajax('/r/product_Coupon/marketingListSp', {
			type: 'POST',
			dataType: 'JSON',
			params: {
				spid: spid
			},
			success: function (res) {
				if (res.code == 200) {
					var data = res.data.data[0];
					data["spid"] = spid;
					_this.renderActivityPage(data);
				} else {
					STip("fail", res.msg,2000);
					window.location.href="marketing_share_list.html";
				}
			},
			fail: function () {
				STip("fail", res.msg);
			}
		})
	},
	//时间戳转换
	formatTimeStamp: function (timestamp) {
		var date = new Date(parseInt(timestamp) * 1000 );
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = (date.getDate()<10 ? '0'+date.getDate() : date.getDate()) + ' ';
		h = (date.getHours()<10 ? '0' +date.getHours() : date.getHours())+ ':';
		m = (date.getMinutes()<10) ? '0' + date.getMinutes() :date.getMinutes();

		var dateTime = Y + M + D + h + m;
		console.log(dateTime)
		return dateTime;
	},
	//渲染活动页面
	renderActivityPage: function (data) {
		var _this = this;
		var render = PFT.Util.ParseTemplate(ListTpl);
		var html = "";
		var beginDate = data.activity_bt ? _this.formatTimeStamp(data.activity_bt) : "";
		var endDate = data.activity_et ? _this.formatTimeStamp(data.activity_et) : "";
		var content = data.content;
		data["beginDate"] = beginDate;
		data["endDate"] = endDate;
		html = render({ data: data });
		_this.container.html(html);
		_this.initUeditor(1,data.content,data.share_type);//初始化默认富文本编辑器
		_this.initUeditor(2,data.content,data.share_type);
		_this.getActivityList(data.relation_pid);//初始化活动产品
		_this.initGetCouponId("couponId", data.coupon_id);//初始化获取优惠券列表
		_this.initGetCouponId("couponIdInp", data.coupon_id);
		_this.initGetCouponId("typeFourCouponId", data.coupon_id);
		/*if (data.share_type != 3) {
			_this.setContent(data.share_type, data.content);//将富文本编辑器内容写入
		}*/
		_this.initImgUpload();//初始化图片上传插件
		// _this.excelUpLoad();//初始化文件上传插件

		$("#saveBtn").attr({ "data-spid": data.spid, "data-mkid": data.mkid });
		$(" .fileuploadWrap .fileuploadTextInp").css("width", "160px");//重置图片上传input框宽度

	},
	//切换分享类型
	changeShareType: function (e) {
		var _this = this;
		var tarLabel = $(e.currentTarget);
		var tarRadio = tarLabel.children(".inp-r");
		var tarNum = tarRadio.attr("value");
		$("#share_type_" + tarNum).show().siblings(".share_type").hide();
		$("#saveBtn").attr("data-type", tarNum);
		if(tarNum == 4){
			$('.shareTypeOneToTree').hide();
			$('.shareTypeFour').show();
			$('.date').hide();
		}else{
			$('.shareTypeOneToTree').show();
			$('.shareTypeFour').hide();
			$('.date').show();
		}

	},
	//获取产品列表
	getActivityList: function (relation_pid) {
		var _this = this;
		var select = new Select({
			source: "/r/product_Coupon/getProducts",
			ajaxType: "POST",
			ajaxParams: {
			},
			isFillContent: false,
			filterType: "ajax",  //指定过滤方式为ajax
			field: {
				id: "id",
				name: "title",

			},
			trigger: $("#schProInp"),
			filter: false,
			defaultVal: relation_pid ? relation_pid : "",
			adaptor: function (res) {
				$(".selectOptionUl").css("padding-left", 0);
				var result = { code: 200 };
				var list = res.data;
				if (!list) {
					return result;
				}
				$("#schProInp").attr("data-fid", list[0].fid);
				var newList = [];
				for (var i = 0; i < list.length; i++) {

					newList.push({
						id: list[i].pid,
						title: list[i].ltitle+' - '+list[i].ttitle,

					});
				}
				//console.log(newList)
				result["data"] = newList;

				//	console.log(share_type)

				return result;
			},
		});
	},
	//获取优惠券id 
	initGetCouponId: function (id, coupon_id) {
		var _this = this;
		var selectId = new Select({
			source: "/r/product_Coupon/getCoupon",
			ajaxType: "POST",
			ajaxParams: {
			},
			isFillContent: false,
			filterType: "ajax",  //指定过滤方式为ajax
			field: {
				id: "id",
				name: "title",
			},
			trigger: $("#" + id),
			filter: false,
			defaultVal: coupon_id ? coupon_id : "",
			adaptor: function (res) {
				$(".selectOptionUl").css("padding-left", 0);
				var result = { code: 200 };
				var list = res.data.data;
				if (!list) {
					return result;
				}
				var newCouList = [];
				for (var i = 0; i < list.length; i++) {

					newCouList.push({
						id: list[i].id,
						title: list[i].coupon_name
					});
				}
				// console.log(newList)
				result["data"] = newCouList;
				return result;
			},
		});
	},
	//票券张数输入时选中radio
	checkCouponNum: function () {
		$("#couponNumRadio").prop("checked", true);
	},
	//转换日期为时间戳
	formatDate: function (date) {
		var timestamp = Date.parse(new Date(date));
		var timestamps = timestamp / 1000;
		return timestamps;
	},
	//写入ueditor
	setContent: function (share_type, content) {
		if (share_type == 1) {
			this.ue1.setContent(content);
		} else {
			this.ue2.setContent(content);
		}
	},
	//保存新增优惠活动
	saveAddNewActivity: function (e) {
		var _this = this;
		var tarBtn = $(e.currentTarget);
		var type = tarBtn.attr("data-type");
		var spid = tarBtn.attr("data-spid");
		var mkid = tarBtn.attr("data-mkid");
		var params = {};
		var param;
		var title = $("#title").val();
		var beginDate = _this.formatDate($("#beginDate").val());
		var endDate = _this.formatDate($("#endDate").val());
		var only_member = $(".inp-limit:checked").val();
		if (!title) return STip("fail", "活动名称不为空!", 3000);
		if (!beginDate) return STip("fail", "活动起始时间不为空!", 3000);
		if (!endDate) return STip("fail", "活动截止时间不为空!", 3000);
		if (beginDate > endDate) return STip("fail", "起始时间不能迟于截止时间!", 3000);
		if (!only_member) STip("fail", "请选择是否仅限会员卡!", 3000);
		switch (type) {
			case '1':
				param = _this.getTypeAParam();
				break;
			case '2':
				param = _this.getTypeBParam();
				break;
			case '3':
				param = _this.getTypeCParam();
				break;
			case '4':
				param = _this.getTypeDParam();
				break;
		}
		params = param;
		params["spid"] = spid;
		params["id"] = mkid;
		params["activity_name"] = title;
		params["only_member"] = only_member;
		params["bt"] = beginDate;
		params["et"] = endDate;
		params["share_type"] = type;
		//console.log(params);
		_this.saveReq(params);
		//window.location.href="marketing_share_list.html";
	},
	//类别1参数
	getTypeAParam: function () {
		var couponId = $("#couponId").attr("data-id");
		var couponNum = $("#couponNum").val();
		var uecontent = this.ue1.getContent();
		var imgPath = $("#imagePath").attr("src");
		var reg = /^([1-9]\d{0,5}|999999)$/;
		var param;
		if (!couponId) return STip("fail", "优惠券ID不为空!", 3000);
		if (!reg.test(couponNum)) return STip("fail", "赠券张数在1~999999之间!", 3000);
		param = {
			coupon_id: couponId,
			relation_pid: "0",
			coupon_num: couponNum,
			red_pack_money: "",
			content: uecontent,
			thumb: imgPath || ""
		}
		return param;
	},
	//类别2参数
	getTypeBParam: function () {
		var red_pack_money = $("#redPackMoney").val();
		var uecontent = this.ue2.getContent();
		var imgPath = $("#imagePath_2").attr("data-path");
		var param;
		var reg = /^([0-9]\d{0,9}|1000000000)$/;
		if (!reg.test(red_pack_money)) return STip("fail", "红包金额在0~10亿之间!", 3000);
		param = {
			coupon_id: "",
			relation_pid: "",
			coupon_num: "0",
			red_pack_money: red_pack_money,
			content: uecontent,
			thumb: imgPath || ""
		}
		return param;
	},
	//类别3参数
	getTypeCParam: function () {
		var couponIdInp = $("#couponIdInp").attr("data-id");
		var coupon_num;
		var couponNum = $("#couponNumber").val();
		var proInp = $("#schProInp").attr("data-id");
		var param;
		var reg = /^([1-9]\d{0,5}|999999|-1)$/;
		
		coupon_num = ($("input[name='couponNum']:checked").val() == -1) ? -1 : couponNum;
		if (!reg.test(coupon_num)) return STip("fail", "赠券张数在1~999999之间!", 3000);
		if (!couponIdInp) return STip("fail", "优惠券ID不为空!", 3000);
		if (!proInp) return STip("fail", "活动产品不为空!", 3000);

		param = {
			coupon_id: couponIdInp,
			relation_pid: proInp,
			coupon_num: coupon_num,
			red_pack_money: "",
			content: "",
			thumb: "",
		}
		return param;
	},
	//类别4参数
	getTypeDParam: function () {
		var couponIdInp = $("#typeFourCouponId").attr("data-id");
		var couponNum = $("#typeFourCouponNum").val();

		var param;
		var reg = /^([1-9]\d{0,5}|999999|-1)$/;
		
		if (!reg.test(couponNum)) return STip("fail", "赠券张数在1~999999之间!", 3000);
		if (!couponIdInp) return STip("fail", "优惠券ID不为空!", 3000);

		this.shareTypeFourParams.num= couponNum;
		this.shareTypeFourParams.id= couponIdInp;

		param = {
			coupon_id: couponIdInp,
			coupon_num: couponNum,
			relation_pid: "",
			red_pack_money: "",
			content: "",
			thumb: "",
			only_member : 2
		}
		return param;
	},
	//保存数据请求
	saveReq: function (param) {		
		if(param.share_type == 4){
			window["FileuploadCallbacks"][3] = [];
			window["FileuploadCallbacks"][3].push(function(res){
				if(res.code == 200){
					STip("success", "保存成功!", 2000, function () {		
						window.location.href = "marketing_share_list.html";
					});
				}else{
					STip("fail", res.msg, 2000, function () {
					});
				}
			
			});
			PFT.Util.Ajax('/r/product_Coupon/CreateShare', {
				type: "POST",
				dataType: "json",
				params: param,
				success: function (res) {
					if (res.code == 200) {
						$('#excelUploadForm').submit();
					} else {
						STip("fail", res.msg, 3000);
					}
				}
			})

		}else{
			PFT.Util.Ajax('/r/product_Coupon/CreateShare', {
				type: "POST",
				dataType: "json",
				params: param,
				success: function (res) {
					if (res.code == 200) {
						STip("success", "保存成功!", 2000, function () {
							window.location.href = "marketing_share_list.html";
						});
					} else {
						STip("fail", res.msg, 3000);
					}
				}
			})
		}
		
	},
	changeCouponNumber:function(e){
		var tarBtn = $(e.currentTarget);
		tarBtn.attr("value",tarBtn.val());
	},
	changefile:function(e){
		var fileBtn = $(e.currentTarget);
		var val=fileBtn.val();
		var fileName = "";
	 	if(typeof(val) != "undefined")  
        {  
            fileName = val.split("\\").pop();  
            fileName = fileName.substring(0, fileName.lastIndexOf("."));  
            fileName += val.substr(val.indexOf("."));
        } 
        $('.fileuploadTextInp').val(fileName);
	}
})




$(function () {
	new Main();
})
