var Validate = {
	//非空
	noBlank: function( value ){
		return !!value;
	},
	//最小
	min: function( value, rule ){
		return value.length >= rule;
	},
	//最大
	max: function( value, rule ){
		return value.length <= rule;
	},
	//验证常用英文符号，常用于密码验证
	typeChar : function(val){
		//常用英文符号
		var sChar = /[`~!@#\$%\^&\*\(\)_\+\-=\{\[\}\]\\\\|;:'",<>\.\?\/]/g;
		return sChar.test(val);
	},
	typeCN : function(str){
		var result = true;
		var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
		for(var i= 0,len=str.length; i<len; i++){
			if(!reg.test(str)){
				result = false;
				break;
			}
		}
		return result;
	},
	//中文、英文
	typeZE: function( value ){
		return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z]+$/.test( value );
	},
	//英文、数字
	typeEN: function( value ){
		return /^[0-9|a-z|A-Z]+$/.test( value );
	},
	//只能大写英文字母
	typeE : function(value){
		return /^[A-Z]+$/g.test(value);
	},
	//只能小写英文字母
	typee : function(value){
		return /^[a-z]+$/g.test(value);
	},
	//只能大小写英文字母
	typeEe : function(value){
		return /^[a-zA-Z]+$/g.test(value);
	},
	//数字
	typeNum: function( value ){
		return !isNaN( value );
	},
	//电话
	typePhone: function( value ){
		var reg = /^1[0-9]{10}$/;
		return reg.test( value );
	},
	//email
	typeEmail: function( value ){
		return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
	},
	//身份证号合法性验证
	//支持15位和18位身份证号
	//支持地址编码、出生日期、校验位验证
	idcard : function(code){
		var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
		var tip = "";
		var pass= true;

		if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
			tip = "身份证号格式错误";
			pass = false;
		}else if(!city[code.substr(0,2)]){
			tip = "地址编码错误";
			pass = false;
		}else{
			//18位身份证需要验证最后一位校验位
			if(code.length == 18){
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
				//校验位
				var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++)
				{
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if(parity[sum % 11] != code[17]){
					tip = "校验位错误";
					pass =false;
				}
			}
		}
		return pass;
	},
	//验证密码(合法性及安全度)
	//6-20数字、字母和常用符号两种以上组合
	validatePwd : function(pwd){
		var len = pwd.length;
		//常用英文符号
		var sChar = /[`~!@#\$%\^&\*\(\)_\+\-=\{\[\}\]\\\\|;:'",<>\.\?\/]/g;
		if(!pwd) return {error:"缺少pwd",level:""};
		if(len<6 || len>20) return {error:"位数须在6-20间",level:""};
		//判断密码可用性
		//不能全为数字  不能全为字母   不能全为符号
		//须是数字、字母、符号  三项中任意两项或三项组合
		var check = function(pwd){
			var error = "";
			var len = pwd.length;
			if(/\s/g.test(pwd)) return error = "不能包含空格";
			if(Validate.typeNum(pwd)) return error = "不能是纯数字";
			if(Validate.typeEe(pwd)) return error = "不能是纯字母";
			var num_leter_result = [];
			for(var i=0; i<len; i++){
				var s = pwd[i];
				if(Validate.typeNum(s) || Validate.typeEe(s)){
					num_leter_result.push(s);
				}
			}
			if(num_leter_result.length==0) error = "必须包含数字或字母";
			return error;
		};
		//判断密码强弱程度
		//弱密码：6位数字字母(大小写均可)组合。
		//中密码: 7位数及以上 数字字母（小写）组合
		//强密码：7位数及以上 数字字母并且存在大写字母或符号
		var getCheckLevel = function(pwd){
			var len = pwd.length;
			if(len==6) return "weak";
			var hasUpcaseLetterOrChar = (function(){
				var res = false;
				for(var i=0; i<len; i++){
					var s = pwd[i];
					if(Validate.typeE(s) || sChar.test(s)){
						res = true;
						break;
					}
				}
				return res;
			})();
			//只要包含有大写字母或常用符号的7位及以上密码
			if(hasUpcaseLetterOrChar) return "strong";
			return "normal";
		};
		var check_able = check(pwd);
		if(check_able){
			return{error:check_able,level:""};
		}else{
			var level = getCheckLevel(pwd);
			return{error:"",level:level};
		}
	}
};
module.exports = Validate;
