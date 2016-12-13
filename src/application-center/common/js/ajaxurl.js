module.exports = {
    //付费页面 - 资费列表
    chargeList: '/r/AppCenter_ModuleConfig/tariffAlloca',
    //付费界面 - 付费模式
    getMode:    '/r/AppCenter_ModuleList/payModeInfo',
    //付费页面 - 应用中心费用配置页面的 下架功能
    removeCharge: '/r/AppCenter_ModuleConfig/underCarriage',

    //付费页面 - 修改资费时，获取该资费的默认信息
    singleCharge: '/r/AppCenter_ModuleConfig/modTraiffList',
    //付费页面 - 修改资费时，接收修改后的数据
    modCharge: '/r/AppCenter_ModuleConfig/modTraiffRec',
    //付费页面 - 新增资费
    addCharge: '/r/AppCenter_ModuleConfig/newTariff',

    //付费页面 - 模块列表
    appListInPage: '/r/AppCenter_ModuleConfig/getModuleList',

    //推荐应用 获取所有模块
    appList: '/r/AppCenter_ModuleList/getAllModuleName',


    //付费界面-模块描述-获取已有的信息
    getAppDetail: '/r/AppCenter_ModuleDetail/getModuleDetail',
    //获取推荐的模块列表
    getRecommendApps: '/r/AppCenter_ModuleList/getModuleListExceptSelf',
    //付费界面-模块描述-更新模块信息
    updateApp: '/r/AppCenter_ModuleConfig/updateModule',

    //开通统计列表
    statistics: '/r/AppCenter_ModuleList/sumModule',
    //开通统计明细
    statisticsDetail: '/r/AppCenter_ModuleList/getDetail'
};