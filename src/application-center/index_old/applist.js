


var GetListAjax = require("./appList_service.js");
var loadingHTML = require("COMMON/js/util.loading.pc.js");
var yingjian_tpl = require("./tpl/yingjian.xtpl");
// var card_tpl = require("./tpl/cardtpl.xtpl");
// var appIntro = require("./intro-appcenter/index.js");

var AppList = PFT.Util.Class({

	container : "#section-con",

	EVENTS : {
		"click .tab-list li" : "onTabBtnClick"
	},

	init : function(){

		var that = this;

        var url = window.location.href,
            urlArr = url.split('?'),
            isCategory = urlArr.length > 1 ? true : false,
            catId = isCategory ? urlArr[1].split('=')[1] : null;

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
		var req5 = function(){
			return that.getAppList(0,5);  //首页，票务系统
		}
		var req7 = function(){
			return that.getAppList(0,7);  //首页，其他
		}

		// var req5 = function(){
		// 	return that.getAppList(0,5);  //首页，智能硬件
		// };

        switch(catId) {
            case '1':
                //分类应用数量不多，暂时把tab切换隐藏
                $('#tab').hide();
                req1().done(function(xhr){
                    $("#tabCon").html(that.tempIndexListBox);
                });
                break;
            case '2':
                $('#tab').hide();
                req2().done(function(xhr){
                    $("#tabCon").html(that.tempIndexListBox);
                });
                break;
            case '3':
                $('#tab').hide();
                req3().done(function(xhr){
                    $("#tabCon").html(that.tempIndexListBox);
                });
                break;
            case '4':
                $('#tab').hide();
                req4().done(function(xhr){
                    $("#tabCon").html(that.tempIndexListBox);
                });
                break;
            case '0':
                $('#tab').hide();
                $("#tabCon").html(yingjian_tpl);
                break;
            default:
                //顺序发请求
                // req1().then(req2).then(req3).then(req4).then(req5).then(req7).done(function(xhr){
                //     $("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
                //     // appIntro.init(that.memberID); //传入会员id用于cookie
                // });
				req1().then(req2).then(req3).then(req4).then(req5).done(function(xhr){

                    // $("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
					that.tempIndexListBox = that.tempIndexListBox + yingjian_tpl;
                    // appIntro.init(that.memberID); //传入会员id用于cookie
                }).then(req7).done(function(){
                    $("#tabCon").html(that.tempIndexListBox);
				});
        }

        $("#top-ad-close").on("click",function(){

        	$(".topad-wrap").remove();

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

				if( type == 0 && list.length > 0 ){
					that.CacheList(list,type,category);
				}else if(type == 0 && list.length == 0 && that.tempIndexListBox == ""){
					that.tempIndexListBox = "<p style='text-align: center;height: 200px;line-height: 200px'>未查询到数据...</p>";
				}
				if( type != 0 ){
					switch (type){
						case 1 : //新上线
							if( list.length > 0 ){
								that.CacheList(list,type,category);
							}else{
								that.tempNewOnlineListBox = "<p style='text-align: center;height: 200px;line-height: 200px'>未查询到数据...</p>"
							}
							break;
						case 2 : //未开通
							if( list.length > 0 ){
								that.CacheList(list,type,category);
							}else{
								that.tempUnOpendListBox = "<p style='text-align: center;height: 200px;line-height: 200px'>未查询到数据...</p>"
							}
							break;
						case 3: 
							if( list.length > 0 ){
								that.CacheList(list,type,category);
							}else{
								that.tempOpendListBox = "<p style='text-align: center;height: 200px;line-height: 200px'>未查询到数据...</p>"
							}
							break;
						default :
							alert(type+"是什么类型？")
					}
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
				$("#tabCon").html(that.tempIndexListBox);
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
			listTitle = "直销模块";
			ulClassName = "app-list1";
		}else if(category == 2 && type == 0){
			listTitle = "营销工具";
			ulClassName = "app-list2";
		}else if(category == 3 && type == 0){
			listTitle = "对接平台";
			ulClassName = "app-list3";
		}else if(category == 4 && type == 0){
			listTitle = "会员一卡通";
			ulClassName = "app-list4";
		}else if(category == 5 && type == 0){
			listTitle = "票务系统";
			ulClassName = "app-list5";
		}else if(category == 7 && type == 0){
			listTitle = "其他";
			ulClassName = "app-list7";
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

        	if(!this.memberID){
        		this.memberID = list[i].member_id;
        	}

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

                    	if(list[i].button_type == 0){ //免费试用
        		            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
        		            '<div class="app-btn-w">' +
        		               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">免费试用</a>' +
        				    '</div>' ;
                    	}else if(list[i].button_type == 1){ //开通
        		            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
        		            '<div class="app-btn-w">' +
        		               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">开通</a>' +
        				    '</div>' ;
                    	}else if(list[i].button_type == 2){ //使用
                    		temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
        		            '<div class="app-btn-w">' +
        		               '<a href="http://'+location.host+'/'+list[i].url+'" class="btn btn-default mr10" >打开应用</a>' + (list[i].xufei?'<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' : '') +
        				    '</div>' ;
                    	}



                    }else if(category == 6){ //智能硬件用静态加，在45行

               //      	temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
        	      //       '<div class="app-btn-w">' +
        	      //          '<a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a>' +
        			    // '</div>' ;

                    }else{ //其余  //category为undefined的情况和category为1,2,3的情况

                    	if(list[i].category == "4"){//为不是首页的一卡通情况（一卡通要展示summary）

    		            	if(list[i].button_type == 0){ //免费试用
    				            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
    				            '<div class="app-btn-w">' +
    				               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">免费试用</a>' +
    						    '</div>' ;
    		            	}else if(list[i].button_type == 1){ //开通
    				            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
    				            '<div class="app-btn-w">' +
    				               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">开通</a>' +
    						    '</div>' ;
    		            	}else if(list[i].button_type == 2){ //使用
    		            		temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].summary+'</span></div>' +
    				            '<div class="app-btn-w">' +
    				               '<a href="http://'+location.host+'/'+list[i].url+'" class="btn btn-default mr10">打开应用</a>' + (list[i].xufei?'<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' : '') +
    						    '</div>' ;
    		            	}

                    	}else{//不是首页的非一卡通情况

							if(list[i].button_type == 0){//免费试用
		    		            temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'</span></div>' +
		    		            '<div class="app-btn-w">' +
		    		               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">免费试用</a>' +
		    				    '</div>' ;
							}else if(list[i].button_type == 1){//开通

								if(list[i].flag_expire == 1){  //开通按钮但过期显示过期时间
                                    temp += '<div class="text-ellipsis"><span class="app-price"><em '+ (list[i].expiresoon?'class="c-warning"':'') +'>'+list[i].expire_time+'</em>到期</span></div>' +
						            '<div class="app-btn-w">' +
						               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">开通</a>' +
								    '</div>' ;
								}else{  //开通按钮但未过期显示价格
				        		    temp += '<div class="text-ellipsis"><span class="app-price">'+ this.highlightPrice( list[i].price ) +'</span></div>' +
						            '<div class="app-btn-w">' +
						               '<a href="appcenter_details.html?module_id='+mid+'" class="btn btn-default-reverse w100">开通</a>' +
								    '</div>' ;
								}

							}else if(list[i].button_type == 2){//使用
                                temp += '<div class="text-ellipsis"><span class="app-price"><em '+ (list[i].expiresoon?'class="c-warning"':'') +'>'+list[i].expire_time+'</em>到期</span></div>' +
					            '<div class="app-btn-w">' +
					               '<a href="http://'+location.host+'/'+list[i].url+'" class="btn btn-default mr10">打开应用</a>' + (list[i].xufei?'<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' : '') +
							    '</div>' ;
							}
							

                    	}


                    }


	            temp += '</div>' +//app-right结束标签
	                '</div>' ; //app-item结束标签

                if(list[i].flag_new == 0 && list[i].flag_expire == 0){ //不显示"new"标签，也不显示"过期"标签；

        	    		temp += '</li>' ;
                }else{  //显示"new"标签，或显示"过期"标签；

					//显示"new"标签
                	if(list[i].flag_new == 1){
                		temp += '<i class="ico-new"></i>' +
            			'</li>' ;
                	}
					//显示"过期"标签；
					else if(list[i].flag_expire == 1){
						temp += '<i class="ico-expired"></i>'+
							'</li>' ;
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

    highlightPrice: function( priceStr ){
        var price_str = priceStr,
            reg = /\d+([\.]?\d+)?/g,
            res = reg.exec( price_str );

        if( res != null ) {
            var firstIndex = res.index,
                lastIndex = reg.lastIndex;

            var priceStrArr = price_str.split(''),
                str1 = priceStrArr.slice(0,firstIndex),
                str2 = priceStrArr.slice( lastIndex );

                appPrice = str1.join('') + '<em class="c-warning">' + res[0] + '</em>' + str2.join('');

            return appPrice;

        } else {

            return priceStr;

        }
    }
	/**
	 * cardTemplate 卡片模板
	 */
	// cardTemplate : PFT.Util.ParseTemplate(card_tpl)


});


module.exports = AppList;