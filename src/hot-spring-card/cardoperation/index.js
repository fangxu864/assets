var entry_modal = require("./tpl/entry.xtpl");
require("./index.scss");
$(".g-index").append(entry_modal);

var entryCard = function () {
  this.entryBtn = $("#entryBtn");
  this.modalBg = $(".m-modal_bg");
  this.entryModalbg = $(".m-modal_bg.entry");
  this.cardEditbg = $(".m-modal_bg.edit");
  this.phyInp = $(".u-input_box .u-input.phy_no");
  this.schInp = $("#sch_inp");
  this.entryDiv = $(".u-input_box,.u-div");
  this.tbody = $("tbody");
  this.searchBtn = $(".u-sch_btn");
  this.cardEditBtn = $(".crd_operation .u-btn_edit");
  this.clearBtn = $("#clearCardInpBtn");
  var xhrPoster;
  this.bind();

}




entryCard.prototype = {
  bind: function () {
    var that = this;
    //手牌录入input去除背景色
    that.entryDiv.on("click", ".readCard,#entryCard", function (e) {
      $(this).prev("input").removeAttr("readonly").focus().css("background", "#FFF");
    });


    //关闭模态框以后重置input框状态
    that.modalBg.on("click", ".close", function () {
      that.modalBg.hide();
      that.phyInp.val("").attr("readonly", "readnoly").css("background", "#eee");
    });


    //卡牌录入模态框,获取关联产品
    that.entryBtn.on("click", function () {
      that.getLid();
    });

    //读卡自动提交
    that.schInp.on("keyup", function (e) {
      that.onFlashCard(e);
    })

    //手牌编辑模态框
    that.cardEditBtn.on("click", function (e) {
      $(".m-modal_bg.edit").show();

    });


    //搜索列表呈现
    that.searchBtn.on("click", function (e) {
      that.getCardList(1, 9);
      that.phyInp.val("").css("background", "#eee");
    });

    //清除按钮
    that.clearBtn.on("click", function (e) {
      that.onSearchclearBtn(e);
    })
  },
  getLid: function () {
    //获取关联产品
    this.phyInp.val("").css("background", "#eee");
    this.entryModalbg.show();
  },
  getCardList: function (page, pageSize) {
    //搜索获取手牌列表
    var that = this,
      cardList = "",
      physicsNo = this.schInp.val();
    xhrPoster = PFT.Util.Ajax(
      "/r/product_HotSpringCard/searchHotSpringCard",
      {
        type: "POST",
        params: {
          "physicsNo": physicsNo,
        },
        loading: function () {
          that.tbody.html("").html("<tr><td>正在加载...</td></tr>");
        },
        success: function (res) {
          switch (res.code) {
            case 200:
              var list = res.data;
              if (list.length) {
                $.each(list, function (i, item) {
                  cardList += ' <tr> <td class="crd_card_no">' + list[i].visible_no + '</td>'
                    + '<td class="crd_phy_no"></td>'
                    + ' <td class="crd_color">' + list[i].color + '</td>'
                    + '<td class="crd_status">' + list[i].status + '</td>'
                    + '<td class="crd_paylist"></td>'
                    + '<td class="crd_operation">'
                    + ' <a class="u-btn_edit" >编辑</a>'
                    + ' <a class="u-btn_rl" >挂失</a>'
                    + ' <a class="u-btn_disable" >禁用</a>'
                    + ' <a class="u-btn_del" >删除</a><br/>'
                    /* + '<a class="u-btn_paylist">历史账单</a>'*/
                    + ' </td> </tr>';


                });
                that.tbody.html("").html(cardList);
                that.cardEdit();

              }
              break;
            case 201:
              //未登录
              alert(PFT_MALL.ajax_unlogin);
              break;
            case 204:
              //参数错误
              alert(PFT_MALL.ajax_serverError);
              break;
          }
        }
      }
    )
  },
  cardEdit: function () {
    //手牌编辑模态框
    var cardEditBtn = $("tbody .crd_operation .u-btn_edit");
    cardEditBtn.on("click", function (e) {

      PFT.Util.Ajax(
        "/r/product_HotSpringCard/editCard",
        {
          type: "POST",
          params: {
            "physicsNo": 123456,
          }
        }
      )


      $(".m-modal_bg.edit").show();
    });
  },

  onFlashCard: function (e) {
    //刷卡
    var that = this;
    var tarInp = $(e.currentTarget);
    var val = tarInp.val();
    var keycode = e.keyCode;
    val ? that.clearBtn.show() : that.clearBtn.hide();
    if (keycode != 13) return false;
    that.getCardInfo();
  },
  getCardInfo: function () {
    //页面刷卡获取卡片信息
    var that = this;
    var cardInp = that.schInp;
    var physicsNo = cardInp.val();
    var cardInfo = "";
    console.log(physicsNo);
    PFT.Util.Ajax(
      "/r/product_HotSpringCard/getCardInfo",
      {
        type: "POST",
        params: {
          "physicsNo": physicsNo,
        },
        success: function (res) {
          switch (res.code) {
            case 200:
              var data = res.data;
              cardInfo += ' <tr> <td class="crd_card_no">' + data.visible_no + '</td>'
                + '<td class="crd_phy_no"></td>'
                + ' <td class="crd_color">' + data.color + '</td>'
                + '<td class="crd_status">' + data.status + '</td>'
                + '<td class="crd_paylist">' + data.title + '</td>'
                + '<td class="crd_operation">'
                + ' <a class="u-btn_edit" >编辑</a>'
                + ' <a class="u-btn_rl" >挂失</a>'
                + ' <a class="u-btn_disable" >禁用</a>'
                + ' <a class="u-btn_del" >删除</a><br/>'
                /* + '<a class="u-btn_paylist">历史账单</a>'*/
                + ' </td> </tr>';
              that.tbody.html("").html(cardInfo);
              break;
            case 201:
              //未登录
              that.tbody.html("").html('<tr><td>' + res.msg + '</td></tr>');
              break;
            case 204:
              //参数错误
              that.tbody.html("").html('<tr><td>' + res.msg + '</td></tr>');
              break;
          }

        }
      }
    )

  },
  onSearchclearBtn: function (e) {
    var that = this;
    that.schInp.focus().val('');
    that.clearBtn.hide();
  },
  onDelBtn: function (physicsNo) {
    //点击删除按钮
    PFT.Util.Ajax(
      "/r/product_HotSpringCard/setStatusOfDeleting",
      {
        type: "POST",
        params: {
          "physicsNo": physicsNo,
        },
        success: function (res) {
          switch (res.code) {
            case 200:
              PFT.Util.STip("success", "删除成功", 2000, function () {
                //删除成功回调
              });
              break;
            case 201:
              //未登录
              PFT.Util.STip("fail", "删除失败,请重新登录", 2000, function () {
                //删除失败回调
              });
              break;
            case 204:
              //参数错误
              PFT.Util.STip("fail", "删除失败", 2000, function () {
                //删除失败回调
              });
              break;
          }

        }
      });


  },






}

$(function () {
  var newCard = new entryCard();
})


