var entry_modal = require("./tpl/entry.xtpl");
require("./index.scss");
$(".g-index").append(entry_modal);

var entryCard = function () {
  var xhrPoster;
  var pagination;
  this.entryBtn = $("#entryBtn");
  this.modalBg = $(".m-modal_bg");
  this.entryModalbg = $(".m-modal_bg.entry");
  this.phyInp = $(".u-input_box .u-input.phy_no");
  this.schInp = $("#sch_inp");
  this.entryDiv = $(".u-input_box,.u-div");
  this.tbody = $("tbody");
  this.searchBtn = $(".u-sch_btn");
  this.cardEditBtn = $(".crd_operation .u-btn_edit");
  this.clearBtn = $(".g-content .u-div .clearCardInpBtn");
  this.modalClearBtn = $(".m-modal .u-input_box .clearCardInpBtn");
  this.modalUInp = $(".m-modal_bg .u-input");
  this.modalCardInp = $(".m-modal .u-input_box .card_no");
  this.editModalCardInp = $(".m-modal_edit .u-input_box .card_no");
  this.readCardBtn = $(".m-modal .readCard");
  this.lid = $(".m-modal .lid");
  this.saveBtn = $(".m-modal_entring .save");
  this.saveNewBtn = $(".m-modal_entring .saveNew");
  this.editSaveBtn = $(".m-modal_edit .save");
  this.delBtn = $(".crd_operation .u-btn_del");
  this.delConfBtn = $(".m-modal.del .confirm");
  this.lossBtn = $(".crd_operation .u-btn_rl");
  this.lossConfBtn = $(".m-modal.loss .confirm");
  this.fillConfBtn = $(".m-modal_fillCard .save");

  this.bind();
}




entryCard.prototype = {
  bind: function () {
    var that = this;

    var Pagination = require("COMMON/modules/pagination-x");

    pagination = new Pagination({
      container: "#paginationWrap", //必须，组件容器id
      // count : 7,                //可选  连续显示分页数 建议奇数7或9
      showTotal: true,         //可选  是否显示总页数
      jump: true               //可选  是否显示跳到第几页
    });
    pagination.on("page.switch", function (toPage, currentPage, totalPage) {
      // toPage :      要switch到第几页
      // currentPage : 当前所处第几页
      // totalPage :   当前共有几页
      console.log(currentPage);
      pagination.render({ current: toPage, total: totalPage });

      if (xhrPoster && xhrPoster.status !== 200) {
        xhrPoster.abort();
      }

      $('html,body').animate({
        scrollTop: $('.g-index').offset().top
      }, 300);

      that.getCardList(toPage);
    });



    //读卡自动focus,去除背景
    that.entryDiv.on("click", ".readCard,#entryCard", function (e) {
      $(this).prev("input").removeAttr("readonly").val('').focus().css("background", "#FFF");
    });


    //关闭模态框以后重置input框状态
    that.modalBg.on("click", ".close", function () {
      that.modalBg.hide();
      that.onCloseModalClean();
    });

    //录入模态框,获取关联产品
    that.entryBtn.on("click", function (e) {
      that.getLid(e);
    });

    //编辑模态框
    /*that.cardEditBtn.on("click", function (e) {
      $(".m-modal_bg.edit").show();
    });*/

    //读卡自动检测
    that.schInp.on("keyup", function (e) {
      that.onFlashCard(e);
    })

    //搜索手牌列表
    that.searchBtn.on("click", function (e) {
      that.getCardList(1);
      that.phyInp.val("").css("background", "#eee");
    });

    //模态框录入卡号
    that.phyInp.on("keyup", function (e) {
      that.onModalFlashCard(e);
    });


    //页面input清除按钮
    that.clearBtn.on("click", function (e) {
      that.onSearchclearBtn(e);
    });

    //模态框input清除按钮
    that.modalClearBtn.on("click", function (e) {
      that.onModalClearBtn(e);
    });

    //手牌号检验
    that.modalCardInp.on("change", function (e) {
      var entryCardVal,
        editCardNo = $(".m-modal_edit .u-input.card_no").val(),
        entryCard = $(".u-input_box .card_no").val(),
        editEntryCard = $(".m-modal_edit .u-input_box .card_no").val(),
        span_des = $(".u-span_des.card_no");
      if (entryCard === "") {
        entryCardVal = editEntryCard;
      } else if (editEntryCard === "") {
        entryCardVal = entryCard;
      }
      var reg = /^[0-9a-zA-Z]+$/;
      var span = '<span class="u-span_des ">检查是否含有空格</span>';
      if (reg.test(entryCardVal)) {
        that.onSubmitCheck(entryCardVal);
      } else {
        span_des.html("").html(span);
      }
    });


    //录入模态框保存按钮
    that.saveBtn.on("click", function (e) {
      that.onModalAddSaveBtn(e);
    });
    //录入模态框保存新开按钮
    that.saveNewBtn.on("click", function (e) {
      that.onModalAddSaveNewBtn(e);
    });
    //编辑模态框保存按钮
    that.editSaveBtn.on("click", function (e) {
      that.onModalEditSubmit(e);
    });
    //删除按钮
    that.delConfBtn.on("click", function (e) {
      that.onDelConfirm(e);
    });
    //挂失按钮(所有状态更新确认按钮)
    that.lossConfBtn.on("click", function (e) {
      var confirmBtn = $(this),
        status = confirmBtn.attr("data-status");

      that.onSetStatusConfirm(status, confirmBtn);
    });
    //补卡按钮
    that.fillConfBtn.on("click", function (e) {
      that.onFillCardSubmit(e);
    })

  },
  getLid: function (e) {
    //获取关联产品
    this.phyInp.val("").css("background", "#eee");
    this.entryModalbg.show();
  },
  getCardList: function (page) {
    //搜索获取手牌列表
    var that = this,
      cardList = "",
      physicsNo,
      physicsNo = this.schInp.val();
    status = $(".u-input_radio.status:checked").val();
    color = $(".u-input_radio.color:checked").val();

    xhrPoster = PFT.Util.Ajax(
      "/r/product_HotSpringCard/searchHotSpringCard",
      {
        type: "GET",
        params: {
          "physicsOrVisible": physicsNo,
          "status": status,
          "color": color,
          "page": page,


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
                    + '<td class="crd_phy_no">' + list[i].physics_no + '</td>'
                    + ' <td class="crd_color">' + list[i].color_name + '</td>';
                  switch (list[i].status) {
                    case "1":
                      cardList += '<td class="crd_status">' + list[i].status_name + '</td>'
                        + '<td class="crd_paylist"></td>'
                        + '<td class="crd_operation" data-pn=' + list[i].physics_no + ' data-vn=' + list[i].visible_no + ' data-cl=' + list[i].color + ' data-lid="">'
                        + ' <a class="u-btn_edit" >编辑</a>'
                        + ' <a class="u-btn_rl status" data-status="3">挂失</a>'
                        + ' <a class="u-btn_disable status" data-status="4">禁用</a>'
                        + ' <a class="u-btn_del" >删除</a><br/>'
                        /* + '<a class="u-btn_paylist">历史账单</a>'*/
                        + ' </td> </tr>';
                      break;
                    case "2":
                      cardList += '<td class="crd_status">' + list[i].status_name + '</td>'
                        + '<td class="crd_paylist"></td>'
                        + '<td class="crd_operation" >'
                        /* + ' <a class="u-btn_edit" data-pn='+list[i].physics_no+' data-vn='+list[i].visible_no+ 'data-cl='+list[i].color+' data-lid="">编辑</a>'*/
                        /* + '<a class="u-btn_paylist">历史账单</a>'*/
                        + ' </td> </tr>';
                      break;
                    case "3":
                      cardList += '<td class="crd_status">' + list[i].status_name + '</td>'
                        + '<td class="crd_paylist"></td>'
                        + '<td class="crd_operation" data-pn=' + list[i].physics_no + ' data-vn=' + list[i].visible_no + ' data-cl=' + list[i].color + ' data-lid="">'
                        + ' <a class="u-btn_fillCard" >补卡</a>'
                        + ' <a class="u-btn_unloss status" data-status="1">取消挂失</a>'
                        /* + '<a class="u-btn_paylist">历史账单</a>'*/
                        + ' </td> </tr>';
                      break;
                    case "4":
                      cardList += '<td class="crd_status">' + list[i].status_name + '</td>'
                        + '<td class="crd_paylist"></td>'
                        + '<td class="crd_operation" data-pn=' + list[i].physics_no + ' data-vn=' + list[i].visible_no + ' data-cl=' + list[i].color + ' data-lid="">'

                        + ' <a class="u-btn_undisable status" data-status="1">取消禁用</a>'
                        /* + '<a class="u-btn_paylist">历史账单</a>'*/
                        + ' </td> </tr>';
                      break;
                  }

                });
                that.tbody.html("").html(cardList);
                pagination.render({ current: page ,total:res.data[0].allPage});
                that.cardEdit();
                that.cardDel();
                that.fillCard();
                that.statusUpdate();
              }
              break;
            case 201:
              //未登录
              that.tbody.html("").html('<tr><td>' + res.msg + '</td></tr>');
              break;
            case 204:
              //参数错误
              that.tbody.html("").html('<tr><td>' + res.msg + '</td></tr>');
              $('#paginationWrap').hide();
              break;
          }
        }
      }
    )
  },
  cardEdit: function () {
    //手牌编辑模态框
    var that = this;
    var cardEditBtn = $("tbody .crd_operation .u-btn_edit");
    var saveEditBtn = $(".m-modal_edit .u-modal_btn.save");

    cardEditBtn.on("click", function (e) {
      var parent = $(this).parent();
      var phy_no = parent.attr("data-pn");
      var card_no = parent.attr("data-vn");
      var color = parent.attr("data-cl");
      var phyInp = $(".m-modal_bg.edit .phy_no");
      var cardInp = $(".m-modal_bg.edit .card_no");
      var cardBg = $(".m-modal_bg.edit .cardBg");
      var editModal = $(".m-modal_bg.edit");
      saveEditBtn.attr({ "data-oldpn": phy_no, "data-oldcolor": color, "data-oldcrd": card_no, "data-lid": '' });
      editModal.show();
      phyInp.val(phy_no);
      cardInp.val(card_no);
      if (color === "1") {
        cardBg.val("1");
      } else if (color === "2") {
        cardBg.val("2");
      } else {
        cardBg.val("-1");
      }
    });

  },

  onCloseModalClean: function () {
    var that = this;
    var a = '读取物理卡号';
    var span = '使用箱号或手牌上印制的卡号';
    
    that.modalClearBtn.hide();
    that.readCardBtn.html("").text(a);
    that.modalCardInp.html("").text(span);
    that.modalUInp.val("");
    that.phyInp.attr("readonly", "readnoly").css("background", "#eee");
  },
  onFlashCard: function (e) {
    //页面刷卡
    var that = this;
    var clearBtn = $(".g-content .u-div .clearCardInpBtn");
    var tarInp = $(e.currentTarget);
    var val = tarInp.val();
    var keycode = e.keyCode;
    val ? clearBtn.show() : clearBtn.hide();
    if (keycode != 13) return false;
    that.getCardInfo(e);
  },
  getCardInfo: function (e) {
    //页面刷卡获取卡片信息
    var that = this;
    var cardInp = that.schInp;
    var physicsNo = cardInp.val();
    var cardInfo = "";
    $("#paginationWrap").hide();
    PFT.Util.Ajax(
      "/r/product_HotSpringCard/getCardInfo",
      {
        type: "GET",
        params: {
          "physicsNo": physicsNo,
        },
        loading: function () {
          that.tbody.html("").html("<tr><td>正在加载...</td></tr>");
        },
        success: function (res) {

          switch (res.code) {
            case 200:
              var data = res.data;
              cardInfo += ' <tr> <td class="crd_card_no">' + data.visible_no + '</td>'
                + '<td class="crd_phy_no">' + data.physics_no + '</td>'
                + ' <td class="crd_color">' + data.color_name + '</td>';
              switch (data.status) {
                case "1":
                  cardInfo += '<td class="crd_status">' + data.status_name + '</td>'
                    + '<td class="crd_paylist"> </td>'
                    + '<td class="crd_operation" data-pn=' + data.physics_no + ' data-vn=' + data.visible_no + ' data-cl=' + data.color + ' data-lid="">'
                    + ' <a class="u-btn_edit" >编辑</a>'
                    + ' <a class="u-btn_rl status" data-status="3">挂失</a>'
                    + ' <a class="u-btn_disable status" data-status="4">禁用</a>'
                    + ' <a class="u-btn_del" >删除</a><br/>'
                    /* + '<a class="u-btn_paylist">历史账单</a>'*/
                    + ' </td> </tr>';
                  break;
                case "2":
                  cardInfo += '<td class="crd_status">' + data.status_name + '</td>'
                    + '<td class="crd_paylist"> </td>'
                    + '<td class="crd_operation" data-pn=' + data.physics_no + ' data-vn=' + data.visible_no + ' data-cl=' + data.color + ' data-lid="">'
                    + '<td class="crd_paylist"></td>'
                    + '<td class="crd_operation" >'
                    /* + '<a class="u-btn_paylist">历史账单</a>'*/
                    + ' </td> </tr>';
                  break;
                case "3":
                  cardInfo += '<td class="crd_status">' + data.status_name + '</td>'
                    + '<td class="crd_paylist"> </td>'
                    + '<td class="crd_operation" data-pn=' + data.physics_no + ' data-vn=' + data.visible_no + ' data-cl=' + data.color + ' data-lid="">'
                    + ' <a class="u-btn_fillCard" >补卡</a>'
                    + ' <a class="u-btn_unloss status" data-status="1">取消挂失</a>'
                    /* + '<a class="u-btn_paylist">历史账单</a>'*/
                    + ' </td> </tr>';
                  break;
                case "4":

                  cardInfo += '<td class="crd_status">' + data.status_name + '</td>'
                    + '<td class="crd_paylist"> </td>'
                    + '<td class="crd_operation" data-pn=' + data.physics_no + ' data-vn=' + data.visible_no + ' data-cl=' + data.color + ' data-lid="">'

                    + ' <a class="u-btn_undisable status" data-status="1">取消禁用</a>'

                    /* + '<a class="u-btn_paylist">历史账单</a>'*/
                    + ' </td> </tr>';
                  break;
              }


              that.tbody.html("").html(cardInfo);
              that.cardEdit();
              that.cardDel();
              that.fillCard();
              that.statusUpdate();
              break;
            case 102:
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
  onModalFlashCard: function (e) {
    //在模态框中刷卡
    var that = this;
    var clearBtn = $(".m-modal .u-input_box .clearCardInpBtn")
    var tarInp = $(e.currentTarget);
    var val = tarInp.val();
    var keycode = e.keyCode;
    val ? clearBtn.show() : clearBtn.hide();
    if (keycode != 13) return false;
    var physicsNo = "";
    var physicsNo0 = $(".m-modal_edit .u-input_box .u-input.phy_no").val();
    var physicsNo1 = $(".m-modal_entring .u-input_box .u-input.phy_no").val();
    var physicsNo2=$(".m-modal_fillCard .u-input_box .u-input.phy_no").val();
    if (physicsNo0 !== "") {
      physicsNo = physicsNo0;
    } else if (physicsNo1 !== "") {
      physicsNo = physicsNo1;
    }else if(physicsNo2 !==""){
      physicsNo = physicsNo2;
    }

    that.getModalCardInfo(physicsNo);
  },
  getModalCardInfo: function (physicsNo) {
    //模态框中刷卡检验唯一性
    var that = this;
    var cardInfo = "";
    PFT.Util.Ajax(
      "/r/product_HotSpringCard/checkPhysicsCard",
      {
        type: "GET",
        params: {
          "physicsNo": physicsNo,
        },
        success: function (res) {
          switch (res.code) {
            case 400:
              cardInfo = ' <span class="crd_card_no" style="color:red;">' + res.msg + '</span>';
              $(".readCard ").html(cardInfo);
            case 200:
              cardInfo = ' <span class="crd_card_no ">' + res.msg + '</span>';
              $(".readCard ").html(cardInfo);
              break;
            case 102:
              //未登录

              break;
            case 204:
              //参数错误

              break;
          }

        }
      }
    )
  },
  onSearchclearBtn: function (e) {
    //点击搜索框清除按钮
    var that = this;
    that.schInp.focus().val("");
    that.clearBtn.hide();
  },
  onModalClearBtn: function (e) {
    //模态框清除按钮
    var that = this;
    var a = ' 读取物理卡号';
    that.modalClearBtn.prevAll(".u-input.phy_no").focus().val("");
    that.modalClearBtn.prevAll("a").html("").text(a);
    that.modalClearBtn.hide();
  },
  onModalAddSaveBtn: function (e) {
    //模态框 完成提交
    var that = this;
    that.onModalSubmit(e);
    that.entryModalbg.hide();
  },
  onModalAddSaveNewBtn: function (e) {
    //添加模态框 完成并继续添加
    var that = this;
    that.onModalSubmit(e);
    that.onCloseModalClean(e);

  },

  onModalEditSaveBtn: function (e) {
    //编辑模态框 完成编辑
    var that = this;
    that.onModalEditSubmit(e);

  },

  onModalSubmit: function (e) {
    var that = this;
    var reg = /^[0-9a-zA-Z]+$/;
    var colorBg = $(".m-modal_bg .cardBg");
    var lid = that.lid.attr("data-lid");
    var phyVal = that.phyInp.val();
    var carVal = that.modalCardInp.val();
    var color = colorBg.val();
    if (reg.test(phyVal, carVal)) {
      PFT.Util.Ajax(
        "/r/product_HotSpringCard/createHotSpringCard",
        {
          type: "GET",
          params: {
            "physicsNo": phyVal,
            "color": color,
            "visibleNo": carVal,
            "lid": "14076"
          },
          success: function (res) {
            switch (res.code) {
              case 200:
                that.onCloseModalClean();
                PFT.Util.STip("success", res.msg, 3000, function () {

                });
                break;
              case 400:
                PFT.Util.STip("fail", res.msg, 3000, function () {

                });
            }
          },
        }
      );
    } else {
      PFT.Util.STip("fail", "添加失败,请检查是否有字段为空", 3000, function () { });
      return false;
    }
  },
  onModalEditSubmit: function (e) {
    var that = this;
    var reg = /^[0-9a-zA-Z]+$/;
    var phyNo = $(".m-modal_bg.edit .phy_no");
    var cardNo = $(".m-modal_bg.edit .card_no");
    var colorBg = $(".m-modal_bg.edit .cardBg");
    var oldPhyVal = that.editSaveBtn.attr("data-oldpn");
    var oldColor = that.editSaveBtn.attr("data-oldcolor");
    var oldCard = that.editSaveBtn.attr("data-oldcrd");
    console.log(oldPhyVal + "+" + oldCard + "+" + oldColor);
    var lid = that.lid.attr("data-lid");
    var phyVal = phyNo.val();
    console.log(phyVal);
    var cardVal = cardNo.val();
    var color = colorBg.val();
    if (reg.test(phyVal, cardVal)) {
      PFT.Util.Ajax(
        "/r/product_HotSpringCard/editCard",
        {
          type: "GET",
          params: {
            "newPhysics": phyVal,
            "newColor": color,
            "newVisible": cardVal,
            "lid": "14076",
            "oldPhysics": oldPhyVal,
            "oldVisible": oldCard,
            "oldColor": oldColor
          },
          success: function (res) {

            switch (res.code) {
              case 200:
                that.modalBg.hide();
                that.onCloseModalClean();
                PFT.Util.STip("success", res.msg, 3000, function () {
                });
                break;
              case 400:
                PFT.Util.STip("fail", res.msg, 3000, function () {
                });
                break;
            }
          },
        }
      );
    } else {
      PFT.Util.STip("fail", "添加失败,请检查是否有字段为空", 3000, function () { });
      return false;
    }
  },
  onSubmitCheck: function (entryCard) {
    var reg = /^[0-9a-zA-Z]+$/;
    var lid = this.lid.attr("data-lid");
    var span_des = $(".u-span_des.card_no");
    if (reg.test(entryCard)) {
      PFT.Util.Ajax(
        "/r/product_HotSpringCard/checkVisibleNo",
        {
          type: "GET",
          params: {
            "visibleNo": entryCard,
            "lid": lid
          },
          success: function (res) {
            var span = '<span class="u-span_des ">' + res.msg + '</span>';
            switch (res.code) {
              case 200:
                span_des.html("").html(span);
                break;
              case 400:
                span_des.html("").html(span);
                break;
            }
          },
        }
      );
    } else {
      return false;
    }
  },
  cardDel: function (e) {
    //删除模态框
    var that = this;
    var crd_operation = $("tbody .crd_operation");
    var delBtn = $("tbody .crd_operation .u-btn_del")
    var delModal = $(".m-modal_bg.del");
    var confirmBtn = $(".m-modal_bg.del .confirm");
    delBtn.on("click", function (e) {
      var phyNo = $(this).parent(".crd_operation").attr("data-pn");
      delModal.show();
      confirmBtn.attr("data-pn", phyNo);
    });
  },
  onDelConfirm: function (e) {

    var that = this;
    var physicsNo = that.delConfBtn.attr("data-pn");
    var delModal = $(".m-modal_bg.del");
    //点击删除按钮
    PFT.Util.Ajax(
      "/r/product_HotSpringCard/setStatusOfDeleting",
      {
        type: "GET",
        params: {
          "physicsNo": physicsNo,
          "is_delete": 1,
        },
        success: function (res) {
          delModal.hide();
          switch (res.code) {
            case 200:

              PFT.Util.STip("success", "删除成功", 3000, function () {
                //删除成功回调        
              });
              that.getCardList(1);
              break;
            case 201:
              //未登录
              PFT.Util.STip("fail", "删除失败,请重新登录", 3000, function () {
                //删除失败回调
              });
              break;
            case 400:
              //参数错误
              PFT.Util.STip("fail", "删除失败", 3000, function () {
                //删除失败回调
              });
              break;
          }

        }
      });

  },


  statusUpdate: function (e) {
    //状态更新
    var that = this;
    var statusBtn = $("tbody .crd_operation .status");
    var statusModal = $(".m-modal_bg.loss");
    var content = $(".m-modal_bg.loss .u-modal_content");
    var confirmBtn = $(".m-modal_bg.loss .confirm");
    statusBtn.on("click", function () {
      var $this = $(this);
      var phyNo = $this.parent().attr("data-pn");
      var status = $this.attr("data-status");
      var text = $this.text();
      var contentTxt = "确定要" + text + "？";
      content.text(contentTxt);
      statusModal.show();
      confirmBtn.attr({ "data-pn": phyNo, "data-status": status });
    });
  },
  onSetStatusConfirm: function (status, confirmBtn) {
    var that = this;
    var physicsNo = confirmBtn.attr("data-pn");
    var statusModal = $(".m-modal_bg.loss");
    PFT.Util.Ajax(
      "/r/product_HotSpringCard/setCardStatus",
      {
        type: "GET",
        params: {
          "physicsNo": physicsNo,
          "status": status,
        },
        success: function (res) {
          statusModal.hide();
          switch (res.code) {
            case 200:
              PFT.Util.STip("success", res.msg, 3000, function () {
                //修改成功回调
              });
              that.getCardList(1);
              break;
            case 201:
              //未登录
              PFT.Util.STip("fail", res.msg, 3000, function () {
                //修改失败回调
              });
              break;
            case 400:
              //参数错误
              PFT.Util.STip("fail", res.msg, 3000, function () {
                //修改失败回调
              });
              break;
          }

        }
      });

  },
  fillCard: function () {
    var that = this;
    var fillBtn = $("tbody .crd_operation .u-btn_fillCard");
    var fillModal = $(".m-modal_bg.fillCard");
    var confirmBtn = $(".m-modal_bg.fillCard .save");
    fillBtn.on("click", function () {
      var $this = $(this).parent();
      var oldPhyNo = $this.attr("data-pn");
      fillModal.show();
      confirmBtn.attr("data-pn", oldPhyNo);
    })
  },
  onFillCardSubmit: function () {
    var that = this;
    var reg = /^[0-9a-zA-Z]+$/;
    var lid = that.lid.attr("data-lid");
    var phyVal=$(".m-modal_fillCard .u-input.phy_no").val();
    var fillCardModal=$(".m-modal_bg.fillCard");
    var oldPhyVal = that.fillConfBtn.attr("data-pn");
 
    if (reg.test(phyVal)) {
      PFT.Util.Ajax(
        "/r/product_HotSpringCard/replacePhysicsCard",
        {
          type: "GET",
          params: {
            "newPhysics": phyVal,
            "oldPhysics": oldPhyVal
          },
          success: function (res) {
            switch (res.code) {
              case 200:
                fillCardModal.hide();
                that.onCloseModalClean();
                PFT.Util.STip("success", res.msg, 3000, function () {

                });
                 that.getCardList(1);
                break;
              case 400:
                PFT.Util.STip("fail", res.msg, 3000, function () {

                });
            }
          },
        }
      );
    } else {
      PFT.Util.STip("fail", "添加失败,请检查是否有字段为空", 3000, function () { });
      return false;
    }
  },
}




$(function () {
  var newCard = new entryCard();
})


