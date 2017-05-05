/**
 * Created by Administrator on 2017/4/28.
 */

//对应的域名
var domin = PFT.PREFIX_DOMAIN();
module.exports={
    1:{
        titleName: "基本信息",
        href: domin + "account_info.html",
        active: ''
    },
    2:{
        titleName: "账号信息",
        href: domin + "enterprise_info.html",
        active: ''
    },
    3:{
        titleName: "联系方式",
        href: domin + "contact.html",
        active: ''
    },
    4:{
        titleName: "资质认证",
        href: domin + "certifi.html",
        active: '',
        display: function () {
            var isShow = true;
            var val = $("#dtypeInp").val();
            //当用户类型为“5->普通用户”时，不显示资质认证
            if(val == 5) isShow = false;
            return isShow;
        }
    },
    5:{
        titleName: "修改密码",
        href: domin + "chPs.html",
        active: ''
    },
    6:{
        titleName: "套餐服务",
        href: domin + "new/appcenter_packserve.html",
        active: ''
    }
};