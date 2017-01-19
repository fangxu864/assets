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
module.exports = function(parent){
	var container = $('<div id="wxShopDataBox" class="wxShopDataBox modBox"></div>').appendTo(parent);
	var UserInfo = PFT.Util.Class({
		container : container,
		template : PFT.Util.ParseTemplate(Tpl),
		init : function(){
			console.log(this.container);
			this.render();
			this.renderWxShopLineEchart()
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
		renderWxShopLineEchart : function () {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('wxShopLineEchart'));

			$.ajax({
				url: "/r/Home_HomeOrder/saleRank",    //请求的url地址
				dataType: "json",   //返回格式为json
				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				data: {},    //参数值
				type: "POST",   //请求方式
				timeout:10000,   //设置超时 10000毫秒
				beforeSend: function() {
					//请求前的处理
					myChart.showLoading();
				},
				success: function(res) {
					//请求成功时处理
					console.log(res);
					myChart.hideLoading();
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
						myChart.setOption(option)
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