/**
 * Created by Administrator on 2017/4/28.
 */

//对应的域名
var domin = PFT.PREFIX_DOMAIN();
module.exports={
    1:{
        titleName: "购票限制",
        href: domin + "prod_restrict.html",
        active: ''
    },
    2:{
        titleName: "黑名单",
        href: domin + "new/memcard_blacklist.html",
        active: '',
        display: function () {
            var isShow = false;
            var val = $("#session_sid").val();
            //只有三亚账户才显示黑名单和购票
            if(val == 272 || val == 4971 || val == 3385 || val == 6970) isShow = true;
            return isShow;
        }
    },
    3:{
        titleName: "购票",
        href: domin + "new/memcard_buyticket.html",
        active: '',
        display: function () {
            var isShow = false;
            var val = $("#session_sid").val();
            //只有三亚账户才显示黑名单和购票
            if(val == 272 || val == 4971 || val == 3385 || val == 6970) isShow = true;
            return isShow;
        }

    }
};