require("./index.scss");

var DatePicker = require("COMMON/modules/datepicker"),
    Message = require('pft-ui-component/Message'),
    Tips = require('COMMON/modules/tips'),
    ParseTemplate = PFT.Util.ParseTemplate,
    ParseMemberTpl = ParseTemplate('./tr.xtpl');

var MemberManage = PFT.Util.Class({

    container: '#Page_Mems',

    searchContainer: '#searchCtn',

    EVENTS: {

    },

    AJAX_URLS: {
        memberDetail: '/r/Admin_MemberManage/getMemberDetails/'
    },

    cacheData: {},

    filterParams: {},

    init: function() {

        this.initFilter();

        this.render();
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
                html = ParseMemberTpl({ data: data });
                break;

            case 'loading':
                html = '<tr><td colspan="10" class="stat-wrap">' + data || '加载中，请稍候' + '</td></tr>';
                break;

            case 'error':
                html = '<tr><td colspan="10" class="stat-wrap">' + data || '数据加载失败，请稍后重试' + '</td></tr>';
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
            tipsContent;

        if( !this.tips ) this.tips = new Tips;

        switch( action ) {
            case 'OTA':
                tipsContent = currTarget.attr('data-ota').split(',').join('<br>');
                this.tips.show({
                    direction: 'bottom',
                    hostObj: e.currentTarget,
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
        PFT.Util.Ajax( '',{
            type: 'post',

            loading: function() {},

            success: function( res ) {},

            serverError: function( xhr, msg ) {}
        })
    },

    onDropdownClick: function( e ) {
        var searchContainer = $( this.searchContainer ),
            currTarget = $( e.currentTarget ),
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
                            if(end_str-begin_str >= (30*24*60*60*1000)){
                                alert(queryLimitTip || "最多只能查询30天以内数据");
                                tarInp.val(oldVal);
                            }
                        }else{
                            if(end_str-begin_str >= (93*24*60*60*1000)){
                                alert(queryLimitTip || "最多只能查询三个月以内数据");
                                tarInp.val(oldVal);
                            }
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
                            if(end_str-begin_str >= (30*24*60*60*1000)){
                                alert(queryLimitTip || "最多只能查询30天以内数据");
                                tarInp.val(oldVal);
                            }
                        }else{
                            if(end_str-begin_str >= (93*24*60*60*1000)){
                                alert(queryLimitTip || "最多只能查询三个月以内数据");
                                tarInp.val(oldVal);
                            }
                        }

                    }
                }
            });
        })
    },

    onBtnSearchClick: function() {
        if( !this.isFormValid() ) return false;

        var that = this;

        // 请求数据
        PFT.Util.Ajax( this.AJAX_URLS.memberManage, {
            type: 'post',

            params: this.filterParams,

            loading: function() {
                that.render('loading');
            },

            success: function( res ) {
                if( res.code == 200 ) {
                    that.render( 'success', res.data.list );
                } else {
                    that.render( 'error', res.msg );
                }
            },

            serverError: function( xhr, msg ) {
                that.render( 'error', res.msg );
            }
        })
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
            singleSign,
            customer,
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

        if( oucherFee && this.isFloat( oucherFee ) ) {
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