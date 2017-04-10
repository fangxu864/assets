
module.exports = {
    /**
     * @method 年月加减计算
     * @param date 当前年月 如2017-03
     * @param act 加或减多少月
     */
    countYearMonth: function (date , act) {
        var curYear = Number( date.match(/^\d+/)[0] );
        var curMonth = Number( date.match(/\d+$/)[0] ) - 1;
        curMonth += Number(act);
        var month = curMonth >= 0 ? curMonth % 12 + 1 : 12 + curMonth % 12 + 1;
        var year =curYear + Math.floor( curMonth / 12 );
        month = month > 9 ? month : 0 + '' + month;
        return year + '-' + month
    },

    /**
     * @method 修正格式化日期
     */
    formatDate: function (date) {
        if( ! /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)){
            console.log("请传入正确的日期格式：如2017-2-3、2017-02-03/2017-02-3/2017-2-03");
            return false;
        }
        var year = date.match(/^\d+/)[0];
        var month = Number( date.match(/(?:\-)(\d+)(?:\-)/)[1] );
        var day = Number( date.match(/\d+$/)[0] );
        month = month > 9 ? month : 0 + '' + month;
        day = day > 9 ? day : 0 + '' + day;
        return year + '-' + month + '-' + day
    },

    /**
     * @method 获取某一月的天数
     * @param yearMonth 如2017-03
     * @returns {number} 如 31
     */
    getMonthDays: function ( yearMonth ) {
        var curYear = Number( yearMonth.match(/^\d+/)[0] );
        var curMonth = Number( yearMonth.match(/\d+$/)[0] );
        var d = new Date(curYear,curMonth,0);
        return d.getDate();
    },

    /**
     * @mehtod 判断真假
     */
    judgeTrue: function( param ) {
        var type = Object.prototype.toString.call(param);
        switch (type){
            case '[object Array]':
                return param.length === 0 ?  !1 : !0 ;
                break;
            case '[object Object]':
                var t;
                for (t in param)
                    return !0;
                return !1;
                break;
            case '[object String]':
                return param === '' ? !1 : !0 ;
                break;
            case '[object Number]':
                return param === 0 ? !1 : !0 ;
                break;
            case '[object Boolean]':
                return param === false ? !1 : !0;
                break;
            case '[object Null]':
                return !1;
                break;
            case '[object Undefined]':
                return !1;
                break;
            default :
                return type;
        }
    }

};