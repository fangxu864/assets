require("./index.scss");

var DatePicker = require("COMMON/modules/datepicker"),
    Message = require('pft-ui-component/Message'),
    Tips = require('COMMON/modules/tips'),
    ParseTemplate = PFT.Util.ParseTemplate,
    trtpl = require('./tr.xtpl'),
    ParseMemberTpl = ParseTemplate( trtpl ),
    Pagination = require("COMMON/modules/pagination-x/v1.0");;

var MemberManage = PFT.Util.Class({

    container: '#Page_Mems',

    searchContainer: '#searchCtn',

    paginationContainer: '#paginationCtn',

    EVENTS: {
        'click .btn-morefilter':            'moreFilterToggle',         // 点击 更多筛选
        'click #memsMerchant .radioBox':    'selectRadio',              // 点击 选择商户
        'click #btnGetStatisticsNum':       'getStatisticsNum',         // 点击 统计数量
        'click .dropdown':                  'onDropdownClick',          // 下拉框点击事件
        'click .name_select_box':           'onNameSelectBoxClick',     // 过滤条件名称下拉，已合并至下拉框点击事件
        'click #schBtn':                    'onBtnSearchClick',         // 点击 搜索

        'click .btnDisable':                'onBtnDisableClick',        // 点击 禁用
        'click .btnDelete':                 'onBtnDeleteClick',         // 点击 删除
        'click .btnEnable':                 'onBtnEnableClick',         // 点击 启用
        'click .btnRenew':                  'onBtnRenewClick',          // 点击 恢复
        'click .btnResetPassword':          'resetPassword',            // 点击 重置密码
        'click .btnPassApply':              'passApply',                // 点击 通过
        'click .btnRejectApply':            'rejectApply',              // 点击 拒绝
        'click .btnDrawContract':           'drawContract',             // 点击 签单
        'mouseenter .hasTips':              'showTip',
        'mouseleave .hasTips':              'hideTip'
    },

    AJAX_URLS: {
        memberManage: '/r/Admin_MemberManage/getSearchParam/',
        getTotal: '/r/Admin_MemberManage/getTotalInfo/',
        getLoginIdentity: '/r/Admin_MemberManage/getLoginIdentity/'
    },

    memberIdentity: {
        isKefu: false,
        isManager: false,
        isFinancial: false
    },

    // 缓存每种搜索条件不同页面的数据
    cacheData: {},

    filterParams: {},

    xhrGetData: null,

    pagination: null,

    PAGE_SIZE: 10,

    GROUP: {
        '1': '华东大区',
        '2': '华北大区',
        '3': '西南大区',
        '4': '华中大区',
        '99': '项目组'
    },

    // 3 未启用 4 欠费 5 一个月内到期 6 待审核 7 待回款
    MerchantStat: {
        'unEnableNum': '3',     // 未启用 条数
        'ArrearsNum': '4',      // 欠费条数
        'ExpireNum': '5',       // 一个月内到期 条数
        'PendingNum': '6',      // 待审核 条数
        'StandNum': '7'         // 待回款 条数
    },

    init: function() {
        this.getLoginIdentity();

        this.initFilter();

        this.render();
    },

    getLoginIdentity: function(){
        var that = this;

        PFT.Util.Ajax( this.AJAX_URLS.getLoginIdentity, {
            type:'post',

            loading: function(){},

            success: function( res ){
                if( res.code == 200 ) {

                    that.setMemberIdentity( res.data.type );

                    that.renderIdentityRelated( res.data );

                } else {
                    Message.alert( res.msg );
                }
            },

            serverError: function() {
                Message.alert('请求出错，请刷新页面！');
            }
        });
    },

    renderIdentityRelated: function( data ) {
        //身份识别 1 签单人 2 客服 3 区域经理 4市场部门经理 6 财务员工 7 其他人员（签单，区域，客服显示全部）
        switch( +data.type ) {
            case 1:
                $('#memsSingleSign').addClass('disabled').find('.val').attr( 'data-val', data.sale[0].id ).html( data.sale[0].dname );
                $('#memsCustomer').find('ul').append( this.renderDropdown( 2, data.kefu ) );
                break;

            case 2:
                $('#memsSingleSign').find('ul').append( this.renderDropdown( 1, data.sale ) );
                $('#memsCustomer').find('ul').append( this.renderDropdown( 2, data.kefu ) );
                break;

            case 3:
                $('#memsSingleSign').find('ul').append( this.renderDropdown( 1, data.sale ) );
                $('#memsCustomer').find('ul').append( this.renderDropdown( 2, data.kefu ) );
                $('#memsRegion').addClass('disabled').find('.val').attr( 'data-val', data.group ).html( this.GROUP[ data.group ] );
                break;

            default:
                $('#memsSingleSign').find('ul').append( this.renderDropdown( 1, data.sale ) );
                $('#memsCustomer').find('ul').append( this.renderDropdown( 2, data.kefu ) );
                break;
        }
    },

    renderDropdown: function( type, data ) {
        //身份识别 1 签单人 2 客服 3 区域经理 4市场部门经理 6 财务员工 7 其他人员（签单，区域，客服显示全部）
        var html = '';

        switch( type ) {
            case 1:
                for( var i=0, len=data.length; i<len; i++ ) {
                    html += '<li data-val="' + data[i].id + '">' + data[i].dname + '</li>';
                }
                break;

            case 2:
                for( var i=0, len=data.length; i<len; i++ ) {
                    html += '<li data-val="' + data[i].st_memberid + '">' + data[i].st_name + '</li>';
                }
                break;
        }

        return html;
    },

    setMemberIdentity: function( type ) {
        switch( +type ) {
            case 2:
                this.memberIdentity.isKefu = true;
                break;

            case 4:
                this.memberIdentity.isManager = true;
                break;

            case 6:
                this.memberIdentity.isFinancial = true;
        }
    },

    initFilter: function() {
        var that = this;

        this.initDatepicker();

        $('#memsSearchName').on('input propertychange', function(){
            if( $('#clearSearchBtn').is(':visible') ) {
                if( !$.trim( $(this).val() ) ) {
                    $('#clearSearchBtn').hide();
                }
            } else {
                if( $.trim( $(this).val() ) ) {
                    $('#clearSearchBtn').show();
                }
            }
        });

        $('#clearSearchBtn').on('click', function(){
            $('#memsSearchName').val('');
            $(this).hide();
        })

        //导出按钮
        $("#expBtn").on("click",function () {
            var api = "/r/report_statistics/orderList/";

            if( that.isAdmin=="1" ){
                api="/r/report_statistics/adminOrderList/";
            }

            var downUrl = api + "?export_excel=1&" + that.JsonStringify( that.filterParams );

            that.outExcel(downUrl);
        });

        $(document).on('click', function( e ){
            if( !$( e.target ).closest('.dropdown').length && !$( e.target ).is('.dropdown') ) {
                $('.dropdown').removeClass('active');
            }
        })
    },

    render: function( state, data ){
        var renderBody = $('#renderBody'),
            html;

        switch( state ) {
            case 'success':
                html = ParseMemberTpl({ data: data, memberIdentity: this.memberIdentity });
                break;

            case 'loading':
                html = '<tr><td colspan="10" class="stat-wrap">' + (data || '加载中，请稍候') + '</td></tr>';
                break;

            case 'error':
                html = '<tr><td colspan="10" class="stat-wrap">' + (data || '数据加载失败，请稍后重试') + '</td></tr>';
                break;

            default:
                html = '<tr><td colspan="10" class="stat-wrap">请输入条件搜索</td></tr>';
                break;
        }

        renderBody.html( html );
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

    // 操作 事件列表
    onBtnDisableClick: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定禁用？', function( result ){
            if( result ) {

            } else {

            }
        });
    },
    onBtnDeleteClick: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定删除？', function( result ){
            if( result ) {

            } else {

            }
        });
    },
    onBtnEnableClick: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定启用？', function( result ){
            if( result ) {

            } else {

            }
        });
    },
    onBtnRenewClick: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定恢复？', function( result ){
            if( result ) {

            } else {

            }
        });
    },
    resetPassword: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '是否重置此账号密码为【pft@12301】？', function( result ){
            if( result ) {

            } else {

            }
        });
    },
    passApply: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定通过？', function( result ){
            if( result ) {

            } else {

            }
        });
    },
    rejectApply: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定拒绝？', function( result ){
            if( result ) {

            } else {

            }
        });
    },

    showTip: function( e ) {
        var currTarget = $( e.currentTarget ),
            action = currTarget.attr('data-action'),
            tipsContent = '';

        if( !this.tips ) this.tips = new Tips;

        switch( action ) {
            case 'OTA':
                if( currTarget.attr('data-ota') ) {
                    tipsContent = currTarget.attr('data-ota').split(',').join('<br>');
                    this.tips.show({
                        direction: 'bottom',
                        hostObj: currTarget,
                        content: tipsContent,
                        bgcolor: '#E5E5E5',
                        color: '#303D46'
                    });
                }
                break;

            case 'company':
                tipsContent += '企业名称：' + currTarget.attr('data-name') + '<br />';
                tipsContent += '企业类型：' + currTarget.attr('data-type') + '<br />';
                tipsContent += '商户类型：' + currTarget.attr('data-dtype') + '<br />';
                tipsContent += '联系人：' + currTarget.attr('data-cname') + '(' + currTarget.attr('data-mobile') + ')';

                this.tips.show({
                    direction: 'bottom',
                    hostObj: currTarget,
                    content: tipsContent,
                    bgcolor: '#E5E5E5',
                    color: '#303D46'
                });
                break;

            case 'cooperation':
                tipsContent += '合作模式：' + currTarget.attr('data-mode') + '-' + currTarget.attr('data-pay') + '<br />';
                currTarget.attr('data-packagefee') ? (tipsContent += '协议价格：' + currTarget.attr('data-packagefee') + '<br />') : '';
                tipsContent += '协议起始日期：' + currTarget.attr('data-begindate') + '<br />';
                tipsContent += '协议终止日期：' + currTarget.attr('data-enddate');

                this.tips.show({
                    direction: 'bottom',
                    hostObj: currTarget,
                    content: tipsContent,
                    bgcolor: '#E5E5E5',
                    color: '#303D46'
                });
                break;
        }
    },
    hideTip: function( e ) {
        this.tips.closeAllTips();
    },

    // Filter Events List
    //导出excel
    outExcel:function (downloadUrl) {
        var iframeName="iframe"+new Date().getTime();
        $("body").append(' <iframe style="display: none" name="'+iframeName+'"></iframe>');
        window.open(downloadUrl, iframeName);
    },

    moreFilterToggle: function( e ) {
        $('#moreFilter').toggle();
    },

    selectRadio: function( e ){
        var currTarget = $( e.currentTarget );

        currTarget.addClass('active').siblings().removeClass('active');
    },

    getStatisticsNum: function( e ) {
        var that = this;

        PFT.Util.Ajax( this.AJAX_URLS.getTotal,{
            type: 'post',

            loading: function() {},

            success: function( res ) {
                if( res.code == 200 ) {
                    that.renderStatisticsNum( res.data );
                } else {
                    Message.alert('请求出错，请刷新页面！');
                }
            },

            serverError: function( xhr, msg ) {
                Message.alert('请求出错，请刷新页面！');
            }
        })
    },

    renderStatisticsNum: function( data ){
        var memsMerchant = $('#memsMerchant');
        for( var key in data ) {
            memsMerchant.find('.radioBox[data-stat=' + this.MerchantStat[ key ] +']').find('.radio-text').append( '(' + data[key] + ')' );
        }
    },

    onDropdownClick: function( e ) {
        var searchContainer = $( this.searchContainer ),
            currTarget = $( e.currentTarget ),
            target = $( e.target );

        searchContainer.find('.dropdown').not( currTarget ).removeClass('active');

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
        $("#datetimepicker_begin").on("click",function(e){
            var tarInp = $("#btimeInp"),
                endInp = $("#etimeInp"),
                endtime = endInp.val(),
                date = tarInp.val();

            if(!date) date = DatePicker.CalendarCore.gettoday();

            var max = endtime ? endtime.substr(0,10) : "";

            console.log( date );

            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                // max : max,
                onAfter : function(val,oldVal){
                    var beginDate = val.substr(0,10),
                        endDate = endtime.substr(0,10),
                        queryLimit = $("#queryLimitHidInp").val(),
                        queryLimitTip = $("#queryLimitTipHidInp").val(),
                        begin_str = +new Date( beginDate ),
                        end_str = +new Date( endDate );

                    if(endDate && beginDate){
                        if(queryLimit==1){
                            // if(end_str-begin_str >= (30*24*60*60*1000)){
                            //     alert(queryLimitTip || "最多只能查询30天以内数据");
                            //     tarInp.val(oldVal);
                            // }
                        }else{
                            // if(end_str-begin_str >= (93*24*60*60*1000)){
                            //     alert(queryLimitTip || "最多只能查询三个月以内数据");
                            //     tarInp.val(oldVal);
                            // }
                        }
                    }
                }
            });
        })
        $("#datetimepicker_end").on("click",function(e){
            var tarInp = $("#etimeInp"),
                beginInp = $("#btimeInp"),
                beingTime = beginInp.val(),
                beginDate = beingTime.substr(0,10),
                date = tarInp.val();

            if(!date) date = DatePicker.CalendarCore.gettoday();

            var min = beingTime ? beingTime.substr(0,10) : "";

            console.log( date );


            datepicker.open(date,{
                picker : tarInp,
                todayAfterDisable : false,
                // min : min,
                onAfter : function(val,oldVal){
                    var endDate = val.substr(0,10),
                        queryLimit = $("#queryLimitHidInp").val();

                    if( endDate && beginDate ){
                        var begin_str = +new Date(beginDate);
                        var end_str = +new Date(endDate);
                        var queryLimitTip = $("#queryLimitTipHidInp").val();

                        if(queryLimit==1){
                            // if(end_str-begin_str >= (30*24*60*60*1000)){
                            //     alert(queryLimitTip || "最多只能查询30天以内数据");
                            //     tarInp.val(oldVal);
                            // }
                        }else{
                            // if(end_str-begin_str >= (93*24*60*60*1000)){
                            //     alert(queryLimitTip || "最多只能查询三个月以内数据");
                            //     tarInp.val(oldVal);
                            // }
                        }

                    }
                }
            });
        })
    },

    onBtnSearchClick: function() {
        if( !this.isFormValid() ) return false;

        ( !this.xhrGetData || this.xhrGetData.readyState == 4 ) && this.ajaxGetData( 1 );
    },

    ajaxGetData: function( page ) {
        var that = this,
            page = page ? page : 1,
            params = $.extend( {}, this.filterParams, { page: page, pageSize: this.PAGE_SIZE }),
            paramsStr = this.JsonStringify( params ),
            cache;

        if ( this.cacheData[ paramsStr ] ) {
            cache = this.cacheData[ paramsStr ];
            this.render( 'success', cache.data.list );
            this.pagination.render({ current: page, total: cache.data.totalPage });

        } else {
            // 请求数据
            this.xhrGetData = PFT.Util.Ajax( this.AJAX_URLS.memberManage, {
                type: 'post',

                params: params,

                loading: function() {
                    that.render('loading');
                },

                success: function( res ) {
                    if( res.code == 200 ) {
                        that.cacheData[ paramsStr ] = res;

                        that.render( 'success', res.data.list );

                        if( !that.pagination ) {
                            that.pagination = new Pagination({
                                container : that.paginationContainer, //必须，组件容器id
                                count : 7,                //可选  连续显示分页数 建议奇数7或9
                                showTotal : true,         //可选  是否显示总页数
                                jump : true               //可选  是否显示跳到第几页
                            });

                            that.pagination.on("page.switch",function(toPage,currentPage,totalPage){
                                // toPage :      要switch到第几页
                                // currentPage : 当前所处第几页
                                // totalPage :   当前共有几页
                                that.pagination.render({ current: toPage, total: totalPage });

                                that.xhrGetData.readyState == 4 && that.ajaxGetData( toPage );
                            });
                        }

                        that.pagination.render({current: page, total: res.data.totalPage});
                    } else {
                        that.render( 'error', res.msg );
                        that.pagination = null;
                        $( that.paginationContainer ).empty();
                    }
                },

                serverError: function( xhr, msg ) {
                    that.render( 'error', res.msg );
                    that.pagination = null;
                    $( that.paginationContainer ).empty();
                }
            });
        }
    },

    isFormValid: function() {
        var merchant = $('#memsMerchant').find('.active').attr('data-stat'),

            searchType = $('#memsSearchType').find('.val').attr('data-val'),
            searchName = $('#memsSearchName').val(),

            searchTime = $('#memsSearchTime').find('.val').attr('data-val'),
            searchBeginTime = $('#btimeInp').val(),
            searchEndTime = $('#etimeInp').val(),

            searchStatus = $('#memsSearchStatus').find('.val').attr('data-val'),
            merchantType = $('#memsMerchantType').find('.val').attr('data-val'),
            singleSign = $('#memsSingleSign').find('.val').attr('data-val'),
            customer = $('#memsCustomer').find('.val').attr('data-val'),
            region = $('#memsRegion').find('.val').attr('data-val'),
            group = $('#memsGroup').find('.val').attr('data-val'),
            comType = $('#memsComType').find('.val').attr('data-val'),
            enableBeginTime = $('#memsEnableBeginTime').val(),
            enableEndTime = $('#memsEnableEndTime').val(),
            model = $('#memsModel').find('.val').attr('data-val'),
            oucherFeeType = $('#memsOucherFeeType').find('.val').attr('data-val'),
            oucherFee = $('#memsOucherFee').val();

        if( this.hasIllegalChar( searchName ) ) {
            Message.alert('输入有误！请重新输入');
            $('#memsSearchName').focus();
            return false;
        }

        if( searchBeginTime > searchEndTime ) {
            Message.alert('起始时间不能大于结束时间！');
            return false;
        }

        if( enableBeginTime != '' ) {
            if( !this.isNumber( enableBeginTime ) ) {
                Message.alert('请输入正整数！');
                $('#memsEnableBeginTime').focus();
                return false;
            }

            if( !enableEndTime ) {
                Message.alert('启用时长最大值不能为空！');
                return false;
            }
        }

        if( enableEndTime != '' ) {
            if( !enableBeginTime ) {
                Message.alert('启用时长最小值不能为空！');
                return false;
            }

            if( !this.isNumber( enableEndTime ) ) {
                Message.alert('请输入正整数');
                $('#memsEnableEndTime').focus();
                return false;
            }
        }

        if( oucherFee && !this.isFloat( oucherFee ) ) {
                Message.alert('请输入数字（可包含小数点）!');
                $('#memsOucherFee').focus();
                return false;
        }

        this.filterParams = {
            merchant:   merchant,
            searchType: searchType,
            searchName: searchName,
            searchTime: searchTime,
            searchBeginTime: searchBeginTime,
            searchEndTime: searchEndTime,
            searchStatus: searchStatus,
            merchantType: merchantType,
            singleSign: singleSign,
            customer: customer,
            region: region,
            group: group,
            comType: comType,
            enableBeginTime: enableBeginTime,
            enableEndTime: enableEndTime,
            model: model,
            oucherFeeType: oucherFeeType,
            oucherFee: oucherFee
        };

        return true;
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