/**
 * Created by Administrator on 2016/7/28.
 */
//省市区三地联动下拉框
var p_c_a=require("COMMON/modules/address_three");
p_c_a.province_city_area("province","city","area")

//车辆信息下拉框
var SelectShort=require("COMMON/modules/select_short");
var car_info=new SelectShort({
    id:"car_info",
    arr:["五人座以内（包含五人）","五人座以上"]
})