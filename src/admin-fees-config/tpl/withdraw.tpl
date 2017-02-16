    <div class="alertbox">
            <div class="topbox">
                <span class="topboxspan curl" style="max-width:330px;"><span class="topproduct" ></span>自动清分配置</span>
                <span class="toplasttime">上次清分日期：<span class="timespan"></span></span>
            </div>
            <div class="alertcom">
                <div class="Withdrawtype" id="withqing">
                    <span class="withdrawspan">开启自动清分：</span>
                    <div class="withdrawselect active">
                        <span class="iconk" data-id="<?=$tmp['id']?>" id="open"></span>
                    </div>
                </div>
                <div class="Withdrawtype">
                    <span class="withdrawspan">提现方式：</span>
                    <div class="withdrawselect">
                       <span class="dropWrap">
                            <span class="selectBox w389 border">
                                <em class="selected" id="manner" type="1">日结</em>
                                <i class="iconfont moreIcon" href="###"></i>
                            </span>
                            <div class="dropBox w398">
                                <ul class="gate">
                                    <li class="zuuid" type="1">日结</li>
                                    <li class="zuuid" type="2">周结</li>
                                    <li class="zuuid" type="3">月结</li>
                                </ul> 
                            </div>
                       </span>
                    </div>
                </div>
                <div class="Withdrawtype">
                    <span class="withdrawspan">手续费：</span>
                    <div class="withdrawselect">
                        <input class="baseInp border w384" id="CounterFee" type="text" maxlength="20" value="">
                        <span class="withtitle">‰</span>
                    </div>
                </div>
                <div class="Withdrawtype">
                    <span class="withdrawspan">手续费扣除方式：</span>
                    <div class="withdrawselect">
                        <li class="methList w120 radioBox active"  id="cutaccount">
                            <a class="radio" href="javascript: void(0);" style="color:#000">
                                <span class="i_radio"></span>     
                                <span class="tspan">账户余额扣除</span>
                            </a>
                        </li>
                        <li class="methList w120 radioBox" id="cutmoney">
                            <a class="radio" href="javascript: void(0);" style="color:#000">
                                <span class="i_radio"></span>
                                <span class="tspan">提现余额扣除</span>
                            </a>
                        </li>
                    </div>
                </div>
                <div class="Withdrawtype" style="height:100px;line-height:100px;">
                    <span class="withdrawspan">预留金额：</span>
                    <div class="withdrawselect">
                         <div class="yuliu">
                                <ul>
                                    <li class="methList w90 radioBox sitds active" id="reservation">
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span class="tspan">余额预留</span>
                                            <input class="baseInp border w296" id="resetext" type="text" style="height:20px;line-height:20px;" maxlength="20" value="">
                                            <span class="bwithtitle">元</span>
                                        </a>
                                    </li>
                                    <li class="methList w185 sitds radioBox" id="Reserve">
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span class="tspan">预留余额的</span>
                                            <input class="baseInp border w296" id="Reservetext" type="text" maxlength="20" style="height:20px;line-height:20px;"value="">
                                            <span class="bwithtitle">%</span>
                                        </a>
                                    </li>
                                    <li class="methList notus sitds radioBox" id="notused" >
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span>预留未使用订单的金额，其余清分<!--（<span style="color:red">限纯供应商</span>）-->
                                        </a>
                                    </li>
                         
                                </ul>
                            </div>
                    </div>
                </div>
                <div class="Withdrawtype">
                    <span class="withdrawspan">清分时间：</span>
                    <div class="withdrawselect">
                        <div class="withdrawTime">
                            <div class="week" style="display:none">
                                <ul>
                                    <li class="methList w90 radioBox active weekdate" id="one">
                                        <span>每周</span>
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span>一</span>
                                        </a>
                                    </li>
                                    <li class="methList w185 radioBox weekdate" id="two">
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span>二</span>
                                        </a>
                                    </li>
                                    <li class="methList  radioBox weekdate" id="three" >
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span>三</span>
                                        </a>    
                                    </li>
                                    <li class="methList  radioBox weekdate" id="four" >
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span>四</span>
                                        </a>    
                                    </li>
                                    <li class="methList  radioBox weekdate" id="five" >
                                        <a class="radio" href="javascript: void(0);">
                                            <span class="i_radio"></span>
                                            <span>五</span>
                                        </a>    
                                    </li>
                                    <span class="dropWrap border" style="top:5px;heigth:28px;line-height:28px;left:5px;">
                                        <span class="selectBox drop100" style="top:0px;">
                                            <em class="selected etime" in="2" id="s_number"><span id="daystime">2</span>:00</em>
                                           <i class="iconfont moreIcon" href="###"></i>
                                        </span>
                                        <div class="dropBox drop100">
                                            <ul class="daynum" style="height:187px;overflow:auto"></ul> 
                                        </div>
                                    </span>
                                </ul>
                            </div>
                            <div class="days"  >
                                <span class="dropWrap border" style="top:5px;heigth:28px;line-height:28px;left:5px;">
                                        <span class="selectBox drop100" style="top:0px;">
                                            <em class="selected etime" in="2" id="s_number"><span id="ddaystime">2</span>:00</em>
                                           <i class="iconfont moreIcon" href="###"></i>
                                        </span>
                                        <div class="dropBox drop100">
                                            <ul class="daynum" style="height:187px;overflow:auto"></ul> 
                                        </div>
                                   </span>
                            </div>
                            <div class="mouth" style="display:none">
                                  <span style="margin-left:5px;margin-top:5px;">每月</span>
                                  <span class="dropWrap  border" style="top:1px;heigth:28px;line-height:28px;left:5px;">
                                        <span class="selectBox drop100" style="top:0px;">
                                            <em class="selected" id="mouthtime">1</em>
                                           <i class="iconfont moreIcon" href="###"></i>
                                        </span>
                                        <div class="dropBox drop100">
                                            <ul class="mnum" style="height:187px;overflow:auto"></ul> 
                                        </div>
                                   </span>
                                   <span style="margin-left:5px;margin-top:5px;">日，</span>
                                    <span class="dropWrap  border" style="top:1px;heigth:28px;line-height:28px;left:5px;">
                                        <span class="selectBox drop100" style="top:0px;">
                                            <em class="selected etime" in="2"><span id="mdaytime">2</span>:00</em>
                                           <i class="iconfont moreIcon" href="###"></i>
                                        </span>
                                        <div class="dropBox drop100">
                                           <ul class="daynum" style="height:187px;overflow:auto"></ul> 
                                        </div>
                                   </span>
                            </div>
                        
                        </div>
                    </div>
                </div>
                <div class="Withdrawtype">
                    <span class="withdrawspan">提现账户：</span>
                    <div class="withdrawselect">
                        <ul class="withaccount"></ul>
                    </div>
                 </div>
            </div>
            <div class="withsave">
                <div class="savebtn">
                    <a id="close" class="searchBtnb ctrlBtn" href="javascript:;">取消</a>
                    <a id="sure" class="recoverSearchBtnb ctrlBtn" data-fid="<?=$a['id']?>" href="javascript:;">保存</a>
                </div>
            </div>  
      </div>
      <style>
      /*之前老的css*/
        #search{width:200px;heigth:30px;line-height:30px;padding-left:5px;}
        .wrap{width:80%; float:right;}
        table{width:100%; border-top: 1px solid #d5dde0; border-left: 1px solid #d5dde0; margin-bottom:10px; line-height:30px;}
        th{background:#f2f7fa; color:#62676a;}
        .border{border: 1px solid #C9C9C9;-moz-box-shadow: 0px 1px 1px rgba(0,0,0,.08) inset;-webkit-box-shadow: 0px 1px 1px rgba(0,0,0,.08) inset;box-shadow: 0px 1px 1px rgba(0,0,0,.08) inset;border-radius: 3px;-moz-border-radius: 3px;}
        th,td{ text-align:center; border-bottom: 1px solid #d5dde0; border-right: 1px solid #d5dde0;}
        .fenyeiWrap{<!-- width:77%; --> }
        td input.set{width:60px; height:20px; text-align:center; line-height:20px\9; }
        #perPageWrap{display:none;}
        .act_btn{float:right; height:22px; line-height:22px\9; border: 1px solid #ACACAC; padding: 0 5px 1px; padding: 0 8px\9; cursor:pointer;}
        .fenyeiWrap{margin-top:50px;float:right;}
        @media screen and (-webkit-min-device-pixel-ratio:0) {.set{line-height:24px;}}
        p{padding-left:0px;margin-bottom:5px;}
        p input{vertical-align:-5px\9;margin-right:10px;}
        p button{line-height:20px;cursor: pointer;border:none;width: 80px;height: 32px;line-height: 32px;margin-right: 10px;text-align: center;border-radius: 3px;margin-top: 1px;background: #2a98da;color: #fff;}
        .radiot{padding:0 5px;}
        .set_radio{vertical-align: -2px;}
        .tbFees{table-layout:fixed;}
        .setWidth{width: 90px;}
        .setWidth_a{width: 72px;}
        .setWidth_b{width:105px;}
        .setWidth_c{width:65px;}
        .active .close{background-position: 0 -25px;}
        .w120{width:120px;float:left;color:black}
      
      
      
      .auto_withdraw{cursor:pointer;}
      .bank span{float:left;width:100%;height:20px;line-height:20px;}
      .radio{padding-left: 18px; position: relative;}
      .radio .i_radio{position: absolute; top: 1px; left: 0; display: inline-block; width: 14px; height: 14px; background: url(http://images.12301.cc/icon/check.png) no-repeat; }.radio .i_radio,.check .i_check{position: absolute; top: 1px; left: 0; display: inline-block; width: 14px; height: 14px; background: url(http://images.12301.cc/icon/check.png) no-repeat; }.radio .i_radio,.check .i_check{position: absolute; top: 1px; left: 0; display: inline-block; width: 14px; height: 14px; background: url(http://images.12301.cc/icon/check.png) no-repeat; }
      .active .radio .i_radio{background-position: -14px 0;}
      .listWrap .methList{float: left; margin-right: 3px; padding:0 5px;display: inline-block; line-height: 35px; background: #F5F5F5; border: 1px solid #F5F5F5; margin-bottom: 1px;} 
      .hideline{width:120px;}
      .curl{float:left;text-align: left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor: pointer;}
      .alertbox{display:none;width: 550px;height: 550px;padding-bottom: 20px;background: #FFFFFF;border: 2px solid #E5E5E5;position: fixed;top: 100px;left: 50%;margin-left: -200px;z-index: 99;}
      .alertbox .topbox{float:left;width:100%;height:40px;line-height:40px;background:#E2E2E2;}
      .alertbox .topbox .topboxspan{font-size:16px;padding-left:10px;}
      .alertbox .topbox .toplasttime{margin-left:10px;color:#D445D1;}
      .alertbox .withsave{float:left;width:100%;height:80px;border-top:1px solid #dddddd;}
      .alertbox .withsave .savebtn{ clear: both;margin-top: 21px;margin-bottom: 5px;overflow: hidden;padding-left: 142px;}
      .alertbox .withsave .ctrlBtn{ display:block; float:left; width:120px; height:32px; line-height:32px; margin-right:10px; text-align:center; border-radius:3px; margin-top:1px; background:#2a98da; color:#fff}
      .alertbox .withsave .searchBtnb{background:white;border:1px solid #2a98da;color:#2a98da;}
      .alertbox .withsave .recoverSearchBtnb{color:white;}
      .alertbox .alertcom{float:left;width:505px;padding:20px;height:auto;margin-bottom: 10px;}
      .alertbox .alertcom .Withdrawtype{float:left;height:40px;line-height:40px;margin-bottom:10px;}
      .alertbox .alertcom span.withdrawspan {float: left;display: inline-block;width: 102px;font-size: 14px;}
      .alertbox .alertcom .withdrawselect {float: left;background: white;width: 400px;height: 35px;margin-top:5px;}
      .alertbox .alertcom .dropWrap{position: relative;margin-bottom: 3px;display: inline-block;vertical-align: middle;}   
      .alertbox .alertcom .selectBox{position: relative; top: -1px;top: -2px\9; display: inline-block; padding-left: 5px; font-size: 14px; cursor: pointer; color: #6C7882;   background: #FFFFFF; }
      .alertbox .alertcom .withdrawTime{width:396px;height:35px;line-height:35px;background:#EEEEEE;}
      .alertbox .alertcom .border{border: 1px solid #C9C9C9;-moz-box-shadow: 0px 1px 1px rgba(0,0,0,.08) inset;-webkit-box-shadow: 0px 1px 1px rgba(0,0,0,.08) inset;box-shadow: 0px 1px 1px rgba(0,0,0,.08) inset;border-radius: 3px;-moz-border-radius: 3px;}
      .alertbox .alertcom .moreIcon{display: inline-block; position: absolute; right: 0; font-size: 25px; background: #F8FAFA; border-left: 1px solid #C9C9C9;}
      .alertbox .alertcom .dropBox{display: none; position: absolute; left:-1px; border: 1px solid #C9C9C9; cursor: pointer; background: #FFFFFF;z-index:99;}
      .alertbox .alertcom .dropBox  li{ height: 30px; line-height: 30px;padding-left: 5px;}
      .alertbox .alertcom .dropBox  li:hover{background: #E0E0E0;}
      .alertbox .alertcom .withtitle{position:relative;top:-37px;left:374px}
      .alertbox .alertcom .bwithtitle{position:relative;left:-26px}
      .alertbox .alertcom .dropWrap.active .dropBox{display: block;}
      .alertbox .alertcom .week{float:left;width:380px;height:35px;line-height:35px;}
      .alertbox .alertcom .week li{float:left;margin-left:5px;}
      .alertbox .alertcom .week .radio{color:black;text-decoration:none;} 
      .alertbox .alertcom .yuliu{float:left;width:400px;height:35px;line-height:35px;}
      .alertbox .alertcom .yuliu li{float:left;margin-left:0px;}
      .alertbox .alertcom .yuliu .radio{color:black;text-decoration:none;} 
      .alertbox .alertcom .yuliu .tspan{display:inline-block;width:63px;} 
      .alertbox .alertcom .w44{width:44px;border-left: 0 none;background: #EEEEEE;line-height: 35px;left: -4px;top: 1px;}
      .alertbox .alertcom .w296{width:275px;height:35px;line-height:35px;}
        @-moz-document url-prefix(){.alertbox .alertcom .w296{height:50px;width:275px;line-height:35px;}} /*火狐*/
        @media screen and (-webkit-min-device-pixel-ratio:0) {.alertbox .alertcom .w296{width:296px;height:35px;line-height:35px;}}/*谷歌*/
      .alertbox .alertcom .w300{width: 334px; height: 35px; line-height: 35px;}
      .alertbox .alertcom .w398{width: 393px; }
      .alertbox .alertcom .w389{width: 389px; height: 35px; line-height: 35px;}
      .alertbox .alertcom .w384{width: 384px; top: 36px; }
      .alertbox .alertcom .baseInp { height: 24px;line-height: 24px;padding: 5px;}
      .alertbox .alertcom .withaccount li{float:left;display:inline-block;width:188px;height:60px;padding-left:5px;line-height:60px;border:1px solid #dddddd;margin-right:5px;cursor:pointer;}
      .selectBox {border-left: 0 none;background: #EEEEEE;}
      .dropBox.drop30 {width: 47px;z-index: 999;top: 38px;}
      .dropBox.drop100 {width: 90px;top: 25px;}
      .selectBox.drop100 {width: 85px;height: 25px;line-height: 25px;}
      .iconk{position: absolute;cursor:pointer;top:69px;left:121px;display: inline-block;width: 56px; height: 25px;background: url(http://static.12301.cc/images/opcolse.png) no-repeat;}
      .alertbox .alertcom .withaccount .acborder{border:1px solid red}
      .alertbox .alertcom .withaccount .nocursor {cursor: not-allowed}
      
      
      
      </style>