/**
 * Created by Administrator on 2016/10/28.
 */



function LoopTip(data){
    var _this=this;
    this.container=data.container;//loopTip的容器
    this.content=data.content;//loopTip的文本内容
    this.init();
    this.loop();
    this.bind();

}
LoopTip.prototype={
    init:function(){
        var _this=this;
        this.container.css("position","relative");
        this.container.append('<div class="loop_con" style="position: absolute;white-space: nowrap;color: #F07845">'+this.content+'</div>');
        //loopTip的文本框
        this.wrap=_this.container.find(".loop_con");
        _this.wrap.css("left",_this.container.width()+"px");
    },
    loop:function () {
        var _this=this;
        clearInterval(_this.timer);
        _this.timer = setInterval(function () {
            _this.wrap.css("left",(parseInt(_this.wrap.css("left"))-1)+"px");
            if(parseInt(_this.wrap.css("right")) >= parseInt(_this.container.width())){
                clearInterval(_this.timer);
                _this.wrap.css("left",parseInt(_this.container.width())+"px");
                _this.loop()
            }
        },30)
    },
    bind:function () {
        var _this=this;
        _this.wrap.on("mouseover",function(){
            clearInterval(_this.timer);
        });
        _this.wrap.on("mouseout",function(){
            _this.loop()
        })
    },
    setInterval_own:{
        timer:-1,
        count:function(func,time){
            var _this=this;
            _this.clear();
            this.timer=setTimeout(function () {
                func();
                _this.count(func,time)
            },time);
        },
        clear:function () {
            var _this=this;
            clearTimeout(_this.timer)
        }
    }
};

module.exports=LoopTip;