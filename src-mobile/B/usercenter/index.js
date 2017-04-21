require('./index.scss');

var Toast = require('COMMON/Components/Toast-Mobile/v1.0'),
    toast = new Toast;

var ParseTemplate = PFT.Util.ParseTemplate;

var tpls = {
    accBalance: ParseTemplate( require('./balance.xtpl') ),
    appLi: ParseTemplate( require('./li.xtpl') )
};

var UserCenter = PFT.Util.Class({
    container: '#userCenter',

    dom: {
        info: '#userInfo',          // 用户信息
        accBalance: '#accBalance',  // 账户余额
        list: '#list'               // 应用列表
    },

    MENU_ICONS: {
        book: ['icon-chanpinyuding', '#f37777'],
        order_search: ['icon-dingdan', '#0797d9'],
        poster: ['icon-haibaotuiguang', '#3eba40']
    },

    AJAX_URL: '/r/MicroPlat_Member/userCenterInfo',

    init: function() {
        var token = $('#csrf_token').val();

        this.ajaxGetInfo( token );
    },

    ajaxGetInfo: function( token ){
        var _this = this;

        if( token ) {
            PFT.Util.Ajax( this.AJAX_URL, {
                type: 'post',

                params: {
                    token: token
                },

                loading: function() {
                    // type,content,duration,callback
                    toast.show('loading', '拼命加载中...');
                },

                success: function( res ) {
                    toast.hide();

                    if( res.code == 200 ) {
                        _this.renderInfo( res.data );
                    } else {
                        PFT.Mobile.Alert( res.msg );
                    }
                },

                serverError: function( xhr, errMsg ) {
                    PFT.Mobile.Alert( errMsg );
                }
            })
        }
    },

    renderInfo: function( data ) {
        var userinfo = $( this.dom.info ),
            accBalance = $( this.dom.accBalance ),
            applist = $( this.dom.list );

        userinfo.find('.user-photo').css({
            backgroundImage: data.user_info.headphoto
        }).end().find('.user-name').text( data.user_info.name );

        if( data.user_info.money ) {
            let html = tpls.accBalance({ balance: data.user_info.money/100 });
            accBalance.html( html );
        }

        var ul = applist.children('.ul'),
            html = tpls.appLi({ menu: data.menu, icons: this.MENU_ICONS });

        ul.html( html );
    }
});

$(function(){
    new UserCenter;
})