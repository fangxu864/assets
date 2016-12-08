


var GetListAjax = require("../common/service/appList_service.js"); 
var loadingHTML = require("COMMON/js/util.loading.pc.js");

var AppList = PFT.Util.Class({
		
	container : "#section-con",

	EVENTS : {
		"click .tab-list li" : "onTabBtnClick"
	},
			
	init : function(){

		this.tempbox = [];
		this.tab = $(".tab-list li");

		this.showAppList("app-list1","index");
		this.showAppList("app-list2","index");
		this.showAppList("app-list3","index");


	},

	showAppList : function(ulClassName,BtnName,CacheData){ //传入动态生成内容的父ul的类名或按钮名

		var that = this;
		var listTitle = "";

		if(BtnName == "newOnline"){
			listTitle = "新上线";			
		}else if(BtnName == "unopend"){
			listTitle = "未开通";			
		}else if(BtnName == "opend"){
			listTitle = "已开通";			
		}else{
			listTitle = "核心功能";
		}

		GetListAjax({
		    loading : function(){
		        var loadingHtml = loadingHTML("请稍后...",{
		            tag : "div",
		            colspan : 5,
		            className : "loading"
		        });

		        if( CacheData == undefined ){ //当没有缓存的时候loading
		        	$("#tabCon").html(loadingHtml);	
		        }
		        
		    },
		    complete : function(){

		    	if( CacheData == undefined ){ //当没有缓存的时候loading
		        	$(".loading").remove();	
		        }
		    	
		    },
		    success : function(data){

		    	if( CacheData != undefined && CacheData.length>0 ){
		    		var list = CacheData;
		    		$("#tabCon").html("");
		    	}else{
		    		var list = data.list;
		    	}

		        var code = data.code;
		        var msg = data.msg;

		        that.appendList(list,listTitle,ulClassName,BtnName);

		    },
		    fail : function(msg){
		        alert(msg);
		    }
		},BtnName);


	},

	onTabBtnClick : function(e){

		var tarBtn = $(e.currentTarget);
		tarBtn.addClass("active");
		tarBtn.siblings().removeClass("active");
		var nowId = tarBtn.attr("id");
		if( nowId == "indexTab"){ //首页
			this.init();  //重新发请求并清空tempbox
		}
		if( nowId == "newOnlineTab"){ //新上线
			var CacheData = this.handleTempBox("newOnline");
			// this.showAppList("app-list1","newOnline",CacheData);
			$("#tabCon").html("");
			var listTitle = "新上线";
			this.appendList(CacheData,listTitle,"app-list1","newOnline");
		}
		if( nowId == "unopendTab"){ //未开通
			var CacheData = this.handleTempBox("unopend");
			// this.showAppList("app-list1","unopend",CacheData);	
			$("#tabCon").html("");
			var listTitle = "未开通";
			this.appendList(CacheData,listTitle,"app-list1","unopend");
		}
		if( nowId == "opendTab"){ //已开通
			var CacheData = this.handleTempBox("opend");
			// this.showAppList("app-list1","opend",CacheData);
			$("#tabCon").html("");
			var listTitle = "已开通";
			this.appendList(CacheData,listTitle,"app-list1","opend");
		}

	},


	handleTempBox : function(type){ //根据不同情况处理首页缓存并返回

		if(type == "newOnline" && this.tempbox.length > 0){

			console.log("处理新上线缓存");
			console.log(this.tempbox);

			var newData = [];

			for(var i = 0;i<this.tempbox.length;i++){

				for(var j = 0;j<this.tempbox[i].length;j++){

					if(this.tempbox[i][j].isNew == true){
						newData.push(this.tempbox[i][j]);
					}

				}

			}

			console.log(newData);
			return newData;

		}

		if(type == "unopend" && this.tempbox.length > 0){

			console.log("处理未开通缓存");
			console.log(this.tempbox);

			var newData = [];

			for(var i = 0;i<this.tempbox.length;i++){

				for(var j = 0;j<this.tempbox[i].length;j++){

					if(this.tempbox[i][j].opend == false){
						newData.push(this.tempbox[i][j]);
					}

				}

			}

			console.log(newData);
			return newData;

		}

		if(type == "opend" && this.tempbox.length > 0){

			console.log("处理未开通缓存");
			console.log(this.tempbox);

			var newData = [];

			for(var i = 0;i<this.tempbox.length;i++){

				for(var j = 0;j<this.tempbox[i].length;j++){

					if(this.tempbox[i][j].opend == true){
						newData.push(this.tempbox[i][j]);
					}

				}

			}

			console.log(newData);
			return newData;

		}


	},


	appendList : function(list,listTitle,ulClassName,BtnName){


        var fatherTemp =    '<div class="tab-con">' + 
				                '<h4 class="app-class mb30">'+listTitle+'</h4>' +
				                '<div class="app-list-wrap">' +
				                    '<ul class="app-list '+ ulClassName +' clearfix">' +
				                    '</ul>' +
				                '</div>' +
				            '</div>'  ;

		$("#tabCon").append(fatherTemp);

		var listbox = $('ul.'+ ulClassName);		           

        var temp = "";
        //动态dom
        for(var i = 0;i<list.length;i++){
            temp += 
            '<li>' +
                '<div class="app-item">' +
                    '<div class="app-left">' +
                        '<i class="ui-app-icon"></i>' +
                        '<p class="app-open"><span class="app-usernum c-warning">'+list[i].userNumber+'</span> 用户<br>已开通</p>' +
                    '</div>' +
                    '<div class="app-right">' +
                        '<div class="text-ellipsis"><strong class="app-name">'+list[i].title+'</strong></div>' ;

                        if(list[i].opend == false){  //未开通
                        	if(list[i].try == true){  
                		          temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'元/1季</span></div>' +
                		          '<div class="app-btn-w">' +
                		             '<a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a>' +
                				  '</div>' ;
                        	}else{
                        		  temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'元/1季</span></div>' +
                		          '<div class="app-btn-w">' +
                		             '<a href="javascript:;" class="btn btn-default-reverse w100">开通</a>' +
                				  '</div>' ;
                        	}
                        }else{//已开通
                    		if(list[i].expired == true){  //未过期
                        		  temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'元/1季</span></div>' +
                		          '<div class="app-btn-w">' +
                		             '<a href="javascript:;" class="btn btn-default w100">使用</a>' +
                				  '</div>' ;
                    		}else{  //已过期
                        		  temp += '<div class="text-ellipsis"><span class="app-price">'+'2016-12-11到期'+'</span></div>' +
                		          '<div class="app-btn-w">' +
                		             '<a href="javascript:;" class="btn btn-default-disable mr10">使用</a>' + '<a href="javascript:;" class="btn-link">续费</a>' +
                				  '</div>' ;
                    		}  
                        }

	            temp += '</div>' +
	                '</div>' ;

                if(list[i].isNew == true){ //是否是新上线

        	    	if(list[i].expired == false){//新上线并且过期
        	    		temp += '<i class="icon-expired"></i>' +'<i class="icon-new"></i>'+
        				'</li>' ;
        	    	}else{ 
	    		    	temp += '<i class="icon-new"></i>' +
	    				'</li>' ;
        	    	}
                	
                }else{

                	if(list[i].expired == false){//过期
                		temp += '<i class="icon-expired"></i>' +
            			'</li>' ;
                	}else{
                		temp += '</li>' ; 
                	}

                }

        }
       	listbox.html(temp);

       	if(BtnName == "index"){ //缓存首页数据
       		this.tempbox.push(list);	
       	}


	}


});


module.exports = AppList;
