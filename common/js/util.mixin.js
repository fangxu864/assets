/**
 * Author: huangzhiyang
 * Date: 2016/7/29 14:36
 * Description: ""
 */
/*
 * 将源对象的成员复制到目标对象中
 * @target { Object } 目标对象
 * @source { Object } 源对象
 * @override { Boolean } 是否覆盖 默认为true(覆盖)
 * @param { Array } 只复制该数组中在源对象中的属性
 * @return { Object } 目标对象
 */
module.exports = function( target, source, override, whitelist ){
	if( !target || !source ) return;
	if( override === undefined ){
		override = true;
	}

	var prop, len, i,
		_mix = function( prop ){
			if( override === true || !(prop in target) ){
				target[ prop ] = source[ prop ];
			}
		};

	if( whitelist && (len = whitelist.length) ){
		for( i = len; i; ){
			prop = whitelist[--i];
			if( prop in source ){
				_mix( prop );
			}
		}
	}
	else{
		for( prop in source ){
			_mix( prop );
		}
	}

	return target;
};