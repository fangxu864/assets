/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-23 18:15:09 
 * @Last Modified by: huangzhiyang
 * @Last Modified time: 2017-05-27 17:05:37
 * @desc pc端checkbox、radio组件
 * 
 * var c = CheckRadioSelect("#containerId",{
 *       type : "checkbox",        // {string}        可选, 默认checkbox   checkbox或radio 
 *       layout : "h",             // {string}        可选, 布局方式 默认h  h-横向   v-竖向
 *       checked : "",             // {string|number} 可选, 初始化时默认被选中的项的key值 
 *       name : "",                // {string}        可选, 类似于input的name属性
 *       EVENTS : {},              // {object}        可选, 事件代理
 *       onSelect : function(){},  // {function}      可选, 点击某个option时的回调
 *       option : []               // {array}         必填, 要显示的option项   option = [{key:1,text:"选项一"},{key:2,text: function(){return'<div style="">选项二</div>'}}]
 * })
 * 
 */
require("./index.scss");
var Util = PFT.Util;
var isObject = Util.isObject;
var isArray = Util.isArray;
var isUndefined = Util.isUndefined;
var isString = Util.isString;
var isNumber = Util.isNumber;
var isFunction = Util.isFunction;
var CheckRadioSelect = PFT.Util.Class({
    EVENTS : {
        "click .checkRadioOpt" : "onCheckRadioOptClick"
    },
    init : function(opt){
        this.opt = opt;
        this.hasInit = false;
        this._bindEvent();
    },
    onCheckRadioOptClick : function(e){
        var tarItem = $(e.currentTarget);
        var key = tarItem.attr("data-key");
        var type = this.opt.type;
        if(tarItem.attr("data-type")=="radio" && tarItem.hasClass("checked")) return false;
        if(!tarItem.hasClass("disable")){
            if(type!=="checkbox"){
                tarItem.addClass("checked").siblings().removeClass("checked");
            }else{
                tarItem.toggleClass("checked");
            }
        }
        var params = {
            key : key,
            text : this.getText(key),
            disable : tarItem.hasClass("disable"),
            tarOption : tarItem,
            checked : this.getChecked(),
            unChecked : this.getUnChecked()
        };
        this.opt.onSelect.call(this,params);
        this.trigger("select",params);
    },
    _bindEvent : function(){
        var events = this.opt.EVENTS;
        var container = this.container;
        for(var i in events){
            (function(i){
                // events = {
                //     "click .btn a" : "onClick",
                //     //如果有多个事件名，以下2种写法都支持，但推荐使用第1种，这也是jquery的写法
                //     "input propertychange #input" : "onInputChange",
                //     "input,propertychange #input" : "onInputChange"
                // }
                var matched = i.match(/(([a-z]+(\s|,)*)+)(\s)(.*)/);
                var eventType = matched[1];
                var selector = matched[5];
                eventType = eventType.replace(","," ");
                var handler = events[i];
                var handlerType = typeof handler;
                if(handlerType!=="function" && handlerType!=="string") return;
                if(handlerType=="string") handler = Option[handler];
                if(typeof handler!=="function") return;
                if(selector){
                    container.on(eventType,selector,function(e){
                        handler.call(that,e);
                    });
                }else{
                    pocontainerper.on(eventType,function(e){
                        handler.call(that,e);
                    });
                }	
            })(i);
        }
    },
    _createOption : function(){
        var that = this;
        var option = this.opt.option;
        var type = this.opt.type;
        var html = "";
        if(!isArray(option) || option.length==0) return false;
        for(var i=0,len=option.length; i<len; i++){
            var opt = option[i];
            var key = opt.key;
            var text = isFunction(opt.text) ? opt.text() : opt.text;
            var id = that._createID(key);
            var styleArr = [];
            var css = opt.css;
            if(isObject(css)){
                for(var c in css){
                    var cs = css[c];
                    //如果css用驼峰，需要把驼峰转成连字符
                    c = c.replace(/([A-Z])/g,"-$1");
                    styleArr.push(c+":"+cs);
                }
            }
            html += '<li style="'+styleArr.join(";")+'" data-type="'+type+'" data-key="'+key+'" id="checkRadioOpt_'+id+'" class="checkRadioOpt checkRadioOpt_'+id+'">';
			html += '	<span class="inp"></span>';
			html += '	<span class="label">'+text+'</span>';
			html += '</li>';
        }
        return html;
    },
    _createID : function(key){
        var opt = this.opt;
        var type = opt.type;
        var name = opt.name;
        var id = type + "_" + name + "_" + key;
        return id;
    },

    //===================================================================
    //=======暴露以下方法给外部使用
    //===================================================================
    
    //渲染组件到container里
    render : function(){
        var opt = this.opt;
        var layout = {
            h : "land",
            v : "ver"
        }[opt.layout];
        var type = opt.type;
        var cls = layout + " " + type;
        var html = '';
        var optHtml = this._createOption();
        if(!optHtml) return false;
        html += '<ul class="checkRadioWrap '+cls+'">';
        html += optHtml;
        html += '</ul>';
        this.container.html(html);
        if(!this.hasInit){
            this.hasInit = true;
            var checked = this.opt.checked;
            if((isString(checked) && checked!="") || isNumber(checked)){
                var id = this._createID(checked);
                var tarOption = this.container.find(".checkRadioOpt_"+id);
                if(tarOption.length) tarOption.trigger("click");
            }
        }
    },
    
    //获取某个key对应的文件内容
    getText : function(key){
        if(isUndefined(key)) return false;
        var option = this.opt.option;
        var result = "";
        for(var i=0; i<option.length; i++){
            var opt = option[i];
            var id = opt.key;
            var text = isFunction(opt.text) ? opt.text() : opt.text;
            if(id==key){
                result = text;
                break;
            }
        }
        return result;
    },
    //获取当前值 
    getValue : function(){
        return this.getChecked();
    },
    //获取被选中的项的key值，如果有多个值(type=checkbox时) 用“,”隔开  1,2,3
    getChecked : function(){
        var result = [];
        this.container.find(".checkRadioOpt").each(function(){
            var item = $(this);
            if(item.hasClass("checked")) result.push(item.attr("data-key"));
        })
        return result.join(",");
    },
    //获取未被选中的项的key值，如果有多个值(type=checkbox时) 用“,”隔开  1,2,3
    getUnChecked : function(){
        var result = [];
        this.container.find(".checkRadioOpt").each(function(){
            var item = $(this);
            if(!item.hasClass("checked")) result.push(item.attr("data-key"));
        })
        return result.join(",");
    },
    //相当于获取input的name属性
    getName : function(){
        return this.opt.name;
    },
    //选中某一项或多项
    //select(1)  select(1,2,3,4,5)
    select : function(key){
        var that = this;
        var id,opt;
        var container = this.container;
        var args = arguments;
        for(var i=0,len=args.length; i<len; i++){
            var k = args[i];
            id = that._createID(k);
            opt = container.find(".checkRadioOpt_"+id);
            if(opt.length && !opt.hasClass("disable")) opt.trigger("click");
        }
        return this;
    },
    //取消勾选某一项或多项
    //unselect(1)  unselect(1,2,3,4,5)
    unSelect : function(key){
        var that = this;
        var type = this.opt.type;
        var id,opt;
        var container = this.container;
        var args = arguments;
        for(var i=0,len=args.length; i<len; i++){
            var k = args[i];
            id = that._createID(k);
            opt = container.find(".checkRadioOpt_"+id);
            if(opt.length && !opt.hasClass("disable")) opt.removeClass("checked");
        }
        return this;
    },
    //禁用某一项，如不传key，则默认禁用所有项
    disable : function(key){
        var that = this;
        var container = this.container;
        var args = arguments;
        if(isUndefined(key)){
            container.find(".checkRadioOpt").addClass("disable");
        }else{
            for(var i=0; i<args.length; i++){
                var k = args[i];
                var tarItem = container.find(".checkRadioOpt_"+that._createID(k));
                if(tarItem.length) tarItem.addClass("disable");
            }
        }
        return this;
    },
    //启用某一项，如不传key，则默认启用所有项
    enable : function(key){
        var that = this;
        var container = this.container;
        var args = arguments;
        if(isUndefined(key)){
            container.find(".checkRadioOpt").removeClass("disable");
        }else{
            for(var i=0; i<args.length; i++){
                var k = args[i];
                var tarItem = container.find(".checkRadioOpt_"+that._createID(k));
                if(tarItem.length) tarItem.removeClass("disable");
            }
        }
        return this;
    },
    //销毁组件
    destroy : function(){
        this.container.off().remove();
    }
});


module.exports = function(container,opt){

    opt = opt || {};
    var def = {
        type : "checkbox",
        layout : "h",  //h-横向   v-竖向
        checked : "",
        name : "",
        css : {},      //可以为每个option指定自定义样式
        EVENTS : {},
        onSelect : function(){},
        option : []
    };

    for(var i in def){
        if(typeof opt[i]=="undefined") opt[i] = def[i];
    }

    opt["container"] = container;

    return new CheckRadioSelect(opt);
    
}