<div class="firstContain">
    <div class="contain">
        <div class="trangle"></div>
        <div class="contain2" id="SearchMerchantG" merchant_id="">商户：</div>
        <div class="allContain" id="MerchantContainG" >
            <input id="searchInputSecondLG" type="text" placeholder="请输入关键词直接搜索"/>
            <!--<div id="searchSecondL"></div>-->
            <i class="iconfont" id="searchSecondLG" >&#xe60a;</i>
            <ul id="ComsuggestKeyG">

            </ul>

        </div>

    </div>
    <label class="checkboxcon">
        <input class="checkbox" type="checkbox"  checked="checked"/>
        <div class="checkbox-value">过滤测试账号</div>
    </label>

</div>
<div class="trecoreup">
    <i class="uptic"></i>
    <span class="update" id="update">导出数据</span>
</div>
<div class="secondContain">
    <div class="selectDataFn calendarSelect " id="selectDataFnG">本周</div>
    <div class="trangle positioTran"></div>
    <div class="allContain" id="calendarContainG">
        <span class=" calendarContainClass" id="threeMonthCalendarG" >三个月以内</span>
        <span class=" calendarContainClass" id="thisMonthCalendarG">当月</span>
        <span class="calendarContainClass" id="thisWeekCalendarG">本周</span>
        <span class="calendarContainClass" id="todayCalendarG">当日</span>
    </div>

    <div id="calendarDateBe" class="calendarDateBe calendarSelect ">
        <input id="calendarInputOneG" type="text" class="calendarInputOne InputCalendar" placeholder="开始时间" >
        <i class="iconfont" id="contPositionG">&#xe65b;</i>
        <div id="ContainForCalendarG" ></div>
    </div>
    <i class="trCalendar">至</i>
    <div id="calendarDateEnd" class="calendarDateEnd calendarSelect">
        <input id="calendarInputtwoG" type="text" class="calendarInputtwo InputCalendar" placeholder="结束时间">
        <i class="iconfont" id="contPositionTG">&#xe65b;</i>
        <div id="ContainForCalendarTwoG" ></div>
    </div>
    <P class="changeDateP">
        <a  class="sDate"id="report_thisweek">本周</a>
        <a class="sDate" id="report_lastweek" >上周</a>
        <a class="sDate" id="report_thismonths">本月</a>
        <a  class="sDate" id="report_lastmonth">上月</a>
    </P>
    <div class="clear"></div>
</div>
<div class="choseCommodity">
    <div class="contain contain1">
        <div class="trangle"></div>
        <div class="contain2" id="proCommodityG"land_id="">产品名称：</div>
        <div class="allContain" id="proCommodityItemG">
            <input id="searchInputG" type="text" placeholder="请输入关键词直接搜索"/>
            <!--<div id="search"></div>-->
            <i class="iconfont" id="searchG" >&#xe60a;</i>
            <ul id="suggestKeyG">

            </ul>

        </div>

    </div>
    <div>
        <select class="selectDistributor contain contain3">
            <option data-value="1">分销商</option>
            <option data-value="2" selected="selected" id="ResellerOPt">供应商</option>
        </select>
    </div>
    <div class="contain contain1 ">
        <div>
            <div class="trangle"></div>
            <div class="contain2" id="contianDistributorFG" reseller_id=""></div>
            <div class="allContain" id="containDistributorSG">
                <input id="searchInputSecondG" type="text" placeholder="请输入关键词直接搜索"/>
                <i class="iconfont" id="searchSecondG" >&#xe60a;</i>
                <!--<div id="searchSecond"></div>-->
                <ul id="containDistributorSelctFG">

                </ul>
            </div>
        </div>


    </div>
    <div class="contain contain1" >
        <div class="contain2" id="produceItermG" count_way="product">按产品汇总</div>
        <div class="trangle"></div>
        <div class="allContain" id="produceAllG">
            <span class="Commercial returnData" id="forProduceG" count_way="product">按产品汇总</span>
            <span class="Commercial returnData" id="produceAllTicketG" count_way="ticket" >按票汇总</span>
            <span class="Commercial returnData" id="distributorAllG" count_way="reseller">按分销商汇总</span>
            <span class="Commercial returnData" id="forDateG"  count_way="date">按日期汇总</span>
            <span class="Commercial returnData" id="forOrderG" count_way="channel">按预定渠道汇总</span>
        </div>

    </div>
    <label>
        <div class="searchBtn" id="reportSearchBtnG">查询</div>
        <input  type="button" value="查询" style="display:none">
    </label>


</div>
<div class="rankCon">
    <div class="rankConTwo">
        <table class="reportTable" id="reportTableG" border="0" cellspacing="0" cellpadding="0">

            <thead class='headShow'>
            <th class="tL" id="produceTlG">
                产品
            </th>
            <th class="tR">订单数</th>
            <th class="tR">检票数</th>
            <th class="tR">金额（元）</th>
            <th class="tR">利润（元）</th>


            </thead>




        </table>
    </div>

</div>
<div class="buttonCation">
    <div id="pageButtonOneG" class="PageButton"></div>
    <div class="pageAttention ">
        <span id="PageRecentG">1</span>
        <i>/</i>
        <span id="PageTotalG">3</span>
        <div id="testButtonG"></div>
    </div>

</div>