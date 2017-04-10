


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

        // var urlResult = url.match(/new\/appcenter\.html/);
        // this.URL_PREFIX = url.slice( 0, urlResult.index );

        this.prefix_domain = PFT.PREFIX_DOMAIN();

			// console.log( "catId:" + catId );

		this.tempListBox = "";
		this.tempIndexListBox = "";     //全部缓存
		this.tempClassListBox = "";     //分类缓存
		this.tempNewOnlineListBox = ""; //新上线缓存
		this.tempUnOpendListBox = "";   //未开通缓存
		this.tempOpendListBox = "";     //已开通缓存
        this.tempHotListBox = '';       // 推荐应用缓存



		var req1 = function(){
			return that.getAppList(0,1);  //分类，直销模块
		};
		var req2 = function(){
			return that.getAppList(0,2);  //分类，营销工具
		};
		var req3 = function(){
			return that.getAppList(0,3);  //分类，对接平台
		};
		var req4 = function(){
			return that.getAppList(0,4);  //分类，会员一卡通
		};
		var req5 = function(){
			return that.getAppList(0,5);  //分类，票务系统
		}
		var req7 = function(){
			return that.getAppList(0,7);  //分类，其他
		}


		var reqAll = function(){
			return that.getAppList(0,0);
		}


		// var req5 = function(){
		// 	return that.getAppList(0,5);  //首页，智能硬件
		// };

        switch(catId) {  //
            case '1':  //直销模块
                //分类应用数量不多，暂时把tab切换隐藏
                $('#tab').hide();
                req1().done(function(xhr){
                    $("#tabCon").html(that.tempClassListBox);
                });
                break;
            case '2': //营销工具
                $('#tab').hide();
                req2().done(function(xhr){
                    $("#tabCon").html(that.tempClassListBox);
                });
                break;
            case '3': //对接平台
                $('#tab').hide();
                req3().done(function(xhr){
                    $("#tabCon").html(that.tempClassListBox);
                });
                break;
            case '4': //会员一卡通
                $('#tab').hide();
                req4().done(function(xhr){
                    $("#tabCon").html(that.tempClassListBox);
                });
                break;
            case '0': //票务系统
                $('#tab').hide();
                req5().done(function(xhr){
                    $("#tabCon").html(that.tempClassListBox);
                });
                break;
			case '5': //智能终端
                $('#tab').hide();
                $("#tabCon").html(yingjian_tpl);
                break;
			case '6': //其他
                $('#tab').hide();
                req7().done(function(xhr){
                    $("#tabCon").html(that.tempClassListBox);
                });
                break;

            default:
                //顺序发请求
                // req1().then(req2).then(req3).then(req4).then(req5).then(req7).done(function(xhr){
                //     $("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
                //     appIntro.init(that.memberID); //传入会员id用于cookie
                // });
				// req1().then(req2).then(req3).then(req4).then(req5).done(function(xhr){
                //     // $("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
				// 	that.tempIndexListBox = that.tempIndexListBox + yingjian_tpl;
                //     // appIntro.init(that.memberID); //传入会员id用于cookie
                // }).then(req7).done(function(){
                //     $("#tabCon").html(that.tempIndexListBox);
				// });



				reqAll().done(function(xhr){
                    $("#tabCon").html(that.tempIndexListBox + yingjian_tpl);
				})
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
                        case 5:
                            if( list.length > 0 ){
                                that.CacheList(list,type,category);
                            }else{
                                that.tempHotListBox = "<p style='text-align: center;height: 200px;line-height: 200px'>未查询到数据...</p>"
                            }
                            break;
						case 4: //分类
							if( list.length > 0 ){
								for( var j = 0;j<list.length;j++){
									var nowlist = list[j].list;
									var cate = list[j].cate;
									that.CacheList(nowlist,type,cate);
								}
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

		// classificationTab 新加分类tab Id


		//有缓存就用缓存，没缓存就发请求
		if( nowId == "allTab"){ //全部
			if(that.tempIndexListBox == ""){
				that.init();
			}else{
				$("#tabCon").html(that.tempIndexListBox  + yingjian_tpl);
			}
		}


		if( nowId == "classificationTab"){ //分类
			if(that.tempClassListBox == ""){
				//请求
				// var req1 = function(){
				// 	return that.getAppList(0,1);  //首页，核心功能
				// };
				// var req2 = function(){
				// 	return that.getAppList(0,2);  //首页，营销推广
				// };
				// var req3 = function(){
				// 	return that.getAppList(0,3);  //首页，同业对接
				// };
				// var req4 = function(){
				// 	return that.getAppList(0,4);  //首页，一卡通
				// };
				// var req5 = function(){
				// 	return that.getAppList(0,5);  //首页，票务系统
				// }
				// var req7 = function(){
				// 	return that.getAppList(0,7);  //首页，其他
				// }

				var req = function(){
					return that.getAppList(4,0);  //分类
				};


				req().done(function(xhr){
					$("#tabCon").html(that.tempClassListBox + yingjian_tpl);
				});


				// xhr.then(function(){
				// 	$("#tabCon").html(that.tempClassListBox);
				// });
                // req1().then(req2).then(req3).then(req4).then(req5).then(req7).done(function(xhr){
                    // that.tempClassListBox = that.tempClassListBox + yingjian_tpl;
                    // $("#tabCon").html( that.tempClassListBox + yingjian_tpl );
                // });
				// req1().then(req2).then(req3).then(req4).then(req5).done(function(xhr){
				// 	that.tempClassListBox = that.tempClassListBox + yingjian_tpl;
    //             }).then(req7).done(function(){
    //                 $("#tabCon").html(that.tempClassListBox);
				// });


			}else{
				$("#tabCon").html( that.tempClassListBox + yingjian_tpl );
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
        if( nowId == "hotTab"){ //推荐
            if(that.tempHotListBox == ""){
                var xhr = that.getAppList(5);
                xhr.then(function(){
                    $("#tabCon").html(that.tempHotListBox);
                });
            }else{
                $("#tabCon").html(that.tempHotListBox);
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
		//分类情况
		if(category == 1 && type == 4){
			listTitle = "直销模块";
			ulClassName = "app-list1";
		}else if(category == 2 && type == 4){
			listTitle = "营销工具";
			ulClassName = "app-list2";
		}else if(category == 3 && type == 4){
			listTitle = "对接平台";
			ulClassName = "app-list3";
		}else if(category == 4 && type == 4){
			listTitle = "会员一卡通";
			ulClassName = "app-list4";
		}else if(category == 5 && type == 4){
			listTitle = "票务系统";
			ulClassName = "app-list5";
		}else if(category == 7 && type == 4){
			listTitle = "其他";
			ulClassName = "app-list7";
		}
		//tab情况
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
        if( type == 5 && category == undefined){
            listTitle = "推荐";
            ulClassName = "app-list1";
        }
		if( type == 0 && category == 0){
			listTitle = "全部";
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
        		               '<a href="'+ this.prefix_domain +list[i].url+'" class="btn btn-default mr10" >打开应用</a>' + (list[i].xufei?'<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' : '') +
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
    				               '<a href="'+ this.prefix_domain + list[i].url +'" class="btn btn-default mr10">打开应用</a>' + (list[i].xufei?'<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' : '') +
    						    '</div>' ;
    		            	}

                    	}else{//不是首页的非一卡通情况

							if(list[i].button_type == 0){//免费试用
		    		            temp += '<div class="text-ellipsis"><span class="app-price">'+ this.highlightPrice( list[i].price ) +'</span></div>' +
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
					               '<a href="'+ this.prefix_domain + list[i].url +'" class="btn btn-default mr10">打开应用</a>' + (list[i].xufei?'<a href="appcenter_pay.html?appid='+mid+'" class="btn-link">续费</a>' : '') +
							    '</div>' ;
							}


                    	}


                    }


	            temp += '</div>' +//app-right结束标签
	                '</div>' ; //app-item结束标签

                if(list[i].flag_new == 0 && list[i].flag_expire == 0){ //不显示"new"标签，也不显示"过期"标签；

        	    		temp += '</li>' ;
                }else{  //显示"new"标签，或显示"过期"标签；
					if(list[i].hot){
						temp += '<i class="ico-hot"></i>' ;
					}
					//显示"new"标签
                	if(list[i].flag_new == 1){
                		temp += '<i class="ico-new"></i>';
                	}
					//显示"过期"标签；
					else if(list[i].flag_expire == 1){
						temp += '<i class="ico-expired"></i>'
                	}
                    temp += '</li>' ;
                }

        }


        //父结尾
        temp+=      '</ul>' +
            	'</div>' +
        	'</div>'  ;


		//缓存
		if( type == 0 && category == 0){  //首页
        	this.tempIndexListBox += temp;
        }else if(type == 1 && category == undefined){ //新上线
        	this.tempNewOnlineListBox += temp;
        }else if(type == 2 && category == undefined){ //未开通
        	this.tempUnOpendListBox += temp;
        }else if(type == 3 && category == undefined){ //已开通
        	this.tempOpendListBox += temp;
        }else if(type == 5 && category == undefined){ //推荐
            this.tempHotListBox += temp;
        }else if(type == 0){//侧边栏分类情况
			this.tempClassListBox += temp;
		}else if(type == 4){//分类情况
			this.tempClassListBox += temp;
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
