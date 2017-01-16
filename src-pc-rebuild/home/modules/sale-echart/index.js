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
			this.renderLineEchart();
			this.renderPieEchart();
			this.renderBarEchart();
		},
		EVENTS : {
			"click #saleEchartBox .lineEchartControlBox .bTimeInp" : "onBTimeInpClick"
		},
		render : function(data){
			var html = this.template(data || {
					"name": "慢慢的店铺",   //账号名称
					"cname" : "天地银行",   //公司名称
					"type" : 1, //账号类型,0供应商,1分销商
					'hasAuth' : 1, //是否认证
					"remainMoney": 111,     //余额
					"expireDate" : "2012-1-1",   //到期时间
					"mobile": 123123123123,      //手机号
					"abnormalOrder" : 12,    //异常订单  ,
					"lastLogin" : "2012-1-1", //上次登陆时间
					"avatar" : "http://images.12301.cc/123624/1452148699.png" //头像
				});
			this.container.html(html);
		},
		renderLineEchart : function () {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('lineEchart'));
			var option = {
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : ['周一','周二','周三','周四','周五','周六','周日']
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'邮件营销',
						type:'line',
						stack: '总量',
						areaStyle: {normal: {}},
						data:[120, 132, 101, 134, 90, 230, 210]
					},
					{
						name:'联盟广告',
						type:'line',
						stack: '总量',
						areaStyle: {normal: {}},
						data:[220, 182, 191, 234, 290, 330, 310]
					},
					{
						name:'视频广告',
						type:'line',
						stack: '总量',
						areaStyle: {normal: {}},
						data:[150, 232, 201, 154, 190, 330, 410]
					},
					{
						name:'直接访问',
						type:'line',
						stack: '总量',
						areaStyle: {normal: {}},
						data:[320, 332, 301, 334, 390, 330, 320]
					},
					{
						name:'搜索引擎',
						type:'line',
						stack: '总量',
						label: {
							normal: {
								show: true,
								position: 'top'
							}
						},
						areaStyle: {normal: {}},
						data:[820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			};

			// 绘制图表
			myChart.setOption(option);
		},
		renderPieEchart : function () {

			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('pieEchart'));
			var option = {
				title : {
					text: '7天产品使用排行',
					subtext: '纯属虚构',
					x:'center'
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
				},
				series : [
					{
						name: '访问来源',
						type: 'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:[
							{value:335, name:'直接访问'},
							{value:310, name:'邮件营销'},
							{value:234, name:'联盟广告'},
							{value:135, name:'视频广告'},
							{value:1548, name:'搜索引擎'}
						],
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

			// 绘制图表
			myChart.setOption(option);
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
	});


	return new saleEchart;
};