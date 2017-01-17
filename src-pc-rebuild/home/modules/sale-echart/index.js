/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/dataZoom');


var Datepicker = require("COMMON/modules/datepicker");
var datepicker = new Datepicker();

require("./index.scss");
var Tpl = require("./index.xtpl");
module.exports = function(parent){

	var container = $('<div id="saleEchartBox" class="saleEchartBox modBox"></div>').appendTo(parent);

	var saleEchart = PFT.Util.Class({
		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			console.log(this.container);
			this.render();
			//折线图
			this.lineEchart = echarts.init(document.getElementById('lineEchart'));
			// //饼图
			// this.pieEchart = echarts.init(document.getElementById('pieEchart'));
			// //条形图
			// this.barEchart = echarts.init(document.getElementById('barEchart'));
			this.renderPieEchart();
			this.renderBarEchart();
		},
		EVENTS : {
			"click .lineEchartControlBox input" : "onTimeInpClick" ,
			"click .lineEchartControlBox .typeBtn" : "onTypeBtnClick" ,
			"click .lineEchartControlBox .okBtn" : "onOkBtnClick" ,
			"click .lineEchartControlBox .quickDateBtn" : "onQuickDateBtnClick" ,
			"click .selectBox .icon" : "onSelectBoxIconClick" ,
		},
		render : function(data){
			var _this = this ;


			var html = this.template(data || {
					"bTimeInpVal": _this.When.getSomeday(-6),   //账号名称
					"eTimeInpVal": _this.When.getSomeday(0)
				});
			this.container.html(html);
		},

		// renderLineEchart : function () {
		// 	// 基于准备好的dom，初始化echarts实例
		// 	var myChart = echarts.init(document.getElementById('lineEchart'));
		// 	var option = {
		// 		tooltip : {
		// 			trigger: 'axis'
		// 		},
		// 		legend: {
		// 			data:['当前数据','对比数据']
		// 		},
		// 		toolbox: {
		// 			feature: {
		// 				saveAsImage: {}
		// 			}
		// 		},
		// 		grid: {
		// 			left: '3%',
		// 			right: '4%',
		// 			bottom: '3%',
		// 			containLabel: true
		// 		},
		// 		xAxis : [
		// 			{
		// 				type : 'category',
		// 				boundaryGap : false,
		// 				data : ['周一','周二','周三','周四','周五','周六','周日']
		// 			}
		// 		],
		// 		yAxis : [
		// 			{
		// 				type : 'value'
		// 			}
		// 		],
		// 		series : [
		// 			{
		// 				name:'当前数据',
		// 				type:'line',
		// 				stack: '总量',
		// 				smooth : true ,
		// 				areaStyle: {normal: { color : "#77cfdd"}},
		// 				lineStyle : { normal : { color : '#c6cad3'}},
		// 				data:[120, 132, 101, 134, 90, 230, 210]
		// 			},
		// 			{
		// 				name:'对比数据',
		// 				type:'line',
		// 				stack: '总量',
		// 				smooth : true ,
		// 				areaStyle: {normal: { color : "#e8e9ed" }},
		// 				lineStyle : { normal : { color : '#c6cad3'}},
		// 				data:[220, 182, 191, 234, 290, 330, 310]
		// 			}
		// 		]
		// 	};
        //
		// 	// 绘制图表
		// 	myChart.setOption(option);
		// },
		renderPieEchart : function () {

			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('pieEchart'));
			// var option = {
			// 	title : {
			// 		text: '7天产品使用排行',
			// 		subtext: '纯属虚构',
			// 		x:'center'
			// 	},
			// 	tooltip : {
			// 		trigger: 'item',
			// 		formatter: "{a} <br/>{b} : {c} ({d}%)"
			// 	},
			// 	legend: {
			// 		orient: 'vertical',
			// 		left: 'left',
			// 		data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
			// 	},
			// 	series : [
			// 		{
			// 			name: '访问来源',
			// 			type: 'pie',
			// 			radius : '55%',
			// 			center: ['50%', '60%'],
			// 			data:[
			// 				{value:335, name:'直接访问'},
			// 				{value:310, name:'邮件营销'},
			// 				{value:234, name:'联盟广告'},
			// 				{value:135, name:'视频广告'},
			// 				{value:1548, name:'搜索引擎'}
			// 			],
			// 			itemStyle: {
			// 				emphasis: {
			// 					shadowBlur: 10,
			// 					shadowOffsetX: 0,
			// 					shadowColor: 'rgba(0, 0, 0, 0.5)'
			// 				}
			// 			}
			// 		}
			// 	]
			// };

			// 绘制图表
			// myChart.setOption(option);
			myChart.showLoading()
		},
		renderBarEchart : function () {

			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('barEchart'));
			var option = {
				title: {
					text: '7天渠道排行',
					subtext: '数据来自网络'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				// legend: {
				// 	data: ['2011年', '2012年']
				// },
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					boundaryGap: [0, 0.01]
				},
				yAxis: {
					type: 'category',
					data: ['美团','宝中旅游','微商城','飞猪','同程','途牛','XXX分销商']
				},
				series: [
					{
						name: '订单数',
						type: 'bar',
						data: [18203, 23489, 29034, 104970, 131744, 30230,55141]
					}
				]
			};


			// 绘制图表
			myChart.setOption(option);
		},


		/**
		 * @events 时间input点击时间
		 * @param e
         */
		onTimeInpClick : function(e){
			var tarInp = $( e.currentTarget );
			//起始日期input
			if( tarInp.hasClass("bTimeInp") ){
				datepicker.show(tarInp.val(),{
					picker : tarInp,              //必选
					top : 0,                     //可选，相对偏移量
					left : 0,                    //可选，相对偏移量
					// min : "2016-09-10",          //可选，默认为空""
					max : $(".lineEchartControlBox .eTimeInp").val(),          //可选，默认为空""
					todayBeforeDisable : false,  //可选，今天之前的日期都不显示
					todayAfterDisable : false,   //可选，今天之后的日期都不显示
				})
			}
			//结束日期Inp
			else if( tarInp.hasClass("eTimeInp") ){
				datepicker.show(tarInp.val(),{
					picker : tarInp,              //必选
					top : 0,                     //可选，相对偏移量
					left : 0,                    //可选，相对偏移量
					min : $(".lineEchartControlBox .bTimeInp").val(),          //可选，默认为空""
					// max : "2016-09-20",          //可选，默认为空""
					todayBeforeDisable : false,  //可选，今天之前的日期都不显示
					todayAfterDisable : false,   //可选，今天之后的日期都不显示
				})
			}
			console.log(tarInp)

		},

		/**
		 * @events 类型按钮点击 1--票数  2--金额
		 * @param e
         */
		onTypeBtnClick : function (e) {
			var tarBtn = $( e.currentTarget );
			tarBtn.addClass("active")
				.siblings().removeClass("active");
			this.container.find(".lineEchartControlBox .okBtn").click();
		},

		/**
		 * @events 确定按钮点击
		 * @param e
         */
		onOkBtnClick : function (e) {
			var _this = this ;
			var params = {
				search_type :  _this.container.find(".lineEchartControlBox .typeBtn.active").attr("data-type") ,
				begin_time  :  _this.container.find(".lineEchartControlBox .bTimeInp").val() ,
				end_time  :  _this.container.find(".lineEchartControlBox .eTimeInp").val() ,
				compare_type  :  _this.container.find(".selectBox .compare.icon-checkbox-checked").attr("data-type")
			};
			_this.lineEchart.showLoading();
			$.ajax({
				url: "/r/Home_HomeOrder/saleTrends",    //请求的url地址
				dataType: "json",   //返回格式为json
				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				data: params,    //参数值
				type: "POST",   //请求方式
				timeout:10000,   //设置超时 10000毫秒
				beforeSend: function() {
					//请求前的处理
				},
				success: function(res) {
					//请求成功时处理
					console.log(res);
					_this.lineEchart.hideLoading();
					var newArr = [] , oldArr = [] , xAxisArr = [] , i , j , k;

					for( i in res.data.new){
						newArr.push(res.data.new[i])
					}
					for( j in res.data.old ){
						oldArr.push(res.data.old[j])
					}
					for( k in res.data.timeLine ){
						xAxisArr.push( res.data.timeLine[k]["time"])
					}

					var option = {
							tooltip : {
								trigger: 'axis'
							},
							legend: {
								data:['当前数据','对比数据']
							},
							toolbox: {
								feature: {
									saveAsImage: {}
								}
							},
						dataZoom: [
							{
								type: 'slider',
								show: true,
								xAxisIndex: [0],
								start: 0,
								end: 100
							},
							// {
							// 	type: 'inside',
							// 	xAxisIndex: [0],
							// 	start: 1,
							// 	end: 35
							// },
						],
							grid: {
								left: '3%',
								right: '4%',
								bottom: '10%',
								containLabel: true
							},
							xAxis : [
								{
									type : 'category',
									boundaryGap : false,
									data : xAxisArr
								}
							],
							yAxis : [
								{
									type : 'value'
								}
							],
							series : [
								{
									name:'当前数据',
									type:'line',
									stack: '总量',
									smooth : true ,
									areaStyle: {normal: { color : "#77cfdd"}},
									lineStyle : { normal : { color : '#c6cad3'}},
									data: newArr
								},
								{
									name:'对比数据',
									type:'line',
									stack: '总量',
									smooth : true ,
									areaStyle: {normal: { color : "#e8e9ed" }},
									lineStyle : { normal : { color : '#c6cad3'}},
									data: oldArr
								}
							]
						};
					_this.lineEchart.setOption(option)
				},
				complete: function(res,status) {
					//请求完成的处理
					if(status=="timeout"){
						alert("请求超时")
					}
				},
				error: function() {
					//请求出错处理
				}
			});
		},

		/**
		 * @events 快速选择日期按钮点击
		 * @param e
         */
		onQuickDateBtnClick : function (e) {
			var _this = this;
			var tarBtn = $(e.currentTarget) ;
			tarBtn.addClass("active")
				.siblings().removeClass("active");
			var dataNum = tarBtn.attr("data-num");
			this.container.find(".lineEchartControlBox .bTimeInp").val( _this.When.getSomeday(dataNum) );
			this.container.find(".lineEchartControlBox .eTimeInp").val( _this.When.getSomeday(0) );
			this.container.find(".lineEchartControlBox .okBtn").click();
		},

		/**
		 * @events 折线图底部select点击
		 * @param e
         */
		onSelectBoxIconClick : function (e) {
			var _this = this;
			var tarBtn = $(e.currentTarget) ;
			//同比和环比
			if(tarBtn.hasClass("compare")){
				tarBtn.toggleClass("icon-checkbox-checked") ;
				tarBtn.parent().siblings(".td").find(".compare").toggleClass("icon-checkbox-checked");
				this.container.find(".lineEchartControlBox .okBtn").click();
			}
			//高亮周末
			else if ( tarBtn.hasClass("weekend") ){
				tarBtn.toggleClass("icon-checkbox-checked");
			}
		},


		/**
		 * @object 获取时间
		 */
		When : {
			/**
			 * @object 当前时间对象
			 */
			date : new Date() ,

			/**
			 * @method 获取当前时间戳
			 * @returns {number}
             */
			curTimeStamp : function () {
				return this.date.getTime();
			},

			/**
			 * @method 获取某天 0 获取当天 -1获取昨天  1 获取明天
			 * @param Num
             * @returns {string}
             */
			getSomeday : function ( Num ) {
				var _this = this ;
				var dayNum = Number( Num );
				var timeStamp = _this.curTimeStamp() + dayNum * 1000 * 60 * 60 * 24 ;
				var date = new Date(timeStamp);
				var month = ( date.getMonth() + 1 ).toString().length === 2 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
				var day = date.getDate().toString().length === 2 ? date.getDate() : '0' + date.getDate();
				return date.getFullYear() + '-' + month + '-' + day;
			}
		}

	});


	return new saleEchart;
};