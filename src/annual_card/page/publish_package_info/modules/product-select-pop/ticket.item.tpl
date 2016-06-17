<% _.each(tickets,function(item,index){ %>
<% var aid = item.apply_did; %>
<li data-id="<%=item.id%>" class="ticketItem">
    <% var checked = index==0 ? "checked" : ""; %>
    <input data-ticid="<%=item.id%>" class="prodSelect_ticketRadio" type="radio" name="prodSelect_ticketRadio" id="ticketRadio_<%=item.id%>"  <%=checked%> />
    <label  for="ticketRadio_<%=item.id%>" class="t"><%=item.title%></label>
</li>
<% }) %>
