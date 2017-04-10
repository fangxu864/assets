
require('./index.scss');

// var Common = require("./common.js");
var ParseTemplate = PFT.Util.ParseTemplate;

var Loading = require("COMMON/js/util.loading.pc"),
    LoadingHtml = Loading("努力加载中...",{
        height : 121
    });

var tpl = {
    index:  require('./index.xtpl'),
    li:     require('./li.xtpl')
};

module.exports = function( parent, scrollContainerId ){

    var html = ParseTemplate( tpl.index )(),
        hasInited = false,

        $scrollContainer = $('#' + scrollContainerId),
        scrollContainerHeight = $scrollContainer.outerHeight(),
        scrollContainerOffsetTop = $scrollContainer.offset().top,
        $recommendApp,
        recommendAppOffsetTop;

    parent.append( html );
    $recommendApp = $('#recommendApp'),
    recommendAppOffsetTop = $recommendApp.offset().top;

    var RecommendApp = PFT.Util.Class({
        container: '#recommendApp',

        AJAX_URLS: {
            getModuleList: '/r/AppCenter_ModuleList/getModuleList'
        },

        init: function() {
            this.getModuleList();
        },

        getModuleList: function(){
            this.getData({
                url: this.AJAX_URLS.getModuleList
            })
        },

        getData: function( opt ) {
            var _this = this;

            return PFT.Util.Ajax( opt.url, {
                type: 'post',

                params: {
                    type: 5
                },

                loading: function() {
                    _this.renderData({
                        type: 'loading',
                        data: LoadingHtml
                    });

                    opt.loading && opt.loading();
                },

                success: function( res ) {
                    if( res.code == 200 ) {
                        if( res.data.length ) {
                            _this.renderData({
                                type: 'success',
                                data: res.data
                            });

                            opt.success && opt.success( res );
                        } else {
                            _this.renderData({
                                type: 'nodata',
                                data: '暂无数据'
                            });
                        }
                    } else {
                        _this.renderData({
                            type: 'dataError',
                            data: res.msg
                        });
                    }
                },

                serverError: function( xhr, msg ) {
                    _this.renderData({
                        type: 'serverError',
                        data: msg
                    });

                    opt.error && opt.error( xhr, msg );
                }
            });
        },

        renderData: function( opt ) {
            var container = this.container.find('.app-list').eq(0),
                html;

            switch( opt.type ) {
                case 'loading':
                case 'nodata':
                case 'dataError':
                case 'serverError':
                    container.html('<li class="app-' + opt.type.toLowerCase() + '">' + opt.data +'</li>');
                    break;
                case 'success':
                    html = ParseTemplate( tpl.li )({ data: opt.data });
                    container.html( html );
                    break;
            }
        }
    });

    $scrollContainer.on('scroll.showRecommendApp', function(){
        var scrollTop = $(this).scrollTop();

        if( scrollContainerHeight + scrollTop + scrollContainerOffsetTop > recommendAppOffsetTop ) {
            if( !hasInited ) {
                hasInited = true;

                new RecommendApp;

                $scrollContainer.off('scroll.showRecommendApp');
            }
        }
    });
}