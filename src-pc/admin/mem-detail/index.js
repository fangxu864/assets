require("./index.scss");
require('./lightbox.css');
require('./lightbox.js');

var DatePicker = require("COMMON/modules/datepicker"),
    Message = require('pft-ui-component/Message'),
    Dialog = require('pft-ui-component/Dialog'),
    ParseTemplate = PFT.Util.ParseTemplate,
    SECTION_TPL = {
        'detailAside': ParseTemplate( require('./aside.xtpl') ),
        'detailBaseinfo': ParseTemplate( require('./baseinfo.xtpl') ),
        'detailContract': ParseTemplate( require('./contract.xtpl') ),
        'detailAuthority': ParseTemplate( require('./authority.xtpl') ),
        'detailContact': ParseTemplate( require('./contact.xtpl') ),
        'detailCertification': ParseTemplate( require('./certification.xtpl') )
    },
    dialogTpl = {
        'dialogBaseinfo': ParseTemplate( require('./dialog-baseinfo.xtpl') ),
        'dialogCashout': ParseTemplate( require('./dialog-cashout.xtpl') ),
        'dialogAuthority': ParseTemplate( require('./dialog-authority.xtpl') ),
    },
    Toast = require('COMMON/modules/Toast'),
    toast = new Toast;

var MemberManage = PFT.Util.Class({

    container: '#Page_Mem-detail',

    mainContainer: '#detailMain',

    asideContainer: '#detailAside',

    EVENTS: {
        'click .btnAction':         'onBtnActionClick',         // 合并操作事件
        'click .select':            'onSelectClick',            // 下拉框点击事件
        'click #btnModBaseinfo':    'onBtnModBaseinfoClick',
        'click #btnConfigCash':     'onBtnConfigCashClick'
    },

    AJAX_URLS: {
        memberDetail:       '/r/Admin_MemberManage/getMemberDetails/',
        setMemberStatus:    '/call/jh_mem.php',
        saveMemberInfo:     '/r/Admin_MemberManage/saveMemberInfo/'
    },

    memberIdentity: null,

    cacheData: {},

    filterParams: {},

    init: function() {
        var id = this.id = PFT.Util.UrlParse()['id'];

        if( !id ) {
            Message.alert('会员ID有误，请返回列表重新选择','',{
                onCloseAfter : function(){
                    location.href = 'mems.html';
                }
            });
            return false;
        }

        this.bindEvents();

        this.updateMemberDetails();
    },

    bindEvents: function() {
        $(document).on('click', function( e ){
            if( !$( e.target ).closest('.select').length && !$( e.target ).is('.select') ) {
                $('.select').removeClass('active');
            }
        });
    },

    // 设置当前登录账户身份
    setMemberIdentity: function( type ) {
        this.memberIdentity = {};

        switch( +type ) {
            case 2:
                this.memberIdentity.isKefu = true;
                break;

            case 4:
                this.memberIdentity.isManager = true;
                break;
        }
    },

    updateMemberDetails: function( section_ids ) {
        var that = this;

        PFT.Util.Ajax( this.AJAX_URLS.memberDetail, {
            type: 'post',

            params: { id: this.id },

            loading: function(){
                toast.show('loading','加载中，请稍候');
            },

            success: function( res ) {
                toast.hide();

                if( res.code == 200 ) {

                    that.memberIdentity || that.setMemberIdentity( 4 );

                    that.render( res.data, section_ids );
                } else {
                    Message.alert( res.msg );
                }
            },

            serverError: function( xhr, msg ) {
                toast.hide();
                Message.error( msg || PFT.AJAX_ERROR_TEXT );
            }
        })
    },

    render: function( data, section_ids ) {
        var section_ids = section_ids || [];

        this.updateSections( data, section_ids );
        // if( section_ids.length ) {
        //     for( var i = 0, len = section_ids.length; i<len; i++ ) {
        //         this.updateSections( data, section_ids[i] );
        //     }
        // } else {
        //     this.renderHtml( data );
        // }
    },

    updateSections: function( data, section_ids ) {
        var opt = {},
            section,
            section_id;

        opt.detail = data,
        opt.isKefu = this.memberIdentity.isKefu || false,
        opt.isManager = this.memberIdentity.isManager || false;

        if( section_ids.length ) {
            for( var i = 0, len = section_ids.length; i<len; i++ ) {

                section_id = section_ids[i];
                section = $( '#' + section_id );

                !section.length && $('<div>', { id: section_id, class: 'detail-section' }).appendTo( this.mainContainer );
                section = $( '#' + section_id );
                section.html( SECTION_TPL[ section_id ]( opt ) );
            }
        } else {
            for( var key in SECTION_TPL ) {

                section_id = key;
                section = $( '#' + section_id );

                if( section_id == 'detailAside' ) {

                    section.html( SECTION_TPL[ section_id ]( opt ) );

                } else {

                    !section.length && $('<div>', { id:  section_id, class: 'detail-section' }).appendTo( this.mainContainer );
                    section = $( '#' + section_id );
                    section.html( SECTION_TPL[ section_id ]( opt ) );

                }
            }
        }
    },

    JsonStringify:function (obj) {
        var str="",
            arr=[];
        for(var key in obj){
            str=key+"="+obj[key];
            arr.push(str);
        }
        return arr.join("&");
    },

    onBtnActionClick: function( e ) {
        var that = this,
            currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id'),
            CONFIRM_MSG = {
                clearAccount:   '确定删除？',
                Disable:        '确定禁用？',
                Enable:         '确定启用？',
                Renew:          '确定恢复？',
                PassApply:      '确定通过？',
                RejectApply:    '确定拒绝？',
                resetPassword:  '是否重置此账号密码为【pft@12301】？'
            },
            actionParams = {};

        actionParams.mid = id;

        switch( currTarget.attr('data-action') ) {
            case 'clearAccount':
                actionParams.action = 'clearAccount';
                break;

            case 'Disable':
            case 'RejectApply':
                actionParams.action = 'SetMemStatus';
                actionParams.status = 1;
                break;

            case 'Enable':
            case 'Renew':
            case 'PassApply':
                actionParams.action = 'SetMemStatus';
                actionParams.status = 0;
                break;

            case 'resetPassword':
                actionParams.action = 'resetPassword';
                break;
        }

        Message.confirm( CONFIRM_MSG[ currTarget.attr('data-action') ], function( result ){
            if( result ) {
                that.ajaxSetMemberStatus( currTarget.attr('data-action'), actionParams );
            } else {

            }
        });
    },

    ajaxSetMemberStatus: function( action, params ) {
        var that = this;

        PFT.Util.Ajax( this.AJAX_URLS.setMemberStatus, {
            type: 'post',

            params: params,

            loading: function(){
                toast.show('loading','正在设置，请稍候');
            },

            success: function( res ) {
                toast.hide();

                if( res.status == 'success' || res.status == 'ok' ) {

                    if( action != 'resetPassword' ) {
                        that.updateMemberDetails();
                    }

                } else {
                    Message.alert( res.msg );
                }
            },

            serverError: function( xhr, msg ) {
                Message.alert( msg );
            }
        });
    },

    onBtnModBaseinfoClick: function( e ) {
        var that = this,
            target = $( e.target ),
            info = {};

        info.dname = target.attr('data-name'),
        info.group = target.attr('data-group'),
        info.comname = target.attr('data-comname'),
        info.comtype = target.attr('data-comtype'),
        info.transfer_time = target.attr('data-transfer-time');

        if( !this.dialogBaseinfo ) {

            this.dialogBaseinfo = new Dialog({
                title: '基本信息修改',
                content: dialogTpl.dialogBaseinfo({ info : info }),
                width: 550,
                yesBtn: {
                    text: '保存',
                    onClick: function( e ) {

                        that.ajaxSetBaseinfo({
                            url: that.AJAX_URLS.saveMemberInfo,

                            success: function( res ) {
                                that.updateMemberDetails([ 'detailAside', 'detailBaseinfo' ]);
                            }
                        })
                    }
                },
                cancelBtn: '取消',
                zIndex: 99,
                onOpenBefore : function() {},
                onOpenAfter : function() {
                    if( !that.datepicker ) {
                        that.initDatepicker();
                    }
                },
                onCloseBefore : function() {},
                onCloseAfter : function() {}
            });

        }

        this.dialogBaseinfo.open();
    },

    ajaxSetBaseinfo: function( opt ) {
        var params = {};

        params.id = this.id;

        if( this.hasIllegalChar( $('#memsDialogDname').val() ) || this.hasIllegalChar( $('#memsDialogCName').val() ) ) {
            Message.alert('包含非法字符！');
            return false;
        }

        params.dname = $('#memsDialogDname').val()
        params.group = $('#memsDialogGroup').find('.val').attr('data-val');
        params.cname = $('#memsDialogCName').val();
        params.ctype = $('#memsDialogCType').find('.val').text();
        params.transtime = $('#dialogDatetimepicker').find('.input-date').val();

        this.ajaxSetData({
            url: opt.url,
            params: params,
            success: opt.success
        });
    },

    onBtnConfigCashClick: function( e ) {
        var that = this,
            target = $( e.target ),
            info = {};

        if( !this.dialogConfigCash ) {

            this.dialogConfigCash = new Dialog({
                title: '清分配置',
                content: '初始化中，请稍候',
                width: 550,
                yesBtn: {
                    text: '保存',
                    onClick: function( e ) {

                        that.ajaxConfigCash({
                            url: that.AJAX_URLS.saveMemberInfo,

                            success: function( res ) {
                                that.updateMemberDetails([ 'detailAside', 'detailBaseinfo' ]);
                            }
                        })
                    }
                },
                cancelBtn: '取消',
                zIndex: 99,
                onOpenBefore : function() {},
                onOpenAfter : function() {
                    that.ajaxGetConfigCash();
                },
                onCloseBefore : function() {},
                onCloseAfter : function() {}
            });

        }

        this.dialogConfigCash.open();
    },

    ajaxGetConfigCash: function() {},

    ajaxConfigCash: function( opt ) {
        var params = {};

        params.id = this.id;


        this.ajaxSetData({
            url: opt.url,
            params: params,
            success: opt.success
        });
    },

    ajaxSetData: function( opt ) {
        PFT.Util.Ajax( opt.url, {
            type: 'post',

            params: opt.params,

            loading: function() {
                toast.show('loading','正在设置，请稍候');
            },

            success: function( res ) {
                toast.hide();

                if( res.code == 200 ) {
                    opt.success && opt.success( res );
                } else {
                    Message.alert( res.msg );
                }
            },

            serverError: function( xhr, msg ) {
                Message.alert( msg );
            }
        })
    },

    selectRadio: function( e ){
        var currTarget = $( e.currentTarget );

        currTarget.addClass('active').siblings().removeClass('active');
    },

    onSelectClick: function( e ) {
        var currTarget = $( e.currentTarget ),
            target = $( e.target );

        $( this.container ).find('.select').not( currTarget ).removeClass('active');

        if( currTarget.hasClass('disabled') ) { return false; }

        if( target.closest('.dropdown-options').length ) {
            currTarget.removeClass('active');
            currTarget.find('.val').html( target.text() );
        } else {
            currTarget.addClass('active');
        }
    },

    initDatepicker : function(){
        var that = this;
        var datepicker = this.datepicker = new DatePicker();
        $("#dialogDatetimepicker").on("click",function(e){
            var tarInp = $( this ).find('.input-date'),
                date = tarInp.val();

            if( !date ) date = DatePicker.CalendarCore.gettoday();

            datepicker.open( date, {
                picker : tarInp,
                todayAfterDisable : false,
                // max : max,
                onAfter : function(val,oldVal){}
            });
        })
    },

    isNumber: function( str ){
        var pattern = /^\d+$/;

        if( pattern.test( str ) ) {
            return true;
        }

        return false;
    },

    isFloat: function( str ) {
        var pattern = /^\d*\.?\d+$/;

        if( pattern.test( str ) ) {
            return true;
        }

        return false;
    },

    hasIllegalChar: function( str ) {
        var pattern=/[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;

        if( pattern.test( str ) ){
            return true;
        }

        return false;
    }
});

$(function(){
    new MemberManage;
})