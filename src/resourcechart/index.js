/**
 * Created by Administrator on 2016/8/16.
 */
require("./index.scss");
var tpl=require("./index.xtpl");

var echarts = require('echarts');
// // 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');
// // 引入饼状图和地图
// require('echarts/lib/chart/pie');
// require('echarts/lib/chart/map');
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
// require('echarts/lib/component/legend');
//引入中国地图json数据
var chinaJson=require("./china.json");



var Rchart={
    init:function(){
        $(".rChart_box").html(tpl);
        this.wu=100;
        this.initChart1();
        this.initChart2();
        this.initChart3();
        this.initChart4();
    },
    initChart1:function(){
        var _this=this;
        // 基于准备好的dom，初始化echarts实例
       this.chart1 = echarts.init(document.getElementById('jingqu_jibie'));
        // 绘制图表
        var option = {
            backgroundColor: '#f2f2f2',
            title : {
                text: '景区级别',
                subtext: '好多级别',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['5A','4A','3A','其它']
            },
            series : [
                {
                    name: '所占比例',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:_this.wu, name:'5A'},
                        {value:310, name:'4A'},
                        {value:234, name:'3A'},
                        {value:135, name:'其它'}
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
        this.chart1.setOption(option);
        this.chart1.on("click",function(params){
            console.log(params)
            console.log(params.name);
        })
    },
    initChart2:function(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fenxiao_pingtai'));
        // 绘制图表
        var option = {
            backgroundColor: '#f2f2f2',
            title : {
                text: '分销平台',
                subtext: '好多平台',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: ['票付通','乐乐酷','票工厂','智游宝','任我游','票管家']
            },
            series : [
                {
                    name: '所占比例',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:1000, name:'票付通'},
                        {value:310, name:'乐乐酷'},
                        {value:234, name:'票工厂'},
                        {value:135, name:'智游宝'},
                        {value:135, name:'任我游'},
                        {value:135, name:'票管家'}
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




        myChart.setOption(option);
    },
    initChart3:function(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piaowu_system'));
        // 绘制图表
        var option = {
            backgroundColor: '#f2f2f2',
            title : {
                text: '票务系统',
                subtext: '好多系统',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['浙江深大','福建九天达','深圳鼎游','上海大漠']



            },
            series : [
                {
                    name: '所占比例',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:500, name:'浙江深大'},
                        {value:310, name:'福建九天达'},
                        {value:234, name:'深圳鼎游'},
                        {value:135, name:'上海大漠'},
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




        myChart.setOption(option);
    },
    initChart4:function(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('area_fenbu'));
        // 绘制图表
        echarts.registerMap('china', chinaJson);
        myChart.setOption({
            backgroundColor: '#f2f2f2',
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            series: [
                {
                    name: '中国',
                    type: 'map',
                    mapType: 'china',
                    selectedMode : 'multiple',
                    // label: {
                    //     normal: {
                    //         show: true
                    //     },
                    //     emphasis: {
                    //         show: true
                    //     }
                    // },
                    data:[
                        {name:'福建', selected:true}
                    ]
                }
            ]
        });

        myChart.on("click",function(params){
            console.log(params.name);
        })
    }
};


$(function($){
    Rchart.init();

    setTimeout(function(){
        Rchart.wu=300;
        Rchart.chart1.setOption({
            series : [
                {
                    data:[
                        {value:Rchart.wu, name:'5A'},
                        {value:310, name:'4A'},
                        {value:234, name:'3A'},
                        {value:135, name:'其它'}
                    ]
                }
            ]
           });
        console.log(Rchart.wu);
        setTimeout(function(){
            Rchart.wu=800;
            Rchart.chart1.setOption({
                series : [
                    {
                        data:[
                            {value:Rchart.wu, name:'5A'},
                            {value:310, name:'4A'},
                            {value:234, name:'3A'},
                            {value:135, name:'其它'}
                        ]
                    }
                ]
            });
            console.log(Rchart.wu)
            setTimeout(function(){
                Rchart.wu=1000;
                Rchart.chart1.setOption({
                    series : [
                        {
                            data:[
                                {value:Rchart.wu, name:'5A'},
                                {value:310, name:'4A'},
                                {value:234, name:'3A'},
                                {value:135, name:'其它'}
                            ]
                        }
                    ]
                });
                console.log(Rchart.wu)
                setTimeout(function(){
                    Rchart.wu=1300;
                    Rchart.chart1.setOption({
                        series : [
                            {
                                data:[
                                    {value:Rchart.wu, name:'5A'},
                                    {value:310, name:'4A'},
                                    {value:234, name:'3A'},
                                    {value:135, name:'其它'}
                                ]
                            }
                        ]
                    });
                    console.log(Rchart.wu)
                },5000)
            },5000)
        },5000)
    },5000)

});