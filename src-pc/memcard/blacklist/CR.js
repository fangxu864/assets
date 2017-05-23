/**
 * Created by Administrator on 2017/5/5.
 */
module.exports = {
    url:{
        //获取产品信息
        getLand: "/r/product_Product/getLand",
        //获取景区黑名单
        getBlacklist:"/r/product_Product/getBlacklist",
        //增加景区黑名单
        addBlackList:"/r/product_Product/addBlackList",
        //编辑景区黑名单
        setBlacklist:"/r/product_Product/setBlacklist",
        //删除景区黑名单
        deleteBlacklist:"/r/product_Product/deleteBlacklist",
        //excel导入景区黑名单
        addBlacklistByExcel:"/r/product_Product/addBlacklistByExcel"
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