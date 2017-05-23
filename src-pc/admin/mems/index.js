require("./index.scss");

var DatePicker = require("COMMON/modules/datepicker");

var MemberManage = PFT.Util.Class({
    container: '#Page_Mems',
    searchContainer: '#searchCtn',
    EVENTS: {
        'click .btn-morefilter':            'moreFilterToggle',
        'click #memStatistics .radioBox':   'selectRadio',
        'click #btnGetStatisticsNum':       'getStatisticsNum',
        'click .dropdown':                  'onDropdownClick',
        'click .name_select_box':           'onNameSelectBoxClick',
        'click #schBtn':                    'onBtnSearchClick'
    },

    cacheData: {},

    filterParams: {},

    init: function() {

        this.initDatepicker();

        this.bindEvent();

        this.render();

        //导出按钮
        $("#expBtn").on("click",function () {
            var api="/r/report_statistics/orderList/";
            if(_this.isAdmin=="1"){
                api="/r/report_statistics/adminOrderList/";
            }
            var downUrl=api+"?export_excel=1&"+_this.JsonStringify(_this.filterParamsBox);
            _this.outExcel(downUrl);
        });
    },

    bindEvent: function() {
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
                break;

            case 'loading':
                break;

            case 'error':
                break;

            default:
                html = '<tr><td colspan="10" class="stat-wrap">请输入条件搜索</td></tr>';
                renderBody.html( html );
                break;
        }
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

        // 请求数据
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
    }
});

$(function(){
    new MemberManage;
})