// 引入
// var SearchFilter = require('./SearchFilter');

// var searchFilter = new SearchFilter();
// searchFilter.reInit({
//     begin_date: '2017-04-22 00:00',
//     end_date: '2017-04-25 23:59',
//     date_type: 1
// })

require('./index.scss');

var Alert = require("COMMON/Components/Alert-Mobile/v1.0");

var ParseTemplate = PFT.Util.ParseTemplate;

var tpl = require('./index.xtpl');

var Mobiscroll = require('./mobiscroll');

var SearchFilter = PFT.Util.Class({

    dom: {
        container: '#pageFilter'
    },

    params: {
        begin_date: '', // 格式为 YYYY-mm-dd hh:mm
        end_date: '',   // 格式为 YYYY-mm-dd hh:mm
        date_type: 0    // 日期类型， 0 下单时间，1游玩时间，2验证时间
    },

    DATE_TYPE: [ '下单时间', '游玩时间', '验证时间' ],

    hasInited: false,

    parent: 'body',

    init: function( parent, opt ) {
        // opt 参数列表
        // begin_date
        // end_date
        // date_type
        // onSearch: 点击搜索的回调函数

        if( parent && !/^#/.test( parent ) ) {
            this.parent = '#' + parent;
        }

        var opts = $.extend( {}, this.params, opt );

        this.renderTpl( this.parent, opts );

        this.bindEvents( this.parent, opts );

        this.hasInited = true;
    },

    reInit: function( opt ) {
        // opt 参数列表
        // begin_date
        // end_date
        // date_type
        // onSearch: 点击搜索的回调函数
        var opts = $.extend( {}, this.params, opt );

        this.renderTpl( this.parent, opts );

        this.bindEvents( this.parent, opts );
    },

    renderTpl: function( parentId, opt ) {
        var html = ParseTemplate( tpl )(),
            $container,
            dateSelected;

        if( !this.hasInited ) {
            $( parentId ).append( html );
        }

        this.show();

        this.quickSelectDateInit();

        $container = $( this.dom.container );

        $( this.dom.container ).addClass('show');
        $container.find('.dateType').html( this.DATE_TYPE[ Number( opt.date_type ) ] + '<i class="arrow-d"></i>' ).attr({ 'data-type': opt.date_type });

        if( !opt.begin_date && !opt.end_date ) {

            $container.find('.quickSelectDate li:first-child').addClass('active').siblings().removeClass('active');
            $container.find('.date-range').hide();
            $container.find('.beginDatetime').val('');
            $container.find('.endDatetime').val('');

        } else if( opt.begin_date && opt.end_date ) {

            dateSelected = $container.find('.quickSelectDate li').filter(function(){
                return opt.begin_date == $(this).attr('data-begin') && opt.end_date == $(this).attr('data-end');
            });

            if( dateSelected.length ) {
                dateSelected.addClass('active').siblings().removeClass('active');
                $container.find('.date-range').hide();
            } else {

                $container.find('.quickSelectDate li:last-child').addClass('active').siblings().removeClass('active').end().end()
                            .find('.date-range').show().end()
                            .find('.beginDatetime').val( opt.begin_date ).end()
                            .find('.endDatetime').val( opt.end_date );

            }
        } else {

            $container.find('.quickSelectDate li:last-child').addClass('active').siblings().removeClass('active').end().end()
                        .find('.date-range').show().end()
                        .find('.beginDatetime').val( opt.begin_date ).end()
                        .find('.endDatetime').val( opt.end_date );

        }

    },

    bindEvents: function( parentId, opt ) {
        var _this = this,
            $container = $( this.dom.container );
            // $parent = !!parentId ? $( parentId ) : $(document);

        if( !this.hasInited ) {

            $container
            .on( 'tap', '.dateType', function(){
                // 显示选择时间类型
                $container.find('.modal-select').addClass('show');
            })
            .on( 'tap', '.modal-select', function( e ){
                // 选择时间类型返回
                var $target = $( e.target );

                if( $target.is('.modal-select-option') ) {
                    $container.find('.dateType').html( _this.DATE_TYPE[ Number( $target.attr('data-type') ) ] + '<i class="arrow-d"></i>' ).attr({ 'data-type': $target.attr('data-type') });
                }

                $( e.currentTarget ).removeClass('show');
            })
            .on( 'tap', '.date-type-val li', function(){
                // 选择时间周期
                if( !$( this ).is('.active') ) {
                    $( this ).addClass('active').siblings().removeClass('active');

                    if( $( this ).is(':last-child') ) {
                        $(this).closest('.form-group').next().show();
                    } else {
                        $(this).closest('.form-group').next().hide();
                    }
                }
            })
            .on( 'tap', '.btnCancel', function(){
                // 点击取消
                _this.hide();
            })
            .on( 'tap', '.btnClear', function(){
                // 点击清空
                _this.reInit({
                    begin_date: '',
                    end_date: '',
                    date_type: 0,
                })
            });

            // 日期时间控件
            var setOption = function( selector, setCallback ) {
                return {
                    theme: 'ios',
                    display: 'bottom',
                    lang: 'zh',
                    onSet: function( event, inst ) {
                        // inst:  mobiscroll实例
                        var input_val = event.valueText;
                        input_val = input_val.replace(/[T]/, ' ');
                        input_val = input_val.replace(/:00Z/, '');
                        $( selector ).val( input_val );
                        setCallback && setCallback( event.valueText )
                    }
                }
            }

            var beginDate = Mobiscroll.datetime( '#beginDatetime', setOption( '#beginDatetime', function( defaultValue ){ endDate.setVal( defaultValue ) } ) );

            var endDate = Mobiscroll.datetime( '#endDatetime', setOption( '#endDatetime' ) );
        }

        // 点击搜索
        if( opt.onSearch ) {
            $container
                .off('tap.search')
                .on( 'tap.search', '.btnSearch', function(){

                    _this.setParams();

                    if( _this.params.begin_date && _this.params.end_date && _this.params.begin_date>_this.params.end_date ) {
                        Alert("起始日期不能晚于截止日期");
                        return false;
                    }

                    _this.hide();

                    opt.onSearch && opt.onSearch( _this.params );
                })
        } else {
            if( !this.hasInited ) {
                console.log('首次加载onSearch必填');
            }
        }
    },

    setParams: function() {
        var $container = $( this.dom.container ),
            $dateSelected = $container.find('.quickSelectDate .active'),
            dateStr = new Date();

        switch( $dateSelected.attr('data-date') ) {
            case '1':
                // 今天
            case '2':
                // 昨天
            case '3':
                // 近七日
                this.params.begin_date = $dateSelected.attr('data-begin');
                this.params.end_date = $dateSelected.attr('data-end');
                break;
            case '4':
                // 自定义
                this.params.begin_date = $container.find('.beginDatetime').val();
                this.params.end_date = $container.find('.endDatetime').val();
                break;
        }

        this.params.date_type = $container.find('.dateType').eq(0).attr('data-type');
    },

    quickSelectDateInit: function() {
        var _this = this,
            $container = $( this.dom.container ),
            lis = $container.find('.quickSelectDate li');

        lis.each(function(){
            var dateStr = new Date();

            switch( $(this).attr('data-date') ) {
                case '1':
                    // 今天
                    $(this).attr({
                        'data-begin': _this.formatDate(dateStr.getFullYear(),  dateStr.getMonth() + 1,  dateStr.getDate(),  0,  0 ),
                        'data-end': _this.formatDate(dateStr.getFullYear(),  dateStr.getMonth() + 1,  dateStr.getDate(),  23,  59 )
                    });
                    break;
                case '2':
                    // 昨天
                    dateStr.setDate( dateStr.getDate() - 1 );
                    $(this).attr({
                        'data-begin': _this.formatDate(dateStr.getFullYear(),  dateStr.getMonth() + 1,  dateStr.getDate(),  0,  0 ),
                        'data-end': _this.formatDate(dateStr.getFullYear(),  dateStr.getMonth() + 1,  dateStr.getDate(),  23,  59 )
                    });
                    break;
                case '3':
                    // 近七日
                    dateStr.setDate( dateStr.getDate() - 6 );
                    $(this).attr({
                        'data-begin': _this.formatDate(dateStr.getFullYear(),  dateStr.getMonth() + 1,  dateStr.getDate(),  0,  0 )
                    });
                    dateStr = new Date();
                    $(this).attr({
                        'data-end': _this.formatDate(dateStr.getFullYear(),  dateStr.getMonth() + 1,  dateStr.getDate(),  23,  59 )
                    });
                    break;
            }
        })
    },

    formatDate: function( year, month, date, hour, minute ) {
        // YYYY-mm-dd hh:mm
        return year + '-' + ( month>10 ? month : '0'+month ) + '-' + ( date>10 ? date : '0'+date ) + ' ' + ( hour>10 ? hour : '0'+hour ) + ':' + ( minute>10 ? minute : '0'+minute );
    },

    show: function( opt ) {
        $( this.dom.container ).addClass('show');
    },

    hide: function(){
        $( this.dom.container ).removeClass('show');
    }
});

module.exports = SearchFilter;
// module.exports = {
//     searchFilter: null,

//     show: function( parent, opt ) {
//         if( this.searchFilter ) {

//         } else {
//             this.searchFilter = new SearchFilter( parent );
//         }
//     }
// };