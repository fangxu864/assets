/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */
// // 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');
// // 引入柱状图
// require('echarts/lib/chart/line');
// require('echarts/lib/chart/bar');
// require('echarts/lib/chart/pie');
// // 引入提示框和标题组件
// require('echarts/lib/component/legend');
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
// require('echarts/lib/component/dataZoom');


var Datepicker = require("COMMON/modules/datepicker");
var datepicker = new Datepicker();

require("./index.scss");
var Tpl = require("./index.xtpl");
var oD_yesterday_tpl = require("./orderdata-yesterday.xtpl");
var oD_today_tpl = require("./orderdata-today.xtpl");

var LoadingPC = require("COMMON/js/util.loading.pc.js");

var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();


module.exports = function(parent){

	var container = $('<div id="saleEchartBox" class="saleEchartBox modBox"></div>').appendTo(parent);

	var saleEchart = PFT.Util.Class({
		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		template_yesterday_od : PFT.Util.ParseTemplate(oD_yesterday_tpl),
		template_today_od : PFT.Util.ParseTemplate(oD_today_tpl),
		init : function(){
			var _this = this ;
			this.render();
			this.renderOrderData_today( true );
			this.renderOrderData_yesterday();
			//折线图
			this.lineEchart = echarts.init(document.getElementById('lineEchart'));
			this.pieEchart = echarts.init(document.getElementById('pieEchart'));
			this.barEchart = echarts.init(document.getElementById('barEchart'));
			//窗口resize时 ，echarts重新渲染
			$(window).on("resize" , function () {
				_this.lineEchart.resize();
				_this.pieEchart.resize();
				_this.barEchart.resize();
			});
			//数据懒加载，当出现在视窗中才开始加载
			$("#G_Body").on("scroll.renderPie-Bar" , function (e) {
				if( _this.container.find(".line3").offset().top < $(window).height() ){
					_this.renderPieEchart();
					_this.renderBarEchart();
					$(this).off("scroll.renderPie-Bar")
				}
			}).on("scroll.renderLineEchart" , function () {
				if( _this.container.offset().top < $(window).height() ){
					_this.container.find(".lineEchartControlBox .okBtn").click();
					$(this).off("scroll.renderLineEchart")
				}
			})
		},
		EVENTS : {
			"click .lineEchartControlBox input" : "onTimeInpClick" ,
			"click .lineEchartControlBox .typeBtn" : "onTypeBtnClick" ,
			"click .lineEchartControlBox .okBtn" : "onOkBtnClick" ,
			"click .lineEchartControlBox .quickDateBtn" : "onQuickDateBtnClick" ,
			"click .selectBox .icon" : "onSelectBoxIconClick" ,
			"click .line1 .today-box .rt .icon-shuaxin" : "onShuaXinIconClick" ,
		},


		/**
		 * @method 渲染基础dom
		 * @param data
         */
		render : function(data){
			var _this = this ;
			var html = this.template(data || {
					"bTimeInpVal": _this.When.getSomeday(-6),
					"eTimeInpVal": _this.When.getSomeday(0)
				});
			this.container.html(html);
		},


		/**
		 * @method 渲染今日订单数据
		 */
		renderOrderData_today : function ( isInit ) {
			var _this = this ;
			var curContainer = _this.container.find(".line1 .today-box .rt table");
			var icon = _this.container.find(".line1 .today-box .rt .icon");
			var params ;
			if( isInit ){
				params = {}
			}else{
				params = { is_flush : 1}
			}
			var LoadingStr = LoadingPC("努力加载中...",{
				tag : "tr",
				colspan : 6,
				width : 500,
				height : 150
			});

			PFT.Util.Ajax("/r/Home_HomeOrder/todayInfo/",{
				type : "POST",
				params : params,
				loading : function(){
					if( isInit ){
						curContainer.html(LoadingStr);
					}else{
						icon.addClass("rotateInfinite");
					}
				},
				complete : function(res){
					if( res.code == 200 ){
						var html = _this.template_today_od({data : res.data});
						curContainer.html( html );
						if( isInit ){
							icon.show();
						}else{
							Tips.show({
								lifetime : 1500 ,
								direction : top,
								hostObj : icon ,
								content : "刷新成功",
								bgcolor : "#3eba40"
							})
						}
						icon.removeClass("rotateInfinite");
					}else{
						icon.removeClass("rotateInfinite");
						Tips.show({
							lifetime : 1500 ,
							direction : top,
							hostObj : icon ,
							content : "亲,距上次刷新五分钟后可以再次刷新"
						})
					}
				}
			});
			// var html = _this.template_today_od( );
			// _this.container.find(".line1 .today-box .rt table").html( html )
		},


		/**
		 * @method 渲染昨日订单数据
		 */
		renderOrderData_yesterday : function () {
			var _this = this ;

			var curContainer = _this.container.find(".line1 .yesterday-box .rt table");
			var LoadingStr = LoadingPC("努力加载中...",{
				tag : "tr",
				colspan : 6,
				width : 500,
				height : 150
			});

			PFT.Util.Ajax("/r/Home_HomeOrder/YesterdayInfo/",{
				type : "POST",
				params : {},
				loading : function(){
					curContainer.html(LoadingStr);
				},
				complete : function(res){
					if( res.code == 200 ){
						var html = _this.template_yesterday_od( { data : res.data.data } );
						curContainer.html( html )
					}else{
						curContainer.html( res.msg )
					}

				}
			});

			// var html = _this.template_yesterday_od( );
			// _this.container.find(".line1 .yesterday-box .rt").html( html )
		},


		/**
		 * @method 渲染饼图
		 */
		renderPieEchart : function () {
			var _this = this ;

			$.ajax({
				url: "/r/Home_HomeOrder/productUseRank",    //请求的url地址
				dataType: "json",   //返回格式为json
				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				data: {},    //参数值
				type: "POST",   //请求方式
				timeout:10000,   //设置超时 10000毫秒
				beforeSend: function() {
					//请求前的处理
					_this.pieEchart.showLoading();
				},
				success: function(res) {
					//请求成功时处理
					_this.pieEchart.hideLoading();

					if( res.code == 200 ){
						var nameArr = [] , valueArr = [] , dataArr = [];
						for( var key in res.data.rank ){
							nameArr.push(res.data.rank[key]["name"]);
							dataArr.push({ value : res.data.rank[key]["total_money"] ,name : res.data.rank[key]["name"] })
						}
						var option = {
							color : [ '#60bfeb' , '#f38f2c' ,'#3270b9' ,'#64b966' ,'#e7403a'],
							title : {
								text: '7天产品使用排行',
								// subtext: '纯属虚构',
								x:'center'
							},
							tooltip : {
								trigger: 'item',
								formatter: "{a} <br/>{b} : {c} ({d}%)"
							},
							// legend: {
							// 	orient: 'vertical',
							// 	left: 'left',
							// 	data: nameArr
							// },
							series : [
								{
									name: '产品名称',
									type: 'pie',
									radius : '55%',
									center: ['50%', '60%'],
									data : dataArr,
									itemStyle: {
										emphasis: {
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0.5)'
										}
									}
								}
							]
						};
						_this.pieEchart.setOption(option)
					}else {
						_this.pieEchart.showLoading({
							text : '饼图暂无数据'
						});
					}
				},
				complete: function(res,status) {
					//请求完成的处理
					if(status=="timeout"){
						alert("饼图数据请求超时")
					}
				},
				error: function() {
					//请求出错处理
					alert("饼图数据请求出错")
				}
			});
		},


		/**
		 * @method 渲染条形图
		 */
		renderBarEchart : function () {
			var _this = this ;
			$.ajax({
				url: "/r/Home_HomeOrder/saleRank",    //请求的url地址
				dataType: "json",   //返回格式为json
				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				data: {},    //参数值
				type: "POST",   //请求方式
				timeout:10000,   //设置超时 10000毫秒
				beforeSend: function() {
					//请求前的处理
					_this.barEchart.showLoading();
				},
				success: function(res) {
					//请求成功时处理
					_this.barEchart.hideLoading();
					if( res.code == 200 ){
						var yAxisArr = [] , seriesDataArr = [] ;
						for( var key in res.data ){
							yAxisArr.unshift( res.data[key]["name"]);
							seriesDataArr.unshift( res.data[key]["total_money"])
						}
						var option = {
							color : ['#2889e1'],
							title: {
								text: '7天渠道排行',
								// subtext: '数据来自网络'
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
								data: yAxisArr
							},
							series: [
								{
									name: '订单数',
									type: 'bar',
									barMaxWidth: 40 ,
									data: seriesDataArr ,
								}
							]
						};
						_this.barEchart.setOption(option)
					}else{
						_this.barEchart.showLoading({
							text : '条形图暂无数据'
						});
					}
				},
				complete: function(res,status) {
					//请求完成的处理
					if(status=="timeout"){
						alert("饼图数据请求超时")
					}
				},
				error: function() {
					//请求出错处理
					alert("饼图数据请求出错")
				}
			});
		},


		/**
		 * @events 今日订单数据刷新按钮点击事件
		 */
		onShuaXinIconClick :function (e) {
			var _this = this ;
			_this.renderOrderData_today( false );
		},


		/**
		 * @events 时间input点击时间
		 * @param e
         */
		onTimeInpClick : function(e){
			var _this = this ;
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
					max : _this.When.getSomeday(0),          //可选，默认为空""
					todayBeforeDisable : false,  //可选，今天之前的日期都不显示
					todayAfterDisable : false,   //可选，今天之后的日期都不显示
				})
			}

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
			$.ajax({
				url: "/r/Home_HomeOrder/saleTrends",    //请求的url地址
				dataType: "json",   //返回格式为json
				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				data: params,    //参数值
				type: "POST",   //请求方式
				timeout:10000,   //设置超时 10000毫秒
				beforeSend: function() {
					//请求前的处理
					_this.lineEchart.showLoading();
				},
				success: function(res) {
					//请求成功时处理
					if( res.code == 200 ){
						_this.lineEchart.hideLoading();
						var newArr = [] , oldArr = [] , xAxisArr = [] , i , j , k ,timeStr = '';

						for( i in res.data["new"]){
							newArr.push(res.data["new"][i])
						}
						for( j in res.data["old"] ){
							oldArr.push(res.data["old"][j])
						}
						//格式化日期，返回20170102  -->  2017/01/02  如果是周末  返回周六或周日
						for( k in res.data.timeLine ){
							timeStr = res.data.timeLine[k]["time"].replace(/\d{2,4}(?=(\d{2}){1,2}$)/g , "$&/");
							if( /0|6/.test( new Date(timeStr).getDay()) ){
								if( new Date(timeStr).getDay() === 0 ){
									timeStr = "周日" ;
								}else{
									timeStr = "周六" ;
								}
							}
							xAxisArr.push( timeStr );
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
									saveAsImage: false
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
								bottom: '15%',
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
					}else{
						_this.lineEchart.showLoading({
							text : '折线图暂无数据'
						});
					}

				},
				complete: function(res,status) {
					//请求完成的处理
					if(status=="timeout"){
						alert("折线图一请求超时")
					}
				},
				error: function() {
					//请求出错处理
					alert("折线图一请求出错")
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