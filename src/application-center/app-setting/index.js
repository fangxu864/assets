/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");
var Checkbox = require('../common/js/checkbox');
var getInfoAjaxUrl = require('../common/js/ajaxurl.js')['getAppDetail'];
var getRecommendAppsAjaxUrl = require('../common/js/ajaxurl.js')['getRecommendApps'];
var updateModuleAjaxUrl = require('../common/js/ajaxurl.js')['updateApp'];
// var loadingHTML = require("COMMON/js/util.loading.pc.js");

var Main = PFT.Util.Class({
	init : function(){

		var that = this;

		this.id = this.getId();//获取当前模块的id

		this.handleCheckBox();
		
		this.getModuleListRecommend({//获取推荐的模块列表
			loading : function(){
			},
			complete : function(){
			},
			success : function(data){

				var _data = data.data;
			    var code = data.code;
			    var msg = data.msg;
			    that.renderRecommendList(_data);

			    that.getInfoAjax({   //获取已有的信息 //当推荐模块请求成功之后
			        loading : function(){
			        },
			        complete : function(){
			        },
			        success : function(infodata){

			        	var _infodata = infodata.data;
			            var infocode = infodata.code;
			            var infomsg = infodata.msg;

			            that.appendInfo(_infodata);

			        }
			    });

			}
		});


		$("#confirm").on("click",function(){
			that.updateModuleAjax({
				loading : function(){
				},
				complete : function(){
				},
				success : function(data){

					var _data = data.data;
				    var code = data.code;
				    var msg = data.msg;

				    if(code == 200){
				    	alert(msg);
				    	//跳转回页面
				    	window.location = '/new/appcenter_applist.html';
				    }else if(code == 400){
				    	//弹窗错误信息
				    	alert(msg);
				    }

				}
			});
		});



	},

	handleCheckBox : function(){

		//是否免费试用
		new Checkbox({
			selector: '#chkboxFreeTrial',
			callbacks: {
				toggleFreeTrial: function () {
					if($(this).is('.checked')) {
						$('#daysFreeTrial').prop('disabled', false);
					} else {
						$('#daysFreeTrial').prop('disabled', true);
						$('#daysFreeTrial').val("");
					}
				}
			}
		});
		//关联推荐
		new Checkbox({
			selector: '#recommendApp .checkbox',
			callbacks: {
				recommendLimited: function (cxt) {
					console.log(this.className)
					if($('#recommendApp').children('.checked').length > 3) {
						cxt.unCheck(this);
						alert('推荐应用不能超过3个');
					}
				}
			}
		});


	},


	getId : function(){
		var url = window.location.href;
		if( url.indexOf("?") > 0 ){
			var urlSplited = url.split("?");
			var idSplited = urlSplited[1].split("=");
			var id = idSplited[1];
			return id
		}else{
			console.log("没有id参数");
			return -1
		}
	},

	updateModuleAjax : function(opts){

		var that = this;

		var introduce = $("#introduce").val(); //应用介绍
		var summary = $("#summary").val(); //模块描述
		var freeDays = $("#daysFreeTrial").val();
		if(freeDays.length == 0){ //不免费的情况
			freeDays = 0;
		}
		var linkModule = [];
		var labelListChecked = $("#recommendApp label.checked");
		labelListChecked.each(function(){
			var checkedId = $(this).attr("data-id");
			linkModule.push(checkedId);
		});
		console.log(linkModule);

		PFT.Util.Ajax( updateModuleAjaxUrl , {
			params: {
				module_id : that.id,
				summary : summary,
				introduce : introduce,
				free_days : freeDays,
				link_module : linkModule
			},
			type:"POST",
			loading: function(){
			},
			complete : function(){	
			},	
			success: function(res) {
				opts.success(res);
			}
		});
	},

	getModuleListRecommend : function(opts){

		var that = this;

		PFT.Util.Ajax( getRecommendAppsAjaxUrl , {
			params: {
				module_id : that.id
			},
			type:"POST",
			loading: function(){
			},
			complete : function(){	
			},	
			success: function(res) {
				opts.success(res);
			}
		});

	},

	getInfoAjax : function(opts){
		var that = this;
		
		PFT.Util.Ajax( getInfoAjaxUrl , {
			params: {
				module_id : that.id
			},
			type:"POST",
			loading: function(){
			},
			complete : function(){	
			},	
			success: function(res) {
				opts.success(res);
			}
		});

	},

	renderRecommendList : function(applist){

		var temp = "";

		if(applist.length > 0){
			for(var i = 0;i<applist.length;i++){

				temp += '<label class="checkbox mr30" data-fn="recommendLimited" data-id='+ applist[i].module_id +'>'+
						    '<input type="checkbox" name="" class="hide" />'+
						    '<em class="checkbox-content">'+applist[i].name+'</em>'+
						'</label>' ;	

			}
		}
		$("#recommendApp").append(temp);

	},

	appendInfo : function(data){

		var free_day = data.free_day,
			id = data.id,
			introduce = data.introduce,
			summary = data.summary,
			name = data.name,
			linkInfo = data.link_info;  //关联模块数组
		var temp = "";

		$("#moduleName").html(name);
		$("#introduce").val(introduce);
		$("#summary").val(summary);

		if(free_day == "0"){   //free_day为0表示不免费试用
			$("#chkboxFreeTrial").removeClass('checked');
			$("#daysFreeTrial").prop("disabled",true);
		}else{
			$("#chkboxFreeTrial").addClass('checked');
			$("#daysFreeTrial").prop("disabled",false).val(free_day);
		}

		for(var i = 0;i<linkInfo.length;i++){
			var nowid = linkInfo[i].module_id;
			var nowlabel = $('#recommendApp label[data-id='+nowid+']');
			if(nowlabel.length > 0){
				nowlabel.addClass("checked");
			}
		}

	}

});

$(function(){

	new Main();

});