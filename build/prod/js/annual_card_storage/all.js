!function(t){function e(n){if(a[n])return a[n].exports;var r=a[n]={exports:{},id:n,loaded:!1};return t[n].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var a={};return e.m=t,e.c=a,e.p="http://static.12301.cc/assets/build/prod/",e(0)}({0:function(t,e,a){a(86);var n=a(88),r=a(5),i=a(52),s=Backbone.View.extend({el:$("#cardContainer"),__cache:{},template:_.template(n),events:{"click .deleteBtn":"onDeleteBtnClick"},initialize:function(){var t=this;this.listUl=$("#tbody"),this.pagination=new i({container:$("#paginationContainer"),keyup:!1}),this.pagination.on("next",function(e){var a=e.toPage;t.getAnnualCardList(a)}),this.pagination.on("prev",function(e){var a=e.toPage;t.getAnnualCardList(a)}),this.pid=PFT.Util.UrlParse().pid||"",this.getAnnualCardList(1)},onDeleteBtnClick:function(t){var e=$(t.currentTarget);if(e.hasClass("disable"))return!1;var a=e.attr("data-virtual");return a?void this.deleteAnnualCard(a,e):alert("缺少虚拟卡号")},getAnnualCardList:function(t,e){var a=this,n=this.pid;if(!n)return alert("缺少产品id");t=t||1,e=e||20;var i=this.__cache[t];i?(a.updateListUl(i.cards),this.pagination.render({current:i.page,total:i.total_page})):PFT.Util.Ajax(r.Url.storage.getList,{params:{pid:n,page:t,page_size:e},loading:function(){a.updateListUl("loading")},complete:function(){a.listUl.html("")},success:function(e){e=e||{};var n=e.code,r=e.msg||PFT.AJAX_ERROR_TEXT,i=e.data,s=i.cards,o=i.page||1,l=i.total_page||0;200==n?(a.updateListUl(s),a.pagination.render({current:o,total:l}),a.__cache[t]=i,1==t&&($("#cardStorage_num").text(i.physics),$("#virtualStorage_num").text(i.virtual),$("#titleText").text(i.title))):a.updateListUl(r)}})},deleteAnnualCard:function(t,e){var a=this;return t&&confirm("确定要删除此卡片吗？")?void PFT.Util.Ajax(r.Url.storage.deleteAnnualCard,{params:{virtual_no:t},loading:function(){e.addClass("disable").text("正在删除..")},complete:function(){e.removeClass("disable").text("删除")},success:function(n){n=n||{};var r=n.code,i=n.msg||PFT.AJAX_SERVER_ERROR_TEXT;if(200==r){PFT.Util.STip("success",'<p style="width:200px">删除成功</p>'),e.parents(".listItem").remove();var s=a.pagination.getValue().current;a.removeCacheItem(s,t)}else alert(i)}}):!1},removeCacheItem:function(t,e){var a=this,n=this.__cache;if(!n)return!1;if(n=n[t],!n)return!1;var r=n.cards;for(var i in r){var s=r[i],o=s.virtual_no;o==e&&a.__cache[t].cards.splice(i,1)}},updateListUl:function(t){var e=this.template({data:t});this.listUl.html(e)}});$(function(){new s})},5:function(t,e){var a=function(){},n={Url:{PublishCardProd:{submit:"/r/product_scenic/save/",uploadFile:"/r/product_AnnualCard/uploadImg/",getInfo:"/r/product_scenic/get/"},PackageInfo:{updateTicket:"/r/product_ticket/UpdateTicket/",getPackageInfoList:"/r/product_ticket/ticket_attribute/",getLands:"/r/product_AnnualCard/getLands/",getTickets:"/r/product_AnnualCard/getTickets/",deleteTicket:"/route/index.php?c=product_ticket&a=set_status"},EntryCard:{getProdList:"/r/product_AnnualCard/getAnnualCardProducts/",createAnnualCard:"/r/product_AnnualCard/createAnnualCard/",getAnnualCards:"/r/product_AnnualCard/getAnnualCards/"},makeOrder:{getCardsForOrder:"/r/product_AnnualCard/getCardsForOrder/",getOrderInfo:"/r/product_AnnualCard/getOrderInfo/",isNeedToReplace:"/r/product_AnnualCard/isNeedToReplace/",submit:"/formSubmit_v01.php"},getVirtualStorage:"/r/product_AnnualCard/getVirtualStorage/",storage:{getList:"/r/product_AnnualCard/getAnnualCardStorage/",deleteAnnualCard:"/r/product_AnnualCard/deleteAnnualCard/"},ordersuccess:{getOrderDetail:"/r/product_AnnualCard/orderSuccess/"},active:{checkCard:"/r/product_AnnualCard/activeCheck/",getVCode:"/r/product_AnnualCard/sendVcode/",activateForPc:"/r/product_AnnualCard/activateForPc/"},mclist:{getList:"/r/product_AnnualCard/getMemberList/"},memdetail:{detail:"/r/product_AnnualCard/getMemberDetail/",history:"/r/product_AnnualCard/getHistoryOrder/"}},defaults:{type:"get",ttimout:6e4,loading:a,complete:a,success:a,fail:a,timeout:a,serverError:a}};t.exports=n},52:function(t,e,a){function n(t){this.opt=$.extend(r,t||{}),this.init(this.opt)}a(53);var r={container:"",onNext:function(){},onPrev:function(){},onNavigation:function(){},keyup:!1};n.prototype={init:function(t){var e=this;this.tpl=a(55),this.container="string"==typeof t.container?$("#"+t.container.replace(/#/,"")):t.container,this.container.hide().html(this.tpl),this.currentPage=this.container.find(".whichPageInp"),this.totalPage=this.container.find(".totalPageInp"),this.nextBtn=this.container.find(".nextPageBtn"),this.prevBtn=this.container.find(".prevPageBtn"),t.keyup&&($(document).on("keyup",function(t){e.onKeyupToNav(t)}),this.container.find(".keyupTip").show()),this.container.on("click",".navBtn",function(t){e.onNavBtnClick(t)})},onNavBtnClick:function(t){var e=$(t.currentTarget);if(e.hasClass("disable"))return!1;var a=1*this.currentPage.text(),n=e.hasClass("next")?"next":"prev",r=e.hasClass("next")?a+1:a-1,i={dir:n,fromPage:a,toPage:r};"next"==n?(this.opt.onNavigation(i),this.opt.onNext(i),PFT.Util.PubSub.fire("navigation",i),PFT.Util.PubSub.fire("next",i)):(this.opt.onNavigation(i),this.opt.onPrev(i),PFT.Util.PubSub.fire("navigation",i),PFT.Util.PubSub.fire("prev",i))},onKeyupToNav:function(t){var e=t.keyCode,a=this.nextBtn,n=this.prevBtn,r=1*this.currentPage.text(),i=null;39!=e||a.hasClass("disable")?37!=e||n.hasClass("disable")||(i={dir:"next",fromPage:r,toPage:r-1},this.opt.onNavigation(i),this.opt.onPrev(i),PFT.Util.PubSub.fire("navigation",i),PFT.Util.PubSub.fire("prev",i)):(i={dir:"next",fromPage:r,toPage:r+1},this.opt.onNavigation(i),this.opt.onNext(i),PFT.Util.PubSub.fire("navigation",i),PFT.Util.PubSub.fire("next",i))},on:function(t,e){return t?(e="function"==typeof e?e:function(){},void PFT.Util.PubSub.on(t,e)):!1},show:function(){this.container.show()},hide:function(){this.container.hide()},getValue:function(){return{current:this.currentPage.text(),total:this.totalPage.text()}},render:function(t){if(!t)return this.nextBtn.addClass("disable"),this.prevBtn.addClass("disable"),void this.hide();var e=1*t.total,a=1*t.current,n=this.totalPage,r=this.currentPage,i=this.nextBtn,s=this.prevBtn;return 0==e?(this.nextBtn.addClass("disable"),this.prevBtn.addClass("disable"),void this.hide()):(this.show(),n.text(e),r.text(a),void(e>a?(1!=a?s.removeClass("disable"):s.addClass("disable"),i.removeClass("disable")):(1!=a?s.removeClass("disable"):s.addClass("disable"),i.addClass("disable"))))}},t.exports=n},53:function(t,e){},55:function(t,e){t.exports='<div class="navigationBar">\r\n    <div class="navCon">\r\n        <a href="javascript:void(0)" class="navBtn next nextPageBtn disable"><span class="iconfont">&#xe60d;</span></a>\r\n        <a href="javascript:void(0)" class="prevPageBtn navBtn prev disable"><span class="iconfont">&#xe60c;</span></a>\r\n        <div class="which">\r\n            <span class="whichPageInp pagenum">1</span>\r\n            <span class="var"> / </span>\r\n            <span class="totalPageInp pagenum">1</span>\r\n        </div>\r\n    </div>\r\n    <p style="display:none" class="tip keyupTip">亲，可以使用键盘前后方向键来翻页哟</p>\r\n</div>'},86:function(t,e){},88:function(t,e){t.exports='<% if(Object.prototype.toString.call(data)=="[object Array]"){ %>\r\n    <% if(data.length){ %>\r\n        <% _.each(data,function(item,index){ %>\r\n            <%\r\n                var create_time = new Date(item.create_time*1000);\r\n                var result = [];\r\n                var month = (create_time.getMonth()+1) * 1;\r\n                if(month<10) month = "0" + month;\r\n                result.push(create_time.getFullYear());\r\n                result.push(month);\r\n                result.push(create_time.getDate());\r\n                result = result.join("-");\r\n            %>\r\n            <tr data-id="<%=item.id%>" class="border-bottom listItem">\r\n                <td class="virtual"><%=item.virtual_no%></td>\r\n                <td class="card"><%=item.card_no%></td>\r\n                <td class="physics"><%=item.physics_no%></td>\r\n                <td class="createtime"><%=result%></td>\r\n                <td><a data-virtual="<%=item.virtual_no%>" href="javascript:void(0);" class="deleteBtn">删除</a></td>\r\n            </tr>\r\n        <% }) %>\r\n    <% }else{ %>\r\n        <tr class="status empty"><td style="height:150px; text-align:center" colspan="5">暂无卡片...</td></tr>\r\n    <% } %>\r\n<% }else if(data=="loading"){ %>\r\n    <tr class="status loading"><td style="height:150px; text-align:center" colspan="5">努力加载中...</td></tr>\r\n<% }else if(data=="timeout"){ %>\r\n    <tr class="status timeout"><td style="height:150px; text-align:center" colspan="5">请求超时，请稍后重试...</td></tr>\r\n<% }else if(data=="error"){ %>\r\n    <tr class="status error"><td style="height:150px; text-align:center" colspan="5">请求出错，请稍后重试...</td></tr>\r\n<% }else{ %>\r\n    <tr class="status fail"><td style="height:150px; text-align:center" colspan="5"><%=data%></td></tr>\r\n<% } %>\r\n'}});