/**
 * Created by Administrator on 2016/12/29.
 */

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var ItemTpl = require("./item.xtpl");
var Loading = require("COMMON/js/util.loading.pc");

var LoadingHtml = Loading("努力加载中...",{
	height : 140
});

var Dialog = require('COMMON/modules/dialog-simple');
var Pagination = require("COMMON/modules/pagination-x/v1.0");

module.exports = function(parent){

    var container = $('<div id="PartnerChangeBox" class="PartnerChangeBox barBox"></div>').appendTo(parent);
    //var container = Tpl.appendTo(parent);

    var PartnerChange = PFT.Util.Class({
        //debug : true,
        __hasLoaded : false,

        container : container,

        template : PFT.Util.ParseTemplate(ItemTpl),

        pagination: null,

        PAGE_SIZE: 10,

        dialog: null,

        EVENTS: {
            'click .view-partners': 'onViewPartnerClick'
        },

        AJAX_URLS: {
            partnerChange: '/r/Home_HomeNotice/partnerChangeList/'
        },

        init : function(){
            //this.fetch();
            container.html(Tpl);
			this.listUl = container.find(".partnerList");
			this.listUl.html(LoadingHtml);
        },
        render : function(data){
             var html = this.template(data);
             this.listUl.html(html);
             this.trigger("ready");
        },
        fetch : function(){
            if(this.__hasLoaded) return false;
            this.__hasLoaded = true;

            var that = this;
            var listUl = this.listUl;


            Common.Ajax(Common.api.Home_HomeNotice.partnerChange,{
                params : {
                    size : 8,
                },
                loading : function(){
                    listUl.html(LoadingHtml);
                },
                complete : function(){
                    listUl.html('');
                },
                success : function(res){
                    var code = res.code;
                    var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                    var data = res.data;
                    if(code == 200){
                        that.render({data:data})
                    }else{
                        listUl.html('<div style="height:'+loadingHeight+'px; line-height:'+loadingHeight+'px" class="state serverError">'+msg+'</div>');
                        that.trigger("ready");
                    }
                },
                timeout : function(){
                    listUl.html('<div style="height:'+loadingHeight+'px; line-height:'+loadingHeight+'px" class="state timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</div>');
                    that.trigger("ready");
                },
                serverError : function(){
                    listUl.html('<div style="height:'+loadingHeight+'px; line-height:'+loadingHeight+'px" class="state serverError">'+PFT.AJAX_ERROR_TEXT+'</div>');
                    that.trigger("ready");
                }
            })


        },

        onViewPartnerClick: function( e ) {
            var _this = this,
                $target = $( e.currentTarget ),
                action = $target.attr('data-action'),
                num = Number( $target.attr('data-num') );

            // num不为0时，弹窗显示详情
            if( !!num ) {
                this.dialog = new Dialog({
                    header: '7天合作伙伴变动',
                    width: 600,
                    content: '<div id="dialogContent" class="dialog-content"></div>',
                    onOpenAfter : function() {
                        var dialogContent = $('#dialogContent'),
                            tempStr = '';

                        switch( action ) {
                            case 'add':
                                tempStr = '您添加了 ' + num + ' 个分销商';
                                break;
                            case 'del':
                                tempStr = '您删除了 ' + num + ' 个分销商';
                                break;
                            case 'added':
                                tempStr = num + ' 个供应商添加了您';
                                break;
                            case 'deleted':
                                tempStr = num + ' 个供应商删除了您';
                                break;
                        }

                        tempStr += '<table class="tb" width="100%"><thead><tr><th>时间</th><th>商户名称</th></tr></thead><tbody id="dialogTbody"></tbody></table>';

                        tempStr += '<div id="dialogPagination" class="clearfix"></div>';

                        dialogContent.append( tempStr );

                        _this.dialog.container.css({
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            margin: 'auto',
                            height: dialogContent.outerHeight(true)
                        });

                        _this.getPartnerChange({
                            container:  '#dialogTbody',
                            pageContainer: '#dialogPagination',
                            action: action
                        });
                    },
                    onCloseAfter: function(){
                        _this.dialog.remove();
                        _this.dialog = null;
                        _this.pagination = null;
                    }
                });

                this.dialog.open();
            }
        },

        // opt:
        // container:       tbody id
        // pageContainer:   分页容器id
        // action:          add/ del/ added/ deleted 四种操作
        // page:            当前页
        getPartnerChange: function( opt ) {
            var _this = this,
                type = {
                    add:        0,
                    del:        1,
                    added:      2,
                    deleted:    3
                },
                container = $( opt.container );

            var dialogContent = $('#dialogContent');

            Common.Ajax( _this.AJAX_URLS.partnerChange, {
                params: {
                    type: type[ opt.action ],
                    page: opt.page || 1,
                    size: this.PAGE_SIZE
                },

                loading: function(){
                    _this.renderDialog({
                        container: container,
                        data: LoadingHtml
                    });

                    _this.dialog.container.animate( {height: dialogContent.outerHeight(true)}, 100);
                },

                success: function( res ){
                    if( res.code == 200 ) {
                        if( res.data.list.length ) {
                            _this.renderDialog({
                                container: container,
                                data: res.data
                            });

                            if( !_this.pagination ) {
                                _this.pagination = new Pagination({
                                    container : opt.pageContainer, //必须，组件容器id
                                    count : 7,                //可选  连续显示分页数 建议奇数7或9
                                    showTotal : true,         //可选  是否显示总页数
                                    jump : true               //可选  是否显示跳到第几页
                                });

                                _this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
                                    // toPage :      要switch到第几页
                                    // currentPage : 当前所处第几页
                                    // totalPage :   当前共有几页
                                    _this.pagination.render({current:toPage,total:totalPage});

                                    _this.getPartnerChange({
                                        container:  opt.container,
                                        pageContainer: opt.pageContainer,
                                        action: action,
                                        page: toPage
                                    });
                                });
                            }

                            _this.pagination.render({current: res.data.page, total: res.data.total_page});

                        } else {
                            _this.renderDialog({
                                container: container,
                                data: '无数据'
                            });
                        }
                    } else {
                        _this.renderDialog({
                            container: container,
                            data: res.msg
                        });
                    }

                    _this.dialog.container.stop().animate( {height: dialogContent.outerHeight(true)}, 100);
                },

                serverError: function() {
                    _this.renderDialog({
                        container: container,
                        data: PFT.AJAX_ERROR_TEXT
                    });

                    _this.dialog.container.stop().animate( { height: dialogContent.outerHeight(true) }, 100);
                }
            })
        },

        // opt对象参数:
        // container:   容器JQuery对象
        // data:        渲染的数据，可接受 String 和 Object
        renderDialog: function( opt ) {
            var list,
                tempStr = '';

            switch( Object.prototype.toString.call( opt.data ) ) {
                case '[object String]':
                    opt.container.html('<tr class="dialog-error"><td colspan="2">' + opt.data + '</td></tr>');
                    break;

                case '[object Object]':
                    list = opt.data.list;

                    for( var i=0, len = list.length; i < len; i++ ) {
                        tempStr += '<tr><td>' + this.timestampToString( list[i].time ) + '</td><td>' + list[i].name + '</td></tr>'
                    }

                    opt.container.html( tempStr );
                    break;
            }
        },

        timestampToString: function( timestamp ) {
            // 时间戳包含毫秒数为13位
            // 后端返回10位时自动补000
            if( /^\d+$/.test( timestamp ) ) {
                timestamp = timestamp.length == 10 ? timestamp+'000' : timestamp;
                var d = new Date(+timestamp),
                    year = d.getFullYear(),
                    month = d.getMonth()+1 < 10 ? '0' + (d.getMonth()+1) : d.getMonth()+1,
                    day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
                    hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
                    minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
                    second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            } else {
                return '';
            }
        }
    });

    return new PartnerChange;
};


