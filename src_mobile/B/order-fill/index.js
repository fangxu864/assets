
require("./index.scss");
//服务层
var GetPriceAndStorage = require("./service/getPriceAndStorage_Service.js");
var GetBookInfo = require("./service/getBookInfo_Service.js");
var GetCalendarPrice = require("./service/getCalendarPrice.js");
//tpl
var placeTicket = require("./tpl/placeTicket.xtpl");
var contact = require("./tpl/addContact.xtpl");
//组件模块
var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");  //列表弹窗
var Validate = require("COMMON/js/util.validate.js"); //验证
// var Calendar = require("COMMON/modules/calendar"); //日历
var When=require("COMMON/js/when.js");
var when=new When();


//自己写日历

var Calendar = require("./calendar/index.js");

var Order_fill = PFT.Util.Class({

	container : $("#orderFill"),
	EVENTS : {
		"click #playDate":"testCalendar", //日历插件测试
		"click #contact":"showContact",
		"click #visitorInformation":"showVisitor",
		"click .addBtn":"addNum",
		"click .delBtn":"delNum",
		"blur .numBox":"checkInput",
		"click #regularBtn":"regularToggle"
	},


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

		this.nowYearFlag = parseInt(dateGroup.year);
		this.nowMonthFlag = parseInt(dateGroup.month);
		this.nowDayFlag = parseInt(dateGroup.day);

		return dateGroup;

	},


	testCalendar : function(){

		var that = this;

		var dateGroup = this.getNowDate();	
		var nowDate = dateGroup.nowDate;

		var allHtml = Calendar.init(nowDate);

		var html = allHtml.html;
		var listHtml = allHtml.listHtml;

		this.CalendarBox =  new SheetCore({
			
			content : html,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件  

			height : "auto",      //弹层占整个手机屏幕的高度
			
			yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
			
			noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn

			zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
			
			EVENTS : {            //弹层上面绑定的所有事件放在这里
				"click .prev" : function(e){
					that.changeCal("prev");
				},
				"click .next" : function(e){
					that.changeCal("next");
				}				
			}
		});

		this.CalendarBox.show();

		$(".ui-sheetMask").on("click",function(){
			that.CalendarBox.close();			
		});

		$(".calContentCon").html(listHtml);

	},

	changeCal : function(dir){

		if(dir == "prev"){
			if(this.nowMonthFlag > 1){
				this.nowMonthFlag -= 1; 
			}else{
				this.nowMonthFlag = 12;
				this.nowYearFlag -= 1;
			}
		}else if(dir == "next"){
			if(this.nowMonthFlag < 12){
				this.nowMonthFlag += 1; 
			}else{
				this.nowMonthFlag = 1;
				this.nowYearFlag += 1;
			}
		}

		var date = (this.nowYearFlag.toString()+'-'+this.nowMonthFlag.toString());
		console.log(date);

		Calendar.change(date); //改变日历状态

	},

	init : function(){

		//日历插件测试
		this.testCalendar();

		

		var id = this.getId();
		this.aid = id.aid;
		this.pid = id.pid;
		this.type = id.type;

		this.getCalPrice();
		// if(this.aid == undefined ||this.pid == undefined ||this.type == undefined ){
		// 	console.log("缺少id参数");	
		// }else{
			// console.log("aid="+this.aid+"&pid="+this.pid+"&type="+this.type);
		// }

		// this.ticketTemplate = PFT.Util.ParseTemplate(placeTicket);

		// this.componentsInit();
		// this.getBookInfo();

		// this.getPriceAndStorage();

	},
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

	getCalPrice : function(date){

		var that = this;

		date = '2017-01-26';//先写死

		var params = {
			token : PFT.Util.getToken(),
			aid : this.aid,
			pid : this.pid,
			date : date
		};

		GetCalendarPrice(params,{
			loading:function () {},
			success:function (res) {

				that.handleCalPrice(res);

			},
			complete:function () {}
		});

	},	

	handleCalPrice : function(){




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
			GetBookInfo(params,{
				loading:function () {},
				success:function (req) {

					that.handleBookInfo(req);
					
					// var tickets = req.data.tickets;
					// $(value).find(".ticketName").text(req.data.title);
					// if(tickets){
					// 	var html="";
					// 	for(var i in tickets){
					// 		html += "+"+tickets[i].title
					// 	}

					// 	$(value).find(".details").show();
					// 	$(value).find(".ticketSon").text(html)
					// }

				},
				complete:function () {}
			})

		// });
	},

	handleBookInfo : function(res){

		console.log(res);
		var ticketList = res.tickets;
		this.renderTicketList(ticketList); 
		$("#placeText").text(res.title);

	},

	renderTicketList : function(list){
		var data = {};
		data.list = list;
		var ticketsHtml = this.ticketTemplate(data);	
		$("#ticketList").html(ticketsHtml);
	},

	componentsInit : function () {
		var This = this;

		//日历
		this.calendar = new Calendar();
		//常用联系人
		this.ContactBox =  new SheetCore({

			// header : "选择常用联系人",      //弹层头部标题 可选
			header : function(){
				var html = '<div class="title"><span class="back"><</span>常用联系人</div>';
				//必须把html return出去
				return html;
			},
			
			content : contact,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件  

			height : "100%",      //弹层占整个手机屏幕的高度
			
			yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示
			
			noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn

			zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡
			
			EVENTS : {            //弹层上面绑定的所有事件放在这里
				"click .usualContact li" : function(){
					This.ContactBox.close();
				},
				"click .back" : function () {
					This.ContactBox.close();
				}
			}
		});
		//游客信息
		this.VisitorInformation =  new SheetCore({

			// header : "选择常用联系人",      //弹层头部标题 可选
			header : function(){
				var html = '<div class="title"><span class="back"><</span>常用联系人</div>';
				//必须把html return出去
				return html;
			},

			content : contact,        //弹层内要显示的html内容,格式同header，如果内容很多，可以像这样引入外部一个tpl文件

			height : "100%",      //弹层占整个手机屏幕的高度

			yesBtn : false,       //弹层底部是否显示确定按钮,为false时不显示

			noBtn : false,        //弹层底部是否显示取消按钮,格式同yesBtn

			zIndex : 1,           //弹层的zIndex，防止被其它页面上设置position属性的元素遮挡

			EVENTS : {            //弹层上面绑定的所有事件放在这里
				"click .usualContact li" : function(){
					This.VisitorInformation.close();
				},
				"click .back" : function () {
					This.VisitorInformation.close();
				}
			}

		});
	},
	
	getDate : function () {
		this.calendarBox.show("",{
			picker : $("#playDate"),
			top : 0,
			left : 0,
			onBefore : function(){},
			onAfter : function(){}
		})
	},

	showContact : function () {
		this.ContactBox.show();
	},

	showVisitor : function () {
		this.VisitorInformation.show();
	},

	addNum : function (e) {
		var storage = $(e.target).parent().parent().find(".left .num").text();

		if($(e.target).attr("active") == "true"){
			var num = parseInt($(e.target).parent().find(".numBox").val());
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

	delNum : function (e) {
		var storage = $(e.target).parent().parent().find(".left .num").text();

		if($(e.target).attr("active") == "true"){
			var num = parseInt($(e.target).parent().find(".numBox").val());
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
		$("#totalMoney").text(sum)
	},

	checkInput : function (e) {
		var input = ($(e.target).val());
		var storage = $(e.target).parent().parent().find(".left .num").text();
		if(!Validate.typeNum(input)) {
			alert("请输入正确的数值");
			($(e.target)).val(0)
		}else{
			if(parseInt(input) > parseInt(storage)){
				($(e.target)).val(storage);
				alert("最大库存为"+storage)
			}

			if(parseInt(input) < 0){
				($(e.target)).val(0);
				alert("数量不能为负数")
			}
		}
		this.changeTotal();

		//变灰
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

	getPriceAndStorage : function (param) {
		var This = this;
		var params = param || "";
		GetPriceAndStorage(params,{
			loading:function () {},
			success:function (req) {
				console.log(req);
				var template = PFT.Util.ParseTemplate(placeTicket);
				var htmlStr = template({data:req.data});
				$("#ticketList").empty().append(htmlStr);

				This.getBookInfo()

			},
			complete:function () {}
		});

	}
	

});


$(function(){
	new Order_fill();
});





