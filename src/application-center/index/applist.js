


var GetListAjax = require("../common/service/appList_service.js"); 
var loadingHTML = require("COMMON/js/util.loading.pc.js");

var AppList = PFT.Util.Class({
		
	container : "#app-list-wrap",

	EVENTS : {
	},
			
	init : function(){

		this.tempbox = [];

		this.showAppList("app-list1");
		this.showAppList("app-list2");
		this.showAppList("app-list3");

	},

	showAppList : function(boxClassName){ //传入动态生成内容的父ul的类名

		var that = this;

		GetListAjax({
		    loading : function(){
		        var loadingHtml = loadingHTML("请稍后...",{
		            tag : "div",
		            colspan : 5
		        });
		        $("ul.app-list").html(loadingHtml);
		    },
		    complete : function(){
		    },
		    success : function(data){

		    	console.log(data);

		        var code = data.code;
		        var msg = data.msg;
		        var list = data.list;
		        var listbox = $('ul.'+ boxClassName);
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

		    },
		    fail : function(msg){
		        alert(msg);
		    }
		});


	}



});


module.exports = AppList;
