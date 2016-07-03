<% _.each(privilege,function(item,index,privilege){ %>
    <%
        var ticketid = item.tid;
        var aid = item.aid;
        var id = tid+"_"+ticketid+"_"+aid;
        var attrFlag = 'data-tid="'+tid+'" data-ticketid="'+ticketid+'" data-aid="'+aid+'"';
        var prodName = item.ltitle;
        var ticName = item.title;
        var uselimit = typeof item.use_limit!="undefined" ? item.use_limit : "-1";
        var uselimitArr = ["","",""];
        if(uselimit!=-1 && (typeof uselimit!=="undefined")){
            uselimitArr = uselimit.split(",");
            if(uselimitArr[0]==-1) uselimitArr[0] = "";
            if(uselimitArr[1]==-1) uselimitArr[1] = "";
            if(uselimitArr[2]==-1) uselimitArr[2] = "";
        }
    %>
<li <%=attrFlag%> id="privItem_<%=id%>" class="product border-bottom pckRightItem">
    <div class="float-left">
        <div class="line">
            <div class="lt">
                <label>产品：</label>
            </div>
            <div class="rt">
                <span class="name"><%=prodName%>-<%=ticName%></span>
                <a href="javascript:void(0);" <%=attrFlag%> class="btn btn-s btn-border btn-sel selectProd_picker">选择</a>
            </div>
        </div>
        <div class="line">
            <div class="lt">
                <label>使用规则：</label>
            </div>
            <div class="rt">
                <div class="nolimit">
                    <input type="radio" value="-1" id="uselimit_no_<%=id%>" name="uselimit_<%=id%>" <%=uselimit==-1?"checked":""%> />
                    <label for="uselimit_no_<%=id%>">不限</label>
                </div>
                <div class="limit">
                    <input type="radio" value="1" id="uselimited_<%=id%>" name="uselimit_<%=id%>" <%=uselimit!=-1?"checked":""%> />
                    <label for="uselimited_<%=id%>">
                        共 <input type="text" name="limit_count" value="<%=uselimitArr[2]%>" class="smaInp limitCountInp limitCountInp_total total"> 次
                        <input type="text" name="limit_count" value="<%=uselimitArr[0]%>" class="smaInp limitCountInp limitCountInp_daily daily"> 次/日
                        <input type="text" name="limit_count" value="<%=uselimitArr[1]%>" class="smaInp limitCountInp limitCountInp_month month"> 次/月
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="float-right border-left"><a href="javascript:void(0);" class="btn-del deleteProdBtn">×</a></div>
</li>
<% }) %>