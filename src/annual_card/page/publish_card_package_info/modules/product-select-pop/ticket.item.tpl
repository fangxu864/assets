<% _.each(tickets,function(item){ %>
<li data-id="<%=item.id%>" class="ticketItem">
    <input type="radio" name="ticketRadio" id="ticketRadio_<%=item.id%>"/>
    <label  for="ticketRadio_<%=item.id%>" class="t"><%=item.name%></label>
</li>
<% }) %>
