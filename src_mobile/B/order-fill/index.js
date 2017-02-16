
require("./index.scss");
//服务层
var GetPriceAndStorage = require("./service/getPriceAndStorage_Service.js");
var GetBookInfo = require("./service/getBookInfo_Service.js");
var GetCalendarPrice = require("./service/getCalendarPrice.js");
var GetShowInfo = require("./service/getShowInfo");//演出场次信息
var UpdateLinkman = require("./service/updateLinkman");
var GetLinkman = require("./service/getLinkman");//获取常用联系人信息
var GetHotelPrice = require("./service/getHotelPriceAndStorage");//获取酒店价格和库存
//tpl
var placeTicket = require("./tpl/placeTicket.xtpl");
var contact = require("./tpl/addContact.xtpl");
var lineTpl = require("./tpl/lineMeetPlace.xtpl");
var payModeTpl = require("./tpl/payMode.xtpl");
var showTimeTpl = require("./tpl/showTime.xtpl");//演出时间
var linkmanList = require("./tpl/linkmanList.xtpl");
//组件模块
var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗
var Validate = require("COMMON/js/util.validate.js"); //验证

// var Loading = require("COMMON/modules/loading-mobile");//弃用

var CalendarCore = require("COMMON/js/calendarCore.js");//用outputdate计算酒店几晚

var Toast = require("COMMON/modules/Toast");

// var Calendar = require("COMMON/modules/calendar"); //日历 //不是这个
// var When=require("COMMON/js/when.js");
// var when=new When();


//自己写日历
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
		// "click #playDate":"initCalendar", //自己做日历功能


		"input #checkPhoneInput" : "validTel",//验证电话号码
		"input #checkIdInput" : "validIdCard",//验证身份证号码
		"click #contact" : "handleContact",//处理联系人
		"click #saveContact" : "handleSaveContact",//保存联系人

		"click #checkContact" : "contactList",//常用联系人列表

		"click #visitorInformation" : "handleVisitInfo",//处理游客信息

		// "click #payMode" : "handlePayMode", //处理付款方式


		// "click #contact":"showContact",
		// "click #visitorInformation":"showVisitor",

		"click .addBtn":"addNum",  //加数字 
		"click .delBtn":"delNum",  //减数字

		"input .numBox":"checkInput", //处理手动输入预定数量
		"click #regularBtn":"regularToggle", //退票规则

		"click .submitOrder" : "submitOrder"//提交订单
		
	},

	init : function(){		

		var id = this.getId();
		this.aid = id.aid;
		this.pid = id.pid;
		this.type = id.type;
		if(this.aid == undefined ||this.pid == undefined ||this.type == undefined ){
			console.log("缺少id参数");	
		}

		this.toast = new Toast();//初始化toast

		this.ticketTemplate = PFT.Util.ParseTemplate(placeTicket);

		this.getBookInfo(); //根据不同类型分辨

		//处理付款方式
		this.handlePayMode();

	},
	//处理顶端提示
	handleTips : function(res){

		console.log(res);

		//有效时间
		var validType = res.validType;
		var validTime = res.validTime; //已经处理过了
		//验证时间
		var verifyTime = res.verifyTime;//已处理
		//分批验证
		var batchCheck = res.batch_check; // 是否分批验证 0不分批 1分批
		var batchDay = res.batch_day; // 分批验证一天N张 0不限
		//退票
		var refundRule = res.refund_rule;//2不可退，1游玩日期前可退，0有效期前可退
		var refundRuleText = res.refund_rule_text;
		//退房扣费
		var reb = res.reb;
		var rebType = res.reb_type;

		$("#validTime").text(validTime);//有效时间
		$("#verifyTime").text(verifyTime);//验证时间
		//分批验证
		if(batchDay == "0"){
			$("#batchText").css("display","none");
		}
		//退票
		if(refundRule == "2"){//不可退
			$("#refund.green").text("退票：不可退");
			$("#regular").css("display","none");
		}else{
			$("#refund.green").html('<span class="blue" id="regularBtn">退票规则∨</span>');			
			// refund_rule_text
			$("#regular").text(refundRuleText);
		}

	},
	//提交订单
	submitOrder : function(e){
		//防止跳转
		e.preventDefault();
		console.log("提交订单");

		var token = PFT.Util.getToken();
		if(this.pid){
			var pid = this.pid; 		
		}
		if(this.aid){
			var aid = this.aid; 		
		}

		// var tnum = //购票数量，好几种票怎么办

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

		console.log($("#payMode").attr("data-way"));

		if($("#payMode").attr("data-way")){
			var paymode = $("#payMode").attr("data-way");
		}else{
			PFT.Mobile.Alert("请选择付款方式");
			return false
		}



		var params = {
            token : token,
            pid : pid,
            aid : aid,
            // tnum : tnum,
            begintime : begintime, //游玩日期
            contacttel : contacttel,
            ordername : ordername,
            // paymode : paymode,
            // idcards : idcards, 
            // tourists : tourists,
            // link : link

        }




	},

	//处理付款方式

	handlePayMode : function(){

		var that = this;

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
					console.log(way);
					console.log(t);
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


	handleSaveContact : function(){

		console.log("保存联系人");

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
				}
			},
			complete:function () {},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});

	},

	//常用联系人列表
	contactList : function(){

		console.log("常用联系人列表");

		var that = this;

		var params = {
			token : PFT.Util.getToken()
		}
		GetLinkman(params,{
			loading:function () {
				that.toast.show("loading");
			},
			success:function (res) {
				var list = res.data.info;
				that.toast.hide();
				handleLinkmanList(list);
			},
			complete:function () {},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}
		});

		function handleLinkmanList(list){

			console.log(list);

			if(that.linkManBox){
				var con = $("#LinkmanCon");
				var listHtml = "";

				for( var i = 0;i<list.length;i++){
			    listHtml += '<div class="LinkmanItem">' + 
								'<div class="LinkmanName">'+list[i].name+'</div>' +
								'<div class="LinkmanTel">'+list[i].tel+'</div>' +
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
							console.log(item);
							var name = item.find(".LinkmanName").text();
							var tel = item.find(".LinkmanTel").text();
							console.log(name);
							console.log(tel);
							$("#contact").val(name);
							$("#checkPhoneInput").val(tel);
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
				console.log(item);

				var name = item.find(".LinkmanName").text();
				var tel = item.find(".LinkmanTel").text();
				var params = {
					token : PFT.Util.getToken(),
					ordername : name,
					ordertel : tel,
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
						}
					},
					complete:function () {},
					fail : function(msg){
						PFT.Mobile.Alert(msg);
					}
				});	

			}
		}

	},
	handleContact : function(){
		console.log("处理联系人");
	},
	handleVisitInfo : function(){
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
			var type = id[2].split("=");
			return {
				aid : aid[1],
				pid : pid[1],
				type : type[1]
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


		//用于日历加减月份	//如果不存在赋予今天的初始日期
		if(!this.nowYearFlag){
			this.nowYearFlag = parseInt(dateGroup.year);
		}
		if(!this.nowMonthFlag){
			this.nowMonthFlag = parseInt(dateGroup.month);
		}
		if(!this.nowDayFlag){
			this.nowDayFlag = parseInt(dateGroup.day);
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

			
			//2017/2/9
			//后端提供调试pid
			// 线路 = 57958, 58111
			// 酒店 = 26397, 26398
			// 演出 = 58004, 58114
			// 餐饮 = 57921, 58115
			// 套票 = 58105, 58107
			// 景区 = 25267, 26398

			// A:景区,B:线路,F:套票,H:演出,C:酒店
			// G:餐饮 //餐饮是后面加的

			// params.pid = 25267; //景区			
			// params.pid = 26397; //酒店
			// params.pid = 57958; //线路			
			// params.pid = 58004; //演出
			params.pid = 57921; //餐饮


			GetBookInfo(params,{
				loading:function () {
					that.toast.show("loading");
				},
				success:function (res) {

					that.toast.hide();

					that.handleTips(res);//处理有效期退票等信息							

					that.handleBookInfo(res);

					

				},
				complete:function () {},
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
			console.log("无票");
		}
		$("#placeText").text(res.title);
		//获取pids
		var pids = "";
		for(var i = 0;i<ticketList.length;i++){

			if( i == 0){
				pids = ticketList[i].pid;
			}else{
				pids += "-" +ticketList[i].pid  ;
			}
		}
		//needID//是否需要输入身份证
		var needID = res.needID;
		if( needID == "0"){
			$("#idCardBox").css("display","none");
		}else if(needID == "1"){
			$("#visitorInformation").css("display","none");
		}else if(needID == "2"){
			$("#idCardBox #checkIdInput").css("display","none");
			$("#idCardBox #checkIdCard").css("display","none");
		}

		var type = res.p_type;

		// A:景区,B:线路,F:套票,H:演出,C:酒店
		// G:餐饮 //餐饮是后面加的

		var parent = $(".topInputGroup");

		//根据type不同分别判断显示Input
		if(type == "A" || type == "F"){  //景区
			this.InputGroup = Land(parent,this.aid,this.pid);
			this.renderTicketList(ticketList); 
			this.handleLand(pids);
		} 		
		if(type == "C"){ //酒店
			this.InputGroup = Hotel(parent,this.aid,this.pid);
			this.renderTicketList(ticketList);
			this.handleHotel();
		}
		if(type == "B"){ //线路
			this.InputGroup = Line(parent,this.aid,this.pid);
			this.renderTicketList(ticketList);
			if(res.assStation){
				var staList = res.assStation; 
			}
			this.handleLine(pids,staList);
		}
		if(type == "H"){ //演出
			this.InputGroup = Play(parent,this.aid,this.pid);
			this.renderTicketList(ticketList);
			this.handlePlay(pids);
		}
		if(type == "G"){ //餐饮
			this.InputGroup = Food(parent,this.aid,this.pid);
			this.renderTicketList(ticketList);
			this.handleFood(pids);
		}

		

	},
	//处理演出
	handlePlay : function(pids){
		var that = this;
		//获得日历
		this.calendar = this.InputGroup.calendar;		
		// 发布订阅
		this.calendar.on("next",function(){
			console.log("点击了前进按钮");	
		});
		this.calendar.on("prev",function(){
			console.log("点击了后退按钮");	
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay; 
			$("#showDateInput").val("*演出日期 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
			that.getShowInfo(selectedDay);
		});	
		$("#playTimeInput").on("click",function(){
			if(that.showTimeBox){
				that.showTimeBox.show();
			}else{
				PFT.Mobile.Alert("请选择日期");
			}
		});

	},
	//演出场次信息
	getShowInfo : function(selectedDay){
		var that = this;
		console.log(selectedDay);
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
				that.handleShowInfo(res);
			},
			complete:function(){},
			fail : function(msg){
				PFT.Mobile.Alert(msg);				
			}
		});
	},
	//处理演出场次信息
	handleShowInfo : function(res){
		var that = this;

		if(this.showTimeBox){
			var list = res;
			var html = "";
			for( var i = 0;i<list.length;i++){
				html += '<div class="showItem">'+ list[i].round_name + " " +list[i].bt +'</div>';   
			}
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
						var t = item.text();
						$("#playTimeInput").val(t);
						that.showTimeBox.close();					
					}
				}
			});
			this.showTimeBox.mask.on("click",function(){
				that.showTimeBox.close();			
			});

		}


	},
	//处理线路
	handleLine : function(pids,list){

		var that = this;

		//获得日历
		this.calendar = this.InputGroup.calendar;		
		// 发布订阅
		this.calendar.on("next",function(){
			console.log("点击了前进按钮");	
		});
		this.calendar.on("prev",function(){
			console.log("点击了后退按钮");	
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay; 			
			console.log(selectedDay);
			$("#meetDate").val("*集合日期 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
		});	
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
					$("#meetPlace").val(t);
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
			console.log("点击了前进按钮");	
		});
		this.calendar.on("prev",function(){
			console.log("点击了后退按钮");	
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay; 			
			console.log(selectedDay);
			$("#playDate").val("*游玩日期 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
		});

	},	
	//处理餐饮
	handleFood : function(pids){

		var that = this;

		//获得日历
		this.calendar = this.InputGroup.calendar;		
		// 发布订阅
		this.calendar.on("next",function(){
			console.log("点击了前进按钮");	
		});
		this.calendar.on("prev",function(){
			console.log("点击了后退按钮");	
		});
		this.calendar.on("daySelect",function(){
			var selectedDay = that.calendar.selectedDay;
			that.selectedDay = selectedDay; 			
			$("#mealDateInput").val("*用餐时间 "+selectedDay);
			that.getPriceAndStorage(selectedDay,pids);
		});

	},

	handleHotel : function(){

		var that = this;

		//获得日历
		this.calendar1 = this.InputGroup.calendar1;		
		this.calendar2 = this.InputGroup.calendar2;					
		//入住
		this.calendar1.on("next",function(){
			console.log("点击了前进按钮1");	
		});
		this.calendar1.on("prev",function(){
			console.log("点击了后退按钮1");	
		});
		this.calendar1.on("daySelect",function(){
			var selectedDay = that.calendar1.selectedDay;
			that.selectedDay = selectedDay; 			
			that.hotelDateChange(1,selectedDay);
			// that.getPriceAndStorage(selectedDay,pids);
		});
		//离店
		this.calendar2.on("next",function(){
			console.log("点击了前进按钮2");	
		});
		this.calendar2.on("prev",function(){
			console.log("点击了后退按钮2");	
		});
		this.calendar2.on("daySelect",function(){
			var selectedDay = that.calendar2.selectedDay;
			that.hotelDateChange(2,selectedDay);				
			// that.getPriceAndStorage(selectedDay,pids);
		});


	},

	renderTicketList : function(list){
		var that = this;
		var data = {};
		data.list = list;
		var ticketsHtml = this.ticketTemplate(data);	
		$("#ticketList").html(ticketsHtml);
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
			complete:function () {},
			fail : function(msg){
				PFT.Mobile.Alert(msg);
			}			
		});	

	},


	handlePriceAndStorage : function(res){

		var ticketList = $("#ticketList li.placeTicket");
		for(var i in res){
			renderPrice(i);			
		}
		function renderPrice(i){
			var nowTicket = ticketList.attr("data-pid",i);
			var price = nowTicket.find(".price");
			var storage = nowTicket.find(".storage");
			var data = res[i];
			price.find(".money").text(data.price);
			storage.find(".num").text(data.store);
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
			console.log(this.calendar1);
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


		//跨月份太难了
		// this.handleBetweenTwoDay(inYear,inDate,outDate,parseInt(inMonth),parseInt(outMonth),nights,parseInt(inDay));

		var params = {
			token : PFT.Util.getToken(),
            beginDate : inDate,
            endDate : outDate,
            aid : this.aid,
            pid : this.pid
		}

		GetHotelPrice(params,{
			loading:function(){
				that.toast.show("loading");
			},
			success:function(res){
				console.log(res);
				handleHotelRes(res);//处理res
				that.toast.hide();
			},
			complete:function(){},
			fail : function(msg){
				PFT.Mobile.Alert(msg);				
			}	
		});

		//计算天数差的函数 
		function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
			var  aDate,  oDate1,  oDate2,  iDays  
			aDate  =  sDate1.split("-")  
			oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式  
			aDate  =  sDate2.split("-")  
			oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
			iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
			return  iDays  
		}   
		function handleHotelRes(res){
			//酒店只有一个票
			$(".price").find(".orange.money").text(res.jsprice);
			$(".storage").find(".num").text(res.minStore);
		}

	},
	//处理两天之间
	handleBetweenTwoDay : function(inYear,inDate,outDate,inMonth,outMonth,nights,inDay){

		console.log(inDate);
		console.log(outDate);
		console.log(nights);

		console.log("inMonth:"+inMonth);
		console.log("outMonth:"+outMonth);		

		console.log(inDay);//入住的天数

		console.log(this.calendar1.MonthList);
		console.log(this.calendar2.MonthList);

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









	//以下代码为多余*******************************************************************************************************************************************

	// initCalendar : function(){

	// 	var that = this;

	// 	var dateGroup = this.getNowDate();	
	// 	var nowDate = dateGroup.nowDate;

	// 	var allHtml = Calendar.init(nowDate);

	// 	var html = allHtml.html;
	// 	var listHtml = allHtml.listHtml;

	// 	if(this.CalendarBox){
	// 		this.CalendarBox.show();
	// 	}else{
	// 		this.CalendarBox =  new SheetCore({
				
	// 			content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件  

	// 			height : "auto",      //弹层占整个手机屏幕的高度
				
	// 			yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
				
	// 			noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn

	// 			zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
				
	// 			EVENTS : {            //弹层上面绑定的所有事件放在这里
	// 				"click .prev" : function(e){
	// 					//往前需要判断不能低于当前月份当天
	// 					that.changeCal("prev");
	// 				},
	// 				"click .next" : function(e){
	// 					that.changeCal("next");
	// 				},

	// 				"click .calConItem.column" : function(e){

	// 					var selectedDay = that.calDaySelect(e); //日历天数选择//返回被选中的天数

	// 					if(selectedDay != "disable"){
	// 						that.CalendarBox.close();
	// 					}
						
	// 					that.getPriceAndStorage(selectedDay);
	// 				}				
	// 			}
	// 		});
	// 		this.CalendarBox.mask.on("click",function(){
	// 			that.CalendarBox.close();			
	// 		});
	// 		this.CalendarBox.show();
	// 		this.getCalPrice();
	// 		$(".calContentCon").html(listHtml);
			
	// 	}
		

	// },


	// calDaySelect : function(e){
	// 	var target = $(e.target);
	// 	var tagName = target.attr("tagName");
	// 	if(tagName != "DIV"){
	// 		target = target.parent();
	// 		tagName = target.attr("tagName");
	// 		if(tagName != "DIV"){
	// 			target = target.parent();
	// 		}
	// 	}

	// 	if(target[0].className.indexOf("disable")>0){
	// 		return "disable"
	// 	}

	// 	target.addClass("select");
	// 	var nowTargetDate = target.find('.day').text();
	// 	var list = $(".calConItem.column");
	// 	for( var i = 0;i<list.length;i++){
	// 		var className = list[i].className;
	// 		if( className.indexOf("disable") < 0 ){//除去disable
				
	// 			var t = list.eq(i).find('.day').text();
	// 			if(t != nowTargetDate ){
	// 				list.eq(i).removeClass('select');
	// 			}
	// 		}
	// 	}

	// 	return nowTargetDate; //返回当前被选中的天数

	// },


	// changeCal : function(dir){

	// 	if(dir == "prev"){
	// 		if(this.nowMonthFlag > 1){
	// 			this.nowMonthFlag -= 1; 
	// 		}else{
	// 			this.nowMonthFlag = 12;
	// 			this.nowYearFlag -= 1;
	// 		}
	// 	}else if(dir == "next"){
	// 		if(this.nowMonthFlag < 12){
	// 			this.nowMonthFlag += 1; 
	// 		}else{
	// 			this.nowMonthFlag = 1;
	// 			this.nowYearFlag += 1;
	// 		}
	// 	}

	// 	var date = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString());

	// 	Calendar.change(date); //改变日历状态

	// 	this.getCalPrice("change");

	// },


	// getCalPrice : function(change){

	// 	var that = this;

	// 	if(change == "change"){   

	// 		var dateGroup = {};
	// 		console.log("change");

	// 		dateGroup.year = this.nowYearFlag;
	// 		dateGroup.month = this.nowMonthFlag;
	// 		dateGroup.day = 0;

	// 		var date = dateGroup.year + "-" + dateGroup.month;

	// 		var params = {
	// 			token : PFT.Util.getToken(),
	// 			aid : this.aid,
	// 			pid : this.pid,
	// 			date : date
	// 		};

	// 		console.log(dateGroup.year);
	// 		console.log(dateGroup.month);
	// 		console.log(dateGroup.day);


	// 	}else{

	// 		var dateGroup = this.getNowDate();
	// 		var day = dateGroup.day; 
	// 		var month = dateGroup.month; 
	// 		var year = dateGroup.year; 
	// 		var date = year.toString() + "-" + month.toString() + "-" + day.toString();
	// 		var params = {
	// 			token : PFT.Util.getToken(),
	// 			aid : this.aid,
	// 			pid : this.pid,
	// 			date : date
	// 		};
				

	// 	}


	// 	GetCalendarPrice(params,{
	// 		loading:function () {},
	// 		success:function (res) {

	// 			that.handleCalPrice(res,dateGroup);

	// 		},
	// 		complete:function () {}
	// 	});	
		

	// },	

	// handleCalPrice : function(res,dateGroup){

	// 	var PG = $("span.price");
	// 	for( var i in res){
	// 		for(var j = 0;j<PG.length;j++){
	// 			var data_day = PG.eq(j).attr("data-day");
	// 			dateGroup.month = parseInt(dateGroup.month);
	// 			dateGroup.month =(dateGroup.month<10 ? "0"+dateGroup.month:dateGroup.month);
	// 			var data_date = dateGroup.year+ "-" +dateGroup.month+ "-" +data_day;
	// 			if(data_date == i){
	// 				PG.eq(j).find("em").text(res[i]);
	// 			}
	// 		}
	// 	}		

	// 	var items = $(".calConItem.column"); 

	// 	for(var j = 0;j<items.length;j++){

	// 		if(items.eq(j).find('em').text() == ""){
	// 			items.eq(j).find('.yen').text("");
	// 			items.eq(j).addClass('disable');
	// 		}

	// 	}

		

	// 	var today = (dateGroup.day < 10&&dateGroup.day != 0 ? "0" + dateGroup.day : dateGroup.day); 	

	// 	var days = $(".calConItem.column .day");

	// 	if( dateGroup.day == 0 ){//日历改变月份
			
	// 		for( var n = 0 ; n<days.length ; n++){
	// 			var t = days.eq(n).text(); 
	// 			if( t == "01"){
	// 				var pItem = days.eq(n).parent();
	// 				pItem.addClass('select');
	// 			}
	// 		}	
				
	// 	}else{

	// 		for( var n = 0 ; n<days.length ; n++){
	// 			var t = days.eq(n).text(); 
	// 			if( t == today){
	// 				var pItem = days.eq(n).parent();
	// 				pItem.addClass('select');
	// 			}
	// 		}	

	// 	}


	// },


	// getPriceAndStorage : function (selectedDay) { //传入被选中的天数


	// 	if( selectedDay != "disable"){


	// 		var that = this;
	// 		var month = (this.nowMonthFlag<10 ? "0"+this.nowMonthFlag:this.nowMonthFlag); 
	// 		var date = this.nowYearFlag + "-" + month + "-" + selectedDay;
	// 		console.log(date);

	// 		// var params = {
	// 		// 	token : PFT.Util.getToken(),
	// 		// 	aid : this.aid,
	// 		// 	date : date,
	// 		// 	pids : 
	// 		// };


	// 		// GetPriceAndStorage(params,{
	// 		// 	loading:function () {},
	// 		// 	success:function (req) {
	// 		// 		console.log(req);
	// 		// 		var template = PFT.Util.ParseTemplate(placeTicket);
	// 		// 		var htmlStr = template({data:req.data});
	// 		// 		$("#ticketList").empty().append(htmlStr);

	// 		// 		This.getBookInfo()

	// 		// 	},
	// 		// 	complete:function () {}
	// 		// });	


	// 	}
		

	// },

















	//这以下是家燊写的*************************************************************************************************************************

	//我自己理解的注释

	//初始化组件
	// componentsInit : function () {
		
	// 	var This = this;

	// 	//日历
	// 	// this.calendar = new Calendar();
	// 	//常用联系人
	// 	this.ContactBox =  new SheetCore({

	// 		// header : "选择常用联系人",      //弹层头部标题 可选
	// 		header : function(){
	// 			var html = '<div class="title"><span class="back"><</span>常用联系人</div>';
	// 			//必须把html return出去
	// 			return html;
	// 		},
			
	// 		content : contact,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件  

	// 		height : "100%",      //弹层占整个手机屏幕的高度
			
	// 		yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
			
	// 		noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn

	// 		zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
			
	// 		EVENTS : {            //弹层上面绑定的所有事件放在这里
	// 			"click .usualContact li" : function(){
	// 				This.ContactBox.close();
	// 			},
	// 			"click .back" : function () {
	// 				This.ContactBox.close();
	// 			}
	// 		}
			
	// 	});
	// 	//游客信息
	// 	this.VisitorInformation =  new SheetCore({

	// 		// header : "选择常用联系人",      //弹层头部标题 可选
	// 		header : function(){
	// 			var html = '<div class="title"><span class="back"><</span>常用联系人</div>';
	// 			//必须把html return出去
	// 			return html;
	// 		},

	// 		content : contact,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件

	// 		height : "100%",      //弹层占整个手机屏幕的高度

	// 		yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示

	// 		noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn

	// 		zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡

	// 		EVENTS : {            //弹层上面绑定的所有事件放在这里
	// 			"click .usualContact li" : function(){
	// 				This.VisitorInformation.close();
	// 			},
	// 			"click .back" : function () {
	// 				This.VisitorInformation.close();
	// 			}
	// 		}

	// 	});
	// },
	


	// getDate : function () {
	// 	this.calendarBox.show("",{
	// 		picker : $("#playDate"),
	// 		top : 0,
	// 		left : 0,
	// 		onBefore : function(){},
	// 		onAfter : function(){}
	// 	})
	// },

	// showContact : function () {
	// 	this.ContactBox.show();
	// },

	// showVisitor : function () {
	// 	this.VisitorInformation.show();
	// },


	//加
	addNum : function (e) {
		var storage = $(e.target).parent().parent().find(".left .num").text();

		if($(e.target).attr("active") == "true"){
			var num = parseInt($(e.target).parent().find(".numBox").val());
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

			if(num == storage){
				$(e.target).attr("active","false")
			}
			$(e.target).parent().find(".numBox").val(num);
			this.changeTotal();

		}else{
			return false
		}

	},

	//减
	delNum : function (e) {
		var storage = $(e.target).parent().parent().find(".left .num").text();

		if($(e.target).attr("active") == "true"){
			var num = parseInt($(e.target).parent().find(".numBox").val());
			if(isNaN(num)){
				num = 1;
			}
			if(num <= 0){
				$(e.target).attr("active","false");
				return false
			}else if(num <= storage){
				$(e.target).parent().find(".addBtn").attr("active",true)
			}
			num = num - 1;
			if(num == 0){
				$(e.target).attr("active","false")
			}
			$(e.target).parent().find(".numBox").val(num);
			this.changeTotal();
		}else{
			return false
		}

	},
	
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
		$("#totalMoney").text(sum)
	},

	checkInput : function (e) {
		var input = ($(e.target).val());
		var storage = $(e.target).parent().parent().find(".left .num").text();
		if(!Validate.typeNum(input)) {
			PFT.Mobile.Alert("请输入正确的数值");
			($(e.target)).val(0);
		}else{
			if(parseInt(input) > parseInt(storage)){
				($(e.target)).val(storage);
				PFT.Mobile.Alert("最大库存为"+storage);
			}
			if(parseInt(input) < 0){
				($(e.target)).val(0);
				PFT.Mobile.Alert("数量不能为负数");
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
	}

	
	

});


$(function(){
	new Order_fill();
});





