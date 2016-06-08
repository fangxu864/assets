<% _.each(privilege,function(item){ %>
    <%
        var prod=item.product,tic=item.ticket,rule=item.rule;
        var prodId = prod.id,prodName=prod.name;
        var ticId = tic.id,ticName=tic.name;
        var id = pckId+"_"+prodId+"_"+ticId;
        var attr = 'data-prodId="'+prodId+'" data-ticId="'+ticId+'"';
    %>
<li id="pckRightItem_<%=id%>" <%=attr%> class="product border-bottom pckRightItem pckRightItem_<%=id%>">
    <div class="float-left">
        <div class="line">
            <div class="lt">
                <label>产品：</label>
            </div>
            <div class="rt">
                <span><%=prodName%>-<%=ticName%></span>
                <a data-pckid="<%=pckId%>" href="javascript:void(0);" <%=attr%> class="btn btn-s btn-border btn-sel selectProd_picker">选择</a>
            </div>
        </div>
        <div class="line">
            <div class="lt">
                <label>使用规则：</label>
            </div>
            <div class="rt">
                <div class="float-left">
                    <input type="radio" id="useTimeRadio_total_<%=id%>" checked name="useTimeRadio_<%=id%>"/>
                    <label for="useTimeRadio_total_<%=id%>">不限总次数</label>
                </div>
                <div class="float-left">
                    <input type="radio" id="useTimeRadio_day_<%=id%>" name="useTimeRadio_<%=id%>"/>
                    <label for="useTimeRadio_day_<%=id%>"><input type="text"class="smaInp"> 次/日</label>
                </div>
                <div class="float-left">
                    <input type="radio" id="useTimeRadio_month_<%=id%>" name="useTimeRadio_<%=id%>"/>
                    <label for="useTimeRadio_month_<%=id%>"><input type="text"class="smaInp"> 次/月</label>
                </div>
                <input type="checkbox" id="useTimeCheckbox_total_<%=id%>" name="time"/>
                <label for="useTimeCheckbox_total_<%=id%>"> 共 <input type="text" class="smaInp"> 次</label>
            </div>
        </div>
    </div>
    <div class="float-right border-left"><a href="javascript:void(0);" class="btn-del deleteProdBtn">×</a></div>
</li>
<% }) %>