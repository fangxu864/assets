/**
 * Author: huangzhiyang
 * Date: 2016/6/1 14:50
 * Description: ""
 */
require("./style.scss");
$(function(){
	var ok1=false;
	var ok2=false;
	var ok3=false;
	var ok4=false;
	var ok5=false;
	$("input").each(function(){
		var $tip = $("<span class='errorTip'></span>");
		$(this).parent().append($tip);
	}).focus(function(){
		$(this).siblings('.errorTip').text('');
	});

	// 验证实体卡卡号
	$('#cardNum').blur(function(){
		if($(this).val().length ==10){
			$(this).siblings('.errorTip').text('');
			ok1=true;
		}else if( $(this).val()==''){
			$(this).siblings('.errorTip').text('请输入实体卡卡号');
		}
	});
	// 验证手机号
	$('#phoneNum').blur(function(){
		if($(this).val().length ==11){
			$(this).siblings('.errorTip').text('');
			ok2=true;
		}else if($(this).val().length !=11 && $(this).val()!=''){
			$(this).siblings('.errorTip').text('手机号有误');
		}else{
			$(this).siblings('.errorTip').text('请输入手机号');
		}
	});
	// 验证短信验证码
	$('#codeNum').blur(function(){
		if($(this).val().length ==6){
			$(this).siblings('.errorTip').text('');
			ok3=true;
		}else if($(this).val().length !=6 && $(this).val()!=''){
			$(this).siblings('.errorTip').text('验证码有误');
		}else{
			$(this).siblings('.errorTip').text('请输入短信验证码');
		}
	});
	// 验证身份证号
	$('#idNum').blur(function(){
		if($(this).val().length ==18){
			$(this).siblings('.errorTip').text('');
			ok4=true;
		}else if($(this).val().length !=18 && $(this).val()!=''){
			$(this).siblings('.errorTip').text('身份证号格式有误');
		}else{
			$(this).siblings('.errorTip').text('请输入身份证号');
		}
	});
	// 验证会员名称
	$('#memName').blur(function(){
		if($(this).val().length ==6){
			$(this).siblings('.errorTip').text('');
			ok5=true;
		}else if($(this).val().length !=6 && $(this).val()!=''){
			$(this).siblings('.errorTip').text('会员名称有误');
		}else{
			$(this).siblings('.errorTip').text('请输入会员名称');
		}
	});
	//激活弹出
	$('#activateBtn').click(function(){
		$("input").trigger('blur');
		if(ok1&&ok2&&ok3&&ok4&&ok5){
			$("#memberBox").show();
		}else{
			return false;
		}
	});
	$("#replaceBtn,#messageBtn").click(function(){
		$("#memberBox").hide();
	})
	$("#cardBtn").click(function(){
		$("#payCard").show();
	})
	$(".btn-del").click(function(){
		$("#payCard").hide();
	})
})

//        $btn.click(function(){
//            if($btn.hasClass("disable")) return false;
//            $btn.addClass("disable").text("loading...");
//            $.ajax({
//                url : "http://www.12301.local/r/c/a/",
//                type : "post",
//                dataType : "json",
//                data : {
//                    "card_number" : $("#cardNum").val()
//                },
//                success : function(res){
//                    $btn.removeClass("disable").text("");
//                    res = {
//                        code : 200,
//                        data : {},
//                        msg : ""
//                    }
//                    if(res.code==200){
//                        alert("save success");
//                    }else{
//                        alert(msg);
//                    }
//                },
//                error : function(){
//                    alert("请求出凑");
//                }
//            })
//        })
