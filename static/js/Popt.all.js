/*!
* Iput Dialog Plugin v1.0
* Date: 2013-11-19 10:55:11 
* http://www.huanqw.com/inpt/
* Copyright 2013-2015 hunaqw.com
*/
var Iput = {
    confg: {
        hand: "0", //0对像位置1鼠标位置divID滚动位置
        idIframe: "PoPx", //默认可不用改
        idBox: "PoPy", //默认可不用改
        content: "", //传过来的内容
        ok: null, //弹出框之后执行的函数
        id: null, //不能为空一般传this对像而不是对像ID
        event: window.event, //这个必写一般为e就可以了
        top: 0, //顶部偏移位置
        left: 0, //左部偏移位置
        bodyHeight: 0, //在被position:absolute元素下得到HTML真实高度
        bodyWidth: 0,
        width: 0,
        pop: null //指定ID点击时不关闭
    },
    get: function (obj) { return document.getElementById(obj); },
    lft: function (e) {
        var l = 0;
        while (e) { l += e.offsetLeft; e = e.offsetParent; }
        return l
    },
    ltp: function (e) {
        var t = 0;
        while (e) { t += e.offsetTop; e = e.offsetParent; }
        return t
    },
    clear: function () {
        Iput.confg.hand = "0"; Iput.confg.ok = null; Iput.confg.top = 0; Iput.confg.left = 0; Iput.confg.bodyHeight = 0; Iput.confg.bodyWidth = 0; Iput.confg.width = 0; Iput.confg.pop = null;
    },
    stopBubble: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();    //w3c
        } else {
            window.event.cancelBubble = true; //IE
        }
    },
    pop: function () {
        var $a = document.getElementsByTagName("body").item(0);
        var $c = document.createElement("iframe");
        var $b = document.createElement("div");
        $c.setAttribute('id', Iput.confg.idIframe);
        $c.setAttribute("src", "about:blank");
        $c.style.zindex = '100';
        $c.frameBorder = "0";
        $c.style.width = "0px";
        $c.style.height = "0px";
        $c.style.position = 'absolute';
        $b.setAttribute('id', Iput.confg.idBox);
        $b.setAttribute('align', 'left');
        $b.style.position = 'absolute';
        $b.style.background = 'transparent';
        $b.style.zIndex = '8888';
        if ($a) {
            if (Iput.get(Iput.confg.idIframe)) {
                Iput.colse();
            }
            $a.appendChild($c);
            if ($c) {
                $c.ownerDocument.body.appendChild($b);
            }
            Iput.get(Iput.confg.idBox).innerHTML = Iput.confg.content;
            Iput.drice(Iput.confg.event);
        }

        if (!document.all) {
            window.document.addEventListener("click", Iput.hide, false);
        }
        else {
            window.document.attachEvent("onclick", Iput.hide);
        }
    },
    drice: function (e) {
        var bodyHith = Iput.confg.bodyHeight == 0 ? document.body.parentNode.offsetHeight : Iput.confg.bodyHeight;
        var bodywidth = Iput.confg.bodyWidth == 0 ? document.body.parentNode.offsetWidth : Iput.confg.bodyWidth;
        if (!e) e = window.event;
        var top = 0, left = 0;
        var a = Iput.get(Iput.confg.idBox);
        var b = Iput.get(Iput.confg.idIframe);
        var c = Iput.confg.id.offsetHeight;
        var d = Iput.confg.id.offsetWidth;
        var w = 0;
        if (Iput.get(Iput.confg.idIframe)) {
            if (Iput.confg.hand == "1") {
                top = Iput.confg.top + document.body.scrollTop + document.documentElement.scrollTop + e.clientY;
                left = Iput.confg.left + e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                if (a.offsetHeight + top > bodyHith) { top = top - a.offsetHeight + Iput.get(Iput.confg.idBox).firstChild.offsetHeight; }
                if (a.offsetWidth + left > bodywidth) { left = left - a.offsetWidth + Iput.get(Iput.confg.idBox).firstChild.offsetWidth; }
                a.style.top = top + "px";
                b.style.top = top + "px";
                a.style.left = left + "px";
                b.style.left = left + "px";
            }
            else if (Iput.confg.hand == "0") {
                w = Iput.confg.width == 0 ? (d - 2 + "px") : Iput.confg.width;
                a.style.width = w;
                height = c;
                top = Iput.confg.top + Iput.ltp(Iput.confg.id);
                left = Iput.confg.left + Iput.lft(Iput.confg.id);
                if (a.firstChild.offsetHeight + top + c > bodyHith) { top = top - a.firstChild.offsetHeight - c; }
                if (a.firstChild.offsetWidth + left > bodywidth) { left = left - a.firstChild.offsetWidth + d; }
                b.style.top = top + "px";
                a.style.top = top + height + "px";
                b.style.left = left + "px";
                a.style.left = left + "px";
            }
            else {
                height = c;
                top = Iput.confg.top - Iput.get(Iput.confg.hand).scrollTop + Iput.ltp(Iput.confg.id);
                left = Iput.confg.left - Iput.get(Iput.confg.hand).scrollLeft + Iput.lft(Iput.confg.id);

                if (a.offsetHeight + top > bodyHith) { top = top - a.offsetHeight - c; }
                if (a.offsetWidth + left > bodywidth) { left = left - a.offsetWidth - d; }

                b.style.top = top + height + "px";
                a.style.top = top + height + "px";
                b.style.left = left + "px";
                a.style.left = left + "px";
            }
        }
    },
    show: function () {
        var config = arguments[0]; var that = Iput.confg;
        Iput.clear();
        for (var i in that) { if (config[i] != undefined) { that[i] = config[i]; } };
        Iput.pop();
        if (Iput.confg.ok != null) {
            Iput.action(Iput.confg.ok());
        }
    },
    colse: function () {
        if (Iput.get(Iput.confg.idIframe)) {
            document.body.removeChild(Iput.get(Iput.confg.idBox));
            document.body.removeChild(Iput.get(Iput.confg.idIframe));
        }
        if (Iput.get(Iput.confg.pop)) {
            Iput.get(Iput.confg.pop).style.display = "none";
        }
    },
    $colse: function () { Iput.colse(); },
    hide: function (e) {//点击任何处关闭层
        e = window.event || e;
        var srcElement = e.srcElement || e.target;
        if (Iput.confg.event == undefined) {//输入时用,般在没传入Iput.confg.event请况下使用
            Iput.colse();
        }
        else {
            var a = Iput.confg.event.srcElement || Iput.confg.event.target;
            var b = Iput.get(Iput.confg.pop);
            if (a != srcElement) { Iput.colse(); }
            if (b != null) {
                if (b != srcElement && a != srcElement) { Iput.colse(); }
            }
        }
        if (Iput.get(Iput.confg.idIframe)) {
            Iput.get(Iput.confg.idIframe).onclick = function (e) { Iput.stopBubble(e); };
            Iput.get(Iput.confg.idBox).onclick = function (e) { Iput.stopBubble(e); };
        }
        if (Iput.get(Iput.confg.pop)) {
            Iput.get(Iput.confg.pop).onclick = function (e) { Iput.stopBubble(e); };
        }
    },
    action: function (obj) {
        eval(obj);
    }
}
