require('../css/channels.css');

// require("./global");
// require("./ajaxData");
// require("./sData");
// require("./search");
// require("./product_package");

 // "./src/channels_conf/js/ajaxData", "./src/channels_conf/js/sData", "./src/channels_conf/js/search", "./src/channels_conf/js/product_package",

$(function(){
    var thisLineTop = 0,
        topDistance,
        downDistance,
        lid,
        pid,
        lineNum,
        thisIndex = 1,
        lineHeight = 91,
        targetLine;

    $('#mlistUl').on('mouseenter.dragSort', '.set_all_data', function(){
        //鼠标划入显示移动图标
        $(this).find('.InfoQqIcon').show();
    }).on('mouseleave.dragSort', '.set_all_data', function(){
        //鼠标划出隐藏移动图标
        $(this).find('.InfoQqIcon').hide();
    }).on('mousedown.dragSort', '.InfoQqIcon', function(e){
        var target = $(e.currentTarget);

        lid     = target.attr('lid');
        pid     = target.attr('pid');
        lineNum = $('.find_'+lid).length;
        targetLine = target.closest('tr').eq(0);

        thisIndex = targetLine.index();

        var left = e.pageX + 20,
            top = e.pageY + 20,
            val = targetLine.find(".ctitles").html();
        dg_tips.show( 'dgf', left, top, val);

        thisLineTop = e.pageY;
        topDistance = thisLineTop - targetLine.offset().top;
        downDistance = targetLine.offset().top + lineHeight - thisLineTop;
        targetLine.css('background','#ffffcc');
        $('body').css('cursor','move');
        unselect();
        $(document).on('mousemove.dragSort', function(e){
            dg_tips.move( 'dgf', (e.pageX + 20)+'px', (e.pageY + 20) +'px');
        });
    }).on('mouseup.dragSort', function(e){
        if(!$(e.target).is('.InfoQqIcon') && $(e.target).parents('.set_all_data') && targetLine) {
            $(e.target).parents('.set_all_data').eq(0).find('.InfoQqIcon').trigger('mouseup.dragSort', e.pageY);
        }
    });

    /*
        鼠标按下拖动，移出容器并放开时 执行
     */
    $(document).on('mouseup.dragSort', function(e){
        if(!$(e.target).parents('.set_all_data').length) {
            dg_tips.hide('dgf');
            targetLine && targetLine.css('background','');
            thisLineTop = 0;
            $('body').css('cursor','default');
            $(document).off('mousemove.dragSort');
            onselect();
        }
    });

    $(".InfoQqIcon").live("mouseup.dragSort",function(e, data){
        var target = $(e.currentTarget);

        if(lineNum > 1){
            var moveDistance = (e.pageY || data) - thisLineTop;

            if(moveDistance<0){
                if(thisIndex != 1 && Math.abs(moveDistance) > topDistance){
                    moveDistance = Math.abs(moveDistance);
                    focusIndex = thisIndex - Math.ceil((moveDistance - topDistance)/lineHeight) - 1;
                    focusIndex = focusIndex < 0? 0:focusIndex;
                    $(".find_"+lid).eq(focusIndex).before(targetLine);
                    dg_update(thisIndex,focusIndex,target);
                }
            }else{
                if(thisIndex != lineNum && moveDistance > downDistance){
                    focusIndex = thisIndex + Math.ceil((moveDistance - downDistance)/lineHeight) - 1;
                    focusIndex = focusIndex > lineNum-1 ? lineNum : focusIndex;
                    $(".find_"+lid).eq( focusIndex ).after(targetLine);
                    dg_update( thisIndex, focusIndex, target);
                }
            }
        } else {

        }

        dg_tips.hide('dgf');
        targetLine.css('background','');
        thisLineTop = 0;
        $('body').css('cursor','default');
        $(document).off('mousemove.dragSort');
        onselect();
        targetLine = null;
    });


    function unselect() {
        $('body').attr('unselectable', 'on').css({
            '-moz-user-select':'none',
            '-webkit-user-select':'none',
            'user-select':'none'
        });

        document.body.onselectstart = function() {
            return false;
        };
    }

    function onselect() {
        $('body').attr('unselectable', '').css({
            '-moz-user-select':'',
            '-webkit-user-select':'',
            'user-select':''
        });
    }

    //拖动时跟随鼠标显示提示消息
    var dg_tips = {
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
    }

    function dg_mask(target) {
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
    }

    function dg_update(thisIndex,focusIndex,target) {
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



})