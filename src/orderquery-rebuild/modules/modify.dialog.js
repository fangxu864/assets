/**
 * Created by Administrator on 15-12-3.
 */
require('./modify.dialog.scss');

var dialog = null;
var dialog_speed = 100;

var touristTpl = require('../tpl/tourist.xtpl'),
	parseTouristTpl = PFT.Util.ParseTemplate( touristTpl );

var ModifyDialog = RichBase.extend({
	statics : {
		modifyBtn : null,
		isPositiveNum : function(count){
			count = String(count);
			var type="^[0-9]*[1-9][0-9]*$";
			var re = new RegExp(type);
			if(count.match(re) == null){
				return false;
			}
			return true;
		}
	},

	isTouristInfoLoaded: false,

	touristInfo: 0, 		// type Number, 身份证信息类型，0 无需填写，1 只需填一位，2 一票一证

	init : function(){},

	onCountInpChange : function(tarInp,newVal,oldVal){
		var parent = tarInp.parent(),
			addBtn = parent.children(".addBtn"),
			minuBtn =  parent.children(".minuBtn"),
			min = tarInp.attr("data-min"),
			max = tarInp.attr("data-max"),
			listUl = tarInp.parents(".tlist"),
			listLis = listUl.children(),
			tarListLi = tarInp.parents(".ticketLi"),
			totalInput = this.getTotalTickets(),
			originTicketNum = this.getOriginTicketNum(),
			html;

		if(newVal==oldVal) return false;

		if(newVal>oldVal){ //增加
			if(addBtn.hasClass("disable")) return tarInp.val(oldVal);
			minuBtn.removeClass("disable");
			if(newVal<=max){
				tarInp.val( newVal );
				newVal==max ? addBtn.addClass("disable") : addBtn.removeClass("disable");
				totalInput = this.getTotalTickets();

				//一票一证  当输入框总和大于游客信息总和，添加游客信息输入框
				if( this.touristInfo == 2 ) {
					if( totalInput > originTicketNum ) {
						html = parseTouristTpl({ data:[] });

						$('#dialogTouristList').append( html );
					} else {
						$('#dialogTouristList').children(':hidden').eq(0).show();

						$('#dialogTouristList').children(':visible').find('.icon-shanchu').hide();

						// if( totalInput == originTicketNum ) {
						// 	$('#dialogTouristList').children().find('.icon-shanchu').hide();
						// } else {}
					}
				}
			}else{
				addBtn.addClass("disable");
			}
		}else{ //减少
			if( minuBtn.hasClass("disable") ) return tarInp.val( oldVal );
			//新需求 2016-03-28
			//点击“修改”，对于“未验证”的联票订单  主票、子票 不能全为0，只要有一个票种票数为1 就可以
			//对于“部分验证“的订单（含联票），主票、子票都可以为0(即如果是单票/套票，对于“未验证”的还是
			// 原来的方式，票数至少为1，对于部分验证的单票，票数可以为0)
			if(min=="0|1"){
				if( listLis.length ){ //如果是联票
					var siblingInps = tarListLi.siblings().find(".numInp");
					var min = (function( siblingInps ){
						var min = 1;
						siblingInps.each(function(){
							var tarLi = $(this),
								val = tarLi.val();
							if( val>0 ){
								min = 0;
								return false;
							}
						});
						return min;
					})(siblingInps);
				}else{ //如果是单票
					min = 1;
				}
			}

			if(newVal<=min){

				newVal = min;
				minuBtn.addClass("disable");

				if(newVal==1){
					tarListLi.siblings().find(".numInp").each(function(){
						var tarInp = $(this);
						if(tarInp.val()!="0") tarInp.removeClass("disable");
					})
				}

			}else{
				minuBtn.removeClass("disable");
			}

			if(newVal>max){

				newVal=max;
				addBtn.addClass("disable");

			}else{
				addBtn.removeClass("disable");
			}

			tarInp.val(newVal);
			totalInput = this.getTotalTickets();

			//一票一证  当输入框总和大于游客信息总和，添加游客信息输入框
			if( this.touristInfo == 2 ) {
				if( totalInput < originTicketNum ) {
					$('#dialogTouristList').children().find('.icon-shanchu').show();
				} else {
					$('#dialogTouristList').children(':last-child').remove();
				}
			}
		}
	},

	open : function(tarBtn,ordernum){
		var that = this;

		var title = $("#landTit_"+ordernum).text(),
			dialogTpl = $("#modTicDiaTpl").html(),
			con = that.parseTemplate(dialogTpl,{ ticketList: "" });

		if(!dialog) dialog = that.createDialog();

		dialog.open({
			title : title,
			content : con,
			offset : -100,
			onBeforeOpen : function(){
				that.touristInfo = +tarBtn.attr('data-tourist-info');

				that.renderTicketList( tarBtn, ordernum );

				that.renderTouristInfo( tarBtn, ordernum );

				that.statics.modifyBtn = tarBtn;
				$("#modifyTicket_ordernum_hidInp").val(ordernum);
				$("#dialog-yes-btn").attr("data-ordernum",ordernum);
			}
		})
	},

	createDialog : function(){
		var self = this;
		var dialogTpl = $("#modTicDiaTpl").html();

		var con = self.parseTemplate(dialogTpl,{ ticketList: "" });

		dialog = new PFT.Dialog({
			content : con,
			speed : dialog_speed,
			EVENTS : {
				"click" : {
					//确认修改
					".modTicketDialogCon .modifyBtn" : function(that,e){
						e.preventDefault();

						if( self.touristInfo == 2 ) {
							var totalInput = self.getTotalTickets(),
								totalTouristInfo = $('#dialogTouristList').children(':visible'),
								totalTouristInfoLen = totalTouristInfo.length;

							if( totalInput != totalTouristInfoLen ) {
								alert( '游客信息数必须等于票数！' );
								return false;
							}

							for( var i=0; i<totalTouristInfoLen; i++ ) {
								var tourist_name = totalTouristInfo.eq(i).find('.inp-name'),
									tourist_idcard = totalTouristInfo.eq(i).find('.inp-idcard');

								if( !$.trim( tourist_name.val() ) || (/[`~!@#\$%￥\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im).test( tourist_name.val() ) ) {
									tourist_name.addClass('error');
								}
								if( !$.trim( tourist_idcard.val() ) || !self.isCnNewID( tourist_idcard.val() ) ) {
									tourist_idcard.addClass('error');
								}
							}

							if( $('#dialogTouristList').find('.error').length ) {
								alert('请修正错误游客信息！');
								return false;
							}
						}

						that.close();
						self.fire("ticket.modify",{
							ordernum : $(e.currentTarget).attr("data-ordernum"),
							tarBtn : self.statics.modifyBtn
						});
					},

					//取消修改
					".modTicketDialogCon .cannelModifyBtn" : function(that,e){
						e.preventDefault();
						that.close();
					},

					//减票数
					".modTicketDialogCon .minuBtn" : function(that,e){
						var tarBtn = $(e.currentTarget);
						if(tarBtn.hasClass("disable")) return false;
						var tarInp = tarBtn.parent().children(".numInp");
						var oldVal = tarInp.val()*1;
						var newVal = oldVal-1;

						// 一票一证时 等待游客信息加载完成再开启加减票数
						if( self.touristInfo == 2 ) {
							self.isTouristInfoLoaded && self.onCountInpChange(tarInp,newVal,oldVal);
						} else {
							self.onCountInpChange(tarInp,newVal,oldVal);
						}
					},

					//加票数
					".modTicketDialogCon .addBtn" : function(that,e){
						var tarBtn = $(e.currentTarget);
						if(tarBtn.hasClass("disable")) return false;
						var tarInp = tarBtn.parent().children(".numInp");
						var oldVal = tarInp.val()*1;
						var newVal = oldVal+1;

						// 一票一证时 等待游客信息加载完成再开启加减票数
						if( self.touristInfo == 2 ) {
							self.isTouristInfoLoaded && self.onCountInpChange(tarInp,newVal,oldVal);
						} else {
							self.onCountInpChange(tarInp,newVal,oldVal);
						}
					},

					// 删游客信息
					'#touristInfo .icon-shanchu': function( that, e ){
						var tarBtn = $(e.currentTarget),
							tarTouristId = tarBtn.siblings('.inp-id').length ? tarBtn.siblings('.inp-id').val() : '';

						var totalTouristInfo = $('#dialogTouristList').children(':visible'),
							totalTouristInfoLen = $('#dialogTouristList').children(':visible').length,
							totalInput = self.getTotalTickets();

						if( totalInput < totalTouristInfoLen ) {
							// if( tarTouristId ) {
							// 	$('#dialogTouristList').attr('data-deleted', deletedTourist ? deletedTourist + ',' + tarTouristId : tarTouristId);
							// }
							tarBtn.parent().hide();

							if( totalInput == $('#dialogTouristList').children(':visible').length ) {
								totalTouristInfo.find('.icon-shanchu').hide();
							}
						}
					}

					// 新增游客信息
					// '#touristInfo .btn-addtourist': function( that, e ){
					// 	var tarBtn = $(e.currentTarget);

					// 	if( !tarBtn.is('.disabled') ) {
					// 		var html = parseTouristTpl({ data:[] });

					// 		$('#dialogTouristList').append( html );

					// 		var totalInput = self.getTotalTickets(),
					// 			totalTouristInfo = $('#dialogTouristList').children().length;

					// 		if( totalInput <= totalTouristInfo ) {
					// 			$('#touristInfo .btn-addtourist').addClass('disabled');
					// 		}
					// 	}
					// }
				},
				"focus" : {
					".modTicketDialogCon .numInp" : function(that,e){
						var tarInp = $(e.currentTarget);
						tarInp.attr("data-lastval",tarInp.val());
					}
				},
				"blur" : {
					".modTicketDialogCon .numInp" : function(that,e){
						var tarInp = $(e.currentTarget);
						var val = tarInp.val() * 1;
						var lastVal = tarInp.attr("data-lastval") * 1;
						if(val==lastVal) return false;
						if(!self.statics.isPositiveNum(val)){
							tarInp.val(lastVal);
						}
						self.onCountInpChange(tarInp,val,lastVal);
					}
				},
				"input propertychange" : {
					"#dialogTouristList .inp-name, #dialogTouristList .inp-idcard" : function(that,e){
						var tarInp = $(e.currentTarget);
						tarInp.hasClass('error') && tarInp.removeClass('error');
					}
				}
			}
		});
		return dialog;
	},

	getTotalTickets: function(){
		var ticModListUl = $('#ticModListUl'),
			numInps = ticModListUl.find('.numInp'),
			totalInput = 0;

		for( var i = 0, len = numInps.length; i<len; i++ ) {
			totalInput += Number( numInps.eq( i ).val() );
		}

		return totalInput;
	},

	getOriginTicketNum: function(){
		var ticModListUl = $('#ticModListUl'),
			numInps = ticModListUl.find('.numInp'),
			originNum = 0;

		for( var i = 0, len = numInps.length; i<len; i++ ) {
			originNum += Number( numInps.eq( i ).attr('data-firstval') );
		}

		return originNum;
	},

	renderTicketList: function( tarBtn, ordernum ){
		var that = this;

		var isAjaxRequired = false;

		var tickets = tarBtn.attr("data-ticket").split("&"),
			list = "",
			tmin,
			tmax,
			// originTNumArr = tarBtn.attr('data-origin-tnum').split(','),		// type Array, 订单初始票数
			modRateArr = tarBtn.attr('data-mod-rate').split(','),			// type Array, 每个票类增加减少比例
			pidArr = tarBtn.attr('data-pids').split(','), 					// num_mapping需要pid
			ticModListUl = $('#ticModListUl');

		var is_all_not_terminal = (function(tickets){ //判断联票是未验证(即其所有子票均未验证) 还是部分验证
			var result = true;
			for(var i in tickets){
				var t = tickets[i].split("|");
				var has_terminal_num = t[3];
				if(typeof has_terminal_num!="undefined"){
					has_terminal_num = has_terminal_num*1 || 0;
				}else{
					has_terminal_num = 0;
				}
				if(has_terminal_num!==0){
					result = false;
					break;
				}
			}
			return result;
		})(tickets);

		if( is_all_not_terminal ){ //未验证
			tmin = "0|1";
		}else{ //已验证
			tmin = "0";
		}

		for( var i = 0, len = modRateArr.length; i<len; i++ ) {
			if( +modRateArr[i] > 0 ) {
				isAjaxRequired = true;
				break;
			}
		}

		if( isAjaxRequired ) {
			PFT.Ajax({
				url: "/r/Order_OrderModify/getOriginTicketNum",
				type: "post",
				dataType: "json",
				data: {
					order_num: ordernum
				},
				loading: function () {
					ticModListUl.text("加载中");
				},
				removeLoading: function () {
					ticModListUl.text("");
				},
				timeout: function (res) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">请求票数超时，请稍后重试</p>');
				},
				serverError: function (res) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">请求票数出错，请稍后重试</p>');
				}
			}, function ( res ) {
				if( res.code == 200 ) {
					var originTNumArr = res.data;

					ticModListUl.html( that.renderTicketListData( tickets, modRateArr, pidArr, res.data, tmin ) );
				} else {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">' + res.msg + '</p>');
				}
			});
		} else {
			ticModListUl.html( that.renderTicketListData( tickets, modRateArr, pidArr, [], tmin ) );
		}
	},

	renderTicketListData: function( tickets, modRateArr, pidArr, originTNumArr, tmin ) {
		var ticket_min,
			ticket_max,
			originTNumArr = originTNumArr || [],
			listTpl = $("#modTicDiaList").html(),
			list = '',
			temp;


			// console.log( tickets )

		//新需求 2016-03-28
		//点击“修改”，对于“未验证”的联票订单  主票、子票 不能全为0，只要有一个票种票数为1 就可以
		//对于“部分验证“的订单（含联票），主票、子票都可以为0(即如果是单票/套票，对于“未验证”的还是
		// 原来的方式，票数至少为1，对于部分验证的单票，票数可以为0)
		for(var i in tickets){
			var t = tickets[i].split("|"),
				tname = t[0],
				tnum = t[1],
				tid = t[2],
				has_terminal_num = t[3],
				originMax,
				originMin;

			if(typeof has_terminal_num!="undefined"){
				has_terminal_num = has_terminal_num*1;
			}else{
				has_terminal_num = 0;
			}

			var readonly = tnum==1 ? "readonly" : "";

			// modified 20170509
			// 增加减少人数比例大于0，添加判断更改初始加减按钮的className
			var modRate = +modRateArr[i],
				originTNum = +originTNumArr[ tid ],
				addBtnCls,
				minusBtnCls;

			if( modRate ) {
				if( !originTNum || ( originTNum && isNaN( originTNum ) ) ) {
					PFT.Help.AlertTo("fail", '<p style="width:300px;">缺少参数: 初始票数</p>');
					return false;
				}

				// 增加减少比例不为0, 重置min / max
				originMax = originTNum + Math.ceil( originTNum * modRate / 100 );
				originMin = originTNum - Math.ceil( originTNum * modRate / 100 );

				addBtnCls = tnum >= originMax ? "disable" : '';
				minusBtnCls = tnum <= originMin ? "disable" : '';

				ticket_max = originMax - has_terminal_num,
				ticket_min = (temp = originMin - has_terminal_num) >= 0 ? temp : 0;
			} else {
				ticket_max = tnum - has_terminal_num;
				ticket_min = tmin;
				addBtnCls = "disable";
				minusBtnCls = "";
			}

			if( tnum==0 ) minusBtnCls = "disable";

			console.log( ticket_min );
			list += this.parseTemplate(listTpl,{
				tname : tname,
				tnum : tnum-has_terminal_num,
				has_terminal_num : has_terminal_num,
				tid : tid,
				pid : pidArr[i],
				tmin : ticket_min,
				tmax : ticket_max,
				addBtnCls : addBtnCls,
				minusBtnCls : minusBtnCls,
				origin_tnum: originTNum,
				mod_rate: isNaN( modRate ) ? 0 : modRate
			});
		}

		return list;
	},

	renderTouristInfo: function( tarBtn, ordernum ) {
		var that = this;

		var touristContainer = $('#touristInfo');

		if( that.touristInfo == 2 ) {
			!touristContainer.find('.tourist-title').length && touristContainer.append('<p class="tourist-title"><em id="dialogTouristChanged"></em>游客信息<a class="btn-addtourist disabled" style="display: none;">新增</a></p>');

			!$('#dialogTouristStat').length && touristContainer.append('<div id="dialogTouristStat">加载中</div>');
			!$('#dialogTouristList').length && touristContainer.append('<ul id="dialogTouristList"></ul>');

			PFT.Ajax({
				url: "/r/Order_OrderModify/getOrderTouristInfo",
				type: "post",
				dataType: "json",
				data: {
					ordernum: ordernum
				},
				loading: function () {
					that.isTouristInfoLoaded = false;
					$('#dialogTouristStat').text('加载中').show();
				},
				removeLoading: function () {
					$('#dialogTouristStat').hide();
				},
				timeout: function (res) {
					$('#dialogTouristStat').text('请求游客信息超时，请稍后重试').fadeIn();
					// PFT.Help.AlertTo("fail", '<p style="width:300px;">请求游客信息超时，请稍后重试</p>');
				},
				serverError: function (res) {
					$('#dialogTouristStat').text('请求游客信息出错，请稍后重试').fadeIn();
					// PFT.Help.AlertTo("fail", '<p style="width:300px;">请求游客信息出错，请稍后重试</p>');
				}
			}, function ( res ) {
				var html;

				if( res.code == 200 ) {
					that.isTouristInfoLoaded = true;
					html = parseTouristTpl({ data: res.data.idCardArray });
					$('#dialogTouristList').html( html );
				} else {
					$('#dialogTouristStat').text('请求游客信息出错，请稍后重试').fadeIn();
					// PFT.Help.AlertTo("fail", '<p style="width:300px;">请求游客信息出错，请稍后重试</p>');
				}
			});
		}
	},

	//身份证检测
	isCnNewID: function( code ) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    // if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
    //     tip = "身份证号格式错误";
    //     pass = false;
    // }

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }

    else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    if(!pass);
    return pass;
}
});
module.exports = ModifyDialog;