/**
 * Created by Administrator on 2017/4/14.
 */

import {module1} from "./module1.es6";

var module2 = {
    name: "module2",
    init: function () {

        console.log(module1.name)
    }
};

export {module2};