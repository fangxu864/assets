/**
 * Created by Administrator on 2016/7/28.
 */
//省市区三地联动下拉框
// var p_c_a=require("COMMON/modules/address_three");
// p_c_a.province_city_area("province","city","area",function(_province,_city,_area){
//     $("#province_input").val(_province);
//     $("#city_input").val(_city);
//     $("#area_input").val(_area)
// })



//车辆信息下拉框
var SelectShort=require("COMMON/modules/select_short");
var car_info=new SelectShort({
    id:"car_info",
    arr:["五人座以内（包含五人）","五人座以上"],
    callback:function (cur) {
        $("#car_info_input").val(cur);

    }
})

//上传照片
// var up_img_box=document.getElementById("up_img_box");
var Fileupload=require("COMMON/modules/fileupload");
var STip = require("COMMON/js/util.simple.tip.js");

var uploador = new Fileupload({
		container : $("#up_img_box")   ,                    //必选 组件要显示在哪个容器内，可传容器id或jq对象
	    action    : "/r/product_AnnualCard/uploadImg/"  , // 必选 文件上传至后端，哪个接口地址处理
 	    id        : 1 ,                                       //必选 页面上可能有好几个文件上传组件同时存在，用来标显组件唯一id(数字)
 	    loading   :  function () { } ,                        //上传过程中的回调函数   可选 *
        complete  : function (data) {                         //上传结束后的回调函数   可选 建议后端返回的数据格式：{code:200,data:{src:"图片src地址"},msg:""}
            // console.log(data)
            var code = data.code;
            if(code==200){
                $("#photo_src_hidden_input").val(data.data.src);
                STip("success","文件上传成功！");
            }else{
                alert(data.msg || "error");
            }
        }
 })

var ProvCitySelector = require("COMMON/js/component.city.select.js");
var selector = new ProvCitySelector({
    provId : "#provSelect",
    cityId : "#citySelect",
    onProvChange : function (provId) {
       // console.log(provId)
        $("#province_input").val(provId)
    },
    onCityChange : function (cityId) {
       // console.log(cityId)
        $("#city_input").val(cityId)
    }
});
// var val = selector.getVal();
