/*
 * @Author: huangzhiyang 
 * @Date: 2017-05-23 18:15:09 
 * @Last Modified by:   huangzhiyang 
 * @Last Modified time: 2017-05-23 18:15:09 
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
    state : {
        hasInit : false
    },
    init : function(opt){
        this.opt = opt;
        this._bindEvent();
    },
    onCheckRadioOptClick : function(e){
        var tarItem = $(e.currentTarget);
        var key = tarItem.attr("data-key");
        var type = this.opt.type;
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
        var type = option.type;
        var name = option.name;
        var html = "";
        if(!isArray(option) || option.length==0) return false;
        for(var i=0,len=option.length; i<len; i++){
            var opt = option[i];
            var key = opt.key;
            var text = isFunction(opt.text) ? opt.text() : opt.text;
            var id = that._createID(key);
            html += '<li data-key="'+key+'" id="checkRadioOpt_'+id+'" class="checkRadioOpt checkRadioOpt_'+id+'">';
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
        if(!this.state.hasInit){
            this.state.hasInit = true;
            var checked = this.opt.checked;
            if((isString(checked) && checked!="") || isNumber(checked)){
                var id = this._createID(checked);
                var tarOption = $("#checkRadioOpt_"+id);
                if(tarOption.length) tarOption.trigger("click");
            }
        }
    },
    disable : function(key){
        if(isUndefined(key)){
            this.container.find(".checkRadioOpt").removeClass("checked").addClass("disable");
        }else{
            var tarItem = this.container.find(".checkRadioOpt_"+this._createID(key));
            if(tarItem.length) tarItem.removeClass("checked").addClass("disable");
        }
    },
    enable : function(key){
        if(isUndefined(key)){
            this.container.find(".checkRadioOpt").removeClass("disable");
        }else{
            var tarItem = this.container.find(".checkRadioOpt_"+this._createID(key));
            if(tarItem.length) tarItem.removeClass("disable");
        }
    },
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
    getValue : function(){
        var result = [];
        this.container.find(".checkRadioOpt").filter(function(){
            return $(this).hasClass("checked");
        }).each(function(){
            result.push($(this).attr("data-key"));
        });
        return result.join(",");
    },
    getChecked : function(){
        var result = [];
        this.container.find(".checkRadioOpt").each(function(){
            var item = $(this);
            if(item.hasClass("checked")) result.push(item.attr("data-key"));
        })
        return result.join(",");
    },
    getUnChecked : function(){
        var result = [];
        this.container.find(".checkRadioOpt").each(function(){
            var item = $(this);
            if(!item.hasClass("checked")) result.push(item.attr("data-key"));
        })
        return result.join(",");
    },
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