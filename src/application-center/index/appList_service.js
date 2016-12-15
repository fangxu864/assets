



module.exports = function(opts,whichBtn){

	//是否处于模拟数据状态
	var debug = false ;

	if(debug){

		console.log('模拟'+whichBtn+'数据中');

		//模拟数据data

		var data = {};
		var listlength = 8;
		data.code = 200;
		data.msg = "success";
		data.list = [];
		for(var i = 0;i<listlength;i++){

			(function(){

				var dataItem = {};
				dataItem.title = "微商城" + i ;
				dataItem.price = parseInt(Math.random()*1000);
				dataItem.userNumber = parseInt(Math.random()*10000);
				data.list.push(dataItem);

			})(i);

		}
		//模拟开通情况
		for(var i = 0;i<listlength;i++){
			var r = parseInt(Math.random()*100);
			if(r>=50){
				data.list[i].opend = true; 	
			}
			if(r<50){
				data.list[i].opend = false;
			}
		}		
		//模拟试用与过期情况
		for(var i = 0;i<listlength;i++){
			var r = parseInt(Math.random()*100);
			if(data.list[i].opend == false){ //只有未开通才有是否试用的情况
				if(r >= 50){
					data.list[i].try = true;
				}else{
					data.list[i].try = false;
				} 
			}else{  //已开通则选择是否过期
				if(r >= 50){
					data.list[i].expired = true;
				}else{
					data.list[i].expired = false;
				}
			}
		}

		//新上线情况
		for(var i = 0;i<listlength;i++){
			var r = parseInt(Math.random()*100);
			if(r >= 10){
				data.list[i].isNew = false;
			}else{
				data.list[i].isNew = true;
			} 
		}


		//不用缓存而是后台返回分类的情况
		// var newlist = [];

		// if( whichBtn == "newOnline"){
		// 	for(var i = 0;i<listlength;i++){
		// 		if(data.list[i].isNew == true){
		// 			newlist.push(data.list[i]);
		// 		}
		// 	}
		// 	data.list = newlist;
		// }

		// if( whichBtn == "unopend"){
		// 	for(var i = 0;i<listlength;i++){
		// 		if(data.list[i].opend == false){
		// 			newlist.push(data.list[i]);
		// 		}
		// 	}
		// 	data.list = newlist;
		// }

		// if( whichBtn == "opend"){
		// 	for(var i = 0;i<listlength;i++){
		// 		if(data.list[i].opend == true){
		// 			newlist.push(data.list[i]);
		// 		}
		// 	}
		// 	data.list = newlist;
		// }


		opts.loading();
		setTimeout(function(){
			opts.complete();
			opts.success(data);
		},1000)
		

		return false;

	}else{

		if( opts.type == undefined && opts.category != undefined ){ //只传了category

			var xhr = PFT.Util.Ajax( "/r/AppCenter_ModuleList/getModuleList" , {
				params: {
					category : opts.category 
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

		}else if( opts.type != undefined && opts.category == undefined ){  //只传了type

			var xhr = PFT.Util.Ajax( "/r/AppCenter_ModuleList/getModuleList" , {
				params: {
					type : opts.type 
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

		}else if( opts.type != undefined && opts.category != undefined ){  //type,category两个都传了

			var xhr = PFT.Util.Ajax( "/r/AppCenter_ModuleList/getModuleList" , {
				params: {
					type : opts.type,
					category : opts.category
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

		}else{ //两个都没传

			var xhr = PFT.Util.Ajax( "/r/AppCenter_ModuleList/getModuleList" , {
				params: {
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

		}


		return xhr



	}


};