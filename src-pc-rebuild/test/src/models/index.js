/**
 * Author: huangzhiyang
 * Date: 2016/12/9 9:28
 * Description: ""
 */
const modelArr = [
    require("./count"),
    require("./test"),
];
export default function(app){
    modelArr.forEach(model => {
        app.model(model)
    })
}
