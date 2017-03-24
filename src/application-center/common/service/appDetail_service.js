
module.exports = function(params,opt){
    var __DEBUG__ = false;
    opt = PFT.Util.Mixin(PFT.Config.Ajax(),opt);
    if(__DEBUG__){
        opt.loading();
        setTimeout(function(){
            opt.complete();
            opt.success({
                Ishardware : false,
                appName : "微商城",
                appText : "微信会员可以进行微商城开店分佣，有利于微商城的传播和产品销售。",
                appUseNumber : 3680,
                status : 0,
                appDetail : "移动互联网时代，微商城作为一种新的营销渠道，不断侵蚀着各个行业领域。为了让平台用户有更好的分销和运营渠道，增强用户体验，票付通紧跟时代发展趋势，历时两个多月开发'全民分销'智慧营销新功能，主要目的在于让用户通过C端爆炸式的营销推广自己的微商城，实现增量、拓客、圈层。具体的功能说明，且听小飘为您细细道来！一、全民分销的主要亮点业领域。为了让平台用户有更好的分销和运营渠道，增强用户体验，票付通紧跟时代发展趋势，历时两个多月开发“全民分销”智慧营销新功能，主要目的在于让用户通过C端爆炸式的营销推广自己的微商城，实现增量、拓客、圈层。二、全民分销的主要亮点业领域。为了让平台用户有更好的分销和运营渠道，增强用户体验，票付通紧跟时代发展趋势，历时两个多月开发“全民分销”智慧营销新功能，主要目的在于让用户通过C端爆炸式的营销推广自己的微商城，实现增量、拓客、圈层。",
                etime:"2017-11-20",
                price:"原价218元/年",
                recomend:[{
                    appName:"票券验证",
                    text:"票券验证简介",
                    state:1,
                    useNum:8570
                },{
                    appName:"计调下单",
                    text:"计调下单简介",
                    state:0,
                    useNum:8588
                },{
                    appName:"统计分析",
                    text:"统计分析简介",
                    state:-1,
                    useNum:1512
                }]
            })
        },100);

        return false;
    }

    PFT.Util.Ajax("/r/AppCenter_ModuleDetail/getAppDetail",{
        type : "post",
        params : {
            module_id : params.module_id,
            ptypeApp : params.ptypeApp,
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                if(data.length){
                    opt.success(data);
                }else{
                    opt.empty(data);
                }
            }else{
                opt.fail(msg);
            }
        }
    })
}