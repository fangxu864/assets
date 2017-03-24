
var MinueToDayTime = require("COMMON/js/util.minuToDayTime");

var Parse = require("COMMON/js/util.url.parse.query");//解析url参数

module.exports = function(params,opt){
    
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);

    PFT.Util.Ajax("/r/MicroPlat_Product/getBookInfo",{
        type : "post",
        params : {
            token : params.token,
            aid : params.aid,
            pid : params.pid
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            // res = res || {};
            // var code = res.code;
            // var data = res.data;
            // var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            // if(code==200){
            //     if(data){
            //         opt.success(data);
            //     }else{
            //         opt.empty(data);
            //     }
            // }else{
            //     opt.fail(msg);
            // }


            //志阳的
            res = res || {};
			var code = res.code;
			var data = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			if(code==200){


				// 什么时间有效
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
				//退房扣费

				var reb = data.reb; //当不符合阶梯退票的规则，则收取1元固定手续费
				var reb_type = data.reb_type;  // 1收取手续费元，0百分比
				data["reb"] = reb * 1;
				data["reb_type"] = reb_type * 1;

				//分批验证
				var batch_check = data.batch_check;
				var batch_day = data.batch_day;  //分批验证一天N张 0不限
				if(batch_check==1 && batch_day!=0){ //开启分批验证 并且不能设置为不限验证数
					data["batch_day"] = "本次提交的订单，每日最多使用" + batch_day + "张";
				}


				opt.success(data);

			}else if(code==207){
				var para = getpara();
				window.location.href = "login.html" + para ;	
			}else {
				opt.fail(msg);
			}


        }
    })


	function getpara(){
		var url = window.location.href;
		var urlPara = Parse(url);
		var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;
		delete urlPara[fullHost]
		var url = "?";
		for( var i in urlPara){
			url += i +"=" + urlPara[i] + "&";
		}
		url = url.substring( 0 , url.length-1 );

		return url
	}
}