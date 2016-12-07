



module.exports = function(opt){

	//是否处于模拟数据状态
	var debug = true ;

	if(debug){

		console.log("模拟数据中");

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



		opt.loading();
		setTimeout(function(){
			opt.complete();
			opt.success(data);
		},1000)

		return false;

	}else{

	}


};