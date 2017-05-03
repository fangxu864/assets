
require("./index.scss");
//服务层
var GetPriceAndStorage = require("./service/getPriceAndStorage_Service.js");
var GetBookInfo = require("./service/getBookInfo_Service.js");
var GetCalendarPrice = require("./service/getCalendarPrice.js");
var GetShowInfo = require("./service/getShowInfo");//演出场次信息
var UpdateLinkman = require("./service/updateLinkman");
var GetLinkman = require("./service/getLinkman");//获取常用联系人信息
var GetHotelPrice = require("./service/getHotelPriceAndStorage");//获取酒店价格和库存
var PostSubmitOrder = require("./service/submitOrder");
//tpl
var placeTicket = require("./tpl/placeTicket.xtpl");
var contact = require("./tpl/addContact.xtpl");
var lineTpl = require("./tpl/lineMeetPlace.xtpl");
var payModeTpl = require("./tpl/payMode.xtpl");
var showTimeTpl = require("./tpl/showTime.xtpl");//演出时间
var linkmanList = require("./tpl/linkmanList.xtpl");
var visitInfoTpl = require("./tpl/VisitInfo.xtpl");
//组件模块
var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗
var Validate = require("COMMON/js/util.validate.js"); //验证
// var CalendarCore = require("COMMON/js/calendarCore.js");//用outputdate计算酒店几晚
// var Toast = require("COMMON/modules/Toast");
var Toast = require("./Toast/index");//改造后
var Parse = require("COMMON/js/util.url.parse.query");//解析url参数
//日历
var Calendar = require("./calendar/index.js");
//各个类型模块
var Land = require("./type/land/index.js");  //景区
var Hotel = require("./type/hotel/index.js"); //酒店
var Line = require("./type/line/index.js"); //线路
var Play = require("./type/play/index.js");//演出
var Food = require("./type/food/index.js");//餐饮

var Order_fill = PFT.Util.Class({

	container : $("#orderFill"),
	EVENTS : {
		"input #checkPhoneInput" : "validTel",//验证电话号码
		"input #checkIdInput" : "validIdCard",//验证身份证号码
		"click #saveContact" : "handleSaveContact",//保存联系人
		"click #checkContact" : "contactList",//常用联系人列表
		"click #visitorInformation" : "handleVisitInfo",//处理游客信息
		"click .addBtn":"addNum",  //加数字
		"click .delBtn":"delNum",  //减数字
		"input .numBox":"checkInput", //处理手动输入预定数量
		// "click #regularBtn":"regularToggle", //退票规则
		"click .submitOrder" : "submitOrder"//提交订单
	},
	init : function(){

		var id = this.getId();
		this.aid = id.aid;
		this.pid = id.pid;
		// this.type = id.type;
		if(this.aid == undefined ||this.pid == undefined ){
			console.log("缺少id参数");
		}

		this.toast = new Toast();//初始化toast
		this.toast2 = new Toast(); //用于酒店第一次获取价格和库存请求

		this.ticketTemplate = PFT.Util.ParseTemplate(placeTicket);

		this.getBookInfo(); //根据不同类型分辨

		//防止返回时残留上次input内容的bug
		$("#contact").val("");
		$("#checkPhoneInput").val("");
		$("#payMode").val("");


		// 更改页面标题
		document.title = '订单填写';
	},
	//处理顶端提示
	handleTips : function(res){
		var that = this ;
		//有效时间
		var validType = res.validType;
		var validTime = res.validTime;  //在服务层已处理
		//验证时间
		var verifyTime = res.verifyTime;
		//分批验证
		var batchCheck = res.batch_check; // 是否分批验证 0不分批 1分批
		var batchDay = res.batch_day; // 分批验证一天N张 0不限
		//退票
		var refundRule = res.refund_rule;//2不可退，1游玩日期前可退，0有效期前可退
		var refundRuleText = res.refund_rule_text;
		//退房扣费
		var reb = res.reb;
		var rebType = res.reb_type;
		var cancelCost = res.cancel_cost;

		//有效时间
		if( validTime == "" ){
			$("#validTime").css("display","none");
		}else{
			$("#validTime").text(validTime);
		}
		//验证时间
		if( verifyTime == "" ){
			$("#verifyTime").css("display","none");
		}else{
			$("#verifyTime").text(verifyTime);
		}
		//分批验证
		if(batchCheck == "0"){
			$("#batchText").css("display","none");
		}else if( batchCheck == "1" ){
			if(batchDay == "0"){ //不限
				$("#batchText").text("本次提交的订单，每日不限验证张数");
			}else{
				$("#batchText").text(batchDay);
			}
		}
		//退票
		if(refundRule == "2"){//不可退
			$("#topTips").append('<span class="tips" >退票:不可退</span>');
			// $("#refund.green").text("退票：不可退");
			// $("#regular").css("display","none");   //退票规则隐藏
		}else{
			$("#topTips").append('<p id="refundRule" class="tips" >'+ refundRuleText +'</p>');
			$("#topTips").append('<span class="tips" id="regularBtn">退票规则</span>');
			// 为退票规则绑定事件弹出下拉框

			var rebHtml = "";
			// if( cancelCost.length == 0 ){  //不为阶梯退票
				if(rebType == 1){//元
					rebHtml += '<p class="gray">基础手续费为' + reb/100 + '元</p>' ;
				}else if(rebType == 0){//百分比
					rebHtml += '<p class="gray">基础手续费为票价的'+reb+'%</p>' ;
				}
				// $("#regular").append(rebHtml);

			// }else{ //为阶梯退票

				for( var j=0;j<cancelCost.length;j++){
					var omin = cancelCost[j].c_days;
					var day = omin/(60*24);
					var leave1 = omin%(60*24);
					var hour = leave1/60;
					var min = leave1%60;
					var date = parseInt(day) + '天' + parseInt(hour) + '小时' + min + '分钟';
					cancelCost[j].c_days = date;
				}
				for( var i = 0;i<cancelCost.length;i++){
					if( cancelCost[i].c_type == "0"){//固定金额
						rebHtml += '<p class="gray">游玩日期前'+ cancelCost[i].c_days +'以内退票，手续费为'+parseInt(cancelCost[i].c_cost)/100+'元</p>' ;
					}else if(cancelCost[i].c_type == "1"){//百分比
						rebHtml += '<p class="gray">游玩日期前'+ cancelCost[i].c_days +'以内退票，手续费为票价的'+ parseInt(cancelCost[i].c_cost)/100 +'%</p>' ;
					}
				}
				// $("#regular").append(rebHtml);
			// }

			that.refundBox =  new SheetCore({
				content : rebHtml,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件
				height : "auto",      //弹层占整个手机屏幕的高度
				yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
				noBtn : true,        //弹层底部是否显示取消按钮,格式同yesBtn
				zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
				EVENTS : {            //弹层上面绑定的所有事件放在这里
				}
			});
			that.refundBox.mask.on("click",function(){
				that.refundBox.close();
			});
			$("#regularBtn").on("click",function(){
				that.refundBox.show();
			});

		}

	},
	//提交订单
	submitOrder : function(e){
		e.preventDefault();
		var that = this;
		//防止跳转
		e.preventDefault();

		var token = PFT.Util.getToken();
		if(this.pid){
			var pid = this.pid;
		}
		if(this.aid){
			var aid = this.aid;
		}

		var Tlist = $("#ticketList .placeTicket");
		var link = new Object();
		for( var i = 0;i<Tlist.length;i++){
			if(Tlist.eq(i).attr("data-pid") == this.paramspid){ //this.paramspid为暂时用
				var mainT = Tlist.eq(i);
				var tnum = Tlist.eq(i).find(".right .numBox").val();   //获得主票的数量
			}else{
				var relatedT = Tlist.eq(i);
				var apid = relatedT.attr("data-pid");
				var tlist = this.ticketList;
				for( var x = 0;x<tlist.length;x++){
					if(tlist[i].pid == apid){
						var relatedTval = relatedT.find(".right .numBox").val()
						if(parseInt(relatedTval) < parseInt(tlist[i].buy_low) && parseInt(relatedTval) != 0){
							PFT.Mobile.Alert(tlist[i].title + "购买数量不能低于" + tlist[i].buy_low );
							return false
						}
					}
				}

				link[apid] = relatedT.find(".right .numBox").val();
			}
		}

		if(this.selectedDay){
			var begintime = this.selectedDay;
		}
		//手机号
		if( $("#checkPhoneInput").val() != "" && $(".checkPhone").attr("data-valid") == "true"){
			var contacttel = $("#checkPhoneInput").val();
		}else{
			PFT.Mobile.Alert("手机号格式错误");
			return false
		}
		//联系人名
		if($("#contact").val() != ""){
			var ordername = $("#contact").val();
		}else{
			PFT.Mobile.Alert("请填写联系人");
			return false
		}

		if($("#payMode").attr("data-way")){
			var paymode = $("#payMode").attr("data-way");
		}else{
			PFT.Mobile.Alert("请选择付款方式");
			return false
		}

		//身份证
		var sfz = $("#checkIdInput").val();
		var idcardValid = $("#checkIdCard").attr("data-valid");

		if($("#checkIdInput").css("display") == "none" || $("#idCardBox").css("display") == "none" ){
			sfz = "";
		}else if(sfz == "" && idcardValid == "false"){
			PFT.Mobile.Alert("请填写身份证");
		}else if(sfz != "" && idcardValid == "false"){
			PFT.Mobile.Alert("身份证格式错误，请核对");
		}else if(idcardValid == "true"){
			sfz = sfz;
		}

		//多个联系人的情况
		if( $("#visitorInformation").css("display") == "block" ){

			if( that.visitInfoBox == undefined){
				PFT.Mobile.Alert("请将联系人填写完整");
				return false
			}

			var item = $(".visitInfoItem");
			var idcards = [];
			var tourists = [];

			for( var n = 0;n<item.length;n++){

				var visitName = item.eq(n).find(".visit").val();
				var idcardVal = item.eq(n).find(".idCard").val();

				if( visitName == "" || idcardVal == ""){
					PFT.Mobile.Alert("请将联系人填写完整");
					return false
				}else{
					tourists.push(visitName);
					idcards.push(idcardVal);
				}

			}
		}

		//演出的id
		zoneid = this.zone_id;
		roundid = this.round_id;
		venusid = this.venus_id;

		if( this.type == "H" && roundid == undefined && venusid == undefined){
			PFT.Mobile.Alert("请选择场次时间");
			return false
		}

		//酒店情况
		if(this.type == "C"){
			var begintime = this.beginDate ;
			var endtime = this.endDate ;
		}

		//线路集合地点
		if($("#meetPlace").length != 0 ){
			var assembly = parseInt($("#meetPlace").attr("value"));
		}

		var params = {
            token : token,
            pid : pid,
            aid : aid,
            tnum : tnum,
            begintime : begintime, //游玩日期
			endtime : endtime,
            contacttel : contacttel,
            ordername : ordername,
            paymode : paymode,
			sfz : sfz, //单个身份证 //string
            idcards : idcards, //游客身份证号 //可选 //array
            tourists : tourists, //游客姓名(联系人姓名)  //可选 //array
			zoneid : zoneid, //分区ID 演出必填
			roundid : roundid, //场次ID 演出必填
			venusid : venusid, //场馆ID 演出必填
            link : link, //联票数组 //可选 ['pid' => num,..]
			assembly : assembly
        }


		PostSubmitOrder(params,{

			loading:function () {
				that.toast.show("loading");
			},
			success:function (res) {

				//提交订单成功
				PFT.Mobile.Alert("提交订单成功");

				var host = window.location.host;
				host = host.split(".");

				var ordernum = res.ordernum;
				// var ordernum = "4003823";//写死的

				var ctx = (PFT.Util.UrlParse()).ctx;

				var url = "http://wx."+ host[1] + host[2] +"/html/order_pay_b.html?h="+host[0]+"&"+"ordernum="+ordernum + "&ctx=" + ctx;

				//跳转支付页面
				// setTimeout(function(){
					window.location.href = url;
				// },2000)

			},
			complete:function () {
				that.toast.hide();
			},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}

		})


	},

	//处理付款方式

	handlePayMode : function(res){

		var that = this;
		var selfSupply = res.selfSupply;
		var payNow = res.payNow;

		if(selfSupply == 0 && payNow == 0){//其他

			var payTemplate = PFT.Util.ParseTemplate(payModeTpl);
			var html = payTemplate();

			this.PayModeBox =  new SheetCore({
				content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件
				height : "auto",      //弹层占整个手机屏幕的高度
				yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
				noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn
				zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
				EVENTS : {            //弹层上面绑定的所有事件放在这里
					"click .payItem" : function(e){
						var item = $(e.target);
						var t = item.text();
						var way = item.attr("data-way");
						if(way){
							$("#payMode").val("付款方式: " + t).attr("data-way",way);
							that.PayModeBox.close();
						}
					},
					"click .icon-jiantou" : function(){
						that.PayModeBox.close();
					}
				}
			});

			this.PayModeBox.mask.on("click",function(){
				that.PayModeBox.close();
			});
			$("#payMode").on("click",function(){
				that.PayModeBox.show();
			});

		}else if( payNow == 1 ){  //现场
			$("#payMode").val("付款方式: 现场支付").attr("data-way","4");
			$("#payMode").attr("disabled","true");
		}else if( selfSupply == 1 ){  //自供应产品
			$("#payMode").val("付款方式: 预定自供产品，无需支付").attr("data-way","3");
			$("#payMode").attr("disabled","true");
		}

	},

	//验证电话号码
	validTel : function(){
		var val = $("#checkPhoneInput").val();
		var resu = Validate.typePhone(val);
		if(resu == true){
			$(".checkPhone").text("手机号位数正确").css("color","#0797d9");
			$(".checkPhone").attr("data-valid",true);
		}else{
			$(".checkPhone").text("手机号位数错误，请核对！").css("color","#e11d2c");
			$(".checkPhone").attr("data-valid",false);
		}
	},
	//验证身份证
	validIdCard : function(){
		var val = $("#checkIdInput").val();
		var resu = Validate.idcard(val);
		if( resu == true){
			$("#checkIdCard").text("身份证格式正确").css("color","#0797d9");
			$("#checkIdCard").attr("data-valid",true);
		}else{
			$("#checkIdCard").text("身份证格式错误，请核对").css("color","#e11d2c");
			$("#checkIdCard").attr("data-valid",false);
		}
	},

	//保存联系人
	handleSaveContact : function(){


		var that = this;

		var ordername = $("#contact").val();
		var ordertel = $("#checkPhoneInput").val();

		if( ordername == ""){
			PFT.Mobile.Alert("未填写联系人");
			return false
		}
		if( ordertel == ""){
			PFT.Mobile.Alert("未填写手机号");
			return false
		}else if(  $("#checkPhone").attr("data-valid") == "false" ){
			PFT.Mobile.Alert("手机号位数错误，请核对！");
			return false
		}
		var params = {
			token : PFT.Util.getToken(),
			ordername : ordername,
			ordertel : ordertel,
			type : "add"
		}
		UpdateLinkman(params,{
			loading:function () {
				that.toast.show("loading");
			},
			success:function (res) {
				if( res.code == 200 || res.code == 201){
					PFT.Mobile.Alert(res.msg);
					that.toast.hide();
				}else if(res.code == 207){
					window.location.href = data.url;
					// var para = that.getpara();
					// window.location.href = "login.html" + para ;
				}
			},
			complete:function () {
				that.toast.hide();
			},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});

	},

	//常用联系人列表
	contactList : function(){


		var that = this;

		var params = {
			token : PFT.Util.getToken()
		}
		GetLinkman(params,{
			loading:function () {
				that.toast.show("loading");
			},
			success:function (res) {
				var code = res.code;
				var msg = res.msg;
				if( code == 201){
					that.toast.hide();
					PFT.Mobile.Alert(msg);
					return false
				}else if(code == 207){
					window.location.href = data.url;
					// var para = that.getpara();
					// window.location.href = "login.html" + para ;
				}
				var list = res.data.info;
				that.toast.hide();
				handleLinkmanList(list);
			},
			complete:function () {
				that.toast.hide();
			},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});

		function handleLinkmanList(list){

			if(that.linkManBox){
				var con = $("#LinkmanCon");
				var listHtml = "";

				for( var i = 0;i<list.length;i++){
			    listHtml += '<div class="LinkmanItem">' +
								'<div class="LinkmanName">'+list[i].name+'</div>' +
								'<div class="LinkmanTel" data-IDcard="'+list[i].idcard+'">'+list[i].tel+'</div>' +
								'<i class="icon icon-u-regular icon-yaojiucuo"></i>' +
							'</div>';
				}

				con.html(listHtml);
				that.linkManBox.show();
			}else{
				var data = {};
				data.list = list;
				var listTemplate = PFT.Util.ParseTemplate(linkmanList);
				var html = listTemplate(data);
				that.linkManBox =  new SheetCore({
					content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件
					height : "auto",      //弹层占整个手机屏幕的高度
					yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
					noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn
					zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
					EVENTS : {            //弹层上面绑定的所有事件放在这里
						"click .icon-jiantou" : function(){
							that.linkManBox.close();
						},
						"click .LinkmanItem" : function(e){
							var item = $(e.target);
							if(item[0].tagName == "I"){ //删除按钮
								return false
							}
							if(item[0].className != "LinkmanItem"){
								item = item.parent();
							}
							var name = item.find(".LinkmanName").text();
							var tel = item.find(".LinkmanTel").text();
							$("#contact").val(name);
							$("#checkPhoneInput").val(tel);
							that.validTel();//验证号码
							that.linkManBox.close();
						},
						"click .icon-yaojiucuo" : function(e){
							var item = $(e.target);
							var p = item.parent();
							p.css("display","none");
							delContactMan(p);//删除联系人
						}
					}
				});
				that.linkManBox.mask.on("click",function(){
					that.linkManBox.close();
				});
				that.linkManBox.show();

			}


			function delContactMan(item){

				var name = item.find(".LinkmanName").text();
				var tel = item.find(".LinkmanTel").text();
				var idcard = item.find(".LinkmanTel").attr("data-idcard");
				var params = {
					token : PFT.Util.getToken(),
					ordername : name,
					ordertel : tel,
					idcard : idcard,
					type : "del"
				}
				UpdateLinkman(params,{
					loading:function () {
						that.toast.show("loading");
					},
					success:function (res) {
						if( res.code == 200 || res.code == 201){
							PFT.Mobile.Alert(res.msg);
							that.toast.hide();
						}else if(res.code == 207){
							window.location.href = data.url;
							// var para = that.getpara();
							// window.location.href = "login.html" + para ;
						}
					},
					complete:function () {
						that.toast.hide();
					},
					fail : function(msg){
						PFT.Mobile.Alert(msg);
					}
				});

			}
		}

	},

	//处理游客信息 //多个身份证的情况
	handleVisitInfo : function(){

		var that = this;

		var list = this.ticketList;
		var tlist = $("#ticketList .placeTicket");
		for( var i =0;i<list.length;i++){
			list[i].num = tlist.eq(i).find(".numBox").val();
			list[i].Ttitle = tlist.eq(i).find(".ticketName").text();
		}
		var data = {};
		data.list = list;
		var visitInfoTemplate = PFT.Util.ParseTemplate(visitInfoTpl);
		var html = visitInfoTemplate(data);

		var sum = 0;
		$("#ticketList li.placeTicket").each(function (index,element) {
			var num = parseInt(($(element).find(".numBox").val()));
			sum += num;
		});

		if(!this.numBoxValFlag){
			this.numBoxValFlag = sum;
		}else{
			if(this.numBoxValFlag == sum){  //票数没有变动并且再次打开的情况下
				this.visitInfoBox.show();
				return false
			}else{
				this.numBoxValFlag = sum;
			}
		}

		if(this.visitInfoBox){

			//需要动态生成list
			var html = "";
			for( var i = 0;i<list.length;i++){

         html += '<div class="ticketGroup">'+
                    '<span class="ticketName">'+list[i].Ttitle+'</span>'+
                    '<ul>';

                        for( var j = 0;j<parseInt(list[i].num);j++){
							var y = j+1;
                     html += '<li class="visitInfoItem">'+
                                '<input type="text" class="visit" placeholder="联系人'+y+'">'+
                                '<input type="text" class="idCard" placeholder="身份证">'+
                            '</li>';
                        }
            html += '</ul>'+
                '</div>';

            }
			$(".ticketGroupList").html(html);
			this.visitInfoBox.show();

		}else{

			this.visitInfoBox = new SheetCore({
				content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件
				height : "100%",      //弹层占整个手机屏幕的高度
				yesBtn : function(){

					//计算已编辑
					var list = $("#visitInfo .visitInfoItem");
					var count = 0;
					for( var i = 0;i<list.length;i++){
						var item = list.eq(i);
						var visit = item.find(".visit").val();
						var idCard = item.find(".idCard").val();
						if(visit != "" && idCard != ""){
							count += 1;
						}

					}
					var info = $("#visitorInformation").val();
					var orNum = info.split("/");
					orNum = orNum[1];
					$("#visitorInformation").val("*游客信息 已编辑" + count + "/" + orNum);

				},       //弹层底部是否显示确定按钮,为false时不显示
				noBtn : function(){
				},        //弹层底部是否显示取消按钮,格式同yesBtn
				zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
				EVENTS : {            //弹层上面绑定的所有事件放在这里

				}
			});

			this.visitInfoBox.show();

			this.visitInfoBox.mask.on("click",function(){
				that.visitInfoBox.close();
			});

		}

	},
	//获取id与type
	getId : function(){

		var url = window.location.href;
		var index = url.indexOf("?");

		if( index > 0 ){
			var ids = url.split("?");
			var id = ids[1].split("&");
			var aid = id[0].split("=");
			var pid = id[1].split("=");
			// var type = id[2].split("=");
			return {
				aid : aid[1],
				pid : pid[1],
				// type : type[1]
			}
		}else{
			return false
		}

	},
	//获取当天的日期
	getNowDate : function(){

		var date=new Date;
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		// month =(month<10 ? "0"+month:month);
		var day = date.getDate();

		var dateGroup = {
			year : year,
			month : month,
			day : day,
			nowDate : (year.toString()+'-'+month.toString())
		}

		return dateGroup;

	},

	getBookInfo : function () {

		// $("#ticketList li").each(function (index,value) {
			// var id = $(value).attr("data-id");

			var that = this;

			var params = {
				token : PFT.Util.getToken(),
				aid : this.aid,
				pid : this.pid
			};

			this.paramspid = params.pid;//在支付时用的pid

			GetBookInfo(params,{
				loading:function () {
					that.toast.show("loading");
				},
				success:function (res) {

					that.toast.hide();

					that.handleTips(res);//处理有效期退票等信息

					that.handleBookInfo(res);

					that.handlePayMode(res);

				},
				complete:function () {
					that.toast.hide();
				},
				fail : function(msg){
					PFT.Mobile.Alert(msg);
				}
			})

		// });
	},

	//处理基础信息
	handleBookInfo : function(res){

		var ticketList = res.tickets;
		if(ticketList.length == 0){
			PFT.Mobile.Alert("暂无产品");
			pids = this.pid;
			// $("#ticketList").html(' <li class="placeTicket noproduct" style="height:60px;text-align:center;line-height:60px">暂无产品</li>');
			// $(".personalInformation").css("display","none");
			// return false
		}else{
			this.ticketList = ticketList;
			//获取pids
			var pids = "";
			for(var i = 0;i<ticketList.length;i++){

				if( i == 0){
					pids = ticketList[i].pid;
				}else{
					pids += "-" +ticketList[i].pid  ;
				}

			}

			this.ddays = res.tickets[0].ddays;  //提前购票天数

		}
		$("#placeText").text(res.title);

		if(ticketList.length != 0){
			this.zone_id = ticketList[0].zone_id; //演出的分区ID
		}


		this.type = res.p_type;
		var type = this.type;

		// A:景区,B:线路,F:套票,H:演出,C:酒店
		// G:餐饮

		var parent = $(".topInputGroup");

		//根据type不同分别判断显示Input
		if(type == "A" || type == "F"){  //景区  //套票
			this.InputGroup = Land(parent,this.aid,this.pid,this.ddays);
			this.selectedDay = this.InputGroup.calendar.selectedDay;//初始化日期
			this.renderTicketList(ticketList);
			this.handleLand(pids);
		}
		if(type == "C"){ //酒店
			this.InputGroup = Hotel(parent,this.aid,this.pid,this.ddays);
			this.renderTicketList(ticketList);
			this.handleHotel();
		}
		if(type == "B"){ //线路
			this.InputGroup = Line(parent,this.aid,this.pid,this.ddays);
			this.selectedDay = this.InputGroup.calendar.selectedDay;//初始化日期
			this.renderTicketList(ticketList);
			if(res.assStation){
				var staList = res.assStation;
			}
			this.handleLine(pids,staList);
		}
		if(type == "H"){ //演出
			this.InputGroup = Play(parent,this.aid,this.pid,this.ddays);
			this.selectedDay = this.InputGroup.calendar.selectedDay;//初始化日期
			this.renderTicketList(ticketList);
			this.handlePlay(pids);
		}
		if(type == "G"){ //餐饮
			this.InputGroup = Food(parent,this.aid,this.pid,this.ddays);
			this.selectedDay = this.InputGroup.calendar.selectedDay;//初始化日期
			this.renderTicketList(ticketList);
			this.handleFood(pids);
		}

		//needID//是否需要输入身份证
		this.needID = res.needID;

		if( this.needID == "0"){  //不需要
			$("#idCardBox").css("display","none");
			$("#visitorInformation").css("display","none");
		}else if(this.needID == "1"){  //需要填一个
			$("#visitorInformation").css("display","none");
		}else if(this.needID == "2"){  //需要填多个
			$("#idCardBox #checkIdInput").css("display","none");
			$("#idCardBox #checkIdCard").css("display","none");
			var sum = 0;
			$(".numBox").each(function(i,item){
				sum += parseInt(item.value);
			});
			$("#visitorInformation").val("*游客信息 "+"已编辑0/"+sum);
		}

	},
	//处理演出
	handlePlay : function(pids){
		var that = this;
		//获得日历
		this.calendar = this.InputGroup.calendar;
		// 发布订阅
		this.calendar.on("next",function(){
		});
		this.calendar.on("prev",function(){
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay;
			$("#showDateInput").val("*演出日期 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
			that.getShowInfo(selectedDay,true);
		});

		//第一次获取价格和库存
		that.getPriceAndStorage(that.selectedDay,pids);
		that.getShowInfo(that.selectedDay,true);
		$("#playTimeInput").on("click",function(){
			if(that.showTimeBox){
				that.showTimeBox.show();
			}else{
				that.getShowInfo(that.selectedDay,true); //第一次
			}
		});

	},
	//演出场次信息
	getShowInfo : function(selectedDay,first){
		var that = this;
		var params = {
			token : PFT.Util.getToken(),
			date : selectedDay,
			aid : this.aid,
			pid : this.pid
		}
		GetShowInfo(params,{
			loading:function(){
				that.toast.show("loading");
			},
			success:function(res){
				that.toast.hide();
				that.handleShowInfo(res,first);
			},
			complete:function(){
				that.toast.hide();
			},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
				$("#playTimeInput").val("");
				that.venus_id = undefined;
				that.round_id = undefined;//id
				that.showTimeBox = null ;
				$(".storage .num").text("0");
			}
		});
	},
	//处理演出场次信息
	handleShowInfo : function(res,first){
		var that = this;

		if(this.showTimeBox){
			var list = res;
			var html = "";
			for( var i = 0;i<list.length;i++){
				html += '<div class="showItem" data-num="'+i+'" data-venus_id="'+list[i].venus_id+'" data-round_id="'+list[i].id+'">'+ list[i].round_name + " " +list[i].bt + '-' + list[i].et +'</div>';
			}
			that.handleShowStorage(res,0);
			$("#showCon").html(html);
		}else{
			var data = {};
			data.list = res;
			var showTemplate = PFT.Util.ParseTemplate(showTimeTpl);
			var html = showTemplate(data);
			this.showTimeBox =  new SheetCore({
				content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件
				height : "auto",      //弹层占整个手机屏幕的高度
				yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
				noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn
				zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
				EVENTS : {            //弹层上面绑定的所有事件放在这里
					"click .icon-jiantou" : function(){
						that.showTimeBox.close();
					},
					"click .showItem" : function(e){
						var item = $(e.target);

						that.venus_id = item.attr("data-venus_id");//场馆id
						that.round_id = item.attr("data-round_id");//场次id

						var t = item.text();
						$("#playTimeInput").val(t);
						var num = item.attr("data-num");
						that.handleShowStorage(res,num);
						that.showTimeBox.close();
					}
				}
			});
			this.showTimeBox.mask.on("click",function(){
				that.showTimeBox.close();
			});

			if(first == true){ //初始
				// that.showTimeBox.show();
				$("#playTimeInput").val(res[0].round_name + " " +res[0].bt + '-' + res[0].et);
				that.venus_id = res[0].venus_id;
				that.round_id = res[0].id;//id
				this.handleShowStorage(res,0);
			}

		}

	},
	//处理演出库存
	handleShowStorage : function(res,num){
		var area_storage = res[num].area_storage;
		var tList = $("li.placeTicket");
		for( var i in area_storage){
			for( var j = 0;j<tList.length;j++){
				var nowZoneId = tList.eq(j).attr("zone-id");
				if( nowZoneId == "0" ){
					tList.eq(j).find(".num").text("无限");
				}
				if(nowZoneId == i && nowZoneId != "0"){
					tList.eq(j).find(".num").text(area_storage[i]);
				}
			}
		}
	},
	//处理线路
	handleLine : function(pids,list){

		var that = this;

		//获得日历
		this.calendar = this.InputGroup.calendar;
		// 发布订阅
		this.calendar.on("next",function(){
		});
		this.calendar.on("prev",function(){
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay;
			$("#meetDate").val("*集合日期 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
		});
		//第一次获取价格和库存
		that.getPriceAndStorage(that.selectedDay,pids);
		$("#meetPlace").val("*集合地点 "+list[0]).attr("value","0");
		//集合地点弹窗
		var data = {};
		data.list = list;
		var lineTemplate = PFT.Util.ParseTemplate(lineTpl);
		var html = lineTemplate(data);
		this.lineBox =  new SheetCore({
			content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件
			height : "auto",      //弹层占整个手机屏幕的高度
			yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
			noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn
			zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
			EVENTS : {            //弹层上面绑定的所有事件放在这里
				"click .icon-jiantou" : function(){
					that.lineBox.close();
				},
				"click .linePlItem" : function(e){
					var item = $(e.target);
					var t = item.text();
					var value = item.attr("value");
					$("#meetPlace").val("*集合地点 "+t).attr("value",value);
					that.lineBox.close();
				}
			}
		});
		this.lineBox.mask.on("click",function(){
			that.lineBox.close();
		});
		$("#meetPlace").on("click",function(){
			that.lineBox.show();
		});

	},
	//处理景区
	handleLand : function(pids){

		var that = this;

		//获得日历
		this.calendar = this.InputGroup.calendar;
		// 发布订阅
		this.calendar.on("next",function(){
		});
		this.calendar.on("prev",function(){
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay;
			$("#playDate").val("*游玩日期 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
		});
		//第一次获取价格和库存
		that.getPriceAndStorage(that.selectedDay,pids);

	},
	//处理餐饮
	handleFood : function(pids){

		var that = this;

		//获得日历
		this.calendar = this.InputGroup.calendar;
		// 发布订阅
		this.calendar.on("next",function(){
		});
		this.calendar.on("prev",function(){
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay;
			$("#mealDateInput").val("*用餐时间 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
		});
		//第一次获取价格和库存
		that.getPriceAndStorage(that.selectedDay,pids);

	},

	handleHotel : function(){

		var that = this;

		$(".topInputGroup").addClass("hotel");

		//获得日历
		this.calendar1 = this.InputGroup.calendar1;
		this.calendar2 = this.InputGroup.calendar2;
		//入住
		this.calendar1.on("next",function(){
		});
		this.calendar1.on("prev",function(){
		});
		this.calendar1.on("daySelect",function(){
			var selectedDay = that.calendar1.selectedDay;
			that.selectedDay = selectedDay;
			that.hotelDateChange(1,selectedDay);
		});
		//离店
		this.calendar2.on("next",function(){
		});
		this.calendar2.on("prev",function(){
		});
		this.calendar2.on("daySelect",function(){
			var selectedDay = that.calendar2.selectedDay;
			that.hotelDateChange(2,selectedDay);
		});

		//第一次不发请求设置默认值
		$(".price").find(".orange.money").text("0");
		$(".storage").find(".num").text("0");
		$(".numBox").val("0");

		//第一次获取当日的结算价和库存
		//第一次不用？
		// var params = {
		// 	token : PFT.Util.getToken(),
        //     beginDate : this.calendar1.selectedDay,
        //     endDate : this.calendar2.selectedDay,
        //     aid : this.aid,
        //     pid : this.pid
		// }
		// this.cityReq = GetHotelPrice(params,{
		// 	loading:function(){
		// 		that.toast2.show("loading");
		// 	},
		// 	success:function(res){
		// 		$(".price").find(".orange.money").text(res.jsprice);
		// 		$(".storage").find(".num").text(res.minStore);
		// 		$("#totalMoney").text(res.jsprice);
		// 	},
		// 	complete:function(){
		// 		that.toast2.hide();
		// 	},
		// 	fail : function(msg){
		// 		PFT.Mobile.Alert(msg);
		// 	}
		// });


	},

	renderTicketList : function(list){
		var that = this;
		var data = {};
		data.list = list;
		var ticketsHtml = this.ticketTemplate(data);
		$("#ticketList").html(ticketsHtml);

		//生成子票(套票only)
		for(var i = 0;i<list.length;i++){
			if(list[i].sonTickets){
				var pList = $(".placeTicket");
				var sonT = pList.eq(i).find(".ticketSon");
				var sonHtml = "";
				for(var j = 0;j<list[i].sonTickets.length;j++){
					if( j == list[i].sonTickets.length - 1){
						sonHtml += list[i].sonTickets[j].title + list[i].sonTickets[j].num + "张";
					}else{
						sonHtml += list[i].sonTickets[j].title + list[i].sonTickets[j].num + "张 + ";
					}
				}
				sonT.append(sonHtml);
			}
		}
		//演出的情况要加zone_id
		if(list[0].zone_id){
			var ticketList = $("li.placeTicket");
			for(var j = 0;j<list.length;j++){
				ticketList.eq(j).attr("zone-id",list[j].zone_id);
			}
		}

	},

	getPriceAndStorage : function(selectedDay,pids){

		var that = this;

		var params = {
			token : PFT.Util.getToken(),
			aid : this.aid,
			date : selectedDay,
			pids : pids
		};

		GetPriceAndStorage(params,{
			loading:function () {
				that.toast.show("loading");
			},
			success:function (res) {
				that.toast.hide();
				that.handlePriceAndStorage(res);
			},
			complete:function () {
				that.toast.hide();
			},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});

	},


	handlePriceAndStorage : function(res){

		var that = this;

		that.firstTotalSum = 0;

		var ticketList = $("#ticketList li.placeTicket");
		for(var i in res){
			renderPrice(i);
		}
		$("#totalMoney").text(that.firstTotalSum);
		function renderPrice(i){
			for( var j = 0;j<ticketList.length;j++){
				if( ticketList.eq(j).attr("data-pid") == i){
					var nowTicket = ticketList.eq(j);
					var num = parseInt(nowTicket.find(".numBox").val());
					var price = nowTicket.find(".price");
					var storage = nowTicket.find(".storage");
					var data = res[i];
					//初始化金额
					that.firstTotalSum += data.price*num;
					price.find(".money").text(data.price);
					if( data.store == -1 ){
						storage.find(".num").text("无限");
					}else{
						storage.find(".num").text(data.store);
					}
				}
			}
		}
	},

	//酒店数据变动
	hotelDateChange : function(flag,selectedDay){

		var that = this;
		//flag : 1为入店 2为离店

		var arr = selectedDay.split("-");
		var day = arr[2];
		var month = arr[1];
		var year = arr[0];

		if( flag == 1 ){

			var dateSelectText = month + "月" + day + "日";
			$(".inHotel .dateSelectDay").text(dateSelectText);
			$(".inHotel .dateSelectDay").attr("data-year",year).attr("data-month",month).attr("data-day",day);
			var weekText = "";
			if(this.calendar1.nowSelectWeek == 0){
				weekText = "日";
			}else if(this.calendar1.nowSelectWeek == 1){
				weekText = "一";
			}else if(this.calendar1.nowSelectWeek == 2){
				weekText = "二";
			}else if(this.calendar1.nowSelectWeek == 3){
				weekText = "三";
			}else if(this.calendar1.nowSelectWeek == 4){
				weekText = "四";
			}else if(this.calendar1.nowSelectWeek == 5){
				weekText = "五";
			}else if(this.calendar1.nowSelectWeek == 6){
				weekText = "六";
			}
			var tpl = '<span class="dateSelectWeek">周'+ weekText +'</span>';
			$(".inHotel .dateSelectDay").append(tpl);

		}else if( flag == 2 ){

			var dateSelectText = month + "月" + day + "日";
			$(".outHotel .dateSelectDay").text(dateSelectText);
			$(".outHotel .dateSelectDay").attr("data-year",year).attr("data-month",month).attr("data-day",day);
			var weekText = "";
			if(this.calendar2.nowSelectWeek == 0){
				weekText = "日";
			}else if(this.calendar2.nowSelectWeek == 1){
				weekText = "一";
			}else if(this.calendar2.nowSelectWeek == 2){
				weekText = "二";
			}else if(this.calendar2.nowSelectWeek == 3){
				weekText = "三";
			}else if(this.calendar2.nowSelectWeek == 4){
				weekText = "四";
			}else if(this.calendar2.nowSelectWeek == 5){
				weekText = "五";
			}else if(this.calendar2.nowSelectWeek == 6){
				weekText = "六";
			}
			var tpl = '<span class="dateSelectWeek">周'+ weekText +'</span>';
			$(".outHotel .dateSelectDay").append(tpl);

		}

		that.calculateNight();

	},
	//计算几晚
	calculateNight : function(){

		var that = this;

		var inYear = $(".inHotel .dateSelectDay").attr("data-year");
		var inMonth = $(".inHotel .dateSelectDay").attr("data-month");
		var inDay = $(".inHotel .dateSelectDay").attr("data-day");
		var outYear = $(".outHotel .dateSelectDay").attr("data-year");
		var outMonth = $(".outHotel .dateSelectDay").attr("data-month");
		var outDay = $(".outHotel .dateSelectDay").attr("data-day");

		var inDate = inYear + "-" + inMonth + "-" + inDay;
		var outDate = outYear + "-" + outMonth + "-" + outDay;

		var sign = "";//正负号标识

		if( parseInt(outYear) > parseInt(inYear)){
			sign = "+";
		}else if( parseInt(outYear) == parseInt(inYear)){
			if( parseInt(outMonth) > parseInt(inMonth) ){
				sign = "+";
			}else if(parseInt(outMonth) == parseInt(inMonth)){
				if( parseInt(outDay) > parseInt(inDay) ){
					sign = "+";
				}else if(parseInt(outDay) == parseInt(inDay)){
					PFT.Mobile.Alert("同一天");
					return false
				}else{
					sign = "-";
				}
			}else {
				sign = "-";
			}
		}else{
			sign = "-";
		}

		if(sign == "-"){
			PFT.Mobile.Alert("入住时间要在离店时间之前");
			return false
		}

		//两个日期之间相差几晚
		var nights = DateDiff(inDate,outDate);
		$(".hotelDay .hotelDayTag").text(nights + "晚");

		//处理两天之间是否有空的//太麻烦了，等后期再做
		// this.handleBetweenTwoDay(inYear,inDate,outDate,parseInt(inMonth),parseInt(outMonth),nights,parseInt(inDay));

		var params = {
			token : PFT.Util.getToken(),
            beginDate : inDate,
            endDate : outDate,
			// beginDate : "2017-02-21", //写死
            // endDate : "2017-02-21",//写死
            aid : this.aid,
            pid : this.pid
		}

		this.beginDate = inDate;
		this.endDate = outDate;

		GetHotelPrice(params,{
			loading:function(){
				that.toast.show("loading");
			},
			success:function(res){
				handleHotelRes(res);//处理res
				that.toast.hide();
			},
			complete:function(){
				that.toast.hide();
			},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});

		//计算天数差的函数
		function  DateDiff(sDate1,  sDate2){
			var  aDate,  oDate1,  oDate2,  iDays  ;
			aDate  =  sDate1.split("-")  ;
			oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
			aDate  =  sDate2.split("-")  ;
			oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
			iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);
			return  iDays
		}
		function handleHotelRes(res){
			//酒店只有一个票
			$(".price").find(".orange.money").text(res.jsprice);

			//库存
			if(res.minStore == "-1"){
				$(".storage").find(".num").text("无限");
				$(".addBtn").attr("active","true");
			}else{
				$(".storage").find(".num").text(res.minStore);
			}

			if( parseInt(res.minStore) > 0 ){

				var buyLow = $(".numBox").attr("data-buy_low");
				$(".numBox").val(buyLow);

				$(".addBtn").attr("active","true");

				var tMoney = parseFloat(res.jsprice) * parseFloat(buyLow);

				$("#totalMoney").text(tMoney);

			}



		}

	},
	//处理两天之间是否有空的//未完成
	handleBetweenTwoDay : function(inYear,inDate,outDate,inMonth,outMonth,nights,inDay){

		var list1 = this.calendar1.MonthList;
		var list2 = this.calendar2.MonthList;

		if( inMonth == outMonth){ //没有跨月份

			var list = this.calendar1.MonthList;

			inMonth = (parseInt(inMonth)<10 ? "0"+inMonth:inMonth);
			outMonth = (parseInt(outMonth)<10 ? "0"+outMonth:outMonth);

			for(var i = 0;i<=nights;i++){
				var date = inYear + "-" + inMonth + "-" + inDay;
				for( var j in list1){
					if( date == j ){
						console.log(j);
					}
				}
				inDay += 1;
			}


		}


	},

	//加
	addNum : function (e) {
		var storage = $(e.target).parent().parent().find(".left .num").text();
		var buyUp = $(e.target).attr("data-buy_up");
		if(buyUp == "0" || buyUp == "-1" ){
			buyUp = "无限";
		}
		if($(e.target).attr("active") == "true"){
			var num = parseInt($(e.target).parent().find(".numBox").val());
			if(num == storage || num == buyUp){
				$(e.target).attr("active","false")
				return false
			}
			if(isNaN(num)){
				num = 0;
			}
			if(num >= storage){
				$(e.target).attr("active",false)
				return false
			}else if(num >= 0){
				$(e.target).parent().find(".delBtn").attr("active",true)
			}
			num += 1;
			$(e.target).parent().find(".numBox").val(num);
			this.changeTotal();

		}else{
			return false
		}

	},

	//减
	delNum : function (e) {
		var storage = $(e.target).parent().parent().find(".left .num").text();
		var buyLow = $(e.target).attr("data-buy_low");
		var buyUp = $(e.target).parent().find(".numBox").attr("data-buy_up");
		buyLow = parseInt(buyLow);
		if($(e.target).attr("active") == "true"){
			var num = parseInt($(e.target).parent().find(".numBox").val());
			if(num == 0 || num == buyLow ){
				$(e.target).attr("active","false")
				return false
			}
			if(isNaN(num)){
				num = 1;
			}
			if(num <= 0){
				$(e.target).attr("active","false");
				return false
			}else if(num <= storage){
				$(e.target).parent().find(".addBtn").attr("active",true);
			}
			if(num <= buyUp){
				$(e.target).parent().find(".addBtn").attr("active",true);
			}
			num = num - 1;
			$(e.target).parent().find(".numBox").val(num);
			this.changeTotal();
		}else{
			return false
		}

	},
	//总金额
	changeTotal : function () {
		var sum = 0;
		$("#ticketList li").each(function (index,element) {
			var money = parseFloat(($(element).find(".money").text()));
			var num = parseInt(($(element).find(".numBox").val()));
			sum += money * num;
		});
		if(isNaN(sum)){
			sum = 0;
		}

		sum = parseInt(sum*100);
		sum = sum/100;
		$("#totalMoney").text(sum);

		//游客信息
		var tList = $("#ticketList .placeTicket");
		var num = 0;
		for(var i = 0;i<tList.length;i++){
			var numBox = tList.eq(i).find(".right .numBox");
			num += parseInt(numBox.val());
		}
		if(num >0){
			$("#visitorInformation").val("*游客信息 已编辑0/"+num);
		}


	},

	checkInput : function (e) {
		var input = ($(e.target).val());
		var storage = $(e.target).parent().parent().find(".left .num").text();
		var buyLow = $(e.target).parent().find(".delBtn").attr("data-buy_low");
		var buyUp = $(e.target).parent().find(".addBtn").attr("data-buy_up");
		if(!Validate.typeNum(input)) {
			PFT.Mobile.Alert("请输入正确的数值");
			($(e.target)).val(0);
		}else{
			if(parseInt(input) > parseInt(storage)){
				($(e.target)).val(storage);
				PFT.Mobile.Alert("最大库存为"+storage);
			}
			if(buyUp == "-1"){
				buyUp = "无限";
			}
			if(parseInt(input) > buyUp){
				($(e.target)).val(buyUp);
				PFT.Mobile.Alert("数量不能大于"+buyUp);
			}
			if(parseInt(input) < buyLow){
				($(e.target)).val(buyLow);
				PFT.Mobile.Alert("数量不能小于"+buyLow);
			}
			if(parseInt(input)>0 && parseInt(input)<parseInt(storage)){
				$(".delBtn").attr("active",true);
				$(".addBtn").attr("active",true);
			}
		}
		this.changeTotal();

		//变灰最小不能小于0，最大不能大于库存
		var storage = $(e.target).parent().parent().find(".left .num").text();
		var num = parseInt($(e.target).parent().find(".numBox").val());
		if(num == 0){
			$(e.target).parent().find(".delBtn").attr("active","false");
			$(e.target).parent().find(".addBtn").attr("active","true");
		}
		if(num == storage){
			$(e.target).parent().find(".addBtn").attr("active","false");
			$(e.target).parent().find(".delBtn").attr("active","true");
		}


	},

	regularToggle : function (e) {
		$("#regular").toggle();
	},

	getpara : function(){
		var url = window.location.href;
		var urlPara = Parse(url);
		var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;
		delete urlPara[fullHost]
		var url = "?";
		for( var i in urlPara){
			url += i +"=" + urlPara[i] + "&";
		}
		url = url.substring( 0 , url.length-1 );

		return url

	}


});


$(function(){
	new Order_fill();
});

