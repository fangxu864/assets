/**
 * Author: huangzhiyang
 * Date: 2016/10/10 18:14
 * Description: js浮点数运算不精确问题
 * from: http://rockyee.iteye.com/blog/891538
 */

/**
 * 左补齐字符串
 *
 * @param nSize
 *            要补齐的长度
 * @param ch
 *            要补齐的字符
 * @return
 */
var padLeft = function(target,nSize, ch)
{
	var len = 0;
	var s = target ? target : "";
	ch = ch ? ch : '0';// 默认补0

	len = s.length;
	while (len < nSize)
	{
		s = ch + s;
		len++;
	}
	return s;
}

/**
 * 右补齐字符串
 *
 * @param nSize
 *            要补齐的长度
 * @param ch
 *            要补齐的字符
 * @return
 */
var padRight = function(target,nSize, ch)
{
	var len = 0;
	var s = target ? target : "";
	ch = ch ? ch : '0';// 默认补0

	len = s.length;
	while (len < nSize)
	{
		s = s + ch;
		len++;
	}
	return s;
}
/**
 * 左移小数点位置（用于数学计算，相当于除以Math.pow(10,scale)）
 *
 * @param scale
 *            要移位的刻度
 * @return
 */
var movePointLeft = function(target,scale)
{
	var s, s1, s2, ch, ps, sign;
	ch = '.';
	sign = '';
	s = target ? target : "";

	if (scale <= 0) return s;

	ps = s.split('.');

	s1 = ps[0] ? ps[0] : "";
	s2 = ps[1] ? ps[1] : "";

	if (s1.slice(0, 1) == '-')
	{
		s1 = s1.slice(1);
		sign = '-';
	}
	if (s1.length <= scale)
	{
		ch = "0.";
		s1 = padLeft(s1,scale);
	}
	return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
}
/**
 * 右移小数点位置（用于数学计算，相当于乘以Math.pow(10,scale)）
 *
 * @param scale
 *            要移位的刻度
 * @return
 */
var movePointRight = function(target,scale)
{
	var s, s1, s2, ch, ps;
	ch = '.';
	s = target ? target : "";

	if (scale <= 0) return s;
	ps = s.split('.');
	s1 = ps[0] ? ps[0] : "";
	s2 = ps[1] ? ps[1] : "";
	if (s2.length <= scale)
	{
		ch = '';
		s2 = padRight(s2,scale);
	}
	return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
}
/**
 * 移动小数点位置（用于数学计算，相当于（乘以/除以）Math.pow(10,scale)）
 *
 * @param scale
 *            要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
 * @return
 */
var movePoint = function(target,scale)
{
	if (scale >= 0)
		return movePointRight(target,scale);
	else
		return movePointLeft(target,-scale);
}

module.exports = function(target,scale){
	var s, s1, s2, start;

	s1 = target + "";
	start = s1.indexOf(".");
	s = movePoint(s1,scale);

	if (start >= 0)
	{
		s2 = Number(s1.substr(start + scale + 1, 1));

		if (s2 >= 5 && target >= 0 || s2 < 5 && target < 0)
		{
			s = Math.ceil(s);
		}
		else
		{
			s = Math.floor(s);
		}
	}
	return movePoint(s.toString(),-scale);
};