var MinueToDayTime = require("COMMON/js/util.minuToDayTime");
var CalendarCore = require("COMMON/js/calendarCore.js");






module.exports = function(params,opt){

	opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);


	if(!!opt.debug){
		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success({

				extra : {
					beginDate : CalendarCore.gettoday(),
					endDate : CalendarCore.nextDay()
				},



				"validTime": "仅当天有效", //0表示当天有效，20表示20天内有效, 2016-08-01~2016-08-10表示此时间段内有效
				"verifyTime": "周一周五周日可验", // -1表示不限验证时间, [0,1,3,4,5,6]表示周一周二周四周五周六周日可验, 2016-08-01~2016-08-10表示此时间段可验
				"refund_rule": "1",     //2不可退，1游玩日期前可退，0有效期前可退
				"refund_rule_text" : "游玩日期前30分钟内可退",
				"refund_early_time": "60",  //有效期前多少分钟可退
				"reb" : 100 ,        //当不符合阶梯退票的规则，则收取1元固定手续费
				"cancel_cost": [        //阶梯退票手续费
					{
						"c_days": "1563",   //1563分钟之内
						"c_type": "1",      //收取固定金额 or 百分比
						"c_cost": "1200"    //收取12元 （单位：分）
					},
					{
						"c_days": "184",
						"c_type": "1",
						"c_cost": "1400"
					},
					{
						"c_days": "4320",
						"c_type": "0",
						"c_cost": "40"  //收取票价的百分40
					}
				],
				"assStation": [ //仅当线路产品时返回
					"东土大唐到西天取经",
					"农业银行直达建行厕所"
				],
				"needID": "2",  //是否需要填写身份证
				"title": "【测试】联票订单测试",   //景区名称,
				"p_type" : "A", //景区类型
				//门票列表
				tickets : [{
					"title": "成人票and可乐赠饮",
					"jsprice": 13,
					"tprice": "14.00",
					"zone_id" : "602",
					"pid": "1",
					"tid": "1753",
					"buy_low": "4",   //最小购买张数
					"buy_up": "7",
					"sonTickets": [ //套票才有
						{
							"pid": "3563",
							"lid": "3221",
							"title": "【测试】周五测试（勿买勿删）成人票",
							"num": "1",
							"p_type": "A"
						},
						{
							"pid": "3565",
							"lid": "3222",
							"title": "【测试】没那么简单成人测试测试票",
							"num": "2",
							"p_type": "A"
						}
					]
				},{
					"title": "成人票and可乐赠饮",
					"jsprice": 13,
					"tprice": "14.00",
					"pid": "2",
					"tid": "07536",
					"buy_low": "-1",   //最小购买张数
					"buy_up": "-1"
				},{
					"title": "成人票and可乐赠饮",
					"jsprice": 13,
					"tprice": "14.00",
					"pid": "3",
					"tid": "57536",
					"buy_low": "-1",   //最小购买张数
					"buy_up": "-1"
				}]
			})
		},500)

		return false;
	}

	PFT.Util.Ajax("/r/Book_Booking/getBookInfo/",{
		type : "post",
		params : params,
		loading : opt.loading,
		complete : opt.complete,
		success : function(res){
			res = res || {};
			var code = res.code;
			var data = res.data;
			var msg = res.msg || PFT.AJAX_ERROR_TEXT;
			var extra = {};
			if(code==200){
				

				var validTime = data.validTime;
				if(validTime==0){
					extra["validTime"] = "仅当天有效";
				}else{
					var pre = data.validType==1 ? "下单后" : "游玩日期后";
					if(validTime.indexOf("~")<0){
						extra["validTime"] = (pre+validTime+"天内有效");
					}else{
						extra["validTime"] = (pre+validTime+"内有效");
					}
				}

				//验证时间（全天都可验时，不显示）
				//"verifyTime": -1  -1表示不限验证时间, [0,1,3,4,5,6]表示周一周二周四周五周六周日可验, 2016-08-01~2016-08-10表示此时间段可验
				var verifyTime = data.verifyTime;
				var verifyTimeResult = "限";
				if(verifyTime==-1){
					extra["verifyTime"] = "验证时间不限";
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
					extra["verifyTime"] = (verifyTimeResult + "使用");
				}else{
					extra["verifyTime"] = "限" + verifyTime + "使用";
				}

				//2不可退，1游玩日期前可退，0有效期前可退
				var refund_rule = data.refund_rule;
				var refund_early_time = MinueToDayTime(data.refund_early_time);
				if(refund_rule==1){
					extra["refund_rule"] = "有效期前"+refund_early_time+"可退";
				}else if(refund_rule==0){
					extra["refund_rule"] = "游玩日期前可退";
				}else if(refund_rule==2){
					extra["refund_rule"] = "不可退";
				}


				var reb = data.reb;
				var reb_type = data.reb_type;

				if(reb_type==1){ //1收取手续费元，0百分比,
					extra["reb"] = reb/100 + "元";
				}else{
					extra["reb"] = reb + "%";
				}


				//涉及到钱的，后端都是以分单位返回，前端需要显示成元
				var tickets = data.tickets;
				for(var i=0,len=tickets.length; i<len; i++){
					var ticket = tickets[i];
					var ext = ticket.extra || (ticket.extra={});
					// ext["js"] = ticket.js/100;
					// ext["ls"] = ticket.ls/100;
					ext["js"] = ticket.js;
					ext["ls"] = ticket.ls;
					ext["reb"] = extra["reb"];
				}


				var batch_check = data.batch_check;
				var batch_day = data.batch_day;
				if(batch_check==1 && batch_day!=0){ //开启分批验证 并且不能设置为不限验证数
					extra["batch_day"] = "本次提交的订单，每日最多使用" + batch_day + "张";
				}

				data["extra"] = extra;

				opt.success(data);

			}else{
				opt.fail(msg,code);
			}
		},
		timeout : function(){
			opt.timeout();
		},
		serverError : function(){
			opt.serverError();
		}
	})
}