<% _.each(privilege,function(item,index,privilege){ %>
    <%
        var index = typeof item.index=="undefined" ? index : item.index;
        var nameFlag = pckId+"_"+index;
        var prodId = item.lid, prodName = item.ltitle;
        var ticId = item.tid,ticName=item.ttitle;
        var aid = item.aid;
        var id = pckId+"_"+prodId+"_"+ticId;
        var attr = 'data-prodId="'+prodId+'" data-ticId="'+ticId+'" data-aid="'+aid+'" data-index="'+index+'"';
        var uselimit = typeof item.uselimit!="undefined" ? item.uselimit : "-1";
        var uselimitArr = ["","",""];
        if(uselimit!=-1 && (typeof uselimit!=="undefined")){
            uselimitArr = uselimit.split(",");
            if(uselimitArr[0]==-1) uselimitArr[0] = "";
            if(uselimitArr[1]==-1) uselimitArr[1] = "";
            if(uselimitArr[2]==-1) uselimitArr[2] = "";
        }
    %>
<li <%=attr%> id="privItem_<%=id%>" class="product border-bottom pckRightItem">
    <div class="float-left">
        <div class="line">
            <div class="lt">
                <label>产品：</label>
            </div>
            <div class="rt">
                <span class="name"><%=prodName%>-<%=ticName%></span>
                <a data-pckid="<%=pckId%>" href="javascript:void(0);" <%=attr%> class="btn btn-s btn-border btn-sel selectProd_picker">选择</a>
            </div>
        </div>
        <div class="line">
            <div class="lt">
                <label>使用规则：</label>
            </div>
            <div class="rt">
                <div class="nolimit">
                    <input type="radio" value="-1" id="uselimit_no_<%=nameFlag%>" <%=uselimit==-1?"checked":""%> name="uselimit"/>
                    <label for="uselimit_no_<%=nameFlag%>">不限</label>
                </div>
                <div class="limit">
                    <input type="radio" value="1" id="uselimited_<%=nameFlag%>" <%=uselimit!=-1?"checked":""%> name="uselimit"/>
                    <label for="uselimited_<%=nameFlag%>">
                        共 <input type="text" name="limit_count" value="<%=uselimitArr[0]%>" class="smaInp limitCountInp limitCountInp_total total"> 次
                        <input type="text" name="limit_count" value="<%=uselimitArr[1]%>" class="smaInp limitCountInp limitCountInp_daily daily"> 次/日
                        <input type="text" name="limit_count" value="<%=uselimitArr[2]%>" class="smaInp limitCountInp limitCountInp_month month"> 次/月
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="float-right border-left"><a href="javascript:void(0);" class="btn-del deleteProdBtn">×</a></div>
</li>
<% }) %>