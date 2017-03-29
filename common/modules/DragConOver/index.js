/**
 * Created by Administrator on 2016/8/8.
 */
module.exports=function($){

        /*
         * jQuery拖动插件，容器内物体超出范围可拖动
         * 使用需引用jq
         * author:fangxu
         * 使用说明：
         * $(selector).DragConOver({
         * direction:"x",                     //可以移动的方向，参数有三个："x","y","xy"分别代表只能x轴方向移动，只能y轴方向移动，x和y轴方向均可移动
         * callback:function(json){}          //传入参数为一个json,{x:-10,y:20}即移动的相对距离坐标；
         * })
         * */
        $.fn.DragConOver=function(opt){
            $(this).on('mousedown touchstart' , function (e) {
                e.preventDefault();
                var Default={
                    direction:"xy",
                    callBack:function(){}
                };
                opt=$.extend(Default,opt);
                var that=$(this);
                var parent=that.offsetParent();
                var ePageX = e.pageX ? e.pageX : e.originalEvent.targetTouches[0].pageX;
                var ePageY = e.pageY ? e.pageY : e.originalEvent.targetTouches[0].pageY;
                var disX = ePageX - $(this).offset().left;
                var disY = ePageY -$(this).offset().top;
                $(document).on('mousemove.DragConOver touchmove.DragConOver',function (e) {
                    var ePageX = e.pageX ? e.pageX : e.originalEvent.targetTouches[0].pageX;
                    var ePageY = e.pageY ? e.pageY : e.originalEvent.targetTouches[0].pageY;
                    $(document).on('selectstart.DragConOver',function (e) {
                        e.preventDefault();
                        return false;
                    });
                    e.preventDefault();
                    var startValue={
                        x:that.position().left,
                        y:that.position().top
                    };
                    if(opt.direction.toLowerCase()=="x"){                          //只能X轴方向移动

                        that.offset({left:ePageX-disX});
                        //X轴方向
                        if(that.position().left>0){
                            that.css("left","0")
                        }
                        if(Math.abs(that.position().left)>Math.abs(that.outerWidth()-parent.innerWidth())){
                            that.css("left",-Math.abs(that.outerWidth()-parent.innerWidth())+"px")
                        }
                        if(parent.innerWidth()-that.innerWidth()>=0){
                            that.css("left","0")
                        }
                    }else if(opt.direction.toLowerCase()=="y"){                     //只能Y轴方向移动
                        that.offset({top:ePageY - disY});
                        //Y轴方向
                        if(that.position().top>0){
                            that.css("top","0")
                        }
                        if(Math.abs(that.position().top)>Math.abs(that.outerHeight()-parent.innerHeight())){
                            that.css("top",-Math.abs(that.outerHeight()-parent.innerHeight())+"px")
                        }
                        if(parent.innerHeight()-that.innerHeight()>=0){
                            that.css("top","0")
                        }

                    }else if(opt.direction.toLowerCase()=="xy"){                           //可随意方向移动
                        that.offset({left:ePageX-disX,top:ePageY - disY});
                        //X轴方向
                        if(that.position().left>0){
                            that.css("left","0")
                        }
                        if(Math.abs(that.position().left)>Math.abs(that.outerWidth()-parent.innerWidth())){
                            that.css("left",-Math.abs(that.outerWidth()-parent.innerWidth())+"px")
                        }
                        if(parent.innerWidth()-that.innerWidth()>=0){
                            that.css("left","0")
                        }
                        //Y轴方向
                        if(that.position().top>0){
                            that.css("top","0")
                        }
                        if(Math.abs(that.position().top)>Math.abs(that.outerHeight()-parent.innerHeight())){
                            that.css("top",-Math.abs(that.outerHeight()-parent.innerHeight())+"px")
                        }
                        if(parent.innerHeight()-that.innerHeight()>=0){
                            that.css("top","0")
                        }
                    }
                    var dValue={
                        x:that.position().left-startValue.x,
                        y:that.position().top-startValue.y
                    };
                    opt.callBack(dValue);
                });

                $(document).on('mouseup.DragConOver touchend.DragConOver',function () {
                    $(document).off('mousemove.DragConOver');
                    $(document).off('mouseup.DragConOver');
                    $(document).off('touchmove.DragConOver');
                    $(document).off('selectstart.DragConOver');
                    $(document).off('touchend.DragConOver');
                })
            })
        }

};