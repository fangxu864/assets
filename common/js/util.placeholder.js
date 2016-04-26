/**
 * Created by Administrator on 16-4-14.
 */
module.exports = {
	init : function(){
		if("placeholder" in document.createElement("input")) return false;
		$("input").each(function(){
			var tarInp = $(this);
			var placeholder = tarInp.prop("placeholder");
			var val = $.trim(tarInp.val());
			if(placeholder && !val) tarInp.val(placeholder);
		})
		$(document).on("focus","input",function(e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			var placeholder = tarInp.prop("placeholder");
			if(placeholder && val==placeholder) tarInp.val("");
		}).on("blur","input",function(e){
			var tarInp = $(e.currentTarget);
			var val = $.trim(tarInp.val());
			var placeholder = tarInp.prop("placeholder");
			if(placeholder && !val) tarInp.val(placeholder);
		})
	}
}