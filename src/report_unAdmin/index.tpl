<div class="trecoreup">
    <i class="uptic"></i>
    <span class="update" id="update">导出数据</span>
</div>
<div class="secondContain">
    <div class="selectDataFn calendarSelect " id="selectDataFn">本周</div>
    <div class="trangle positioTran"></div>
    <div class="allContain" id="calendarContainA">
        <span class=" calendarContainClass" id="threeMonthCalendar" >三个月以内</span>
        <span class=" calendarContainClass" id="thisMonthCalendar">当月</span>
        <span class="calendarContainClass" id="thisWeekCalendar">本周</span>
        <span class="calendarContainClass" id="todayCalendar">当日</span>
    </div>

    <div id="calendarDateBe" class="calendarDateBe calendarSelect ">
        <input id="calendarInputOne" type="text" class="calendarInputOne InputCalendar" placeholder="开始时间" >
        <i class="iconfont" id="contPosition">&#xe65b;</i>
        <div id="ContainForCalendarA" ></div>
    </div>
    <i class="trCalendar">至</i>
    <div id="calendarDateEnd" class="calendarDateEnd calendarSelect">
        <input id="calendarInputtwo" type="text" class="calendarInputtwo InputCalendar" placeholder="结束时间">
        <i class="iconfont" id="contPositionT">&#xe65b;</i>
        <div id="ContainForCalendarTwo" ></div>
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
        <div class="contain2" id="proCommodity"land_id="">产品名称：</div>
        <select  id="proCommodityItemA">
            <option value="">请选择产品</option>
         </select>

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
            <div class="contain2" id="contianDistributorF" reseller_id=""></div>
            <select id="containDistributorSA">
                <option value="">选择分销商</option>
            </select>
        </div>


    </div>
    <div class="contain contain1" >
        <div class="contain2" id="produceIterm" count_way="product">按产品汇总</div>
        <div class="trangle"></div>
        <div class="allContain" id="produceAllA">
            <span class="Commercial returnData" id="forProduce" count_way="product">按产品汇总</span>
            <span class="Commercial returnData" id="produceAllTicket" count_way="ticket" >按票汇总</span>
            <span class="Commercial returnData" id="distributorAll" count_way="reseller">按分销商汇总</span>
            <span class="Commercial returnData" id="forDate"  count_way="date">按日期汇总</span>
            <span class="Commercial returnData" id="forOrder" count_way="channel">按预定渠道汇总</span>
        </div>

    </div>
    <label>
        <div class="searchBtn" id="reportSearchBtnA">查询</div>
        <input  type="button" value="查询" style="display:none">
    </label>


</div>
<div class="rankCon">
    <div class="rankConTwo">
        <table class="reportTable" id="reportTable" border="0" cellspacing="0" cellpadding="0">

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

</div>
<div class="buttonCation">
    <div id="pageButtonOneA" class="PageButton"></div>
    <div class="pageAttention ">
        <span id="PageRecent">1</span>
        <i>/</i>
        <span id="PageTotal">3</span>
        <div id="testButtonA"></div>
    </div>

</div>