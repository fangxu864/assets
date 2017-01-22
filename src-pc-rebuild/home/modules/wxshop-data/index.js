/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/line');

// 引入提示框和标题组件
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

require("./index.scss");
var Tpl = require("./index.xtpl");
var conLtTpl = require("./conbox_lt.xtpl");

var LoadingPC = require("COMMON/js/util.loading.pc.js");
module.exports = function(parent){
	var container = $('<div id="wxShopDataBox" class="wxShopDataBox modBox"></div>').appendTo(parent);
	var UserInfo = PFT.Util.Class({
		container : container,
		conLtTemplate : PFT.Util.ParseTemplate(conLtTpl),
		init : function(){
			var _this = this ;
			this.container.html(Tpl);
			this.wxShopLineEchart = echarts.init(document.getElementById('wxShopLineEchart'));
			//窗口变化时，echart重新渲染
			$(window).on("resize", function () {
				_this.wxShopLineEchart.resize()
			});
			//数据懒加载，当出现在视窗中才开始加载
			$("#G_Body").on("scroll.wxShopLineEchart" , function (e) {
				if( _this.container.offset().top < $(window).height() ){
					_this.renderConLeft();
					_this.renderWxShopLineEchart();
					$(this).off("scroll.wxShopLineEchart")
				}
			})
		},

		/**
		 * @method  渲染微商城数据左边部分
         */
		renderConLeft : function(){
			var _this = this ;
			var curContainer = this.container.find(".conBox .lt");
			var LoadingStr = LoadingPC("正在加载...",{
				tag : "tr",
				colspan : 6,
				width : 500,
				height : 200
			});
			PFT.Util.Ajax("/r/Home_HomeApp/getMicroMallStatistics/",{
				type : "get",
				params : {},
				loading : function(){
					curContainer.html(LoadingStr);
				},
				complete : function(res){
					if( res.code == 200 ){
						var html = _this.conLtTemplate({ data : res.data });
						curContainer.html(html);
					}else{
						curContainer.html( res.msg );
					}

				}
			});
		},

		/**
		 * @method  渲染微商城数据右边图表
		 */
		renderWxShopLineEchart : function () {
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
					_this.wxShopLineEchart.showLoading();
				},
				success: function(res) {
					//请求成功时处理
					console.log(res);
					_this.wxShopLineEchart.hideLoading();
					if( res.code == 200 ){
						var yAxisArr = [] , seriesDataArr = [] ;
						for( var key in res.data ){
							yAxisArr.unshift( res.data[key]["name"]);
							seriesDataArr.unshift( res.data[key]["total_money"])
						}
						var option = {
							// title: {
							// 	text: '最近销售趋势'
							// },
							tooltip : {
								trigger: 'axis'
							},
							legend: {
								data:['邮件营销']
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
									name:'联盟广告',
									type:'line',
									stack: '总量',
									areaStyle: {normal: {}},
									data:[220, 182, 191, 234, 290, 330, 310]
								}
							]
						};
						_this.wxShopLineEchart.setOption(option)
					}else{
						alert(res.msg)
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
	});


	return new UserInfo;
};