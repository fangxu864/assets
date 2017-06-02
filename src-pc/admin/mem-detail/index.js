require("./index.scss");
require('./lightbox.css');
require('./lightbox.js');

var DatePicker = require("COMMON/modules/datepicker"),
    Message = require('pft-ui-component/Message'),
    Dialog = require('pft-ui-component/Dialog'),
    Drag = require("pft-ui-component/Drag"),
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
        'dialogBank': ParseTemplate( require('./dialog-bank.xtpl') )
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
        'click .radioBox':          'selectRadio',              // 点击 单选项
        'click #btnModBaseinfo':    'onBtnModBaseinfoClick',
        'click #btnConfigCash':     'onBtnConfigCashClick',
        'click #btnModAuthority':   'onBtnModAuthorityClick'
    },

    AJAX_URLS: {
        memberDetail:       '/r/Admin_MemberManage/getMemberDetails/',
        setMemberStatus:    '/call/jh_mem.php',
        saveMemberInfo:     '/r/Admin_MemberManage/saveMemberInfo/',
        modAuthority:       '/r/Admin_MemberManage/saveMemberPermissions/',
        getAuthority:       '/r/Admin_MemberManage/getMemberPermissions/',
        configCash: {
            getSettingInfo: '/r/Finance_SettleBlance/getSettingInfo/',
            getAccounts: '/r/Finance_SettleBlance/getAccounts/',
            setStatus: '/r/Finance_SettleBlance/setStatus/',
            edit: '/r/Finance_SettleBlance/udpate/',
            add: '/r/Finance_SettleBlance/add/'
        }
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
        var that = this;

        $(document).on('click', function( e ){
            if( !$( e.target ).closest('.select').length && !$( e.target ).is('.select') ) {
                $('.select').removeClass('active');
            }
        });

        // 权限设置 -> 更改 -> 对接系统
        $(document).on('click', '#dialogSysRelated li', function(){
            if( !$(this).hasClass('active') ) {
                $(this).addClass('active').siblings().removeClass('active');
            }
        }).on('click', '#btnAddSys', function(){
            var sysList = $('#dialogSysRelated').find('.sys-list'),
                sysRelatedList = $('#dialogSysRelated').find('.sys-related-list');

            if( sysList.find('.active').length ) {
                sysList.find('.active').prependTo( sysRelatedList ).removeClass('active');
            }
        }).on('click', '#btnDelSys', function(){
            var sysList = $('#dialogSysRelated').find('.sys-list'),
                sysRelatedList = $('#dialogSysRelated').find('.sys-related-list');

            if( sysRelatedList.find('.active').length ) {
                sysRelatedList.find('.active').prependTo( sysList ).removeClass('active');
            }
        });


        $(document).on('click', '#memsDialogCashoutWay .dropdown-options li', function( e ){
            var i = $( e.currentTarget ).index();
            // 清分配置 -> 提现方式 显示对应清分时间设置
            $('#cashoutTime').find('.cashout-time').eq(i).addClass('active').siblings().removeClass('active');
            // 清分配置 -> 提现方式 设置手续费默认值
            var defaultFee = { '1': 5, '2': 4, '3': 0};
            $('#memsDialogServiceFee').val( defaultFee[ $( e.currentTarget ).attr('data-val') ] );
        }).on('click', '#bankAccountList li', function( e ){
            var target = $( e.target );
            if( !target.hasClass('disabled') ) {
                target.addClass('active').siblings().removeClass('active');
            }
        }).on('click', '#memsDialogSetAuto', function( e ){
            $(this).toggleClass('close');
            that.setAutoConfigStatus( e.target );
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
            action = currTarget.attr('data-action'),
            CONFIRM_MSG = {
                clearAccount:   '确定删除？',
                Disable:        '确定禁用？',
                Enable:         '确定启用？',
                Renew:          '确定恢复？',
                PassApply:      '确定通过？',
                RejectApply:    '确定拒绝？',
                resetPassword:  '是否重置此账号密码为【pft@12301】？',
                accredits_auth: {
                    '0': '确定撤销审核？',
                    '2': '确定通过审核？'
                }
            },
            actionParams = {},
            msg;

        switch( action ) {
            case 'clearAccount':
                actionParams.action = 'clearAccount';
                actionParams.mid = id;
                msg = CONFIRM_MSG[ action ];
                break;

            case 'Disable':
            case 'RejectApply':
                actionParams.action = 'SetMemStatus';
                actionParams.status = 1;
                actionParams.mid = id;
                msg = CONFIRM_MSG[ action ];
                break;

            case 'Enable':
            case 'Renew':
            case 'PassApply':
                actionParams.action = 'SetMemStatus';
                actionParams.status = 0;
                actionParams.mid = id;
                msg = CONFIRM_MSG[ action ];
                break;

            case 'resetPassword':
                actionParams.action = 'resetPassword';
                actionParams.mid = id;
                msg = CONFIRM_MSG[ action ];
                break;

            case 'accredits_auth':
                actionParams.action = 'accredits_auth';
                actionParams.did = id;
                actionParams.status = currTarget.attr('data-status');
                msg = CONFIRM_MSG[ action ][ currTarget.attr('data-status') ] || '';
                break;
        }

        if( action == 'accredits_auth' && currTarget.attr('data-status') == 3 ) {
            if( !this.dialogRejectCert ) {
                this.dialogRejectCert = new Dialog({
                    drag: Drag,
                    title: '驳回原因',
                    content: '<div class="textarea-wrap"><textarea id="rejectCert" class="textarea"></textarea></div>',
                    width: 420,
                    yesBtn: {
                        text: '确定',
                        onClick: function( e ) {

                            actionParams.msg = $('#rejectCert').val();
                            that.ajaxSetMemberStatus( action, actionParams );

                        }
                    },
                    cancelBtn: '取消',
                    zIndex: 99
                });
            }
            this.dialogRejectCert.open();
        } else {
            Message.confirm( msg, function( result ){
                if( result ) {
                    that.ajaxSetMemberStatus( action, actionParams );
                } else {

                }
            });
        }
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


    // configCash: {
    //     getSettingInfo:  清分配置-获取某条配置的具体信息
    //     getAccounts:     清分配置-获取常用的银行账户
    //     setStatus:       清分配置-设置配置的状态
    //     edit:            清分配置-修改自动清分配置
    //     add:             清分配置-新增自动清分配置
    // }
    onBtnConfigCashClick: function( e ) {
        var that = this,
            target = $( e.target ),
            info = {},
            configId = target.attr('data-configid') || '',
            action = target.attr('data-action'),
            yesBtnText = {'add':'新增', 'edit':'保存'}[ action ];

        if( !this.dialogConfigCash ) {

            this.dialogConfigCash = new Dialog({
                drag : Drag,
                title: '清分配置',
                content: '<div id="dialogConfigCash"></div><div id="dialogConfigBank"></div>',
                width: 560,
                yesBtn: {
                    text: yesBtnText,
                    onClick: function( e ) {

                        if( that.isConfigCashFormValid() ) {
                            that.ajaxConfigCash({
                                action: action,

                                configId: configId,

                                url: that.AJAX_URLS.configCash[ action ],

                                success: function( res ) {
                                    that.updateMemberDetails([ 'detailContract' ]);
                                }
                            })
                        } else {
                            return false;
                        }
                    }
                },
                cancelBtn: '取消',
                zIndex: 99,
                onOpenBefore : function() {},
                onOpenAfter : function() {
                    that.ajaxGetConfigCash( configId );
                    that.ajaxGetBankAccount( that.id );
                },
                onCloseBefore : function() {},
                onCloseAfter : function() {}
            });

        }

        this.dialogConfigCash.open();
    },

    setAutoConfigStatus: function( target ) {
        var params = {};

        params.id = $( target ).attr('data-id');
        params.status = $( target ).hasClass('close') ? 'off' : 'on';

        PFT.Util.Ajax( this.AJAX_URLS.configCash.setStatus, {
            type: 'post',

            params: params,

            loading: function(){},

            success: function( res ){
                if( res.code != 200 ) {
                    Message.alert( res.msg );
                }
            },

            serverError: function(){
                Message.alert( res.msg );
            }
        })
    },

    isConfigCashFormValid: function() {
        var inp,
            val;

        inp = $('#memsDialogServiceFee');
        val = $.trim( inp.val() );
        if( !this.isFloat( val ) ) {
            Message.alert('手续费输入有误！','',{
                onCloseAfter : function(){
                    inp.focus();
                }
            });
            return false;
        }

        inp = $('#memsDialogReserveFee').find('.active').find('.input-text');
        if( inp.length ) {
            val = $.trim( inp.val() );
            if( !this.isFloat( val ) ) {
                Message.alert('预留金额输入有误！','',{
                    onCloseAfter : function(){
                        inp.focus();
                    }
                });
                return false;
            }
        }

        return true;
    },

    ajaxGetConfigCash: function( configId ) {
        var params = {},
            configId = configId; // 19为测试的配置id

        if( configId ) {
            params.id = configId;

            PFT.Util.Ajax( this.AJAX_URLS.configCash.getSettingInfo, {
                type: 'post',

                params: params,

                loading: function() {
                    $('#dialogConfigCash').html('初始化中，请稍候');
                },

                success: function( res ) {
                    var html;

                    if( res.code == 200 ) {
                        html = dialogTpl.dialogCashout({ info : res.data });
                        $('#dialogConfigCash').html( html );
                    } else {
                        $('#dialogConfigCash').html( res.msg );
                    }
                },

                serverError: function( xhr, msg ) {
                    $('#dialogConfigCash').html( msg || PFT.AJAX_ERROR_TEXT );
                }
            })
        } else {
            $('#dialogConfigCash').html( dialogTpl.dialogCashout({ info : {} }) );
        }
    },

    ajaxGetBankAccount: function( id ) {
        PFT.Util.Ajax( this.AJAX_URLS.configCash.getAccounts, {
            type: 'post',

            params: { fid: id },

            loading: function() {
                $('#dialogConfigBank').html('正在获取提现账号信息，请稍候');
            },

            success: function( res ) {
                var html;

                if( res.code == 200 ) {
                    html = dialogTpl.dialogBank({ info : res.data.account_info });
                    $('#dialogConfigBank').html( html );
                } else {
                    $('#dialogConfigBank').html( res.msg );
                }
            },

            serverError: function( xhr, msg ) {
                $('#dialogConfigBank').html( msg || PFT.AJAX_ERROR_TEXT );
            }
        })
    },

    ajaxConfigCash: function( opt ) {
        // * mode  int 自动清分模式，1=日结，2=周结，3=月结 日结 手续费 5 周结 手续费 4 月结 手续费 0
        // * freeze_type   int 资金冻结类型，1=冻结未使用的总额，2=按比例冻结
        // * close_date    int 周结和月结模式中的清算日期，周结=1-7，月结=1-31
        // * close_time    int 具体的清算时间
        // * transfer_date int 月结模式中清分日期
        // * transfer_time int 月结模式中清分时间
        // * account_no    int 银行账户的序号 1或2
        // * service_fee   float   提现手续费千分比例
        // * cut_way   int 手续费扣除方式：0=提现金额中扣除，1=账户余额扣除 - 默认1
        // * money_type    int 资金冻结详情类别：1=比例，2=具体金额
        // * money_value   float   自资金冻结详情数值：具体比例或是具体金额
        var params = {},
            inp,
            val;

        params.mode = $('#memsDialogCashoutWay').find('.val').attr('data-val');

        params.service_fee = $('#memsDialogServiceFee').val();

        params.freeze_type = $('#memsDialogReserveFee').find('.active').index() != 2 ? '2' : '1';
        if( params.freeze_type == 2 ) {

            inp = $('#memsDialogReserveFee').find('.active').find('.input-text');
            val = $.trim( inp.val() );
            params.money_value = val;
            params.money_type = $('#memsDialogReserveFee').find('.active').index() == 0 ? 2 : 1;

        }

        switch( +params.mode ) {
            case 1:
                params.close_time = $('#cashoutTime').find('.cashout-time').eq(0).find('.val').attr('data-val');
                break;
            case 2:
                params.close_date = $('#cashoutTime').find('.cashout-time').eq(1).find('.radioBox').filter(function(){ return $(this).hasClass('active') }).attr('data-day');
                params.close_time = $('#cashoutTime').find('.cashout-time').eq(1).find('.val').attr('data-val');
                break;
            case 3:
                params.close_date = $('#cashoutTime').find('.cashout-time').eq(2).find('.select').eq(0).find('.val').attr('data-val');
                params.close_time = $('#cashoutTime').find('.cashout-time').eq(2).find('.select').eq(1).find('.val').attr('data-val');
                params.transfer_date = params.close_date;
                params.transfer_time = params.close_time;
                break;
        }

        params.account_no = $('#bankAccountList').find('.active').length ? $('#bankAccountList').find('.active').attr('data-account-no') : '';
        params.cut_way = $('#memsDialogServiceFeeFrom').find('.active').attr('data-stat');

        switch( opt.action ) {
            case 'add':
                // * fid   int 用户ID
                params.fid = this.id;
                break;
            case 'edit':
                // * id  int 记录ID
                params.id = opt.configId;
                break;
        }

        this.ajaxSetData({
            url: opt.url,
            params: params,
            success: opt.success
        });
    },

    onBtnModAuthorityClick: function( e ) {
        var that = this,
            target = $( e.target ),
            info = {};

        if( !this.dialogModAuthority ) {

            this.dialogModAuthority = new Dialog({
                drag : Drag,
                title: '权限设置',
                content: '<div id="dialogModAuthority"></div>',
                width: 650,
                yesBtn: {
                    text: '保存',
                    onClick: function( e ) {

                        that.ajaxModAuthority({
                            account: target.attr('data-account'),

                            url: that.AJAX_URLS.modAuthority,

                            success: function( res ) {
                                that.updateMemberDetails([ 'detailAuthority' ]);
                            }
                        })
                    }
                },
                cancelBtn: '取消',
                zIndex: 99,
                onOpenBefore : function() {},
                onOpenAfter : function() {
                    that.ajaxGetAuthority();
                },
                onCloseBefore : function() {},
                onCloseAfter : function() {}
            });

        }

        this.dialogModAuthority.open();
    },

    ajaxGetAuthority: function() {
        PFT.Util.Ajax( this.AJAX_URLS.getAuthority, {
            type: 'post',

            params: { id: 925 }, // this.id

            loading: function() {
                $('#dialogModAuthority').html('初始化中，请稍候');
            },

            success: function( res ) {
                var html;

                if( res.code == 200 ) {
                    html = dialogTpl.dialogAuthority({ info : res.data });
                    $('#dialogModAuthority').html( html );
                } else {
                    $('#dialogModAuthority').html( res.msg );
                }
            },

            serverError: function( xhr, msg ) {
                $('#dialogModAuthority').html( msg || PFT.AJAX_ERROR_TEXT );
            }
        })
    },

    ajaxModAuthority: function( opt ) {
        var params = {};

        params.id = this.id;
        params.account = opt.account;
        params.add = $('#dialogAddSalerType').find('.active').attr('data-stat');
        params.bind = $('#dialogJiutianAuth').find('.active').attr('data-stat');
        params.search = $('#dialogTerminalSearch').find('.active').attr('data-stat');
        params.refund = $('#dialogRefundBack').find('.active').attr('data-stat');
        params.code = $('#dialogDCode').find('.input-text').val();
        params.sysArr = $('#dialogSysRelated').find('.sys-related-list li').map(function(){ return $(this).attr('data-sysid') }).get().join();
        params.sysType = params.sysArr ? 1 : 0;

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
            currTarget.find('.val').html( target.text() ).attr('data-val', target.attr('data-val'));
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