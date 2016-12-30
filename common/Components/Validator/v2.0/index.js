/**
 * Author: huangzhiyang
 * Date: 2016/12/29 15:39
 * Description: ""
 */
var form = new Form({
	container : $("#form"),
	field : {
		name : {
			value : "sdfdf",
			validate : {
				rule : "require,mobile",
				event : "blur",
				ok : function(){},
				error : function(msg,code){

				}
			}
		},
		mobile : {
			value : "12445234234",
			validate : {
				rule : ["require","mobile",{
					"isChar" : function(val){

					}
				}],
				event : "blur",
				ok : function(){},
				error : function(msg,code){

				}
			}
		}
	},
	template : function(){
		return '<div><%=name%></div>';
	},
	onSubmitBefore : function(data){},
	onSubmitLoading : function(){},
	onSubmitComplete : function(){},
	onSubmitSuccess : function(){},
	onSubmitError : function(){},
	submit : "api.12301.cc/r/c/a"
});

var result  = form.validate();
if(result.isOk){
	//submit()
}else{
	console.log(result.msg,result,code);
}
