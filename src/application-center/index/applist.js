


var GetListAjax = require("../common/service/appList_service.js"); 
var loadingHTML = require("COMMON/js/util.loading.pc.js");

var AppList = PFT.Util.Class({
		
	container : "#app-list-wrap",

	EVENTS : {
	},
			
	init : function(){

		this.showAppList();
		

	},

	showAppList : function(){

		GetListAjax({
		    loading : function(){
		        var loadingHtml = loadingHTML("请稍后...",{
		            tag : "div",
		            colspan : 5
		        });
		        $("ul.app-list").html(loadingHtml);
		    },
		    complete : function(){
		    	$("ul.app-list").html("");  //去除loading
		    },
		    success : function(data){

		    	console.log(data);

		        var code = data.code;
		        var msg = data.msg;
		        var list = data.list;
		        var listbox = $("ul.app-list");
		        var temp = "";
		        //动态dom
		        for(var i = 0;i<list.length;i++){
		            temp += 
		            '<li>' +
		                '<div class="app-item">' +
		                    '<div class="app-left">' +
		                        '<i class="ui-app-icon"></i>' +
		                        '<p class="app-open"><span class="app-usernum c-warning">8888</span> 用户<br>已开通</p>' +
		                    '</div>' +
		                    '<div class="app-right">' +
		                        '<div class="text-ellipsis"><strong class="app-name">微商城</strong></div>' +
		                        '<div class="text-ellipsis"><span class="app-price">222元/1季</span></div>' +
		                        '<div class="app-btn-w">' +
		                            '<a href="javascript:;" class="btn btn-default-reverse w100">免费试用</a>' +
		                        '</div>' +
		                    '</div>' +
		                '</div>' +
		                '<i class="icon-new"></i>' +
		            '</li>' ;
		        }
		        listbox.html(temp);
		        // pagination.render({current:topage,total:totalPage});

		    },
		    fail : function(msg){
		        alert(msg);
		    }
		});


	}



});


module.exports = AppList;
