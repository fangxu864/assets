
require("./index.scss");
require("./xscrolljs/pullup.js");
require("./xscrolljs/xscroll.js");


console.log("service");

var product_order_service = function(opts){

	var debug = false ;

	if(debug){
		console.log("模拟数据data");
		//模拟数据data



		//奔程给的spot_title的数据格式
		// {
		//     "code": 200,
		//     "data": {
		//         "list": [
		//             {
		//                 "lid": "14031",
		//                 "title": "测试排序",
		//                 "p_type": "A",
		//                 "addr": "是打发第三方",
		//                 "px": "10",
		//                 "area": "2|54|0",
		//                 "imgpath": "http://wx.12301.local/images/defaultThum.jpg",
		//                 "minprice": "1.00"
		//             },
		//             {
		//                 "lid": "14067",
		//                 "title": "测试转分销联票 勿动",
		//                 "p_type": "A",
		//                 "addr": "广东",
		//                 "px": 0,
		//                 "area": "18|298|0",
		//                 "imgpath": "http://wx.12301.local/images/defaultThum.jpg",
		//                 "minprice": "0.30"
		//             }
		//         ],
		//         "lastLid": 0,
		//         "lastProPos": 2
		//     },
		//     "msg": "获取产品列表成功"
		// }















		opts.loading();
		setTimeout(function(){
			opts.complete();
			opts.success(data);
		},1000);
		

		return false;


	}else{

		console.log("2");

	}



} 
























console.log("index");

var product_order = {

	init : function(){
		
		this.temp = "";

		console.log("123");

		this.renderScroll();

	},

	renderScroll : function(){

		var that = this;
		console.log(XScroll);

		var xscroll = new XScroll({
			renderTo:"#x_scroll",
			lockY:false,
			container:"#x_container",
			content:"#x_content"
		});
		var pullup = new XScroll.Plugins.PullUp({
			upContent:"上拉加载更多...",
			downContent:"释放以加载更多...",
			loadingContent:"加载中...",
			bufferHeight:0,
			height : 50
		});
		var getData = function(){

			that.getTemp();
			console.log()
			$("#x_content").append(that.temp);
			that.temp = "";

			xscroll.render();
			pullup.complete();

		}
		xscroll.plug(pullup);
		pullup.on("loading",function(){
			getData();
		});
		getData();

	},



	getTemp : function(){

		for(var i = 0;i<5;i++){
			this.temp +='<div class="product_order_list_gap"></div>';

			this.temp +='<ul class="product_order_spot">' +
							'<li class="spot_title">' +
								'<a href="" class="product_detail_link">' +
									'<div class="spot_img"></div>' +
									'<div class="spot_right">' +
										'<span class="spot_name">福建特色景区</span><br>' +
										'<span class="spot_info">[厦门] 供应商：545454315454856</span>' +
									'</div>' +
								'</a>' +
							'</li>' ;

			for(var j = 0;j<3;j++){
			this.temp +=	'<li class="spot_ticket">' +
								'<a href="" class="write_order_link">' +
									'<span class="spot_ticket_name">xxxxxxxx成人票</span>' +
									'<span class="spot_ticket_price">113元</span>' +
									'<i class="spot_ticket_arr">></i>' +
								'</a>' +
							'</li>';
			}				
			

							
			this.temp +=	'<li class="spot_ticket_more spot_ticket">' +
								'<a href="" class="spot_ticket_more_link">' +
									'更多' +
									'<i class="spot_ticket_more_arr">></i>' +
								'</a>' +
							'</li>' +
						'</ul>';
		}
		

	},

	getList : function(){

		var that = this;

		product_order_service({

			loading : function(){
				console.log("loading");
			},
			complete : function(){
				console.log("complete");
			},
			success : function(res){
				console.log("success");
			}

		});

	}

	

}	



$(function(){

	product_order.init();	


});






