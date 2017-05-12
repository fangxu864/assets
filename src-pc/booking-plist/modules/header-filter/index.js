require("./index.scss");
var Common = require("../../common.js");
var ProvCityDataTemplate = require("COMMON/js/config.province.city.data.js");

var LoadingHtml = PFT.Util.LoadingPc("努力加载中...");
var Tpl = require("./index.xtpl");
var Message = require("pft-ui-component/Message");

var HeaderFilter = PFT.Util.Class({
    container :"#searchWrap",
    provCityData : null,
    state : {
        data : {
            provs : null,
            theme : null,
            ptype : PFT.Config.ptype
        }
    },
    ptype : {},
    EVENTS : {
        "click .listUl .item" : "onListUlItemClick", 
        "click .searchBtn" : "onSearchBtnClick", 
        "click .recoverSearchBtn" : "onRecoverSearchBtnClick", 
        "change .provSelect" : "onProvSelectChange"
    },
    init : function(){
        var urlParams = PFT.Util.UrlParse();
        this.fsid = urlParams.fsid || "";
        this.fsaccount = urlParams.fsaccount || "";

        this.searchBtn = $("#searchBtn");
        this.resetBtn = $("#recoverSearchBtn");

        this.initProvCitySelect();
        this.initTheme();
    },
    template : PFT.Util.ParseTemplate(Tpl),
    onListUlItemClick : function(e){
        var container = this.container;
        var tarItem = $(e.currentTarget);
        var themeLineListUl = container.find(".themeLineListUl");
        var hotelLineListUl = container.find(".hotelLineListUl");

        tarItem.addClass("active").siblings().removeClass("active");

        if(tarItem.hasClass("ptype")){
            if(tarItem.attr("data-ptype")=="C"){ //如果是酒店类型，不显示主题，而显示酒店星级
                themeLineListUl.hide();
                hotelLineListUl.show().find(".listUl").children().first().addClass("active").siblings().removeClass("active");
            }else{
                themeLineListUl.show();
                hotelLineListUl.hide();
            }
        }
        


    },
    onSearchBtnClick : function(e){
        var params = this.getParams();
        this.trigger("search",params);
    },
    onRecoverSearchBtnClick : function(e){
        this.trigger("reset");
    },
    onProvSelectChange : function(e){
        var that = this;
        var provCityData = this.provCityData;
        var provId = $(e.currentTarget).val();

        if(provId=="") return $("#citySelect").html('<option value="">不限</option>');

        var prov = provCityData[provId];
        if(!prov) return false;
        var citys = prov.city;
        var html = "";
        for(var i in citys){
            var city = citys[i];
            var id = city.id;
            var name = city.name;
            html += '<option value="'+id+'">'+name+'</option>';
        }
        $("#citySelect").html(html);
    },
    setProvCityData : function(ajaxCityData){
        //最终provCityData数据格式为：
        // {
        //     1 : {
        //         id : 1,
        //         name : "省",
        //         city : {
        //             11 : {
        //                 id : 11,
        //                 name : "市"
        //             }
        //         }
        //     }
        // }

        if(!ajaxCityData) return false;

        var provCityData = this.provCityData = {};

        for(var provId in ajaxCityData){
            var prov = ProvCityDataTemplate[provId];
            var cityIds = ajaxCityData[provId];
            if(prov){
                var provName = prov.name;
                var resCitys = {};
                var citys = prov.city;
                for(var s=0, sl=cityIds.length; s<sl; s++){
                    var cityId = cityIds[s];
                    for(var c=0, cl=citys.length; c<cl; c++){
                        if(cityId==citys[c]["id"] && cityId){
                            resCitys[cityId] = citys[c];
                            break;
                        }
                    }
                }
                provCityData[provId] = {};
                provCityData[provId]["id"] = provId;
                provCityData[provId]["name"] = provName;
                provCityData[provId]["city"] = resCitys;
            }
        }

        return this.provCityData;

    },
    initProvCitySelect : function(){
        var that = this;
        PFT.Util.Ajax(Common.Api.getCityCodeForOrder(),{
            type : Common.AJAX_TYPE,
            ttimeout : Common.AJAX_TIMEOUT,
            loading : function(){
                that.container.html(LoadingHtml);
            },
            complete : function(){},
            success : function(res){
                if(res.code==200){
                    that.setProvCityData(res.data);
                    that.state.data.provs = that.provCityData;
                    that.checkRenderData();
                }else{
                    Message.error(res.msg || PFT.AJAX_ERROR_TEXT);
                }
            },
            serverError : function(){
                Message.error(PFT.AJAX_ERROR_TEXT);
            }
        })
    },
    initTheme : function(){
        var that = this;
        PFT.Util.Ajax(Common.Api.getThemeForOrder(),{
            type : Common.AJAX_TYPE,
            ttimeout : Common.AJAX_TIMEOUT,
            loading : function(){
                that.container.html(LoadingHtml);
            },
            complete : function(){},
            success : function(res){
                if(res.code==200){
                    that.state.data.theme = res.data;
                    that.checkRenderData();
                }else{
                    Message.error(res.msg || PFT.AJAX_ERROR_TEXT);
                }
            },
            serverError : function(){
                Message.error(PFT.AJAX_ERROR_TEXT);
            }
        })
    },
    checkRenderData : function(){
        var data = this.state.data;
        var provCity = data.provs;
        var theme = data.theme;
        if(provCity!=null && theme!=null){
            this.renderData(data);
        }
    },
    renderData : function(data){
        var html = this.template(data);
        this.container.html(html);
    },
    isPtype_C_select : function(){
        return $("#ptypeParmUl").children(".active").attr("data-ptype")=="C";
    },
    resetParams : function(){
        var container = this.container;
        var themeLineListUl = container.find(".themeLineListUl");
        var hotelLineListUl = container.find(".hotelLineListUl");
        $("#searchInp").val("");
        $("#ptypeParmUl").children().first().addClass("active").siblings().removeClass("active");
        $("#topicParamUl").children().first().addClass("active").siblings().removeClass("active");
        themeLineListUl.show();
        hotelLineListUl.hide();
        $("#provSelect").val("").trigger("change");
    },
    getParams : function(){
        var params = {
            title : $.trim($("#searchInp").val()),
            pType : $("#ptypeParmUl").children(".active").attr("data-ptype"),
            province : $("#provSelect").val(),
            city : $("#citySelect").val(),
            fsid : this.fsid,
            fsaccount : this.fsaccount
        };
        if(!this.isPtype_C_select()){
            params["theme"] = encodeURIComponent($("#topicParamUl").children(".active").find("a").attr("data-topic"))
        }else{ //如果是酒店类型 传jtype不传theme
            params["jtype"] = encodeURIComponent($("#hotel_star_ParamUl").children(".active").attr("data-jtype"))
        }
        return params;
    }
});


module.exports = HeaderFilter;


