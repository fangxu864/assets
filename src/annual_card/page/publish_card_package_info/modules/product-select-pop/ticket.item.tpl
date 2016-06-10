<% _.each(tickets,function(item,index){ %>
<li data-id="<%=item.id%>" class="ticketItem">
    <% var checked = index==0 ? "checked" : ""; %>
    <input data-ticid="<%=item.id%>" class="prodSelect_ticketRadio" <%=checked%> type="radio" name="prodSelect_ticketRadio" id="ticketRadio_<%=item.id%>"/>
    <label  for="ticketRadio_<%=item.id%>" class="t"><%=item.name%></label>
</li>
<% }) %>
