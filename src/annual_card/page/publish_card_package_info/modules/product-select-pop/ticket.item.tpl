<% _.each(tickets,function(item){ %>
<li data-id="<%=item.id%>" class="ticketItem">
    <label for="ticket"></label><input type="radio" id="ticket" name="ticketRadio"/>
    <label for="ticket"><span class="t"><%=item.name%></span></label>
</li>
<% }) %>
