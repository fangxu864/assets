!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="http://static.12301dev.com/assets/build/dev/",e(0)}([function(t,e,n){n(1);var i=n(5),r=n(6),a=n(7),o=Backbone.View.extend({time:60,timer:null,el:$("#cardContainer"),events:{"click #readCardBtn":"onReadCardBtnClick","click #getVCodeBtn":"onGetVCodeBtnClick","click #activateBtn":"onActiveBtnClick","focus .textInp":"onTextInpFocus","keyup #cardInp":"onCardInpKeyup","click #clearCardInpBtn":"onClearCardInpBtnClick"},initialize:function(){var t=this;this.cardInp=$("#cardInp"),this.readCardBtn=$("#readCardBtn"),this.getVCodeBtn=$("#getVCodeBtn"),this.idCardInp=$("#idNum"),this.cardInfoBar=$("#cardInfoBar").hide(),this.mobileInp=$("#mobileInp"),this.vcodeInp=$("#vcodeInp"),this.memnameInp=$("#memnameInp"),this.submitBtn=$("#activateBtn"),this.ReadPhysicsCard=new r({id:"readCardObj"}),this.CheckExistDialog=new a,this.CheckExistDialog.on("replaceAndSubmit",function(e){t.submit("replace"),this.close()})},onGetVCodeBtnClick:function(t){var e=$(t.currentTarget);if(e.hasClass("unable"))return!1;var n=$.trim(this.mobileInp.val());return PFT.Util.Validate.typePhone(n)?void this.getVCode(n):alert("请填写正确格式手机号")},onActiveBtnClick:function(t){var e=$(t.currentTarget);if(e.hasClass("disable"))return!1;if(this.cardInfoBar.hasClass("error"))return!1;var n=this.cardInp.val();if(!n)return alert("物理卡号不能为空");var i=this.validator.mobile.call(this);if(!i)return!1;var r=this.validator.vcode.call(this);if(!r)return!1;var a=this.validator.idCard.call(this);return a?void this.submit():!1},onTextInpBlur:function(t){var e=this,n=$(t.currentTarget),i=n.attr("validator");if(!i)return!1;i=i.split("|");for(var r in i){var a=i[r].split(":"),o=a[0],d=a[1]?a[1].split(","):[],s=e.validator[o];s&&s.apply(e,d)}},onTextInpFocus:function(t){var e=$(t.currentTarget),n=e.attr("validator");return n?void("cardInp"==e.attr("id")?$("#cardInfoBar").removeClass("error").hide():e.siblings(".tip").removeClass("error").hide()):!1},onClearCardInpBtnClick:function(t){this.cardInp.val("").focus(),$(t.currentTarget).hide()},onCardInpKeyup:function(t){var e=$(t.currentTarget),n=e.val(),i=t.keyCode,r=$("#clearCardInpBtn");return 13!=i?!1:(n?r.show():r.hide(),void this.getCardInfo(n,"physics"))},validator:{mobile:function(){var t=this.mobileInp,e=$.trim(t.val()),n=t.siblings(".tip");return PFT.Util.Validate.typePhone(e)?(n.hide().removeClass("error"),!0):(n.show().addClass("error").text("请填写正确格式手机号"),!1)},vcode:function(){var t=this.vcodeInp,e=$.trim(t.val()),n=t.siblings(".tip");return e?(n.hide().removeClass("error"),!0):(n.show().addClass("error").text("请填写验证码"),!1)},idCard:function(){var t=this.idCardInp,e=$.trim(t.val()),n=t.siblings(".tip"),i=t.attr("data-require");return e&&!PFT.Util.Validate.idcard(e)||1==i&&!e?(n.show().addClass("error").text("请填写正确格式身份证"),!1):(n.removeClass("error").hide(),!0)}},getCardInfo:function(t,e){var n=this,r=this.readCardBtn,a=n.idCardInp;return t&&e?void PFT.Util.Ajax(i.Url.active.checkCard,{params:{identify:t,type:e},loading:function(){r.addClass("disable"),a.val(""),$("#loadingIcon").show()},complete:function(){r.removeClass("disable"),$("#loadingIcon").hide()},success:function(t){t=t||{};var e=t.data;if(200==t.code){var i=e.need_ID||"",r=e.virtual_no,o=e.physics_no,d=e.card_no;a.attr("validate","idCard:"+i),a.attr("data-requrie",i),1==i?$("#idCard-fontRed").show():$("#idCard-fontRed").hide(),n.cardInfoBar.show().removeClass("error").html("实体卡号："+d+"<i style='margin:0 10px'></i>虚拟卡号："+r+"<i style='margin:0 10px'></i>物理ID："+o)}else n.cardInfoBar.show().html(t.msg||PFT.AJAX_ERROR_TEXT).addClass("error")}}):!1},getVCode:function(t){var e=this,n=this.getVCodeBtn;PFT.Util.Ajax(i.Url.active.getVCode,{params:{mobile:t},loading:function(){n.addClass("unable").text("请稍后..")},success:function(t){if(t=t||{},200==t.code){var i=e.time-1;e.timer=setInterval(function(){i-=1,0>=i?(n.text("获取验证码").removeClass("unable"),clearInterval(e.timer)):n.text(i+"秒后可重新获取")},1e3)}else alert(t.msg||PFT.AJAX_ERROR_TEXT)}})},submit:function(t){var e=this,n=this.submitBtn,r=this.cardInp.val(),a=this.mobileInp.val(),o=this.memnameInp.val(),d=this.idCardInp.val(),s=this.vcodeInp.val(),c={identify:r,type:"physics",mobile:a,name:o,id_card:d,vcode:s};"replace"==t&&(c.replace=1),PFT.Util.Ajax(i.Url.active.activateForPc,{type:"post",params:c,loading:function(){n.addClass("disable")},complete:function(){n.removeClass("disable")},success:function(t){t=t||{};var n=t.data||{};200==t.code?1==n.exist?e.CheckExistDialog.open(n):PFT.Util.STip("success",'<div style="width:200px">激活成功</div>'):alert(t.msg||PFT.AJAX_ERROR_TEXT)}})}});$(function(){new o})},function(t,e){},,,,function(t,e){var n=function(){},i={Url:{PublishCardProd:{submit:"/r/product_scenic/save/",uploadFile:"/r/product_AnnualCard/uploadImg/",getInfo:"/r/product_scenic/get/"},PackageInfo:{updateTicket:"/r/product_ticket/UpdateTicket/",getPackageInfoList:"/r/product_ticket/ticket_attribute/",getLands:"/r/product_AnnualCard/getLands/",getTickets:"/r/product_AnnualCard/getTickets/",deleteTicket:"/route/index.php?c=product_ticket&a=set_status"},EntryCard:{getProdList:"/r/product_AnnualCard/getAnnualCardProducts/",createAnnualCard:"/r/product_AnnualCard/createAnnualCard/",getAnnualCards:"/r/product_AnnualCard/getAnnualCards/"},makeOrder:{getCardsForOrder:"/r/product_AnnualCard/getCardsForOrder/",getOrderInfo:"/r/product_AnnualCard/getOrderInfo/",isNeedToReplace:"/r/product_AnnualCard/isNeedToReplace/",submit:"/formSubmit_v01.php"},getVirtualStorage:"/r/product_AnnualCard/getVirtualStorage/",storage:{getList:"/r/product_AnnualCard/getAnnualCardStorage/",deleteAnnualCard:"/r/product_AnnualCard/deleteAnnualCard/"},ordersuccess:{getOrderDetail:"/r/product_AnnualCard/orderSuccess/"},active:{checkCard:"/r/product_AnnualCard/activeCheck/",getVCode:"/r/product_AnnualCard/sendVcode/",activateForPc:"/r/product_AnnualCard/activateForPc/"},mclist:{getList:"/r/product_AnnualCard/getMemberList/"},memdetail:{detail:"/r/product_AnnualCard/getMemberDetail/",history:"/r/product_AnnualCard/getHistoryOrder/"}},defaults:{type:"get",ttimout:6e4,loading:n,complete:n,success:n,fail:n,timeout:n,serverError:n}};t.exports=i},function(t,e){function n(t){if(t=t||{},this.id=t.id,!this.id)throw Error("缺少id");this.readObj=document.getElementById(this.id)}n.prototype={read:function(){var t=this.readObj;if(!t)return alert("请使用IE浏览器读物理卡号"),"";if("number"!=typeof t.open&&"string"!=typeof t.ICReaderRequest)return alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件"),"";t.open();var e=t.ICReaderRequest();return e||""}},t.exports=n},function(t,e,n){n(8);var i=n(10),r=n(17),a=function(){var t=this;this.submitData={},this.SDialog=new i({width:680,content:r,drag:!0,events:{"click #replaceBtn":function(e){t.onReplaceBtnClick(e)},"click #messageBtn":function(e){t.onMessageBtnClick(e)}}})};a.prototype={open:function(t){t=t||{};var e=t.mobile,n=t.idCard,i=t.name,r=t.left,a="";if("[object Array]"==Object.prototype.toString.call(r)){a='<p class="pname">'+i+"</p>";for(var o in r){var d=r[o],s=d.ltitle,c=d.title,l=d.left;a+='<p class="lname">'+s+" "+c+"（"+l+"）</p>"}}else a=i+"（"+r+"）";this.submitData=t.submitData,this.SDialog.open({onBefore:function(){$("#existDialog_mobile").text(e),$("#existDialog_idCard").text(n),$("#existDialog_name").html(a)}})},close:function(){this.SDialog.close()},on:function(t,e){this.SDialog.on(t,e)},onReplaceBtnClick:function(t){this.SDialog.trigger("replaceAndSubmit",this.submitData,this)},onMessageBtnClick:function(t){this.close()}},t.exports=a},function(t,e){},,function(t,e,n){n(11);var i=n(13),r=n(14),a=n(15),o=n(16),d=new Function,s={width:"",height:"",closeBtn:!0,content:"",drag:!1,speed:200,offsetX:0,offsetY:0,overlay:!0,headerHeightMin:46,events:{},onOpenBefore:d,onOpenAfter:d,onCloseBefore:d,onCloseAfter:d},c=function(){var t=0;return function(){return t++}}(),l=function(t){var e=this,t=this.opt=$.extend(s,t||{});this.uid=c(),this.flag="gSimpleDialog-",this.id=this.flag+this.uid+"-";var n=this.container=$("<div></div>");$("body").append(n),n.attr({id:this.id+"container"}).addClass(this.flag+"container").addClass(this.id+"container"),"number"==typeof t.width&&n.width(t.width),"number"==typeof t.height&&n.height(t.height);var i=this.header=$("<div></div>");if(i.attr({id:this.id+"header"}).addClass(this.flag+"header").addClass(this.id+"header").css({minHeight:t.headerHeightMin}).appendTo(n),t.header){var r="function"==typeof t.header?t.header():t.header;i.prepend(r)}var a=this.content=$("<div></div>");a.attr({id:this.id+"content"}).addClass(this.flag+"content").addClass(this.id+"content").appendTo(n).html("function"==typeof t.content?t.content():t.content);var o=this.closeBtn=$("<div>×</div>");o.attr({id:this.id+"closeBtn"}).addClass(this.flag+"closeBtn").addClass(this.id+"closeBtn").appendTo(n);var d=i.height();o.css({width:d+6,height:d,lineHeight:d-4+"px"}),t.closeBtn||o.addClass("hidden"),o.on("click",function(){e.close()}),this.init(t)};l.prototype=o({init:function(t){var e=this,n=this.events=t.events,i=this.container;for(var a in n){var o=a.replace(/(\w*)\s(.*)/,function(t,e,n){return e+":"+n}).split(":");!function(t){var r=t[0],o=t[1],d=n[a];i.on(r,o,function(t){"function"==typeof d?d(t):"string"==typeof d&&e.prototype[d](t)})}(o)}setTimeout(function(){t.drag&&r({trigger:e.header[0],target:e.container[0]})},10),this.position()},position:function(){var t=this.container,e=t.height(),n=t.width(),r=i(),a=this.opt.offsetX;t.css({left:(r.width-n)/2+a,top:-e+10}).hide()},getMask:function(){var t=$("#"+this.flag+"mask");return t.length?t:(t=$("<div></div>"),t.attr({id:this.flag+"mask","class":this.flag+"mask"}).appendTo($("body")),t)},open:function(t){t=t||{};var e=this,n="undefined"==typeof t.overlay?this.opt.overlay:!!t.overlay,r=t.speed||this.opt.speed,a=t.offsetY||this.opt.offsetY,o=t.onBefore||this.opt.onOpenBefore,d=t.onAfter||this.opt.onOpenAfter,s=i().height,c=this.container.height();this.position(),this.container.show().css({zIndex:9999}),o(),this.container.animate({top:(s-c)/2+a},r,function(){d()}),n&&this.getMask().fadeIn(function(){e.getMask().css("zIndex",9998)})},close:function(t){t=t||{};var e=this.container,n=t.speed||this.opt.speed,i=t.onBefore||this.opt.onCloseBefore,r=t.onAfter||this.opt.onCloseAfter,a=e.height();i(),e.animate({top:-(a+10)},n,function(){r(),e.hide().css({zIndex:-1})});var o=$("#"+this.flag+"mask");o.fadeOut(function(){o.css("zIndex",0)})}},a),t.exports=l},function(t,e){},,function(t,e){t.exports=function(){var t={width:0,height:0};return window.innerWidth?(t.width=window.innerWidth,t.height=window.innerHeight):document.documentElement&&document.documentElement.clientWidth?(t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight):(t.width=document.body.clientWidth,t.height=document.body.clientHeight),t}},function(t,e){var n=window,i=n.document,r=i.documentElement,a=i.body,o=!-[1],d=o&&/msie 6/.test(navigator.userAgent.toLowerCase()),s=1,c="cache"+(+new Date+"").slice(-8),l={},u=function(t){var e=t.charAt(0);return e.toUpperCase()+t.replace(e,"")},h=function(t){var e=u(t);return document.documentElement["scroll"+e]||a["scroll"+e]},p=function(t,e){var n=u(e),i=r["client"+n]||a["client"+n]||0,o=h(e),d=t.getBoundingClientRect();return Math.round(d[e])+o-i},f=function(t){t=t||{};var e=t.trigger,a=t.target;e.style.cursor="move";var s="getSelection"in n?function(){n.getSelection().removeAllRanges()}:function(){try{i.selection.empty()}catch(t){}},c=this,l=f.event,u=!1,v=o?e:i,g=!0,m=!0,C=function(t){u=!0;var n=h("top"),i=h("left"),s=g?0:i,c=g?0:n;f.data("dragData",{x:t.clientX-p(a,"left")+(g?i:0),y:t.clientY-p(a,"top")+(g?n:0),el:s,et:c,er:s+r.clientWidth-a.offsetWidth,eb:c+r.clientHeight-a.offsetHeight}),o&&(d&&m&&a.style.removeExpression("top"),e.setCapture()),l.bind(v,"mousemove",b),l.bind(v,"mouseup",y),o&&l.bind(e,"losecapture",y),t.stopPropagation(),t.preventDefault()};l.bind(e,"mousedown",C);var b=function(t){if(u){s();var e=f.data("dragData"),n=t.clientX-e.x,i=t.clientY-e.y,r=e.et,o=e.er,d=e.eb,c=e.el,l=a.style;l.marginLeft=l.marginTop="0px",l.left=(c>=n?c:n>=o?o:n)+"px",l.top=(r>=i?r:i>=d?d:i)+"px",t.stopPropagation()}},y=function(t){if(u=!1,o&&l.unbind(e,"losecapture",y),l.unbind(v,"mousemove",b),l.unbind(v,"mouseup",y),o&&(e.releaseCapture(),d&&m)){var n=parseInt(a.style.top)-c.getScroll("top");a.style.setExpression("top","fuckIE6=document.documentElement.scrollTop+"+n+'+"px"')}t.stopPropagation()}};f.data=function(t,e,i){if("string"==typeof t)return void 0!==e&&(l[t]=e),l[t];if("object"==typeof t){var r=t===n?0:9===t.nodeType?1:t[c]?t[c]:t[c]=++s,a=l[r]?l[r]:l[r]={};return void 0!==i&&(a[e]=i),a[e]}},f.removeData=function(t,e){if("string"==typeof t)delete l[t];else if("object"==typeof t){var i=t===n?0:9===t.nodeType?1:t[c];if(void 0===i)return;var r=function(t){var e;for(e in t)return!1;return!0},a=function(){if(delete l[i],!(1>=i))try{delete t[c]}catch(e){t.removeAttribute(c)}};e?(delete l[i][e],r(l[i])&&a()):a()}},f.event={bind:function(t,e,n){var i=f.data(t,"e"+e)||f.data(t,"e"+e,[]);if(i.push(n),1===i.length){var r=this.eventHandler(t);f.data(t,e+"Handler",r),t.addEventListener?t.addEventListener(e,r,!1):t.attachEvent&&t.attachEvent("on"+e,r)}},unbind:function(t,e,n){var i=f.data(t,"e"+e);if(i){if(n)for(var r=i.length-1,a=i[r];r>=0;r--)a===n&&i.splice(r,1);else i=void 0;if(!i||!i.length){var o=f.data(t,e+"Handler");t.addEventListener?t.removeEventListener(e,o,!1):t.attachEvent&&t.detachEvent("on"+e,o),f.removeData(t,e+"Handler"),f.removeData(t,"e"+e)}}},eventHandler:function(t){return function(e){e=f.event.fixEvent(e||n.event);for(var i,r=e.type,a=f.data(t,"e"+r),o=0;i=a[o++];)i.call(t,e)===!1&&(e.preventDefault(),e.stopPropagation())}},fixEvent:function(t){if(t.target)return t;var e,n={};n.target=t.srcElement||document,n.preventDefault=function(){t.returnValue=!1},n.stopPropagation=function(){t.cancelBubble=!0};for(e in t)n[e]=t[e];return n}},t.exports=f},function(t,e){var n={fn:{},on:function(t,e){var n=this.fn[t]||(this.fn[t]=[]);n.push(e)},fire:function(t){var e=this.fn[t];if(!e)return!1;var n,i,r=arguments,a=r.length;1==a?(n="",i=this):2==a?(n=r[a-1],i=this):3==a&&(n=r[a-2],i=r[a-1]);for(var o in e){var d=e[o];d.call(i,n)}},trigger:function(){this.fire.apply(this,arguments)}};t.exports=n},function(t,e){t.exports=function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}},function(t,e){t.exports='<div class="memberBox" id="memberBox">\r\n    <p class="memP">会员已存在！是否替换原有卡和套餐？</p>\r\n    <table class="memTable border">\r\n        <thead>\r\n        <tr class="font-gray">\r\n            <th>手机号</th>\r\n            <th>身份证</th>\r\n            <th>卡套餐（已用特权数）</th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr>\r\n            <td><div style="padding-right:10px" id="existDialog_mobile"></div></td>\r\n            <td><div style="padding-right:10px" id="existDialog_idCard"></div></td>\r\n            <td><div id="existDialog_name"></div></td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n    <div class="btnBox">\r\n        <a href="javascript:void(0);" class="btn btn-blue" id="replaceBtn">替换并提交订单</a>\r\n        <a href="javascript:void(0);" class="btn btn-border" id="messageBtn">取消</a>\r\n    </div>\r\n</div>'}]);