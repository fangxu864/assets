require("./index.scss");
var Datepicker = require("COMMON/modules/datepicker");
var Dialog = require('COMMON/modules/dialog-simple');
var Pagination = require("COMMON/modules/pagination-x");
var ParseTemplate = PFT.Util.ParseTemplate;
var template = {
    index: ParseTemplate( require('./tpl/index.xtpl') ),
    online: ParseTemplate( require('./tpl/online.xtpl') ),
    platform: ParseTemplate( require('./tpl/platform.xtpl') ),
    diff: ParseTemplate( require('./tpl/diff.xtpl') )
};

var Main = PFT.Util.Class({
    container: "#bodyContainer",

    EVENTS: {
        "click .inp-date": "initDatePicker",
        "click #schBtn": "getData",
        "click #expBtn": "getData",
        'click .btnViewDetail': 'viewDetail'
    },

    PAGE_SIZE: 10,  // 明细每页显示数量

    cnt:        '',        // 总页数
    source:     '',        // 来源，在线/平台
    type:       '',        // 类型，收入/支出
    payType:    '',        // 收支账户

    // 分页对象
    pagination: null,

    // 弹窗XML对象
    xmlGetDialogData: null,

    // 页面初始化Ajax条件参数
    filterParams: {
        payUser:    '',
        btime:      '',
        etime:      ''
    },

    // 弹窗Ajax请求通用参数
    dialogAjaxParams: null,

    ajaxUrls: {
        'income': {
            'online': '/r/Admin_OnlineSummary/onlineIncomeDetail',
            'platform': '/r/Admin_OnlineSummary/platformIncomeDetail',
            'diff': '/r/Admin_OnlineSummary/differentIncome'
        },
        'outcome': {
            'online': '/r/Admin_OnlineSummary/onlieOutcomeDetail',
            'platform': '/r/Admin_OnlineSummary/platformOutcomeDetail',
            'diff': '/r/Admin_OnlineSummary/differentOutcome'
        }
    },

    init: function () {
        this.datepicker = new Datepicker();
    },

    initDatePicker: function (e) {
        var datepicker = this.datepicker;
        var tarInp = $(e.currentTarget);
        var CalendarCore = Datepicker.CalendarCore;
        var date = tarInp.val();
        var time = tarInp.hasClass("begin") ? "00:00" : "23:59";
        if (!date) {
            date = CalendarCore.gettoday() + " " + time;
        }
        datepicker.show(date, {
            picker: tarInp,
            top: 0,
            left: 0,
        });
    },

    getData: function (e) {
        var _this = this;

        var tarBtn=$(e.currentTarget);
        var exp=tarBtn.attr("data-exp");
        var beginTime = $("#beginTime").val().substr(0, 10);
        var endTime = $("#endTime").val().substr(0, 10);
        var payUser = $("#payUser").val();
        var data;
        var beginTimeStp = _this.formatTimeStamp(beginTime);
        var endTimeStp = _this.formatTimeStamp(endTime);

        if((!beginTimeStp&&endTimeStp)||(beginTimeStp&&!endTimeStp)) return PFT.Util.STip("fail","请选择准确的日期!");

        if (endTimeStp < beginTimeStp) return PFT.Util.STip("fail", "起始日期不能迟于截止日期!", 3000);

        if (endTimeStp-beginTimeStp>1209600&&exp!=1) return PFT.Util.STip("fail","时间间隔不超过15天!",3000);

        this.filterParams = {
            payUser: payUser,
            btime: beginTime,
            etime: endTime
        };

        this.dialogAjaxParams = {
            pay_user: payUser,
            begin_time: beginTime,
            end_time: endTime
        };

        if(exp==1){
            _this.expData( this.filterParams );
            return false;
        }

       _this.getDataReq( this.filterParams );
    },

    getDataReq:function(data){
        var _this=this,
            tbody=$("#tbody"),
            loadTxt="<tr><td colspan='11'><img src=\"http://www.12301.cc/images/icons/gloading.gif\" class='loadImg'/>  加载中,请稍后...</td></tr>";

        PFT.Util.Ajax('/r/Admin_OnlineSummary/summary',{
            type:"POST",

            dataType:"json",

            params:data,

            loading: function(){
                tbody.html(loadTxt);
            },

            success:function(res){
                var data=res.data;
                if(res.code==200){
                    //  var fmData=_this.formatData(data);//判断差异
                    if(data.length<1){
                        return  tbody.html("<tr><td colspan='11'>暂无结果!</td></tr>")
                    }
                    _this.renderData(data);
                }else{
                    tbody.html("<tr><td colspan='11'>"+res.msg+"</td></tr>");
                }
            },

            Servererror: function(){
                tbody.html("<tr><td colspan='11'>请求出错,请稍后再试!</td></tr>")
            }
        })

    },

    renderData: function (data) {
        var render=template.index({data:data}),
            tbody=$("#tbody");
           // console.log(render)

        tbody.html(render);
    },

    expData:function(data){
        // console.log(data);
        PFT.Util.Ajax('/r/Admin_OnlineSummary/summary',{
            type:"POST",
            dataType:"json",
            params:data,
            success:function(res){
                if(res.code==200){
                    if(res.data.length<1) return  PFT.Util.STip("fail", "暂无数据!", 3000);
                    window.open('/r/Admin_OnlineSummary/summary?payUser='+data["payUser"]+'&btime='+data["btime"]+'&etime='+data["etime"]+'&excel=1', '_blank');

                }else{
                    return PFT.Util.STip("fail", res.msg, 3000);
                }
            }
        })
    },

    viewDetail: function( e ) {
        var _this = this;

        _this.cnt = '';

        var $target = $( e.currentTarget ),
            source = _this.source = $target.attr('data-source'),
            type = _this.type = $target.attr('data-type'),
            payType = _this.payType = $target.attr('data-ptype');

        var dialogHeader = this.setDialogHeader( source, type ),
            dialogTHead = this.setDialogTHead( source, type ),
            dialogInitContent = this.setDialogInitContent( this.filterParams.btime, this.filterParams.etime, dialogTHead );

        var dialogDetail = new Dialog({
            width: 1000,

            header: dialogHeader,

            content: dialogInitContent,

            onReady: function(){


                _this.xmlGetDialogData = _this.ajaxGetDetail({
                    page: 1,

                    success:function( data ){

                        _this.renderDialogData({
                            container: '#dialogTBody',
                            data: data,
                            source: source,
                            type: type
                        });

                    }
                })
            },
            onCloseAfter: function(){
                dialogDetail.container.remove();

                _this.pagination = null;
                _this.xmlGetDialogData.state != 4 && _this.xmlGetDialogData.abort();
            }
        });

        dialogDetail.open();
    },

    ajaxGetDetail: function( opt ){
        var typeStr = this.type==0 ? 'income' : 'outcome',
            colspan;

        switch( this.source ) {
            case 'online':
                colspan = 5;
                break;

            case 'platform':
                colspan = 7;
                break;

            default:
                colspan = 8;
        }

        // Ajax请求参数列表
        // 参数名     类型  说明
        // pay_user    int     收款账户ID
        // begin_time  string  开始时间
        // end_time    string  结束时间
        // pay_type    int     支付类型
        // page    int     页码
        // count   int     每页数量
        // cnt     int     总页数
        var params = $.extend( {}, this.dialogAjaxParams, {
            pay_type: this.payType,
            page: opt.page,
            count: this.PAGE_SIZE,
            cnt: this.cnt ? this.cnt : ''
        });

        var $dialogTBody = $('#dialogTBody');

        return PFT.Util.Ajax( this.ajaxUrls[ typeStr ][ this.source ], {
            type: 'POST',
            params: params,

            loading: function(){
                $dialogTBody.html('<tr><td colspan="' + colspan  + '"><img src="http://www.12301.cc/images/icons/gloading.gif" class="loadImg" />  加载中,请稍后...</td></tr>');
            },
            success: function( res ) {
                var data = res.data.list;

                if( res.code == 200 ){
                    //  var fmData=_this.formatData(data);//判断差异
                    if(data.length<1){
                        $dialogTBody.html('<tr><td colspan="' + colspan + '">暂无结果!</td></tr>');
                    } else {
                        opt.success( res.data );
                    }

                }else{
                    $dialogTBody.html('<tr><td colspan="'+ colspan +'">'+res.msg+'</td></tr>');
                }
            },

            Servererror: function(){
                $dialogTBody.html('<tr><td colspan="'+ colspan +'">请求出错,请稍后再试!</td></tr>');
            }
        })
    },

    renderDialogData: function( opt ){
        var _this = this;

        if( !this.source || this.type == undefined ) {
            alert('表单参数错误');
        }

        // 根据source调用对应模板文件
        //  source: online（在线收入/支出明细） / platform（平台收入/支出明细） / diff （收入/支出差异对比）
        var template = this.template[ this.source ];

        var html = template({
                data: opt.data.list,
                type: this.type
            });

        $( opt.container ).html( html );

        if( !_this.pagination ) {
            _this.pagination = new Pagination({
                container : '#dialogPage', //必须，组件容器id
                // count : 7,              //可选  连续显示分页数 建议奇数7或9
                showTotal : true,          //可选  是否显示总页数
                jump : true                //可选  是否显示跳到第几页
            });

            _this.pagination.render({ current: 1, total: opt.data.cnt });

            _this.pagination.on("page.switch", function(toPage,currentPage,totalPage){
                _this.pagination.render({ current: toPage, total: totalPage });

                _this.xmlGetDialogData.state != 4 && _this.xmlGetDialogData.abort();

                _this.xmlGetDialogData = _this.ajaxGetDetail({
                    page: toPage,

                    success:function( data ){

                        _this.renderDialogData({
                            container: '#dialogTBody',
                            data: data,
                            source: _this.source,
                            type: _this.type
                        });

                    }
                })
            });
        } else {
            _this.pagination.render({ current: opt.data.page, total: opt.data.cnt });
        }
    },

    setDialogHeader: function( source, type ) {
        var dialogHeader;

        switch( source ) {
            case 'online':
                dialogHeader = type==0 ? '在线收入明细' : '在线支出明细';
                break;

            case 'platform':
                dialogHeader = type==0 ? '平台收入明细' : '平台支出明细';
                break;

            default:
                dialogHeader = type==0 ? '在线收入和平台收入差异对比' : '在线支出和平台支出差异对比';
        }

        return dialogHeader;
    },

    setDialogTHead: function( source, type ) {
        var dialogTHead;

        switch( source ) {
            case 'online':
                dialogTHead = '<thead><tr><th>交易时间</th><th>订单号</th><th>' + (type==0 ? '收款账户' : '支付账户') +'</th><th>金额（元）</th><th>支付系统订单号</th></tr></thead>';
                break;

            case 'platform':
                dialogTHead = '<thead><tr><th>交易时间</th><th>订单号</th><th>交易类型</th><th>交易账号</th><th>' + (type==0 ? '收款账户' : '支付账户') +'</th><th>金额（元）</th><th>账户名称/交易账号</th></tr></thead>';
                break;

            default:
                dialogTHead = '<thead><tr><th>交易日期</th><th>订单号</th><th>交易类型</th><th>' + (type==0 ? '收款账户' : '支付账户') +'</th><th>在线' + (type==0 ? '收入' : '支出') + '（元）</th><th>平台' + (type==0 ? '收入' : '支出') + '（元）</th><th>差异</th><th>账户名称/交易账号</th></tr></thead>';
        }

        return dialogTHead;
    },

    setDialogInitContent: function( btime, etime, thead ) {
        var dialogInitContent;

        dialogInitContent = '<div class="dialog-content">';
        dialogInitContent += '<div class="dialog-date">交易日期：'+ btime + ' 至 ' + etime +'</div>';
        dialogInitContent += '<table class="tb-dialog g-table" width="100%">';
        dialogInitContent += thead;
        dialogInitContent += '<tbody id="dialogTBody"></tbody>';
        dialogInitContent += '</table>';
        dialogInitContent += '<div id="dialogPage"></div>';

        return dialogInitContent;
    },

    //日期转换时间戳
    formatTimeStamp: function (time) {
        var timestamp = Date.parse(new Date(time));
        var timestamps = timestamp / 1000;
        return timestamps;
    }

});

$(function () {
    new Main();
})