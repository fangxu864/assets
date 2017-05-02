/**
 * Created by Administrator on 2017/4/28.
 */

//对应的域名
var domin = PFT.PREFIX_DOMAIN();
module.exports={
    1:{
        titleName: "会员卡购票限制",
        href: domin + "prod_restrict.html",
        active: ''
    },
    2:{
        titleName: "黑名单",
        href: domin + "new/memcard_blacklist.html",
        active: ''
    },
    3:{
        titleName: "购票",
        href: domin + "new/memcard_buyticket.html",
        active: ''
    }
};