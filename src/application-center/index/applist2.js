


var GetListAjax = require("./appList_service.js"); 
var loadingHTML = require("COMMON/js/util.loading.pc.js");

var AppList = PFT.Util.Class({
		
	container : "#section-con",

	EVENTS : {
		"click .tab-list li" : "onTabBtnClick2"
	},
			
	init : function(){


		var that = this;
		console.log("这是applist2,在applist1的基础上进行改动");
		// this.indexList = [];

		// this.tempbox = [];
		// this.tab = $(".tab-list li");

		// this.getAppList("app-list1","index","核心功能");
		// this.getAppList("app-list2","index","营销推广");
		// this.getAppList("app-list3","index","同业对接");
		// this.getAppList("app-list3","index","会员一卡通");


		this.tempListBox = "";


		var req1 = function(){
			return that.getAppList2(0,1);  //首页，核心功能
		}
		var req2 = function(){
			return that.getAppList2(0,2);  //首页，营销推广	
		}
		var req3 = function(){
			return that.getAppList2(0,3);  //首页，同业对接
		}
		var req4 = function(){
			return that.getAppList2(0,4);  //首页，一卡通
		}
		var req5 = function(){
			return that.getAppList2(0,5);  //首页，智能硬件
		}

		//顺序发请求
		req1().then(req2).then(req3).then(req4).then(req5).done(function(){
			$("#tabCon").html(that.tempListBox);
		});

		//异步的怕顺序不同
		// this.getAppList2(0,1);  //首页，核心功能
		// this.getAppList2(0,2);  //首页，营销推广
		// this.getAppList2(0,3);  //首页，同业对接
		// this.getAppList2(0,4);  //首页，一卡通
		// this.getAppList2(0,5);  //首页，智能硬件

	},


	getAppList2 : function(type,category){    

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

				console.log(res);
				var code = res.code;
				var msg = res.msg;
				var list = res.data;

				that.appendList2(list,type,category);


			}


		});

		return xhr;

	},


	onTabBtnClick2 : function(e){

		var that = this;
		var tarBtn = $(e.currentTarget);
		tarBtn.addClass("active");
		tarBtn.siblings().removeClass("active");
		var nowId = tarBtn.attr("id");
		if( nowId == "indexTab"){ //首页
			// that.getAppList2(0);

			//这样不好，重新请求慢，应该缓存
			that.init();
		}
		if( nowId == "newOnlineTab"){ //新上线
			that.tempListBox = "";
			var xhr = that.getAppList2(1);
			xhr.then(function(){
				$("#tabCon").html(that.tempListBox);
			});
		}
		if( nowId == "unopendTab"){ //未开通
			that.tempListBox = "";
			var xhr = that.getAppList2(2);
			xhr.then(function(){
				$("#tabCon").html(that.tempListBox);
			});
		}
		if( nowId == "opendTab"){ //已开通
			that.tempListBox = "";
			var xhr = that.getAppList2(3);
			xhr.then(function(){
				$("#tabCon").html(that.tempListBox);
			});
		}


	},


	appendList2 : function(list,type,category,tabType){

		console.log("type:"+type);
		console.log("category:"+category);
		var listTitle = "默认标题";
		var ulClassName = "";

		if(category == 1){
			listTitle = "核心功能";
			ulClassName = "app-list1";
		}else if(category == 2){
			listTitle = "营销推广";
			ulClassName = "app-list2";
		}else if(category == 3){
			listTitle = "同业对接";
			ulClassName = "app-list3";
		}else if(category == 4){
			listTitle = "一卡通";
			ulClassName = "app-list4";
		}else if(category == 5){
			listTitle = "智能硬件";
			ulClassName = "app-list5";
		}

        // var fatherTemp =    '<div class="tab-con">' + 
				    //             '<h4 class="app-class mb30">'+listTitle+'</h4>' +
				    //             '<div class="app-list-wrap">' +
				    //                 '<ul class="app-list '+ ulClassName +' clearfix">' +
				    //                 '</ul>' +
				    //             '</div>' +
				    //         '</div>'  ;
		// $("#tabCon").append(fatherTemp);

		// var listbox = $('ul.'+ ulClassName);		           

        var temp = "";

        	temp +=
            //父
			'<div class="tab-con">' + 
                '<h4 class="app-class mb30">'+listTitle+'</h4>' +
                '<div class="app-list-wrap">' +
                    '<ul class="app-list '+ ulClassName +' clearfix">';    
        //动态dom //子
        for(var i = 0;i<list.length;i++){
            temp += 

            '<li>' +
                '<div class="app-item">' +
                    '<div class="app-left">' +
                        '<i class="ui-app-icon"></i>' +
                        '<p class="app-open"><span class="app-usernum c-warning">'+'un'+'</span> 用户<br>已开通</p>' +
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
	    		               '<a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a>' +
	    				    '</div>' ;
						}else if(list[i].button_type == 1){//开通
		        		    temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'</span></div>' +
				            '<div class="app-btn-w">' +
				               '<a href="javascript:;" class="btn btn-default-reverse w100">开通</a>' +
						    '</div>' ;
						}else if(list[i].button_type == 2){//使用
		        		    temp += '<div class="text-ellipsis"><span class="app-price">'+list[i].price+'</span></div>' +
				            '<div class="app-btn-w">' +
				               '<a href="javascript:;" class="btn btn-default mr10">使用</a>' + '<a href="javascript:;" class="btn-link">续费</a>' +
						    '</div>' ;
						}else if(list[i].button_type == 3){//去看看（过期）
		        		    temp += '<div class="text-ellipsis"><span class="app-price">'+'2016-12-11到期'+'</span></div>' +
				            '<div class="app-btn-w">' +
				               '<a href="javascript:;" class="btn btn-default-disable mr10">去看看</a>' + '<a href="javascript:;" class="btn-link">续费</a>' +
						    '</div>' ;
						}      

                    }    


	            temp += '</div>' +
	                '</div>' ;

                if(list[i].flag_new == 1){ //是否是新上线

        	    	if(list[i].use_status == 2){//新上线并且过期
        	    		temp += '<i class="icon-expired"></i>' +'<i class="icon-new"></i>'+
        				'</li>' ;
        	    	}else if(list[i].use_status == 1){ //新上线没有过期 
	    		    	temp += '<i class="icon-new"></i>' +
	    				'</li>' ;
        	    	}
                	
                }else{  //不是新上线

                	if(list[i].use_status == 2){//过期
                		temp += '<i class="icon-expired"></i>' +
            			'</li>' ;
                	}else if(list[i].use_status == 1){ //正常使用
                		temp += '</li>' ; 
                	}

                }       

        }

        //父结尾
        temp+=        '</ul>' +
            		'</div>' +
        		'</div>'  ;

        this.tempListBox += temp;

       	// listbox.html(temp);


	},

	getAppList : function(ulClassName,BtnName,listTitle){ //传入动态生成内容的父ul的类名或按钮名

		var that = this;

		GetListAjax({
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
		    success : function(data){

		    	var list = data.list;
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

			//不用重新请求，利用缓存tempbox
			//参数BtnName传的为indexCache，不会push到tempbox中
			$("#tabCon").html("");
			this.appendList(this.tempbox[0],"核心功能","app-list1","indexCache");
			this.appendList(this.tempbox[1],"营销推广","app-list2","indexCache");
			this.appendList(this.tempbox[2],"同业对接","app-list3","indexCache");
			this.appendList(this.tempbox[3],"会员一卡通","app-list4","indexCache");

		}

		//以下代码有bug，重复点tab会变多 //原因应该是tempbox变多了
		if( nowId == "newOnlineTab"){ //新上线
			var CacheData = this.handleTempBox("newOnline");
			$("#tabCon").html("");
			var listTitle = "新上线";
			this.appendList(CacheData,listTitle,"app-list1","newOnline");
		}
		if( nowId == "unopendTab"){ //未开通
			var CacheData = this.handleTempBox("unopend");
			$("#tabCon").html("");
			var listTitle = "未开通";
			this.appendList(CacheData,listTitle,"app-list1","unopend");
		}
		if( nowId == "opendTab"){ //已开通
			var CacheData = this.handleTempBox("opend");
			$("#tabCon").html("");
			var listTitle = "已开通";
			this.appendList(CacheData,listTitle,"app-list1","opend");
		}

	},


	handleTempBox : function(type){ //根据不同情况处理首页缓存并返回

		if(type == "newOnline" && this.tempbox.length > 0){

			var newData = [];

			for(var i = 0;i<this.tempbox.length;i++){

				for(var j = 0;j<this.tempbox[i].length;j++){

					if(this.tempbox[i][j].isNew == true){
						newData.push(this.tempbox[i][j]);
					}

				}

			}

			return newData;

		}

		if(type == "unopend" && this.tempbox.length > 0){

			var newData = [];

			for(var i = 0;i<this.tempbox.length;i++){

				for(var j = 0;j<this.tempbox[i].length;j++){

					if(this.tempbox[i][j].opend == false){
						newData.push(this.tempbox[i][j]);
					}

				}

			}

			return newData;

		}

		if(type == "opend" && this.tempbox.length > 0){

			var newData = [];

			for(var i = 0;i<this.tempbox.length;i++){

				for(var j = 0;j<this.tempbox[i].length;j++){

					if(this.tempbox[i][j].opend == true){
						newData.push(this.tempbox[i][j]);
					}

				}

			}

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


       	if( BtnName == "index" ){ //缓存首页数据
       		this.tempbox.push(list);	
       	}


	}


});


module.exports = AppList;
