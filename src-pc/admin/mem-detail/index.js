require("./index.scss");

var DatePicker = require("COMMON/modules/datepicker"),
    Message = require('pft-ui-component/Message'),
    ParseTemplate = PFT.Util.ParseTemplate,
    ParseAsideTpl = ParseTemplate('./aside.xtpl'),
    ParseMainTpl = ParseTemplate('./main.xtpl'),
    Toast = require('COMMON/modules/Toast'),
    toast = new Toast;

var MemberManage = PFT.Util.Class({

    container: '#Page_Mem-detail',

    asideContainer: '#detailAside',

    mainContainer: '#detailMain',

    EVENTS: {

    },

    AJAX_URLS: {
        memberDetail: '/r/Admin_MemberManage/getMemberDetails/'
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

    getMemberDetails: function( id ) {
        PFT.Util.Ajax( this.AJAX_URLS.memberDetail, {
            type: 'post',

            params: { id: id },

            loading: function(){
                toast.show('loading','加载中，请稍候');
            },

            success: function( res ) {
                toast.hide();


            },

            serverError: function( xhr, msg ) {
                toast.hide();
                Message.error( msg || PFT.AJAX_ERROR_TEXT );
            }
        })
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

    rejectApply: function( e ) {
        var currTarget = $( e.currentTarget ),
            id = currTarget.attr('data-id');

        Message.confirm( '确定拒绝？', function( result ){
            if( result ) {

            } else {

            }
        });
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