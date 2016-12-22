	


var GetListAjax = require("./appList_service.js"); 
var loadingHTML = require("COMMON/js/util.loading.pc.js");
var yingjian_tpl = require("./tpl/yingjian.xtpl");
// var card_tpl = require("./tpl/cardtpl.xtpl");

var AppList = PFT.Util.Class({
		
	container : "#section-con",

	EVENTS : {
		"click .tab-list li" : "onTabBtnClick"
	},
			
	init : function(){

		var that = this;
		
		this.tempListBox = "";
		this.tempIndexListBox = ""; //首页缓存
		this.tempNewOnlineListBox = ""; //新上线缓存
		this.tempUnOpendListBox = ""; //未开通缓存
		this.tempOpendListBox = ""; //已开通缓存

		var req1 = function(){
			return that.getAppList(0,1);  //首页，核心功能
		};
		var req2 = function(){
			return that.getAppList(0,2);  //首页，营销推广	
		};
		var req3 = function(){
			return that.getAppList(0,3);  //首页，同业对接
		};
		var req4 = function(){
			return that.getAppList(0,4);  //首页，一卡通
		};
		// var req5 = function(){
		// 	return that.getAppList(0,5);  //首页，智能硬件
		// };

		//顺序发请求
		req1().then(req2).then(req3).then(req4).done(function(xhr){
			$("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
		});


	},


	getAppList : function(type,category){    

		var that = this;

		var xhr = GetListAjax({ 

			type : type,

			category : category,

			loading : function(){

				var loadingHtml = loadingHTML("请稍后...",{
				    tag : "div",
				    colspan : 5,
				    className : "loading"
				});
				$("#tabCon").html(loadingHtml);	

			},	

			complete : function(){

				$(".loading").remove();

			},

			success : function(res){

				var code = res.code;
				var msg = res.msg;
				var list = res.data;

				if(list.length > 0 ){
					that.CacheList(list,type,category);
				}
			}


		});

		return xhr;

	},


	onTabBtnClick : function(e){

		var that = this;
		var tarBtn = $(e.currentTarget);
		tarBtn.addClass("active");
		tarBtn.siblings().removeClass("active");
		var nowId = tarBtn.attr("id");

		//有缓存就用缓存，没缓存就发请求
		if( nowId == "indexTab"){ //首页
			if(that.tempIndexListBox == ""){
				that.init();
			}else{
				$("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
			}
		}
		if( nowId == "newOnlineTab"){ //新上线
			if(that.tempNewOnlineListBox == ""){
				var xhr = that.getAppList(1);
				xhr.then(function(){
					$("#tabCon").html(that.tempNewOnlineListBox);
				});
			}else{
				$("#tabCon").html(that.tempNewOnlineListBox);
			}
		}
		if( nowId == "unopendTab"){ //未开通
			if(that.tempUnOpendListBox == ""){
				var xhr = that.getAppList(2);
				xhr.then(function(){
					$("#tabCon").html(that.tempUnOpendListBox);
				});
			}else{
				$("#tabCon").html(that.tempUnOpendListBox);
			}
		}
		if( nowId == "opendTab"){ //已开通
			if(that.tempOpendListBox == ""){
				var xhr = that.getAppList(3);
				xhr.then(function(){
					$("#tabCon").html(that.tempOpendListBox);
				});
			}else{
				$("#tabCon").html(that.tempOpendListBox);
			}
		}


	},


	CacheList : function(list,type,category,tabType){
		

		var listTitle = "";
		var ulClassName = "";

		if(category == 1 && type == 0){
			listTitle = "核心功能";
			ulClassName = "app-list1";
		}else if(category == 2 && type == 0){
			listTitle = "营销推广";
			ulClassName = "app-list2";
		}else if(category == 3 && type == 0){
			listTitle = "同业对接";
			ulClassName = "app-list3";
		}else if(category == 4 && type == 0){
			listTitle = "一卡通";
			ulClassName = "app-list4";
		}else if(category == 5 && type == 0){
			listTitle = "智能硬件";
			ulClassName = "app-list5";
		}

		if( type == 1 && category == undefined){
			listTitle = "新上线";
			ulClassName = "app-list1";
		}
		if( type == 2 && category == undefined){
			listTitle = "未开通";
			ulClassName = "app-list1";
		}
		if( type == 3 && category == undefined){
			listTitle = "已开通";
			ulClassName = "app-list1";
		}           

        var temp = "";

        	temp +=
            //父ul
			'<div class="tab-con">' + 
                '<h4 class="app-class mb30">'+listTitle+'</h4>' +
                '<div class="app-list-wrap">' +
                    '<ul class="app-list '+ ulClassName +' clearfix">';    


        //子li
        for(var i = 0;i<list.length;i++){

        	var mid = list[i].module_id;
        	var open_num = list[i].open_num;
        	var icon_url = list[i].icon || "http://static.12301.cc/assets/build/images/appcenter/icons/default.png";

            temp += 

            '<li>' +
                '<div class="app-item">' +
                    '<div class="app-left">' +
                        '<i class="ui-app-ico" style="background-image:url('+icon_url+')"></i>' +
                        '<p class="app-open"><span class="app-usernum c-warning">'+open_num+'</span> 用户<br>已开通</p>' +
                    '</div>' +
                    '<div class="app-right">' +
                        '<div class="text-ellipsis"><strong class="app-name">'+list[i].name+'</strong></div>' ;

                    if(category == 4){ //一卡通

        	            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
        	            '<div class="app-btn-w">' +
        	               '<a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a>' +
        			    '</div>' ;

                    }else if(category == 5){ //智能硬件  //只有图片  //这样不行啊

                    	temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
        	            '<div class="app-btn-w">' +
        	               '<a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a>' +
        			    '</div>' ;

                    }else{ //其余


						if(list[i].button_type == 0){//免费试用
	    		            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'</span></div>' +
	    		            '<div class="app-btn-w">' +
	    		               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">免费试用</a>' +
	    				    '</div>' ;
						}else if(list[i].button_type == 1){//开通
		        		    temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'</span></div>' +
				            '<div class="app-btn-w">' +
				               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">开通</a>' +
						    '</div>' ;
						}else if(list[i].button_type == 2){//使用
		        		    temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'</span></div>' +
				            '<div class="app-btn-w">' +
				               '<a href="javascript:;" class="btn btn-default mr10">使用</a>' + '<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' +
						    '</div>' ;
						}else if(list[i].button_type == 3){//去看看（过期）
		        		    temp += '<div class="text-ellipsis"><span class="app-price">'+'2016-12-11到期'+'</span></div>' +
				            '<div class="app-btn-w">' +
				               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-disable mr10">去看看</a>' + '<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' +
						    '</div>' ;
						}      

                    }    


	            temp += '</div>' +//app-right结束标签
	                '</div>' ; //app-item结束标签

                if(list[i].flag_new == 1){ //是否是新上线

        	    	if(list[i].use_status == 2){//新上线并且过期
        	    		temp += '<i class="ico-expired"></i>' +'<i class="ico-new"></i>'+
        				'</li>' ;
        	    	}else{ //新上线没有过期 
	    		    	temp += '<i class="ico-new"></i>' +
	    				'</li>' ;
        	    	}
                	
                }else{  //不是新上线

                	if(list[i].use_status == 2){//过期
                		temp += '<i class="ico-expired"></i>' +
            			'</li>' ;
                	}else if(list[i].use_status == 1){ //正常使用
                		temp += '</li>' ; 
                	}

                }       

        }


        //父结尾
        temp+=      '</ul>' +
            	'</div>' +
        	'</div>'  ;


        // 缓存
        if( type == 0 ){  //首页
        	this.tempIndexListBox += temp;
        }else if(type == 1 && category == undefined){ //新上线
        	this.tempNewOnlineListBox += temp;
        }else if(type == 2 && category == undefined){ //未开通
        	this.tempUnOpendListBox += temp;
        }else if(type == 3 && category == undefined){ //已开通
        	this.tempOpendListBox += temp;
        }		
        


	},


	/**
	 * cardTemplate 卡片模板
	 */
	// cardTemplate : PFT.Util.ParseTemplate(card_tpl)


});


module.exports = AppList;
