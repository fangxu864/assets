require("./index.scss");
require('./lightbox.css');
require('./lightbox.js');

var DatePicker = require("COMMON/modules/datepicker"),
    Message = require('pft-ui-component/Message'),
    Dialog = require('pft-ui-component/Dialog'),
    ParseTemplate = PFT.Util.ParseTemplate,
    ParseAsideTpl = ParseTemplate( require('./aside.xtpl') ),
    ParseMainTpl = ParseTemplate( require('./main.xtpl') ),
    Toast = require('COMMON/modules/Toast'),
    toast = new Toast;

var MemberManage = PFT.Util.Class({

    container: '#Page_Mem-detail',

    asideContainer: '#detailAside',

    mainContainer: '#detailMain',

    EVENTS: {
        'click .btnAction':                 'onBtnActionClick',         // 合并操作事件
        'click #btnModBaseinfo':            'onBtnModBaseinfoClick'
    },

    AJAX_URLS: {
        memberDetail: '/r/Admin_MemberManage/getMemberDetails/',
        setMemberStatus:    '/call/jh_mem.php'
    },

    memberIdentity: {
        isKefu: false,
        isManager: false,
        isFinancial: false
    },

    cacheData: {},

    filterParams: {},

    init: function() {
        var id = PFT.Util.UrlParse()['id'];

        if( !id ) {
            Message.alert('会员ID有误，请返回列表重新选择');
            return false;
        }

        this.getMemberDetails( id );
    },

    // 设置当前登录账户身份
    setMemberIdentity: function( type ) {
        switch( +type ) {
            case 2:
                this.memberIdentity.isKefu = true;
                break;

            case 4:
                this.memberIdentity.isManager = true;
                break;
        }
    },

    getMemberDetails: function( id, section_id ) {
        var that = this;

        PFT.Util.Ajax( this.AJAX_URLS.memberDetail, {
            type: 'post',

            params: { id: id },

            loading: function(){
                toast.show('loading','加载中，请稍候');
            },

            success: function( res ) {
                toast.hide();

                if( res.code == 200 ) {

                    that.setMemberIdentity( res.data.type );
                    $( that.asideContainer ).html( ParseAsideTpl({ detail: res.data, isManager: that.memberIdentity.isManager }) );
                    $( that.mainContainer ).html( ParseMainTpl({ detail: res.data, isManager: that.memberIdentity.isManager, isKefu: that.memberIdentity.isKefu }) );
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

    renderMain: function( section_id, data ) {

    },

    JsonStringify:function (obj) {
        var str="";
        var arr=[];
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

        switch( currTarget.attr('data-action') ) {
            case 'clearAccount':
                actionParams.action = 'clearAccount';
                actionParams.mid = id;
                break;

            case 'Disable':
            case 'RejectApply':
                actionParams.action = 'SetMemStatus';
                actionParams.mid = id;
                actionParams.status = 1;
                break;

            case 'Enable':
            case 'Renew':
            case 'PassApply':
                actionParams.action = 'SetMemStatus';
                actionParams.mid = id;
                actionParams.status = 0;
                break;

            case 'resetPassword':
                actionParams.action = 'resetPassword';
                actionParams.mid = id;
                break;
        }

        Message.confirm( CONFIRM_MSG[ currTarget.attr('data-action') ], function( result ){
            if( result ) {
                that.ajaxSetMemberStatus( actionParams );
            } else {

            }
        });
    },

    ajaxSetMemberStatus: function( params ) {
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

                    that.getMemberDetails( params.mid );

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
            info = {},
            info.dname = target.attr('data-name'),
            info.group = target.attr('data-group'),
            info.comname = target.attr('data-comname'),
            info.comtype = target.attr('data-comtype'),
            info.transfer_time = target.attr('data-transfer-time');



        var d = new Dialog({
            title: '基本信息修改',
            content: '',
            width: 550,
            yesBtn: '保存',
            cancelBtn: '取消',
            zIndex: 999,
            onOpenBefore : function() {},
            onOpenAfter : function() {},
            onCloseBefore : function() {},
            onCloseAfter : function() {}
        });

        d.open();
    },

    selectRadio: function( e ){
        var currTarget = $( e.currentTarget );

        currTarget.addClass('active').siblings().removeClass('active');
    },

    onDropdownClick: function( e ) {
        var currTarget = $( e.currentTarget ),
            target = $( e.target );

        searchContainer.find('.dropdown').not( currTarget ).removeClass('active');

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

            if(!date) date = DatePicker.CalendarCore.gettoday();

            datepicker.open(date,{
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