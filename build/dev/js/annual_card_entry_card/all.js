!function(t){function e(r){if(i[r])return i[r].exports;var n=i[r]={exports:{},id:r,loaded:!1};return t[r].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var i={};return e.m=t,e.c=i,e.p="http://static.12301dev.com/assets/build/dev/",e(0)}([function(t,e,i){i(13);var r=(PFT.Util.PubSub,i(15)),n=i(16),a=i(17),s=i(21),o=i(12),c=Backbone.View.extend({el:$("body"),events:{"click #relateSHCardBtn":"onRelateSHCardBtnClick","click #clearAllListBtn":"onClearAllListClick","click #submitBtn":"onSubmit"},initialize:function(){var t=this;this.Header=new r,this.List=new n,this.Dialog=new a({List:this.List}),this.Header.on("create.card",function(e){var i=e.cards;t.List.render(i)}),this.cardList=$("#cardList"),this.Select=new s({trigger:$("#cardProdTriggerInput"),source:o.Url.EntryCard.getProdList+"?page=1&page_size=1000",height:400,field:{id:"id",name:"p_name"},adaptor:function(t){t=t||{};var e=t.data||{},i=e.list||[];return i}}),$(".arrowup").hide(),this.Select.on("open",function(){$("#card_headerContaienr").addClass("select-on"),$(".arrowdown").hide(),$(".arrowup").show()}),this.Select.on("close",function(){$("#card_headerContaienr").removeClass("select-on"),$(".arrowdown").show(),$(".arrowup").hide()})},onRelateSHCardBtnClick:function(t){var e=this.cardList;return 0==e.children(".cardItem").length?alert("请先生成卡号"):void this.Dialog.open(function(){var t=0,i=0;e.children().each(function(){var e=$(this),r=e.find(".card").text(),n=e.find(".physics").text();"--"==r&&(r=""),"--"==n&&(n=""),t+=1,r&&r&&(i+=1)}),$("#hasRelatedCount").text(i),$("#totalRelatedCount").text(t)})},onClearAllListClick:function(t){return 0==this.cardList.children().length?!1:confirm("确定要清空卡片列表吗？")?void this.cardList.html(""):!1},onSubmit:function(t){var e=$(t.currentTarget);if(e.hasClass("disable"))return!1;var i=this.Select.getValue().id;if(!i)return alert("缺少年卡产品id");var r=[];return this.cardList.children().each(function(){var t=$(this),e=t.find(".virtual").text(),i=t.find(".card").text(),n=t.find(".physics").text();"--"==i&&(i=""),"--"==n&&(n=""),r.push({virtual_no:e,card_no:i,physics_no:n})}),0==r.length?!1:void PFT.Util.Ajax(o.Url.EntryCard.createAnnualCard,{type:"post",params:{pid:i,list:r},loading:function(){e.addClass("disable")},complete:function(){e.removeClass("disable")},success:function(t){t=t||{};var e=t.code;200==e?PFT.Util.STip("success",'<p style="width:200px">发卡成功</p>'):alert(t.msg||PFT.AJAX_ERROR_TEXT)}})}});$(function(){new c})},,,,,,,,function(t,e){t.exports=function(){var t={width:0,height:0};return window.innerWidth?(t.width=window.innerWidth,t.height=window.innerHeight):document.documentElement&&document.documentElement.clientWidth?(t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight):(t.width=document.body.clientWidth,t.height=document.body.clientHeight),t}},,,,function(t,e){var i=function(){},r={Url:{PublishCardProd:{submit:"/r/product_scenic/save/",uploadFile:"/r/product_AnnualCard/uploadImg/",getInfo:"/r/product_scenic/get/"},PackageInfo:{updateTicket:"/r/product_ticket/UpdateTicket/",getPackageInfoList:"/r/product_ticket/ticket_attribute/",getLands:"/r/product_AnnualCard/getLands/",getTickets:"/r/product_AnnualCard/getTickets/",deleteTicket:"/route/index.php?c=product_ticket&a=set_status"},EntryCard:{getProdList:"/r/product_AnnualCard/getAnnualCardProducts/",createAnnualCard:"/r/product_AnnualCard/createAnnualCard/",getAnnualCards:"/r/product_AnnualCard/getAnnualCards/",deleteAnnualCard:"/r/product_AnnualCard/deleteAnnualCard/"},makeOrder:{getCardsForOrder:"/r/product_AnnualCard/getCardsForOrder/",getOrderInfo:"/r/product_AnnualCard/getOrderInfo/"},getVirtualStorage:"/r/product_AnnualCard/getVirtualStorage/"},defaults:{type:"get",ttimout:6e4,loading:i,complete:i,success:i,fail:i,timeout:i,serverError:i}};t.exports=r},function(t,e){},,function(t,e){var i=Backbone.View.extend({el:$("#card_headerContaienr"),events:{"click #createCardListBtn":"onCreateCardListBtnClick","keyup #cardCountInp":"onCardCountInpKeyup"},MAX_COUNT:50,initialize:function(){this.cardCountInp=$("#cardCountInp"),this.cardListUl=$("#cardList")},onCreateCardListBtnClick:function(t){var e=this,i=$.trim(this.cardCountInp.val());if(!PFT.Util.Validate.typeInit0(i))return alert("生成数量请填写正整数");if(i>this.MAX_COUNT)return alert("单次最多只能生成"+this.MAX_COUNT+"张");if(this.cardListUl.children(".cardItem").length)return alert("请先将已生成的卡保存，方可再次生成新卡");for(var r=[],n=0;i>n;n++)r.push(e.createCardNumber());this.trigger("create.card",{cards:r})},onCardCountInpKeyup:function(t){13==t.keyCode&&$("#createCardListBtn").trigger("click")},onRelateSHCardBtnClick:function(t){this.trigger("onRelateSHCardBtnClick")},createCardNumber:function(){var t=[];t.push(this.randomWord("letter",!1,1,1)),t.push(this.randomWord("both",!1,1,1)),t.push(this.randomWord("both",!1,1,1)),t.push(this.randomWord("both",!1,1,1)),t.push(this.randomWord("number",!1,1,1)),t.push(this.randomWord("number",!1,1,1)),t.push(this.randomWord("number",!1,1,1));var e=0;for(var i in t){var r=t[i];PFT.Util.Validate.typeInit0(r)&&(e+=1*r)}return e+="",e=e.substr(e.length-1),t.push(e),t.join("")},randomWord:function(t,e,i,r){var n="",a=i,s=[];s="letter"==t?["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]:"number"==t?["0","1","2","3","4","5","6","7","8","9"]:["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],e&&(a=Math.round(Math.random()*(r-i))+i);for(var o=0;a>o;o++){var c=Math.round(Math.random()*(s.length-1));n+=s[c]}return n}});t.exports=i},function(t,e){var i=Backbone.View.extend({el:$("#cardList"),events:{"click .deleteBtn":"onDeleteBtnClick"},initialize:function(){},onDeleteBtnClick:function(t){if(!confirm("是否确定删除该卡？"))return!1;var e=$(t.currentTarget);e.parents(".cardItem").remove()},render:function(t){var e="";for(var i in t){var r=t[i];e+='<tr class="cardItem"><td class="virtual">'+r+'</td><td class="card">--</td><td class="physics">--</td><td><a class="deleteBtn" href="javascript:void(0);">删除</a></td></tr>'}this.$el.html(e)}});t.exports=i},function(t,e,i){var r=i(18),n=i(8);i(19);var a=Backbone.View.extend({state:0,initialize:function(t){var e=this;this.List=t.List,this.dialogBox=this.createDialog(),this.mask=this.createMask(),this.readCardObj=document.getElementById("readCardObj"),this.readCardObj.OnReadEvent=function(t){alert("读卡事件"),alert(t)},this.readCardObj.OnErrorEvent=function(t){alert("读卡错误事件"),alert(t)},$("#readCardBtn").on("click",function(t){e.readwuKa(t)}),$("#dialogCloseBtn").on("click",function(t){e.close()}),$("#relateCardBtn").on("click",function(t){e.relateCard(t)})},relateCard:function(t){var e=$("#physic_no_Inp"),i=$("#cardNumberInput"),r=e.val(),n=$.trim(i.val());return r?n?(this.addCardToList(r,n),e.val(""),void i.val("")):alert("实体卡号不能为空"):alert("请先把卡放在读卡器上，然后点击读卡按钮")},addCardToList:function(t,e){if(!t)return!1;var i=!1,r=$("#cardList"),n=null;if(r.children().each(function(){var e=$(this),r=e.find(".physics").text();return"--"==r&&(r=""),""!=r||n||(n=e),r==t&&""!=r?(i=!0,!1):void 0}),i)return alert("此卡已关联过");n.find(".physics").text(t),n.find(".card").text(e);var a=$("#hasRelatedCount");a.text(1*a.text()+1)},readwuKa:function(t){var e=this.readCardObj;if(!e)return alert("请使用IE浏览器读物理卡号"),!1;if("number"!=typeof e.open&&"string"!=typeof e.ICReaderRequest)return alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件"),!1;e.open();var i=e.ICReaderRequest();$("#physic_no_Inp").val(i)},createDialog:function(){return this.dialogBox?this.dialogBox:(this.dialogBox=$('<div style="display:none; float:left" class="dialogBoxContainer"></div>'),this.dialogBox.append(r),$("body").append(this.dialogBox),this.dialogBox)},createMask:function(){return this.mask?this.mask:(this.mask=$('<div style="display:none" class="dialogMask"></div>'),$("body").append(this.mask),this.mask)},position:function(t){var e=t.width(),i=t.height(),r=n();t.css({position:"fixed",left:(r.width-e)/2,top:(r.height-i)/2-.1*(r.height-i)})},slide:function(t){var e=$("#dialog-slideStage"),i=e.height(),r=e.children(".slideCon"),n=r.css("top");n=1*n.substr(0,n.length-2);var a=0==n?-1:0;r.animate({top:a*i},100,function(){t&&t()})},open:function(t){return 1==this.state?!1:(this.state=1,this.dialogBox.show().css({zIndex:100}),this.mask.show().css({zIndex:99}),this.position(this.dialogBox),$("#dialog-slideStage").children(".slideCon").css({top:0}),void(t&&t()))},close:function(t){this.state=0,this.dialogBox.hide().css({zIndex:-1}),this.mask.hide().css({zIndex:-1}),t&&t()}});t.exports=a},function(t,e){t.exports='<div class="dialogBoxContainerCon">\r\n    <div class="charge border" id="chaBox">\r\n        <div id="dialog-slideStage" class="slideStage">\r\n            <div style="top:0px" class="slideCon">\r\n                <!--<div style="margin-top:18px" class="cha slideItem">-->\r\n                    <!--<h1 class="entry">请刷卡！</h1>-->\r\n                    <!--<h2 style="display:none" id="cardExitTip" class="font-red">已存在</h2>-->\r\n                <!--</div>-->\r\n                <div class="cha slideItem">\r\n                    <object classid="clsid:b1ee5c7f-5cd3-4cb8-b390-f9355defe39a" width="0" height="0" id="readCardObj"></object>\r\n                    <p style="margin-bottom:10px" class="font-gray line-40">\r\n                        物理ID：<input readonly="" type="text" name="" id="physic_no_Inp"/>\r\n                        <a href="javascript:void(0)" style="color:#008EC1" id="readCardBtn">读卡</a>\r\n                    </p>\r\n                    <div class="relaBox">\r\n                        <input id="cardNumberInput" type="text" placeholder="请输入实体卡号（卡面号码）" class="guanInp"/>\r\n                        <a id="relateCardBtn" href="javascript:void(0);" class="btn btn-orange">关联</a>\r\n                    </div>\r\n                    <p style="color:#bfbfbf; margin-top:5px;">请确保填写的卡号确认无误！</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="enCard">\r\n            <span>已关联实体卡:\r\n                <span id="hasRelatedCount" class="numChild">2</span><i class="letr">/</i><span id="totalRelatedCount" class="numP">10</span><span class="font-gray">（不关联实体卡亦可）</span></span>\r\n            <a id="dialogCloseBtn" href="javascript:void(0);" class="btn btn-5x btn-blue btn-finish closeBtn">关闭</a>\r\n        </div>\r\n    </div>\r\n    <!--<div style="display:none;" class="charge border" id="guanBox">-->\r\n        <!--<a href="javascript:void(0);" class="btn-del" style="color:#ccc">×</a>-->\r\n        <!--<div class="cha border-bottom">-->\r\n            <!--<p class="font-gray line-40">物理ID:565666</p>-->\r\n            <!--<div class="relaBox">-->\r\n                <!--<input type="text" placeholder="请输入实体卡号（卡面号码）"class="guanInp"/>-->\r\n                <!--<a href="javascript:;" class="btn btn-orange">关联</a>-->\r\n            <!--</div>-->\r\n        <!--</div>-->\r\n        <!--<div class="enCard">-->\r\n            <!--<span>已关联实体卡:<span class="numChild">2</span><span class="numP">/10</span><span class="font-gray">（不关联实体卡亦可）</span></span>-->\r\n            <!--<a href="javascript:;" class="btn btn-5x btn-blue btn-finish">完成</a>-->\r\n        <!--</div>-->\r\n    <!--</div>-->\r\n</div>'},function(t,e){},,function(t,e,i){function r(t){var t=this.opt=$.extend({},n,t);this.init(t)}i(22);var n={trigger:null,field:{id:"id",name:"name"},filter:!0,height:200,source:"",offset:{top:0,left:0,width:0},tpl:function(){return i(24)},adaptor:function(t){t=t||{};var e=(t.code,t.data||[]);return e},data:null};r.prototype={__cacheData:null,keyupTimer:null,current_id:"",current_name:"",init:function(t){var e=this.trigger="string"==typeof t.trigger?$("#"+t.trigger.substr(t.trigger.indexOf("#")+1)):t.trigger,i=this.source=t.source;return e.length&&(i||t.data)?(this.selectBox=this.createSelectBox(),this.mask=this.createMask(),this.searchInp=this.selectBox.find(".gSelectSearchInp"),this.clearSearchBtn=this.selectBox.find(".clearSearchBtn"),this.listUl=this.selectBox.find(".selectOptionUl"),this.position(),this.bindEvents(),t.data&&(this.__cacheData=t.data,this.listUl.html(this.updateListUl(t.data))),this.opt.source&&!this.opt.data&&null==this.__cacheData&&this.fetchData(this.opt.source),void(t.filter||this.selectBox.addClass("no-search"))):!1},bindEvents:function(){var t=this;this.trigger.on("click",function(e){t.trigger.toggleClass("select-on"),t.trigger.hasClass("select-on")?t.open():t.close()}),this.mask.on("click",function(){t.close()}),this.searchInp.on("keyup",function(e){return t.opt.filter?void t.onSearchInpChange(e):!1}),this.clearSearchBtn.on("click",function(e){$(e.currentTarget).hide(),t.searchInp.val("").focus();var i=t.renderListHtml(t.__cacheData);t.listUl.html(i)}),this.listUl.on("click",".gSelectOptionItem",function(e){t.onOptionItemClick(e)})},onOptionItemClick:function(t){var e=this,i=$(t.currentTarget);if(!i.hasClass("gSelectOptionItem"))return!1;var r=e.opt.field,n=r.id,a=r.name,s=i.attr("data-"+n),o=i.find(".t").text(),c={};c[n]=s,c[a]=o,e.current_id=s,e.current_name=o,e.trigger.attr("data-"+n,s).attr("data-"+a,o),"INPUT"==e.trigger[0].nodeName.toUpperCase()?e.trigger.val(o):e.trigger.text(o),e.close(),i.addClass("active").siblings().removeClass("active"),PFT.Util.PubSub.trigger("option.click",c)},onSearchInpChange:function(t){var e=this;clearTimeout(this.keyupTimer),this.keyupTimer=setTimeout(function(){var i=$.trim($(t.currentTarget).val()),r=e.filter(i);""==i?e.clearSearchBtn.hide():e.clearSearchBtn.show();var n=e.renderListHtml(r);e.listUl.html(n)},200)},filter:function(t){if("function"==typeof this.opt.filter)return this.opt.filter(this.__cacheData,t);var e=[],i=this.__cacheData,r=this.opt.field,n=r.name;if(!t||""==t)return i;if("loading"==i||"error"==i||null==i||"empty"==i)return e;for(var a in i){var s=i[a],o=s[n];o.indexOf(t)>-1&&e.push(s)}return e},createSelectBox:function(){if(this.selectBox)return this.selectBox;var t=this.opt.tpl(),e=this.opt,i=e.trigger.outerWidth()+(e.offset.width||0),r=e.height,n=this.selectBox=$('<div style="display:none;width:'+i+"px;height:"+r+'px" class="gSelectDownBox"></div>');return n.append(t),$("body").append(n),this.selectBox},createMask:function(){return this.mask?this.mask:(this.mask=$('<div style="display:none" class="gSelectMask"></div>'),$("body").append(this.mask),this.mask)},updateListUl:function(t){var e=this.renderListHtml(t);this.listUl.html(e),this.listUl.children().first().trigger("click")},renderListHtml:function(t,e){var i="",r=e||PFT.AJAX_ERROR_TEXT;if("[object Array]"==Object.prototype.toString.call(t)){var n=this.opt.field,a=n.id,s=n.name;for(var o in t){var c=t[o],l=c[a],d=c[s];i+="<li data-"+a+'="'+l+'" class="gSelectOptionItem"><span class="t">'+d+"</span></li>"}i||(i='<li class="status empty">无匹配选项</li>')}else switch(t){case null:i="";break;case"loading":i='<li class="status loading">努力加载中，请稍后...</li>';break;case"fail":i='<li class="status fail">'+r+"</li>";break;case"timeout":i='<li class="status timeout">'+PFT.AJAX_TIMEOUT_TEXT+"</li>";break;case"error":i='<li class="status error">'+PFT.AJAX_TIMEOUT_TEXT+"</li>"}return i},position:function(){var t=this.trigger,e=this.createSelectBox(),i=t.offset(),r=this.opt.offset,n=t.outerHeight(!0);e.css({left:i.left+(r.left||0),top:i.top+n+(r.top||0)})},fetchData:function(t){var e=this;PFT.Util.Ajax(t,{type:"get",dataType:"json",loading:function(){e.opt.__cacheData="loading",e.updateListUl("loading")},complete:function(){e.opt.__cacheData="",e.updateListUl(null)},success:function(t){t=t||{};var i=t.code,r=e.opt.adaptor(t);200==i?(e.__cacheData=r,e.updateListUl(r)):(e.__cacheData="error",e.updateListUl("error"))},error:function(){e.opt.__cacheData="error",e.updateListUl("error")}})},open:function(t){this.createMask().show(),this.createSelectBox().show(),this.trigger.addClass("select-on"),PFT.Util.PubSub.trigger("open"),t&&t()},close:function(t){this.mask.hide(),this.selectBox.hide(),this.trigger.removeClass("select-on"),PFT.Util.PubSub.trigger("close"),t&&t()},getValue:function(){return{id:this.current_id,name:this.current_name}},on:function(t,e){return t?(e="function"==typeof e?e:function(){},void PFT.Util.PubSub.on(t,e)):!1}},t.exports=r},function(t,e){},,function(t,e){t.exports='<div class="gSelectDownBoxCon">\r\n    <div class="selectTopCon">\r\n        <div class="searchBox">\r\n            <div class="searchBoxCon">\r\n                <input type="text" name="" class="gSelectSearchInp"/>\r\n                <i class="iconfont search">&#xe60a;</i>\r\n                <span class="clearSearchBtn"><i class="iconfont">&#xe674;</i></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <ul class="selectOptionUl"></ul>\r\n</div>\r\n\r\n'}]);