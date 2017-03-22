require("./index.scss");
//组件
var simulate = require("./simulate");
var Pagination = require("COMMON/modules/pagination-x");
// var Calendar = require("COMMON/modules/calendar");   //没有精确到秒
var Select = require("./select_scroll");
var Loading = require("COMMON/js/util.loading.pc.js"); 
var Datapicker = require("COMMON/modules/datepicker");  //精确到秒的日历组件
//tpl
var operatorTpl = require("./tpl/operator.xtpl");
var listTpl = require("./tpl/list.xtpl");
//service层
var GetList = require("./service/GetList_service.js");
var Main = PFT.Util.Class({
	container : $("#cardTouristsListWrap"),
	EVENTS : {
		"click #operator" : "onOperatorClick",  //操作员
		"click #checkOut" : "onCheckOut",  //查询
		"click .tdMoreBtn" : "onMoreBtn", //更多
		"click #export" : "onExport"
 	},
	init : function(){

		var that = this;
		this.page = 1;//页数默认为第一页
		this.exports = "0" ;//默认不导出
		//在发送请求之前拦截请求,模拟数据
		simulate.init();
		//处理操作员
		this.handleOperator(); 
		//处理状态
		this.handleStatus();
		//默认激活日期
		var NowDate = new Date();
		var year = NowDate.getFullYear();
		var month = NowDate.getMonth() + 1;
		var day = NowDate.getDate();
		this.deFaultInTime = year + "-" + month + "-" + day + " 00:00:00";
		this.deFaultOutTime = year + "-" + month + "-" + day + " 23:59:59";
		var nowDate = this.getNowFormatDate();//用于日历组件
		$("#actTimein").val(this.deFaultInTime);
		$("#actTimeout").val(this.deFaultOutTime);
		//日历组件部分
		var datapicker = new Datapicker();
		$(".actTimein").on("click",function(){
			datapicker.open( nowDate ,{
				picker : $(".actTimein")
			});	
		})
		$(".actTimeout").on("click",function(){
			datapicker.open( nowDate ,{
				picker : $(".actTimeout")
			});	
		})
		//分页器组件部分
		var Pagination = require("COMMON/modules/pagination-x");
		this.pagination = new Pagination({
			container : "#pagCon",  //必须，组件容器id
			count : 7,                //可选  连续显示分页数 建议奇数7或9
			showTotal : true,         //可选  是否显示总页数
			jump : true	              //可选  是否显示跳到第几页
		});
		this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
			that.page = toPage ;
			that.handleList();
		})

	},
	//导出
	onExport : function(){
		this.exports = "1" ;//默认不导出
		this.onCheckOut();
	},
	onMoreBtn : function(e){
		var target = $(e.target);
		var nowTr = target.parent().parent();
		var tdItems = nowTr.find(".tdItem");
		var eItem = nowTr.find(".tdEmpty");
		target.css("display","none");
		eItem.css("display","none");
		tdItems.css("display","block");
	}, 
	//获得当天的时间
	getNowFormatDate : function(){
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours() ;
		var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() ;
		var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds() ;
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
				+ " " + hours + seperator2 + min
				+ seperator2 + second ;
		return currentdate;
	},
	handleList : function(){
		var html = Loading("请稍等");
		var that = this;

		PFT.Util.Ajax("/r/product_ParkCard/getTouristList",{
			type : "POST",
			dataType : "json",
			params : {

				opid : that.OID, 
				begin : that.beginStamp,
				end : that.endStamp,
				status : that.status,
				export : that.exports,
				physicsno : that.CardId,
				page : that.page,
				pagesize : 2

			},
			loading : function(){
				$("#tempBox").css("display","none");
				$("table.accountList").html(html);
			},
			complete : function(){
			},
			success : function(res){
				var code = res.code;
				if(code == 200){
					var data = res.data
					var list = data.list;
					var msg = res.msg;
					if( list.length > 0){
						that.renderList(list);  //渲染列表
						var topage = data.page;
						var total = data.total_page;
						//渲染分页器
						that.pagination.render({current:that.page,total:total});
						that.transAllTimeStamp();
					}else{
						//无数据
						$("#accountList").html('<div id="tempBox" style="height: 100px;text-align: center;font-size: 20px;line-height: 100px;border: 1px solid #e5e5e5;">暂无列表</div>');
						$("#pagCon").html("");
					}

				}
				
			},
			timeout : function(){ alert("请求起时") },
			serverError : function(){ alert("请求出错")}
		})

	},
	renderList : function(list){
		var ListTemplate = PFT.Util.ParseTemplate(listTpl);
		var listHtml = ListTemplate({ list : list});		
		$("table.accountList").html(listHtml);
	},
	//处理状态
	handleStatus : function(){
		var that = this;
		$(".statusItem").on("click",function(){
			that.CardId = $(".solidCardId").val();//物理卡号Id
			that.OID = $("#operator").attr("data-id");
			// if(that.CardId == ""){
			// 	alert("请填写物理卡号");	
			// 	return false
			// }
			// if( that.OID == "0"){
			// 	alert("请选择操作员");
			// 	return false
			// }
			$(this).siblings().find(".statusItemCircle").removeClass("selected");
			$(this).find(".statusItemCircle").addClass("selected");
			var status = $(this).attr("data-status");
			$("#statusBox").attr("data-status",status);
			that.onCheckOut();
		});
	},
	//处理操作员
	handleOperator : function(){
		var that = this;
		PFT.Util.Ajax("/r/product_ParkCard/getOpId",{
			type : "POST",
			dataType : "json",
			params : {
			},
			loading : function(){
			},
			complete : function(){
			},
			success : function(res){
				var code = res.code;
				var msg = res.msg;
				var list = res.data;
				var operatorTemplate = PFT.Util.ParseTemplate(operatorTpl);
				var operatorHtml = operatorTemplate({ list : list });
				$("#operatorListBox").append(operatorHtml);
				$(".operatorItem").on("click",function(){
					$("#operatorListBox").css("display","none");
					$(".unfoldBox i").removeClass("icon-fold").addClass("icon-unfold");
					$("#operator").val($(this).text());
					$("#operator").attr("data-id",$(this).attr("data-id"));
				});
			},
			timeout : function(){ alert("请求起时") },
			serverError : function(){ alert("请求出错")}
		})

	},
	onOperatorClick : function(){
		var display = $("#operatorListBox").css("display");	
		if( display == "none" ){
			$("#operatorListBox").css("display","block");
			$(".unfoldBox i").removeClass("icon-unfold").addClass("icon-fold");
		}else if( display == "block" ){
			$("#operatorListBox").css("display","none");
			$(".unfoldBox i").removeClass("icon-fold").addClass("icon-unfold");
		}
	},
	//查询
	onCheckOut : function(){
		var beginTime = $("#actTimein").val(); //有默认时间
		var endTime = $("#actTimeout").val(); //有默认时间
		//化为时间戳
		this.beginStamp = this.parseDateToStamp(beginTime);
		this.endStamp = this.parseDateToStamp(endTime);
		//物理卡号
		this.CardId = $(".solidCardId").val();//物理卡号Id
		// if(this.CardId == ""){
		// 	alert("请填写物理卡号");	
		// 	return false
		// }
		// this.CardId ="12345685";   //opid3384的模拟固定卡号
		//操作员
		this.OID = $("#operator").attr("data-id");
		// if( this.OID == "0"){
		// 	alert("请选择操作员");
		// 	return false
		// }
		// 状态
		var status = $("#statusBox").attr("data-status");
		if(status == "all"){
			this.status = "-1";
		}else if(status == "useing"){
			this.status = "1";
		}else if(status == "used"){
			this.status = "2";
		}
		if(this.exports == "1"){
			this.getExport();
		}else{
			//请求列表
			this.handleList();
		}

	},
	getExport : function(){
		var that = this;
		var params = {
			opid : that.OID, 
			begin : that.beginStamp,
			end : that.endStamp,
			status : that.status,
			export : that.exports,
			physicsno : that.CardId
		}
		function JsonStringify(obj) {
			var str="";
			var arr=[];
			for(var key in obj){
				str=key+"="+obj[key];
				arr.push(str);
			}
			return arr.join("&");
		}
		var pa = JsonStringify(params);
		var url = "/r/product_ParkCard/downLoad?" + pa; 
		window.open(url);
		this.exports = "0";	

	},
	transAllTimeStamp : function(){ //改变列表里的时间cuo
		var that = this;
		var stamps = $(".timeStamp");
		stamps.each(function(i,item){
			var stamp = stamps.eq(i).text();
			var time = trans(stamp);
			stamps.eq(i).text(time);
		});
		
		function trans(Stamp){
			var time = Number(Stamp);
			time = new Date(time*1000);
			var newDate = that.parseStampToDate(time);
			return newDate
		}
	},
	parseDateToStamp : function(date){
		date = new Date(Date.parse(date.replace(/-/g, "/")));
		date = date.getTime();
		date = String(date);
		date = date.substr(0,10);
		return date		
	},
	parseStampToDate : function(stamp){
		var   year=stamp.getFullYear();     
		var   month=stamp.getMonth()+1;     
		var   date=stamp.getDate();     
		var   hour=stamp.getHours();     
		var   minute=stamp.getMinutes();     
		var   second=stamp.getSeconds();     
		return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;  
	}

});

$(function(){
    new Main();
});

