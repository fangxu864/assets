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
var Toast = require("COMMON/modules/Toast/");

var Main = PFT.Util.Class({
	init : function(){

		var that = this;
		var toast = new Toast();


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
					toast.show("loading","正在更新中...");
				},
				complete : function(){
					toast.hide();
				},
				success : function(data){

					var _data = data.data;
				    var code = data.code;
				    var msg = data.msg;

				    if(code == 200){
				    	alert(msg);
				    	//跳转回页面
				    	window.location = '/new/appcenter_applist.html';
				    }else{
				    	//弹窗错误信息
				    	alert(msg);
				    }

				}
			});
		});

		$("#cancel").on("click",function(){

			window.location = '/new/appcenter_applist.html';

		});

		// 富文本编辑器
    	window.UEDITOR_CONFIG.initialFrameHeight = 215;
		this.ueditorObj = UE.getEditor('ueditorWrap');

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
					// console.log(this.className)
					if($('#recommendApp').children('.checked').length > 3) {
						cxt.unCheck(this);
						alert('推荐应用不能超过3个');
					}
				}
			}
		});
		//上级模块
		new Checkbox({
			selector: '#parentApp .checkbox',
			callbacks: {
				recommendLimited: function (cxt) {
					// console.log(this.className)
					if($('#parentApp').children('.checked').length > 1) {
						cxt.unCheck(this);
						alert('上级模块只能有一个');
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
			// console.log("没有id参数");
			alert("参数错误");
			window.location = '/new/appcenter_applist.html';
			return -1
		}
	},

	updateModuleAjax : function(opts){

		var that = this;

		var introduce = this.ueditorObj.getContent();
		// var introduce = $("introduce").val(); //应用介绍
		var summary = $("#summary").val(); //模块描述
		var freeDays = $("#daysFreeTrial").val();
		if(freeDays.length == 0){ //不免费的情况
			freeDays = 0;
		}
		//获取推荐模块的id数组
		var linkModule = [];
		var labelListChecked = $("#recommendApp label.checked");
		labelListChecked.each(function(){
			var checkedId = $(this).attr("data-id");
			linkModule.push(checkedId);
		});
		//获取父模块的id
		var parentListChecked = $("#parentApp label.checked");
		var parentId = parentListChecked.attr("data-id");

		PFT.Util.Ajax( updateModuleAjaxUrl , {
			params: {
				module_id : that.id,
				summary : summary,
				introduce : introduce,
				free_days : freeDays,
				parent : parentId,
				link_module : linkModule
			},
			type:"POST",
			loading: function(){
				opts.loading();
			},
			complete : function(){
				opts.complete();
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
				opts.loading();
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

		$("#parentApp").append(temp);
		$("#recommendApp").append(temp);


	},

	appendInfo : function(data){
		var _this = this;

		var free_day = data.free_day,
			id = data.id,
			introduce = data.introduce,
			summary = data.summary,
			name = data.name,
			linkInfo = data.link_info,  //关联模块数组
			parent = data.parent;
		var temp = "";

		$("#moduleName").html(name);

        this.ueditorObj.ready(function() {//编辑器初始化完成再赋值
            _this.ueditorObj.setContent( introduce );  //赋值给UEditor
        });

		// $("#introduce").val(introduce);
		$("#summary").val(summary);

		if(free_day == "0"){   //free_day为0表示不免费试用
			$("#chkboxFreeTrial").removeClass('checked');
			$("#daysFreeTrial").prop("disabled",true);
		}else{
			$("#chkboxFreeTrial").addClass('checked');
			$("#daysFreeTrial").prop("disabled",false).val(free_day);
		}
		//勾选关联推荐
		for(var i = 0;i<linkInfo.length;i++){
			var nowid = linkInfo[i].module_id;
			var nowlabel = $('#recommendApp label[data-id='+nowid+']');
			if(nowlabel.length > 0){
				nowlabel.addClass("checked");
			}
		}
		//勾选上级模块
		var parentNowId = parent;
		var parentNowLabel = $('#parentApp label[data-id='+parentNowId+']');
		parentNowLabel.addClass("checked");

	}

});

$(function(){

	new Main();

});