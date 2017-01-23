
require("./index.scss");

var SheetCore = require("COMMON/Components/Sheet-Core/v1.0");
var contact = require("./addContact.xtpl");

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
	},
	init : function(){
		this.componentsInit()

	},
	componentsInit : function () {
		var This = this;

		//日历
		this.Calendar = new Calendar();
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
		var This = this;
		This.Calendar.show("",{
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
		var num = parseInt($(e.target).parent().find(".numBox").attr("value"));
		$(e.target).parent().find(".numBox").attr("value",num+1);
		this.changeTotal();
	},

	delNum : function (e) {
		var num = parseInt($(e.target).parent().find(".numBox").attr("value"));
		$(e.target).parent().find(".numBox").attr("value",num-1);
		this.changeTotal();
	},
	
	changeTotal : function () {
		var sum = 0;
		$("#ticketList li").each(function (index,element) {
			var money = parseInt(($(element).find(".money").text()));
			var num = parseInt(($(element).find(".numBox").attr("value")));
			sum += money * num;
		});
		$("#totalMoney").text(sum)
	}
	

});


$(function(){
	new Order_fill();
});





