
//封装ajax请求

module.exports = function(opt,toPage,totalPage){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

	//是否处于模拟数据状态
	var debug = true ;

	if(debug){
		console.log("模拟数据");

		if(toPage == undefined){
			toPage = 1;   //默认第一页
		}

		if(totalPage == undefined){
			totalPage = 5; //默认共五页
		}	

		//模拟数据data
		// var data={};
		// var listlength = 7;
		
		// data.code = 200;
		// data.msg = "success";
		// data.list = [];
		// for(var i = 0;i<listlength;i++){

		// 	(function(i){
		// 		var dataItem = {};		
		// 		dataItem.name = "员工姓名" + i ;
		// 		dataItem.time = "记录时间" + i ;
		// 		dataItem.content = "正常" + i ;
		// 		data.list.push(dataItem);
		// 	})(i)
				
		// }


		var dataGroup = [];

		for(var j = 0;j<totalPage;j++){

			(function(j){
				
				var data={};
				var listlength = 10;  //一页10条
				data.page = j;  //第几页
				data.code = 200;
				data.msg = "success";
				data.list = [];
				for(var i = 0;i<listlength;i++){

					(function(i,j){
						j = j+1;
						i = i+1;
						var dataItem = {};		
						dataItem.name = '第'+j+'页员工姓名第' + i +'行';
						dataItem.time = '第'+j+'页记录时间第' + i +'行';
						dataItem.content = '第'+j+'正常第' + i +'行';
						data.list.push(dataItem);
					})(i,j)
						
				}	

				dataGroup.push(data);

			})(j)

		}

		var nowdata = dataGroup[toPage-1];


		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success(nowdata);
		},1000)

		return false;
	}else{
		console.log("正式Ajax");
		PFT.Util.Ajax(PFT.Api.C.getBookInfo(),{
			type : "post",
			params : {
				pid : pid,
				aid : aid,
				token : PFT.Util.getToken()
			},
			loading : opt.loading,
			complete : opt.complete,
			success : function(res){
				res = res || {};
				var code = res.code;
				var data = res.data;
				var msg = res.msg || PFT.AJAX_ERROR_TEXT;
				if(code==200){
					var validTime = data.validTime;
					if(validTime==0){
						data["validTime"] = "仅当天有效";
					}else{
						var pre = data.validType==1 ? "下单后" : "游玩日期后";
						if(validTime.indexOf("~")<0){
							data["validTime"] = (pre+validTime+"天内有效");
						}else{
							data["validTime"] = (pre+validTime+"内有效");
						}
					}

					//验证时间（全天都可验时，不显示）
					//"verifyTime": -1  -1表示不限验证时间, [0,1,3,4,5,6]表示周一周二周四周五周六周日可验, 2016-08-01~2016-08-10表示此时间段可验
					var verifyTime = data.verifyTime;
					var verifyTimeResult = "限";
					if(verifyTime==-1){
						data["verifyTime"] = "";
					}else if(Object.prototype.toString.call(verifyTime)=="[object Array]"){
						for(var i in verifyTime){
							var str = {
								0 : "周日",
								1 : "周一",
								2 : "周二",
								3 : "周三",
								4 : "周四",
								5 : "周五",
								6 : "周六"
							}[verifyTime[i]];
							verifyTimeResult += (str + " ");
						}
						data["verifyTime"] = (verifyTimeResult + "使用");
					}else{
						data["verifyTime"] = "限" + verifyTime + "使用";
					}

					//2不可退，1游玩日期前可退，0有效期前可退
					var refund_rule = data.refund_rule;
					var refund_early_time = MinueToDayTime(data.refund_early_time);
					if(refund_rule==1){
						data["refund_rule_text"] = "有效期前"+refund_early_time+"可退";
					}else if(refund_rule==0){
						data["refund_rule_text"] = "游玩日期前可退";
					}else if(refund_rule==2){
						data["refund_rule_text"] = "不可退";
					}

					data.tickets.forEach(function(item,index){
						var buy_up = item.buy_up;   //限制最大购买张数(即一次最多只能购买多少张)
						var buy_low = item.buy_low; //限制最少购买张数(即一次最少需要购买多少张)
						if(buy_low==0) item["buy_low"] = -1;//后端返回0时，即表示不限 (这里要我吐槽一下坑爹的后端，一会是-1 一会是0)
						if(buy_up==0) item["buy_up"] = -1;
					})

					var reb = data.reb;
					var reb_type = data.reb_type;
					data["reb"] = reb * 1;
					data["reb_type"] = reb_type * 1;

					opt.success(data);

				}else{
					opt.fail(msg);
				}
			}
		})
	}

	
}














