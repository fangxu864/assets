!function(t){function e(n){if(a[n])return a[n].exports;var i=a[n]={exports:{},id:n,loaded:!1};return t[n].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var a={};return e.m=t,e.c=a,e.p="http://static.12301dev.com/assets/build/dev/",e(0)}([function(t,e,a){a(41);var n=a(43),i=Backbone.View.extend({el:$("#cardContainer"),events:{},initialize:function(){this.ListManager=new n}});$(function(){new i})},,,,,function(t,e){var a=function(){},n={Url:{PublishCardProd:{submit:"/r/product_scenic/save/",uploadFile:"/r/product_AnnualCard/uploadImg/",getInfo:"/r/product_scenic/get/"},PackageInfo:{updateTicket:"/r/product_ticket/UpdateTicket/",getPackageInfoList:"/r/product_ticket/ticket_attribute/",getLands:"/r/product_AnnualCard/getLands/",getTickets:"/r/product_AnnualCard/getTickets/",deleteTicket:"/route/index.php?c=product_ticket&a=set_status"},EntryCard:{getProdList:"/r/product_AnnualCard/getAnnualCardProducts/",createAnnualCard:"/r/product_AnnualCard/createAnnualCard/",getAnnualCards:"/r/product_AnnualCard/getAnnualCards/"},makeOrder:{getCardsForOrder:"/r/product_AnnualCard/getCardsForOrder/",getOrderInfo:"/r/product_AnnualCard/getOrderInfo/",isNeedToReplace:"/r/product_AnnualCard/isNeedToReplace/",submit:"/formSubmit_v01.php"},getVirtualStorage:"/r/product_AnnualCard/getVirtualStorage/",storage:{getList:"/r/product_AnnualCard/getAnnualCardStorage/",deleteAnnualCard:"/r/product_AnnualCard/deleteAnnualCard/"},ordersuccess:{getOrderDetail:"/r/product_AnnualCard/orderSuccess/"},active:{checkCard:"/r/product_AnnualCard/activeCheck/",getVCode:"/r/product_AnnualCard/sendVcode/",activateForPc:"/r/product_AnnualCard/activateForPc/"},mclist:{getList:"/r/product_AnnualCard/getMemberList/"},memdetail:{detail:"/r/product_AnnualCard/getMemberDetail/",history:"/r/product_AnnualCard/getHistoryOrder/"}},defaults:{type:"get",ttimout:6e4,loading:a,complete:a,success:a,fail:a,timeout:a,serverError:a}};t.exports=n},,,,,,,,,,function(t,e){var a={fn:{},on:function(t,e){var a=this.fn[t]||(this.fn[t]=[]);a.push(e)},fire:function(t){var e=this.fn[t];if(!e)return!1;var a,n,i=arguments,r=i.length;1==r?(a="",n=this):2==r?(a=i[r-1],n=this):3==r&&(a=i[r-2],n=i[r-1]);for(var s in e){var o=e[s];o.call(n,a)}},trigger:function(){this.fire.apply(this,arguments)}};t.exports=a},function(t,e){t.exports=function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a]);return t}},,,,,,,,,,,,,,,,,,,,,,function(t,e){var a=function(t,e){t=t||"请稍后...",e=e||{};var a=e.tag||"div";"td"==a&&(a="tr");var n=e.width+"px"||"100%",i=e.height||150,r=e.loadingImg||{},s=r.width||24,o=r.top||0,l=e.className||"",c=e.colspan||1,d=e.id||"",u="",h=e.css||{},p="";for(var g in h)p+=g+":"+h[g]+"; ";var v="http://static.12301.cc/assets/build/images/gloading.gif";return u+="<"+a+' id="'+d+'" style="width:'+n+"; height:"+i+"px; line-height:"+i+"px; text-align:center; "+p+'" class="'+l+'">',"tr"!=a&&"td"!=a||(u+='<td style="text-align:center" colspan="'+c+'">'),u+='<img style="width:'+s+"px; position:relative; top:"+o+'px; vertical-align:middle; margin-right:5px" src="'+v+'"/>',u+='<span class="t">'+t+"</span>","tr"!=a&&"td"!=a||(u+="</td>"),u+="</"+a+">"};t.exports=a},,,function(t,e){},,function(t,e,a){var n=a(44),i=a(38),r=a(5),s=a(45),o=a(46),l=a(50),c=a(51),d=Backbone.View.extend({el:$("#listSlideContainer"),events:{"click .doBtn":"onDoBtnClick"},paginations:{},tableTh:{1:["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况","操作"],0:["售出时间","虚拟卡号/实体卡号 ","发卡商户","激活情况","操作"],2:["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况","操作"],4:["会员号","会员手机号","虚拟卡号/实体卡号","发卡商户","激活情况","操作"]},PAGE_SIZE:15,initialize:function(t){t=t||{};var e=this;this.state=l,this.itemWidth=this.$el.width(),this.TabHeader=this.initTabHeader(),this.TabHeader.on("switch",function(t){var a=t.fromStatus,n=t.toStatus;e.active(a,n)}),this.TabHeader.on("searchBtnClick",function(t){var a=t.searchBtn;if(a.hasClass("disable"))return!1;var n=this.getCurrentState(),i=this.getKeyword();e.getList(n,1,i)}),this.statusArr=this.TabHeader.getStatus(),this.slideUl=this.$el.find(".slideUl"),this.slideUl.width(this.itemWidth*this.statusArr.length),this.buildSlideItem(this.statusArr),this.TabHeader.active(1)},template:_.template(s),initTabHeader:function(){return this.TabHeader=new c({state:l}),this.TabHeader},initPagination:function(t){var e=this;for(var a in t){var n=t[a];e.paginations[n]=new o({container:"#paginationContainer_"+n,keyup:!1,onNavigation:function(t){var a=(t.dir,t.fromPage,t.toPage),n=e.TabHeader.getKeyword(),i=e.TabHeader.getCurrentState();e.getList(i,a,n)}})}},onDoBtnClick:function(t){var e=$(t.currentTarget);return e.hasClass("disable")?!1:void(e.hasClass("loss")?this.doAction.loss.call(this,t):e.hasClass("inavail")&&this.doAction.inavail.call(this,t))},buildSlideItem:function(t){for(var e=this,a=_.template(n),i=this.tableTh,r="",s=0;s<t.length;s++){var o=t[s],l=i[o];r+=a({data:{width:e.itemWidth,status:o,ths:l,loading:""}})}this.slideUl.html(r),e.initPagination(t)},active:function(t,e){var a=$("#listItemLi_"+e),n=a.index(),i=this.state[t],r=this.state[e]||(this.state[e]={}),s=this.TabHeader.getSupplySelectVal(),o=this.TabHeader.getKeyword(),l=r.listData;i&&(i.supply=s),i&&(i.keyword=o);var c=r.supply,d=r.keyword||"";this.TabHeader.setKeyword(d),this.TabHeader.setSupplySelectVal(c),d?$("#clearSearchBtn").show():$("#clearSearchBtn").hide(),l||this.getList(e,1),this.slideUl.animate({left:-1*this.itemWidth*n},300)},getList:function(t,e,a){var n=this,s=$("#listItemLi_"+t).find(".tbody");PFT.Util.Ajax(r.Url.mclist.getList,{params:{status:t,page:e,page_size:n.PAGE_SIZE,identify:a},loading:function(){var a=300;1!=e&&(a=s.height()||300);var r=i("努力加载中，请稍后..",{tag:"tr",height:a,colspan:n.tableTh[t].length,css:{"text-align":"center"}});s.html(r),n.paginations[t].render(null)},complete:function(){},success:function(e){e=e||{};var a=e.data||{};if(200==e.code){var i=a.list;if(i){n.state[t]=n.state[t]||(n.state[t]={}),n.state[t].listData=1;var r=n.template({data:{status:t,list:i,colspan:n.tableTh[t].length}});$("#tbody_"+t).html(r)}else alert("请求出错，缺少list对象");var s=a.page,o=a.total_page,l=a.total||0;n.TabHeader.setCount(t,l),n.paginations[t].render({current:s,total:o})}else alert(e.msg||PFT.AJAX_ERROR_TEXT)}})},doAction:{loss:function(t){},inavail:function(t){}}});t.exports=d},function(t,e){t.exports='<li style="width:<%=data.width%>px" id="listItemLi_<%=data.status%>" class="listItemLi listItemLi_<%=data.status%>">\r\n    <table id="listItemTable_<%=data.status%>" class="listItemTable listItemTable_<%=data.status%>">\r\n        <thead>\r\n        <tr>\r\n            <%_.each(data.ths,function(item,index){%>\r\n            <th><%=item%></th>\r\n            <% }) %>\r\n        </tr>\r\n        </thead>\r\n        <tbody id="tbody_<%=data.status%>" class="tbody tbody_<%=data.status%>">\r\n            <tr style="text-align:center">\r\n                <td colspan="<%=data.ths.length%>" style="text-align:center; border-bottom:0 none"><%=data.loading%></td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n    <div id="paginationContainer_<%=data.status%>" class="paginationContainer"></div>\r\n</li>\r\n'},function(t,e){t.exports='<%\r\n   var status = data.status;\r\n   var list = data.list;\r\n   var colspan = data.colspan;\r\n%>\r\n<% if(list.length){ %>\r\n    <% _.each(list,function(item,index){ %>\r\n        <% var cls = (index+1)%2==0 ? "even" : "odd"; %>\r\n        <tr class="listItem <%=cls%>">\r\n            <% if(status==0){ %>\r\n                <td><%=item.sale_time%></td>\r\n            <% }else{ %>\r\n                <td><%=item.account%></td>\r\n                <td><%=item.mobile%></td>\r\n            <% } %>\r\n            <td><%=item.virtual_no%> / <%=item.card_no%></td>\r\n            <td><%=item.supply%></td>\r\n            <td><%={"1":"正常","0":"未激活","2":"禁用","4":"挂失"}[item.status]%></td>\r\n            <td class="font-blue doAction">\r\n                <% if(item.status==0){ %>\r\n                    <span class="color:#ccc">--</span>\r\n                <% }else{ %>\r\n                    <a style="margin-right:8px" class="doBtn detail" target="_blank" href="annual_memdetail.html?id=<%=item.memberid%>">查看</a>\r\n                <% } %>\r\n                <a style="display:none;margin-right:8px" class="doBtn loss" href="javascript:void(0);">挂失</a>\r\n                <a style="display:none" href="javascript:void(0);" class="doBtn inavail">禁用</a>\r\n            </td>\r\n        </tr>\r\n    <% }) %>\r\n<% }else{ %>\r\n    <tr>\r\n        <td colspan="<%=colspan%>" style="height:300px; text-align:center">查无匹配内容...</td>\r\n    </tr>\r\n<% } %>'},function(t,e,a){function n(t){this.opt=$.extend(i,t||{}),this.init(this.opt)}a(47);var i={container:"",onNext:function(){},onPrev:function(){},onNavigation:function(){},keyup:!1};n.prototype={init:function(t){var e=this;this.tpl=a(49),this.container="string"==typeof t.container?$("#"+t.container.replace(/#/,"")):t.container,this.container.hide().html(this.tpl),this.currentPage=this.container.find(".whichPageInp"),this.totalPage=this.container.find(".totalPageInp"),this.nextBtn=this.container.find(".nextPageBtn"),this.prevBtn=this.container.find(".prevPageBtn"),t.keyup&&($(document).on("keyup",function(t){e.onKeyupToNav(t)}),this.container.find(".keyupTip").show()),this.container.on("click",".navBtn",function(t){e.onNavBtnClick(t)})},onNavBtnClick:function(t){var e=$(t.currentTarget);if(e.hasClass("disable"))return!1;var a=1*this.currentPage.text(),n=e.hasClass("next")?"next":"prev",i=e.hasClass("next")?a+1:a-1,r={dir:n,fromPage:a,toPage:i};"next"==n?(this.opt.onNavigation(r),this.opt.onNext(r),PFT.Util.PubSub.fire("navigation",r),PFT.Util.PubSub.fire("next",r)):(this.opt.onNavigation(r),this.opt.onPrev(r),PFT.Util.PubSub.fire("navigation",r),PFT.Util.PubSub.fire("prev",r))},onKeyupToNav:function(t){var e=t.keyCode,a=this.nextBtn,n=this.prevBtn,i=1*this.currentPage.text(),r=null;39!=e||a.hasClass("disable")?37!=e||n.hasClass("disable")||(r={dir:"next",fromPage:i,toPage:i-1},this.opt.onNavigation(r),this.opt.onPrev(r),PFT.Util.PubSub.fire("navigation",r),PFT.Util.PubSub.fire("prev",r)):(r={dir:"next",fromPage:i,toPage:i+1},this.opt.onNavigation(r),this.opt.onNext(r),PFT.Util.PubSub.fire("navigation",r),PFT.Util.PubSub.fire("next",r))},on:function(t,e){return t?(e="function"==typeof e?e:function(){},void PFT.Util.PubSub.on(t,e)):!1},show:function(){this.container.show()},hide:function(){this.container.hide()},getValue:function(){return{current:this.currentPage.text(),total:this.totalPage.text()}},render:function(t){if(!t)return this.nextBtn.addClass("disable"),this.prevBtn.addClass("disable"),void this.hide();var e=1*t.total,a=1*t.current,n=this.totalPage,i=this.currentPage,r=this.nextBtn,s=this.prevBtn;return 0==e?(this.nextBtn.addClass("disable"),this.prevBtn.addClass("disable"),void this.hide()):(this.show(),n.text(e),i.text(a),void(e>a?(1!=a?s.removeClass("disable"):s.addClass("disable"),r.removeClass("disable")):(1!=a?s.removeClass("disable"):s.addClass("disable"),r.addClass("disable"))))}},t.exports=n},function(t,e){},,function(t,e){t.exports='<div class="navigationBar">\r\n    <div class="navCon">\r\n        <a href="javascript:void(0)" class="navBtn next nextPageBtn disable"><span class="iconfont">&#xe60d;</span></a>\r\n        <a href="javascript:void(0)" class="prevPageBtn navBtn prev disable"><span class="iconfont">&#xe60c;</span></a>\r\n        <div class="which">\r\n            <span class="whichPageInp pagenum">1</span>\r\n            <span class="var"> / </span>\r\n            <span class="totalPageInp pagenum">1</span>\r\n        </div>\r\n    </div>\r\n    <p style="display:none" class="tip keyupTip">亲，可以使用键盘前后方向键来翻页哟</p>\r\n</div>'},function(t,e,a){var n=a(16),i=a(15),r=n({},i);t.exports=r},function(t,e,a){var n=a(50),i=Backbone.View.extend({el:$("#tahHeaderContainer"),events:{"click .cardType":"onCardTypeClick","click #searchBtn":"onSearchBtnClick","click #clearSearchBtn":"onClearSearchBtnClick","keyup #searchInp":"onSearchInpKeyup","focus #searchInp":"onSearchInpFocus"},initialize:function(t){this.state=t.state,this.searchInp=$("#searchInp"),this.searchBtn=$("#searchBtn"),this.clearSearchBtn=$("#clearSearchBtn")},onCardTypeClick:function(t){var e=$(t.currentTarget);if(e.hasClass("active"))return!1;var a=this.$el.find(".cardType").filter(".active"),n=a.length?a.attr("data-status"):-1,i=e.attr("data-status");e.addClass("active").siblings().removeClass("active"),this.trigger("switch",{fromStatus:n,toStatus:i})},onSearchBtnClick:function(t){var e=$(t.currentTarget);return e.hasClass("disable")?!1:void this.trigger("searchBtnClick",{searchBtn:e})},onSearchInpFocus:function(t){var e=$.trim($(t.currentTarget).val());e?this.clearSearchBtn.show():this.clearSearchBtn.hide()},onSearchInpKeyup:function(t){var e=$(t.currentTarget),a=$.trim(e.val());a?this.clearSearchBtn.show():this.clearSearchBtn.hide()},onClearSearchBtnClick:function(t){var e=$(t.currentTarget),a=this.getCurrentState(),i=n[a]||(n[a]={}),r=this.searchInp;i.keyword="",r.val(""),this.trigger("searchBtnClick",{searchBtn:this.searchBtn}),e.hide()},active:function(t){this.$el.find(".cardType[data-status="+t+"]").trigger("click")},getStatus:function(){var t=[];return this.$el.find(".cardType").each(function(){var e=$(this),a=e.attr("data-status");t.push(a)}),t},setCount:function(t,e){return 2!=arguments.length?!1:void $("#cardTypeTab_"+t).find(".num").css("display","inline").text("（"+e+"）")},getKeyword:function(){return $.trim(this.searchInp.val())},setKeyword:function(t){this.searchInp.val(t)},getSupplySelectVal:function(){return $("#supplySelect").val()},setSupplySelectVal:function(t){$("#supplySelect").val(t)},getCurrentState:function(){return this.$el.find(".cardType").filter(".active").attr("data-status")}});t.exports=i}]);