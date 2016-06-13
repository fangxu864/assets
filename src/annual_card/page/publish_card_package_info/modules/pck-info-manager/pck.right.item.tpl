<% _.each(privilege,function(item,index,privilege){ %>
    <%
        var index = typeof item.index=="undefined" ? index : item.index;
        var nameFlag = pckId+"_"+index;
        var prod=item.product,tic=item.ticket,rule=item.rule;
        var prodId = prod.id,prodName=prod.name;
        var ticId = tic.id,ticName=tic.name,aid=tic.aid;
        var id = pckId+"_"+prodId+"_"+ticId;
        var attr = 'data-prodId="'+prodId+'" data-ticId="'+ticId+'" data-aid="'+aid+'" data-index="'+index+'"';
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
                    <input type="radio" checked id="useTimeRadio_total_<%=nameFlag%>" name="useTimeRadio_<%=nameFlag%>"/>
                    <label for="useTimeRadio_total_<%=nameFlag%>">不限</label>
                </div>
                <div class="limit">
                    <!--<div name="useTimeRadio_<%=nameFlag%>">-->
                        <input type="radio" id="useTimeCheckbox_total_<%=nameFlag%>" name="useTimeRadio_<%=nameFlag%>"/>
                        <label for="useTimeCheckbox_total_<%=nameFlag%>">
                            共 <input type="text" class="smaInp"> 次
                            <input type="text" class="smaInp"> 次/日
                            <input type="text" class="smaInp"> 次/月
                        </label>

                    <!--<div class="float-left">-->
                        <!--<input type="text" class="smaInp"> 次/日-->
                    <!--</div>-->
                    <!--<div class="float-left">-->
                        <!--<input type="text" class="smaInp"> 次/月-->
                    <!--</div>-->
                </div>
            </div>
        </div>
    </div>
    <div class="float-right border-left"><a href="javascript:void(0);" class="btn-del deleteProdBtn">×</a></div>
</li>
<% }) %>