//huangzy 2017/04/25
//新增写入卡信息功能
//需求：http://bug.12301.test/index.php?m=task&f=view&task=588

var Message = require("pft-ui-component/Message");
var Validate = require("COMMON/Components/Validator/v1.0");
var ValidateRule = Validate.Rules;
var WriteCardInfo = PFT.Util.Class({
    wsUri : "ws://localhost:12301/icread/",
    info : {
        idCard : "",     //身份证
        card_no : "",    //实体卡号
        mobile : "",     //手机号
        phy_no : ""      //物理卡号
    },
    init : function(info){
        this.fid = $("#fidHidInp").val();
        this.refreshInfo(info);
        this.initWS();
    },
    initWS : function(){
        var that = this;
        if(!this.isWebSocketSupport()) return false;
        var ws = this.ws = new WebSocket(this.wsUri);
        ws.onmessage = function(evt){
            var data = evt.data;
            data = JSON.parse(data);
            var code = data.code;
            var msg = data.msg || "-";
            if(code==200){ //成功
                if(data.data){ //data里有data值，说明是读卡
                    that.onReadKaSuccess(data.data);
                }else{ //写卡
                    that.onWriteCardInfoSuccess();
                }
            }else{
                Message.alert("写卡失败，失败原因："+msg)
            }
        };
        ws.onerror = function(evt){
            var data = evt.data;
            Message.error(data);
        };
        ws.onopen = function(evt){}
    },
    onWriteCardInfoSuccess : function(){
        var that = this;
        Message.success("写卡成功");
        PFT.Util.Ajax("r/product_MemberCardBasic/isWrited/",{
            type : "post",
            params : {
                physics : that.info.phy_no
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                if(code==200){
                    setTimeout(function(){
                        window.location.href = PFT.PREFIX_DOMAIN() + "mcard_list.html";
                    },100)
                }else{
                    Message.alert(msg);
                }
            },
            timeout : function(){ Message.error(PFT.AJAX_TIMEOUT_TEXT);},
            serverError : function(){Message.error(PFT.AJAX_ERROR_TEXT)}
        })
    },
    onReadKaSuccess : function(card_no){
        $("#phy_no_inp").val(card_no);
    },
    /**
     * 刷新info
     * info = {
     *      idCard : "",
     *      card_no : "",
     *      mobile : ""
     * }
     */
    refreshInfo : function(data){
        //先重置为空
        var info = this.info = {};
        for(var i in data) info[i] = data[i];
    },
    validate_mobile : function(){
        var mobile = this.info.mobile;
        var res = ValidateRule.mobile(mobile);
        if(!res.isOk) Message.error(res.errMsg);
        return res.isOk;
    },
    validate_idCard : function(){
        var idCard = this.info.idCard;
        var res = ValidateRule.idcard(idCard);
        if(!res.isOk) Message.error(res.errMsg);
        return res.isOk;
    },
    validate_card_no : function(){
        var card_no = this.info.card_no;
        if(!card_no) Message.error("实体卡号不能为空");
        return card_no ? true : false;
    },
    isWebSocketSupport : function(){
        return typeof window.WebSocket==="function";
    },
    getWriteCardInfo : function(){
        var info = this.info;
		var memberID = $("#memberID_hidInp").val();
		var aid = $("#aid_hidInp").val();
		var dname = $("#dname_hidInp").val();
		var mobile = info.mobile;
		var idCard = info.idCard;
		var card_no = info.card_no;
        return{
            memberID : memberID,
            aid : aid,
            dname : dname,
            mobile : mobile,
            idCard : idCard,
            card_no : card_no,
        }
    },
    setDname : function(dname){
        dname = dname || "";
        this.info.dname = dname;
    },
    setMemberID : function(memberID){
        memberID = memberID || "";
        this.info.memberID = memberID;
    },
    sendDataToSocket : function(data){
        if(!this.ws) return false;
        var that = this;
        var info = this.getWriteCardInfo();
		var memberID = info.memberID;
		var aid = info.aid;
		var dname = info.dname;
		var mobile = info.mobile;
		var idCard = info.idCard;
		var card_no = info.card_no;
        var str = memberID+","+aid+","+mobile+","+idCard+","+card_no+","+dname;
        var entryBtn = $("#writeCardBtn");
        var orText = entryBtn.html();

        PFT.Util.Ajax("r/product_MemberCardBasic/encryptCardData/",{
            type : "post",
            params : {
                data : str
            },
            loading : function(){
                entryBtn.html("请稍后..").addClass("disable");
            },
            complete : function(){
                entryBtn.html(orText).removeClass("disable");
            },
            success : function(res){
                var code = res.code;
                var data = res.data.data;
                var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                if(code==200){
                    // var all = {cmd:"writeall",data:{block:4,data:data}};
                    // all = JSON.stringify(all);
                    var strData = '{"cmd":"writeall","data":"{\\\"block\\\":4,\\\"data\\\":\\\"'+data+'\\\"}"}';
                    that.ws.send(strData);
                }else{
                    Message.error(msg+", 错误代码："+code);
                }
            },
            serverError : function(xhr,errText){
                Message.error(errText+": "+PFT.AJAX_ERROR_TEXT);
            }
        })

        
    },
    write : function(){
        var info = this.getWriteCardInfo();
		var memberID = info.memberID;
		var aid = info.aid;
		var dname = info.dname;
		var mobile = info.mobile;
		var idCard = info.idCard;
		var card_no = info.card_no;
        var phy_no = info.phy_no;

        if(!memberID) return Message.error("缺少memberID");
        if(!aid) return Message.error("aid");
        if(!dname) return Message.error("缺少dname");

        if(!mobile && !idCard && !card_no && !phy_no) return Message.alert("请先开卡，开卡成功后才能将信息写入卡里");

        //先验证一下这三个字段，确保3个参数都可用
        if(!this.validate_mobile()) return false;
        if(!this.validate_idCard()) return false;
        if(!this.validate_card_no()) return false;
        if(!this.isWebSocketSupport()) return Message.alert("您的浏览器不支持WebSocket，请更换浏览器，建议使用：谷歌、火狐、360极速模式、IE10+ 等浏览器");

        this.sendDataToSocket();

	},
    readKa : function(){
        this.ws.send('{"cmd":"read"}');
    }
});

module.exports = WriteCardInfo;