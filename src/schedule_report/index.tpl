<div id="ContainOne">
    <div class="firstContain">
        <div class="contain">
            <div class="trangle"></div>
            <div class="contain2">商户：</div>
            <div class="allContain"></div>

        </div>
        <label class="checkboxcon">
            <input class="checkbox" type="checkbox"  checked="checked"/>
            <div class="checkbox-value">过滤测试账号</div>
        </label>
    </div>
    <div class="choseCommodity">
        <div class="contain contain1">
            <div class="trangle"></div>
            <div class="contain2" id="proCommodity">产品名称：</div>
            <div class="allContain" id="proCommodityItem">
                <input id="searchInput" type="text">
                <div id="search"></div>
                </input>
            </div>

        </div>
        <div>
            <select class="selectDistributor contain contain1">
                <option data-value="1">分销商</option>
                <option data-value="2">供应商</option>
            </select>
        </div>
        <div class="contain contain1 ">
            <div>
                <div class="trangle"></div>
                <div class="contain2" id="contianDistributorF">fjdsklfjldkj</div>
                <div class="allContain" id="containDistributorS"></div>
            </div>


        </div>
        <div class="contain contain1" >
            <div class="contain2" id="produceIterm">按产品汇总</div>
            <div class="trangle"></div>
            <div class="allContain" id="produceAll">
                <span class="Commercial returnData">按产品汇总</span>
                <span class="Commercial returnData" id="produceAllTicket">按票汇总</span>
                <span class="Commercial returnData" id="distributorAll">按分销商汇总</span>
                <span class="Commercial returnData" id="forDate">按日期汇总</span>
                <span class="Commercial returnData" id="forOrder">按预定渠道汇总</span>
            </div>

        </div>
        <label>
            <div class="searchBtn">查询</div>
            <input  type="button" value="查询" style="display:none"></input>
        </label>


    </div>
    <table class="reportTable" border="0" cellspacing="0" cellpadding="0">

        <thead class='headShow'>
        <th class="tL" id="produceTl">
            产品
        </th>
        <th class="tR">订单数</th>
        <th class="tR">票数</th>
        <th class="tR">收入（元）</th>
        <th class="tR">支出（元）</th>
        <th class="tR">优惠券数量</th>
        <th class="tR">优惠金额（元）</th>

        </thead>


    </table>

</div>

