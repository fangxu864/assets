
require("./index.scss");

var GetPriceAndStorage = require("./getPriceAndStorage_Service.js");
var GetBookInfo = require("./getBookInfo_Service.js");
var placeTicket = require("./TicketTemplate/placeTicket.xtpl");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");
var contact = require("./addContact.xtpl");
var Validate = require("COMMON/js/util.validate.js");

var Calendar = require("COMMON/modules/calendar");
var When=require("COMMON/js/when.js");
var when=new When();


var Order_fill = PFT.Util.Class({

	container : $("#orderFill"),
	EVENTS : {
		"click #playDate":"getDate",
		"click #contact":"showContact",
		"click #visitorInformation":"showVisitor",
		"click .addBtn":"addNum",
		"click .delBtn":"delNum",
		"blur .numBox":"checkInput",
		"click #regularBtn":"regularToggle"
	},
	init : function(){
		this.componentsInit();
		this.getPriceAndStorage();

	},
	componentsInit : function () {
		var This = this;

		//日历
		this.calendarBox = new Calendar();
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
				var template = PFT.Util.ParseTemplate(placeTicket);
				var htmlStr = template({data:req.data});
				$("#ticketList").empty().append(htmlStr);

				This.getBookInfo()

			},
			complete:function () {}
		});

	},

	getBookInfo : function () {

		$("#ticketList li").each(function (index,value) {
			var id = $(value).attr("data-id");
			GetBookInfo({},{
				loading:function () {},
				success:function (req) {
					var tickets = req.data.tickets;
					$(value).find(".ticketName").text(req.data.title);
					if(tickets){
						var html="";
						for(var i in tickets){
							html += "+"+tickets[i].title
						}

						$(value).find(".details").show();
						$(value).find(".ticketSon").text(html)
					}
				},
				complete:function () {}
			})

		});
	}
	

});


$(function(){
	new Order_fill();
});





