require('./index.scss');

var DateTimePicker = require('date-time-picker');

var ParseTemplate = PFT.Util.ParseTemplate;

var tpl = require('./index.xtpl');

var SearchFilter = PFT.Util.Class({

    dom: {
        dateType: '#dateType',
        quickSelectDate: '#quickSelectDate',
        beginDatetime: '#beginDatetime',
        endDatetime: '#endDatetime'
    },

    init: function( parent ) {
        this.parent = $('#' + parent );

        if( this.parent.length ) {
            this.renderTpl( this.parent );
        }
    },

    reInit: function( opt ) {
        var defaultOpt = {
            begin_date: '',         // 格式为 YYYY-mm-dd hh:mm
            end_date:   '',         // 格式为 YYYY-mm-dd hh:mm
            date_type: 0            // 日期类型， 0 下单时间，1游玩时间，2验证时间
        };

        opts = $.extend( {}, defaultOpt, opt );

        this.renderTpl( opts );
    },

    renderTpl: function( parent, data ) {
        var html = ParseTemplate( tpl )();
        parent.append( html );
        // if( Object.prototype.toString.call( data )  == 'object Object' ) {
        //     ParseTemplate( tpl )({ data: data });
        // } else {
        //     alert('不是我要的数据');
        // }
    },

    output: function(){
        var date_type = Number( $('#dateType').attr('data-type') );
        return {
            begin_date: '',
            end_date:   '',
            date_type: date_type
        }
    }
});

module.exports = {
    searchFilter: null,

    show: function( parent, opt ) {
        if( this.searchFilter ) {

        } else {
            this.searchFilter = new SearchFilter( parent );
        }
    }
};