require('../css/channels.css');

var Dialog = require("COMMON/modules/dialog-simple");



// require("./global");
// require("./ajaxData");
// require("./sData");
// require("./search");
// require("./product_package");

 // "./src/channels_conf/js/ajaxData", "./src/channels_conf/js/sData", "./src/channels_conf/js/search", "./src/channels_conf/js/product_package",

$(function(){
    var dragSort = {
        thisLineTop: 0,
        topDistance: 0,
        downDistance: 0,
        lid: null,
        pid: null,
        lineNum: null,
        thisIndex: 1,
        lineHeight: 91,
        targetLine: null,
        init: function () {
            var that = this;

            $('#mlistUl').on('mouseenter.dragSort', '.set_all_data', function(){
                //鼠标划入显示移动图标
                $(this).find('.InfoQqIcon').show();
            }).on('mouseleave.dragSort', '.set_all_data', function(){
                //鼠标划出隐藏移动图标
                $(this).find('.InfoQqIcon').hide();
            }).on('mousedown.dragSort', '.InfoQqIcon', function(e){
                var target = $(e.currentTarget);

                that.lid        = target.attr('lid');
                that.pid        = target.attr('pid');
                that.lineNum    = $('.find_' + that.lid ).length;
                that.targetLine = target.closest('tr').eq(0);

                that.thisIndex = targetLine.index();

                var left    = e.pageX + 20,
                    top     = e.pageY + 20,
                    val     = targetLine.find(".ctitles").html();
                that.dg_tips.show( 'dgf', left, top, val);

                that.thisLineTop    = e.pageY;
                that.topDistance    = that.thisLineTop - that.targetLine.offset().top;
                that.downDistance   = that.targetLine.offset().top + that.lineHeight - that.thisLineTop;
                that.targetLine.css('background','#ffffcc');
                $('body').css('cursor','move');
                that.unselect();
                $(document).on('mousemove.dragSort', function(e){
                    that.dg_tips.move( 'dgf', (e.pageX + 20)+'px', (e.pageY + 20) +'px');
                });
            }).on('mouseup.dragSort', function(e){
                if(!$(e.target).is('.InfoQqIcon') && $(e.target).parents('.set_all_data') && that.targetLine) {
                    $(e.target).parents('.set_all_data').eq(0).find('.InfoQqIcon').trigger('mouseup.dragSort', e.pageY);
                }
            });

            /*
                鼠标按下拖动，移出容器并放开时 执行
             */
            $(document).on('mouseup.dragSort', function(e){
                if(!$(e.target).parents('.set_all_data').length) {
                    that.dg_tips.hide('dgf');
                    that.targetLine && that.targetLine.css('background','');
                    that.thisLineTop = 0;
                    $('body').css('cursor','default');
                    $(document).off('mousemove.dragSort');
                    that.onselect();
                }
            });

            $(".InfoQqIcon").live("mouseup.dragSort",function(e, data){
                var target = $(e.currentTarget),
                    focusIndex;

                if(that.lineNum > 1){
                    var moveDistance = (e.pageY || data) - that.thisLineTop;

                    if(moveDistance<0){
                        if( that.thisIndex != 1 && Math.abs(moveDistance) > that.topDistance){
                            moveDistance = Math.abs(moveDistance);
                            focusIndex = that.thisIndex - Math.ceil((moveDistance - that.topDistance)/that.lineHeight) - 1;
                            focusIndex = focusIndex < 0? 0:focusIndex;
                            $(".find_" + that.lid ).eq(focusIndex).before(that.targetLine);
                            that.dg_update( that.thisIndex, focusIndex, target );
                        }
                    }else{
                        if( that.thisIndex != that.lineNum && moveDistance > that.downDistance){
                            focusIndex = that.thisIndex + Math.ceil((moveDistance - that.downDistance)/that.lineHeight) - 1;
                            focusIndex = focusIndex > that.lineNum-1 ? that.lineNum : focusIndex;
                            $(".find_" + that.lid ).eq( focusIndex ).after( that.targetLine );
                            that.dg_update( that.thisIndex, focusIndex, target );
                        }
                    }
                } else {

                }

                that.dg_tips.hide('dgf');
                that.targetLine.css('background','');
                that.thisLineTop = 0;
                $('body').css('cursor','default');
                $(document).off('mousemove.dragSort');
                that.onselect();
                that.targetLine = null;
            });
        },
        unselect: function () {
            $('body').attr('unselectable', 'on').css({
                '-moz-user-select':'none',
                '-webkit-user-select':'none',
                'user-select':'none'
            });

            document.body.onselectstart = function() {
                return false;
            };
        },
        onselect: function () {
            $('body').attr('unselectable', '').css({
                '-moz-user-select':'',
                '-webkit-user-select':'',
                'user-select':''
            });
        },
        dg_tips: {
            show: function( id, left, top, val ) {
                if($('#' + id).length) {
                    $('#' + id).show().css({
                        left: left,
                        top: top
                    }).html('您在对【'+ val +' 】进行拖动排序');
                } else {
                    var floatdiv='<div id="' + id + '" style="padding:5px 10px;z-index:99999;border:1px solid #444;background-color:#fff;filter:alpha(opacity=50); -moz-opacity:0.5; opacity:0.5;position:absolute;left:'+ left +'px;top:'+ top +'px;">您在对【'+ val +' 】进行拖动排序</div>';
                    $('body').append(floatdiv);
                }
            },
            move: function( id, left, top ){
                $("#" + id).css({"left": left, "top": top});
            },
            hide: function( id ) {
                $("#" + id).hide();
            },
            remove: function( id ) {
                $("#" + id).remove();
            }
        },
        dg_mask: function ( target ) {
            var W=target.outerWidth();
            var H=target.outerHeight();
            var top=target.offset().top;
            var left=target.offset().left;
            var mask="<div id='dg_mask'> 正在使劲的保存...</div>";
            $('body').append(mask);
            $("#dg_mask").css({
                "background":"#999",
                "position":'absolute',
                'width':W+'px',
                'height':H+'px',
                'line-height':H+'px',
                'top':top+'px',
                'left':left+'px',
                'filter':'alpha(opacity=30)',
                'moz-opacity':30/100,
                'opacity':30/100,
                'text-align':'center',
                'color':'#000'
            });
        },
        dg_update: function ( thisIndex, focusIndex, target ) {
            var Glid    = target.attr("lid");
            var Glength = $(".find_"+Glid).length;
            var ti = {};
            var ids = {};
            $(".find_"+Glid).each(function(i,domEle){
                var pid = $(this).attr("pid");
                var set_check = $(this).find('.set_check');
                var aid = set_check.attr("data-aid");
                var lid = set_check.attr("data-lid");
                ids[i] = {"pid":pid, "aid":aid, "lid":lid, "sort":i};
            })
            ti.action = 'setTicketSort';
            ti.ids = ids;
            $.ajax({
                type:'POST',url: 'call/jh_channels.php',data: ti, dataType:'json',
            }).done(function(res){
                // if(res.status == 'success'){
                //     alert('排序更改成功');
                // }else{
                //     alert('排序更改失败');
                // }
            })
        }
    };

    dragSort.init();

    // var thisLineTop = 0,
    //     topDistance,
    //     downDistance,
    //     lid,
    //     pid,
    //     lineNum,
    //     thisIndex = 1,
    //     lineHeight = 91,
    //     targetLine;

    // $('#mlistUl').on('mouseenter.dragSort', '.set_all_data', function(){
    //     //鼠标划入显示移动图标
    //     $(this).find('.InfoQqIcon').show();
    // }).on('mouseleave.dragSort', '.set_all_data', function(){
    //     //鼠标划出隐藏移动图标
    //     $(this).find('.InfoQqIcon').hide();
    // }).on('mousedown.dragSort', '.InfoQqIcon', function(e){
    //     var target = $(e.currentTarget);

    //     lid     = target.attr('lid');
    //     pid     = target.attr('pid');
    //     lineNum = $('.find_'+lid).length;
    //     targetLine = target.closest('tr').eq(0);

    //     thisIndex = targetLine.index();

    //     var left = e.pageX + 20,
    //         top = e.pageY + 20,
    //         val = targetLine.find(".ctitles").html();
    //     dg_tips.show( 'dgf', left, top, val);

    //     thisLineTop = e.pageY;
    //     topDistance = thisLineTop - targetLine.offset().top;
    //     downDistance = targetLine.offset().top + lineHeight - thisLineTop;
    //     targetLine.css('background','#ffffcc');
    //     $('body').css('cursor','move');
    //     unselect();
    //     $(document).on('mousemove.dragSort', function(e){
    //         dg_tips.move( 'dgf', (e.pageX + 20)+'px', (e.pageY + 20) +'px');
    //     });
    // }).on('mouseup.dragSort', function(e){
    //     if(!$(e.target).is('.InfoQqIcon') && $(e.target).parents('.set_all_data') && targetLine) {
    //         $(e.target).parents('.set_all_data').eq(0).find('.InfoQqIcon').trigger('mouseup.dragSort', e.pageY);
    //     }
    // });

    /*
        鼠标按下拖动，移出容器并放开时 执行
     */
    // $(document).on('mouseup.dragSort', function(e){
    //     if(!$(e.target).parents('.set_all_data').length) {
    //         dg_tips.hide('dgf');
    //         targetLine && targetLine.css('background','');
    //         thisLineTop = 0;
    //         $('body').css('cursor','default');
    //         $(document).off('mousemove.dragSort');
    //         onselect();
    //     }
    // });

    // $(".InfoQqIcon").live("mouseup.dragSort",function(e, data){
    //     var target = $(e.currentTarget);

    //     if(lineNum > 1){
    //         var moveDistance = (e.pageY || data) - thisLineTop;

    //         if(moveDistance<0){
    //             if(thisIndex != 1 && Math.abs(moveDistance) > topDistance){
    //                 moveDistance = Math.abs(moveDistance);
    //                 focusIndex = thisIndex - Math.ceil((moveDistance - topDistance)/lineHeight) - 1;
    //                 focusIndex = focusIndex < 0? 0:focusIndex;
    //                 $(".find_"+lid).eq(focusIndex).before(targetLine);
    //                 dg_update(thisIndex,focusIndex,target);
    //             }
    //         }else{
    //             if(thisIndex != lineNum && moveDistance > downDistance){
    //                 focusIndex = thisIndex + Math.ceil((moveDistance - downDistance)/lineHeight) - 1;
    //                 focusIndex = focusIndex > lineNum-1 ? lineNum : focusIndex;
    //                 $(".find_"+lid).eq( focusIndex ).after(targetLine);
    //                 dg_update( thisIndex, focusIndex, target);
    //             }
    //         }
    //     } else {

    //     }

    //     dg_tips.hide('dgf');
    //     targetLine.css('background','');
    //     thisLineTop = 0;
    //     $('body').css('cursor','default');
    //     $(document).off('mousemove.dragSort');
    //     onselect();
    //     targetLine = null;
    // });


    // function unselect() {
    //     $('body').attr('unselectable', 'on').css({
    //         '-moz-user-select':'none',
    //         '-webkit-user-select':'none',
    //         'user-select':'none'
    //     });

    //     document.body.onselectstart = function() {
    //         return false;
    //     };
    // }

    // function onselect() {
    //     $('body').attr('unselectable', '').css({
    //         '-moz-user-select':'',
    //         '-webkit-user-select':'',
    //         'user-select':''
    //     });
    // }

    //拖动时跟随鼠标显示提示消息
    // var dg_tips = {
    //     show: function( id, left, top, val ) {
    //         if($('#' + id).length) {
    //             $('#' + id).show().css({
    //                 left: left,
    //                 top: top
    //             }).html('您在对【'+ val +' 】进行拖动排序');
    //         } else {
    //             var floatdiv='<div id="' + id + '" style="padding:5px 10px;z-index:99999;border:1px solid #444;background-color:#fff;filter:alpha(opacity=50); -moz-opacity:0.5; opacity:0.5;position:absolute;left:'+ left +'px;top:'+ top +'px;">您在对【'+ val +' 】进行拖动排序</div>';
    //             $('body').append(floatdiv);
    //         }
    //     },
    //     move: function( id, left, top ){
    //         $("#" + id).css({"left": left, "top": top});
    //     },
    //     hide: function( id ) {
    //         $("#" + id).hide();
    //     },
    //     remove: function( id ) {
    //         $("#" + id).remove();
    //     }
    // }

    // function dg_mask(target) {
    //     var W=target.outerWidth();
    //     var H=target.outerHeight();
    //     var top=target.offset().top;
    //     var left=target.offset().left;
    //     var mask="<div id='dg_mask'> 正在使劲的保存...</div>";
    //     $('body').append(mask);
    //     $("#dg_mask").css({
    //         "background":"#999",
    //         "position":'absolute',
    //         'width':W+'px',
    //         'height':H+'px',
    //         'line-height':H+'px',
    //         'top':top+'px',
    //         'left':left+'px',
    //         'filter':'alpha(opacity=30)',
    //         'moz-opacity':30/100,
    //         'opacity':30/100,
    //         'text-align':'center',
    //         'color':'#000'
    //     });
    // }

    // function dg_update(thisIndex,focusIndex,target) {
    //     var Glid    = target.attr("lid");
    //     var Glength = $(".find_"+Glid).length;
    //     var ti = {};
    //     var ids = {};
    //     $(".find_"+Glid).each(function(i,domEle){
    //         var pid = $(this).attr("pid");
    //         var set_check = $(this).find('.set_check');
    //         var aid = set_check.attr("data-aid");
    //         var lid = set_check.attr("data-lid");
    //         ids[i] = {"pid":pid, "aid":aid, "lid":lid, "sort":i};
    //     })
    //     ti.action = 'setTicketSort';
    //     ti.ids = ids;
    //     $.ajax({
    //         type:'POST',url: 'call/jh_channels.php',data: ti, dataType:'json',
    //     }).done(function(res){
    //         // if(res.status == 'success'){
    //         //     alert('排序更改成功');
    //         // }else{
    //         //     alert('排序更改失败');
    //         // }
    //     })
    // }



})




//新加"批量配置渠道"与"新产品渠道默认设置"

var BatchConfigChannel = {



    init : function(){

        var that = this;


        //已进入页面获得taskID
        var taskID = $("#taskID").val();
        console.log(taskID);

        if(parseInt(taskID)) {
            $("#selectUW_left_btn").text("全部产品渠道配置进度").css("background","#0797d9");
            // $(".selectUW_left").css("background","#0797d9");
            that.batchChannelGet();
        } else {
            $("#selectUW_left_btn").text("全部产品渠道配置").css("background","#0797d9");
            // $(".selectUW_left").css("background","#0797d9");
            that.batchChannelSet();
        }
    },
    //批量配置渠道
    batchChannelSet: function () {

        var that = this;

        $("#selectUW_left_btn").on("click", { context: that }, that.btnSetClickFn );
        //全选
        $(".batch_all_choose").click(function(){
            $(".batch_selectlist .batch_check").attr("checked",true);
        })
        //取消全选
        $(".batch_cancel_choose").click(function(){
            $(".batch_selectlist .batch_check").attr("checked",false);
        })

        $(".batch_btn_sure_all").on("click",function(){

            var checkboxs = $(".batch_selectlist input:checkbox:checked");

            var chkbox_value =[];
            checkboxs.each(function(){
                chkbox_value.push($(this).val());
            });

            if(chkbox_value.length>0){
                $("#batchConfig #batch_checkchoose_box").css("top","-20%");
                $("#batchConfig .batch_bgbox,#batchConfig #batch_checkchoose_box").hide();
            }else{
                alert("请您至少选择一个渠道");
                // var tempTpl1 =   '<span class="alertmessage">请您至少选择一个渠道</span>';
                // var dialog1 =  new Dialog({

                //     width : 500,
                //     height : 300,
                //     closeBtn : true,
                //     content : tempTpl1,
                //     drag : false,
                //     speed : 200,
                //     offsetX : 0,
                //     offsetY : 0,
                //     overlay : true,
                //     headerHeightMin : 46

                // });
                // dialog1.open();
                return
            }

            $.ajax({

                url : "/r/Product_Channel/setBatChannelTask/",
                type : "POST",
                data : {channel : chkbox_value},
                beforeSend : function(){
                    $("#selectUW_left_btn").css("background","#d2d2d2").off("click");
                },
                success : function(res){
                    console.log(res);
                    var code = res.code;
                    var msg = res.msg;

                    //设置成功
                    if(code == 200){
                        var id = res.data.id;

                        $("#taskID").val(id);
                        if(parseInt(id)) {
                            $("#selectUW_left_btn").text("批量设置进度查询").css("background","#0797d9");
                            // $(".selectUW_left").css("background","#0797d9");
                            $("#selectUW_left_btn").on("click", { context: that }, that.btnGetClickFn );
                        } else {
                            window.location.reload(true);
                        }
                        alert(msg);
                        // var tempTpl2 =   '<span class="alertmessage">'+msg+'</span>';
                        // var dialog2 =  new Dialog({

                        //     width : 500,
                        //     height : 300,
                        //     closeBtn : true,
                        //     content : tempTpl2,
                        //     drag : false,
                        //     speed : 200,
                        //     offsetX : 0,
                        //     offsetY : 0,
                        //     overlay : true,
                        //     headerHeightMin : 46

                        // });
                        // dialog2.open();
                    }
                    //任务以存在请勿重复操作
                    if(code == 601){
                        $("#selectUW_left_btn").text("批量配置渠道").css("background","#0797d9");
                        // $(".selectUW_left").css("background","#0797d9");
                        //重新绑定事件
                        $("#selectUW_left_btn").on("click", { context: that }, that.btnSetClickFn );
                        alert(msg);
                        // var tempTpl3 =   '<span class="alertmessage">'+msg+'</span>';
                        // var dialog3 =  new Dialog({

                        //     width : 500,
                        //     height : 300,
                        //     closeBtn : true,
                        //     content : tempTpl3,
                        //     drag : false,
                        //     speed : 200,
                        //     offsetX : 0,
                        //     offsetY : 0,
                        //     overlay : true,
                        //     headerHeightMin : 46

                        // });
                        // dialog3.open();
                    }


                }

            });



        });
    },


    batchChannelGet: function () {
        var that = this;

        $("#selectUW_left_btn").on("click", { context: that }, that.btnGetClickFn );
    },

    //批量设置进度查询
    btnGetClickFn: function(e) {
        var that = e.data.context;

        $.ajax({

            url : "/r/Product_Channel/getTaskSchedule/",
            type : "POST",
            data : {id : $("#taskID").val()},
            success : function(res){

                var code = res.code;
                var msg = res.msg;

                console.log(res);

                if(code == 200){

                    var tempTpl =   '<div id="dialogContent">' +
                                        '<div class="taskNumber dialogItem">任务编号：'+ $("#taskID").val() +'</div>' +
                                        '<div class="taskProgress dialogItem">任务进度：已完成 '+ res.data.ratio +'%</div>' +
                                        '<div class="wramTips dialogItem">温馨提示 :'+ (parseInt(res.data.ratio)===100? '<span style="color:#f00">任务已完成，请您核对</span></div>':'任务完成后会发送系统消息通知。</div>') +
                                    '</div>'  ;

                    var dialog =  new Dialog({

                        width : 500,
                        closeBtn : true,
                        content : tempTpl,
                        drag : false,
                        speed : 200,
                        offsetX : 0,
                        offsetY : 0,
                        overlay : true,
                        headerHeightMin : 46,
                        onCloseAfter: function() {
                            if( parseInt(res.data.ratio)===100 ) {
                                window.location.reload(true);
                            }
                        }
                    });
                    dialog.open();

                    if(parseInt( res.data.ratio ) === 100) {
                        $("#taskID").val(0);
                        $("#selectUW_left_btn").text("批量配置渠道").css("background","#0797d9");
                        $("#selectUW_left_btn").off('click').on('click', { context: that }, that.btnSetClickFn );
                    }
                } else {
                    alert(msg);
                    // var tempTpl4 =   '<span class="alertmessage">'+msg+'</span>';
                    // var dialog4 =  new Dialog({

                    //     width : 500,
                    //     height : 300,
                    //     closeBtn : true,
                    //     content : tempTpl4,
                    //     drag : false,
                    //     speed : 200,
                    //     offsetX : 0,
                    //     offsetY : 0,
                    //     overlay : true,
                    //     headerHeightMin : 46

                    // });
                    // dialog4.open();
                }
            }

        });
    },

    btnSetClickFn: function(e) {
        e.data.context.showBox();
    },

    showBox : function(){
        var h=$(window).height();
        var w=$(window).width();
        //显现背景
        $("#batchConfig .batch_bgbox").css("height",h);
        $("#batchConfig .batch_bgbox").css("width",w);
        $("#batchConfig .batch_bgbox").show();
        //显现弹窗
        $("#batchConfig #batch_checkchoose_box").show();
        $("#batchConfig #batch_checkchoose_box").animate({"top":200});
        // x弹窗按钮或取消
        $("#batchConfig .batch_close_btn,#batchConfig .batch_btn_cancels").one("click",function(){
            $("#batchConfig #batch_checkchoose_box").css("top","-20%");
            $("#batchConfig .batch_bgbox,#batchConfig #batch_checkchoose_box").hide();
        });
    }

}


$(function(){
    BatchConfigChannel.init();
});









