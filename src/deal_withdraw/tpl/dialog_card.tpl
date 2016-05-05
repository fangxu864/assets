<style type="text/css">
    #dialogCardWrap{ padding:20px 20px 20px 40px;}
    #dialogCardWrap .line{ position:relative; overflow:hidden; margin-bottom:15px;}
    #dialogCardWrap .line .lt{ float:left; height:30px; line-height:30px; padding-left:30px; width:70px; overflow:hidden}
    #dialogCardWrap .line .rt{ float:left; width:420px}
    #dialogCardWrap .line .textInp{ width:180px; height:22px; line-height:22px; padding:6px 8px; border:1px solid #e5e5e5; background:#fff; box-shadow:inset 0 1px 1px rgba(0,0,0,.055);}
    #dialogCardWrap .line select{ width:200px; height:30px; line-height:30px;}
    #dialogCardWrap .line select option{ padding-left:8px;}
    #dialogCardWrap .line .btn{ display:block; width:80px; height:30px; line-height:30px; text-align:center; color:#fff; background:#008fc2; text-decoration:none}
    #dialogCardWrap .line .btn:hover{ background:#0081af; text-decoration:none}
    #dialogCardWrap .line .btn.disable,#dialogCardWrap .line .btn.disable:hover{ background:#818181; cursor:default}
</style>
<div id="dialogCardWrap" class="dialogCardWrap">
    <div class="head"></div>
    <div class="dialogCardCon">
        <div class="line bank clearfix">
            <div class="lt">银行</div>
            <div class="rt">
                <select name="" id="">
                    <option value="0">中国银行</option>
                </select>
            </div>
        </div>
        <div class="line area clearfix">
            <div class="lt">所在地</div>
            <div class="rt">
                <select name="" id="">
                    <option value="0">中国银行</option>
                </select>
            </div>
        </div>
        <div class="line keyword clearfix">
            <div class="lt">关键字</div>
            <div class="rt">
                <input style="width:240px" class="textInp" type="text" name="" id=""/>
            </div>
        </div>
        <div class="line btn clearfix">
            <div class="lt"></div>
            <div class="rt">
                <a class="btn" href="javascript:void(0)">下一步</a>
            </div>
        </div>
    </div>
</div>