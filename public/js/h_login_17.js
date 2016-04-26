var $ = window.Simple = function (a) {
    return typeof (a) == "string" ? document.getElementById(a) : a
};
$.cookie = {
    get: function (b) {
        var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
        return !a ? "" : decodeURIComponent(a[2])
    },
    getOrigin: function (b) {
        var a = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
        return !a ? "" : (a[2])
    },
    set: function (c, e, d, f, a) {
        var b = new Date();
        if (a) {
            b.setTime(b.getTime() + 3600000 * a);
            document.cookie = c + "=" + e + "; expires=" + b.toGMTString() + "; path=" + (f ? f : "/") + "; " + (d ? ("domain=" + d + ";") : "")
        } else {
            document.cookie = c + "=" + e + "; path=" + (f ? f : "/") + "; " + (d ? ("domain=" + d + ";") : "")
        }
    },
    del: function (a, b, c) {
        document.cookie = a + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (c ? c : "/") + "; " + (b ? ("domain=" + b + ";") : "")
    },
    uin: function () {
        var a = $.cookie.get("uin");
        return !a ? null : parseInt(a.substring(1, a.length), 10)
    }
};
$.http = {
    getXHR: function () {
        return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
    },
    ajax: function (url, para, cb, method, type) {
        var xhr = $.http.getXHR();
        xhr.open(method, url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status === 1223 || xhr.status === 0) {
                    if (typeof (type) == "undefined" && xhr.responseText) {
                        cb(eval("(" + xhr.responseText + ")"))
                    } else {
                        cb(xhr.responseText);
                        if ((!xhr.responseText) && $.badjs._smid) {
                            $.badjs("HTTP Empty[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)
                        }
                    }
                } else {
                    if ($.badjs._smid) {
                        $.badjs("HTTP Error[xhr.status]:" + xhr.status, url, 0, $.badjs._smid)
                    }
                }
                xhr = null
            }
        };
        xhr.send(para);
        return xhr
    },
    post: function (c, b, a, f) {
        var e = "";
        for (var d in b) {
            e += "&" + d + "=" + b[d]
        }
        return $.http.ajax(c, e, a, "POST", f)
    },
    get: function (c, b, a, e) {
        var f = [];
        for (var d in b) {
            f.push(d + "=" + b[d])
        }
        if (c.indexOf("?") == -1) {
            c += "?"
        }
        c += f.join("&");
        return $.http.ajax(c, null, a, "GET", e)
    },
    jsonp: function (a) {
        var b = document.createElement("script");
        b.src = a;
        document.getElementsByTagName("head")[0].appendChild(b)
    },
    loadScript: function (c, d, b) {
        var a = document.createElement("script");
        a.onload = a.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                if (typeof d == "function") {
                    d()
                }
                a.onload = a.onreadystatechange = null;
                if (a.parentNode) {
                    a.parentNode.removeChild(a)
                }
            }
        };
        a.src = c;
        document.getElementsByTagName("head")[0].appendChild(a)
    },
    preload: function (a) {
        var b = document.createElement("img");
        b.src = a;
        b = null
    }
};
$.get = $.http.get;
$.post = $.http.post;
$.jsonp = $.http.jsonp;
$.browser = function (b) {
    if (typeof $.browser.info == "undefined") {
        var a = {
            type: ""
        };
        var c = navigator.userAgent.toLowerCase();
        if (/chrome/.test(c)) {
            a = {
                type: "chrome",
                version: /chrome[\/ ]([\w.]+)/
            }
        } else {
            if (/opera/.test(c)) {
                a = {
                    type: "opera",
                    version: /version/.test(c) ? /version[\/ ]([\w.]+)/ : /opera[\/ ]([\w.]+)/
                }
            } else {
                if (/msie/.test(c)) {
                    a = {
                        type: "msie",
                        version: /msie ([\w.]+)/
                    }
                } else {
                    if (/mozilla/.test(c) && !/compatible/.test(c)) {
                        a = {
                            type: "ff",
                            version: /rv:([\w.]+)/
                        }
                    } else {
                        if (/safari/.test(c)) {
                            a = {
                                type: "safari",
                                version: /safari[\/ ]([\w.]+)/
                            }
                        }
                    }
                }
            }
        }
        a.version = (a.version && a.version.exec(c) || [0, "0"])[1];
        $.browser.info = a
    }
    return $.browser.info[b]
};
$.e = {
    _counter: 0,
    _uid: function () {
        return "h" + $.e._counter++
    },
    add: function (c, b, f) {
        if (typeof c != "object") {
            c = $(c)
        }
        if (document.addEventListener) {
            c.addEventListener(b, f, false)
        } else {
            if (document.attachEvent) {
                if ($.e._find(c, b, f) != -1) {
                    return
                }
                var g = function (h) {
                    if (!h) {
                        h = window.event
                    }
                    var d = {
                        _event: h,
                        type: h.type,
                        target: h.srcElement,
                        currentTarget: c,
                        relatedTarget: h.fromElement ? h.fromElement : h.toElement,
                        eventPhase: (h.srcElement == c) ? 2 : 3,
                        clientX: h.clientX,
                        clientY: h.clientY,
                        screenX: h.screenX,
                        screenY: h.screenY,
                        altKey: h.altKey,
                        ctrlKey: h.ctrlKey,
                        shiftKey: h.shiftKey,
                        keyCode: h.keyCode,
                        data: h.data,
                        origin: h.origin,
                        stopPropagation: function () {
                            this._event.cancelBubble = true
                        },
                        preventDefault: function () {
                            this._event.returnValue = false
                        }
                    };
                    if (Function.prototype.call) {
                        f.call(c, d)
                    } else {
                        c._currentHandler = f;
                        c._currentHandler(d);
                        c._currentHandler = null
                    }
                };
                c.attachEvent("on" + b, g);
                var e = {
                    element: c,
                    eventType: b,
                    handler: f,
                    wrappedHandler: g
                };
                var j = c.document || c;
                var a = j.parentWindow;
                var k = $.e._uid();
                if (!a._allHandlers) {
                    a._allHandlers = {}
                }
                a._allHandlers[k] = e;
                if (!c._handlers) {
                    c._handlers = []
                }
                c._handlers.push(k);
                if (!a._onunloadHandlerRegistered) {
                    a._onunloadHandlerRegistered = true;
                    a.attachEvent("onunload", $.e._removeAllHandlers)
                }
            }
        }
    },
    remove: function (e, c, g) {
        if (document.addEventListener) {
            e.removeEventListener(c, g, false)
        } else {
            if (document.attachEvent) {
                var b = $.e._find(e, c, g);
                if (b == -1) {
                    return
                }
                var k = e.document || e;
                var a = k.parentWindow;
                var j = e._handlers[b];
                var f = a._allHandlers[j];
                e.detachEvent("on" + c, f.wrappedHandler);
                e._handlers.splice(b, 1);
                delete a._allHandlers[j]
            }
        }
    },
    _find: function (e, a, l) {
        var b = e._handlers;
        if (!b) {
            return -1
        }
        var j = e.document || e;
        var k = j.parentWindow;
        for (var f = b.length - 1; f >= 0; f--) {
            var c = b[f];
            var g = k._allHandlers[c];
            if (g.eventType == a && g.handler == l) {
                return f
            }
        }
        return -1
    },
    _removeAllHandlers: function () {
        var a = this;
        for (id in a._allHandlers) {
            var b = a._allHandlers[id];
            b.element.detachEvent("on" + b.eventType, b.wrappedHandler);
            delete a._allHandlers[id]
        }
    },
    src: function (a) {
        return a ? a.target : event.srcElement
    },
    stopPropagation: function (a) {
        a ? a.stopPropagation() : event.cancelBubble = true
    },
    trigger: function (c, b) {
        var e = {
            HTMLEvents: "abort,blur,change,error,focus,load,reset,resize,scroll,select,submit,unload",
            UIEevents: "keydown,keypress,keyup",
            MouseEvents: "click,mousedown,mousemove,mouseout,mouseover,mouseup"
        };
        if (document.createEvent) {
            var d = "";
            (b == "mouseleave") && (b = "mouseout");
            (b == "mouseenter") && (b = "mouseover");
            for (var f in e) {
                if (e[f].indexOf(b)) {
                    d = f;
                    break
                }
            }
            var a = document.createEvent(d);
            a.initEvent(b, true, false);
            c.dispatchEvent(a)
        } else {
            if (document.createEventObject) {
                c.fireEvent("on" + b)
            }
        }
    }
};
$.bom = {
    query: function (b) {
        var a = window.location.search.match(new RegExp("(\\?|&)" + b + "=([^&]*)(&|$)"));
        return !a ? "" : decodeURIComponent(a[2])
    },
    getHash: function (b) {
        var a = window.location.hash.match(new RegExp("(#|&)" + b + "=([^&]*)(&|$)"));
        return !a ? "" : decodeURIComponent(a[2])
    }
};
$.winName = {
    set: function (c, a) {
        var b = window.name || "";
        if (b.match(new RegExp(";" + c + "=([^;]*)(;|$)"))) {
            window.name = b.replace(new RegExp(";" + c + "=([^;]*)"), ";" + c + "=" + a)
        } else {
            window.name = b + ";" + c + "=" + a
        }
    },
    get: function (c) {
        var b = window.name || "";
        var a = b.match(new RegExp(";" + c + "=([^;]*)(;|$)"));
        return a ? a[1] : ""
    },
    clear: function (b) {
        var a = window.name || "";
        window.name = a.replace(new RegExp(";" + b + "=([^;]*)"), "")
    }
};
$.localData = function () {
    var a = "ptlogin2.qq.com";
    var d = /^[0-9A-Za-z_-]*$/;
    var b;

    function c() {
        var g = document.createElement("link");
        g.style.display = "none";
        g.id = a;
        document.getElementsByTagName("head")[0].appendChild(g);
        g.addBehavior("#default#userdata");
        return g
    }

    function e() {
        if (typeof b == "undefined") {
            if (window.localStorage) {
                b = localStorage
            } else {
                try {
                    b = c();
                    b.load(a)
                } catch (g) {
                    b = false;
                    return false
                }
            }
        }
        return true
    }

    function f(g) {
        if (typeof g != "string") {
            return false
        }
        return d.test(g)
    }
    return {
        set: function (g, h) {
            var k = false;
            if (f(g) && e()) {
                try {
                    h += "";
                    if (window.localStorage) {
                        b.setItem(g, h);
                        k = true
                    } else {
                        b.setAttribute(g, h);
                        b.save(a);
                        k = b.getAttribute(g) === h
                    }
                } catch (j) {}
            }
            return k
        },
        get: function (g) {
            if (f(g) && e()) {
                try {
                    return window.localStorage ? b.getItem(g) : b.getAttribute(g)
                } catch (h) {}
            }
            return null
        },
        remove: function (g) {
            if (f(g) && e()) {
                try {
                    window.localStorage ? b.removeItem(g) : b.removeAttribute(g);
                    return true
                } catch (h) {}
            }
            return false
        }
    }
}();
$.str = (function () {
    var htmlDecodeDict = {
        quot: '"',
        lt: "<",
        gt: ">",
        amp: "&",
        nbsp: " ",
        "#34": '"',
        "#60": "<",
        "#62": ">",
        "#38": "&",
        "#160": " "
    };
    var htmlEncodeDict = {
        '"': "#34",
        "<": "#60",
        ">": "#62",
        "&": "#38",
        " ": "#160"
    };
    return {
        decodeHtml: function (s) {
            s += "";
            return s.replace(/&(quot|lt|gt|amp|nbsp);/ig, function (all, key) {
                return htmlDecodeDict[key]
            }).replace(/&#u([a-f\d]{4});/ig, function (all, hex) {
                return String.fromCharCode(parseInt("0x" + hex))
            }).replace(/&#(\d+);/ig, function (all, number) {
                return String.fromCharCode(+number)
            })
        },
        encodeHtml: function (s) {
            s += "";
            return s.replace(/["<>& ]/g, function (all) {
                return "&" + htmlEncodeDict[all] + ";"
            })
        },
        trim: function (str) {
            str += "";
            var str = str.replace(/^\s+/, ""),
                ws = /\s/,
                end = str.length;
            while (ws.test(str.charAt(--end))) {}
            return str.slice(0, end + 1)
        },
        uin2hex: function (str) {
            var maxLength = 16;
            str = parseInt(str);
            var hex = str.toString(16);
            var len = hex.length;
            for (var i = len; i < maxLength; i++) {
                hex = "0" + hex
            }
            var arr = [];
            for (var j = 0; j < maxLength; j += 2) {
                arr.push("\\x" + hex.substr(j, 2))
            }
            var result = arr.join("");
            eval('result="' + result + '"');
            return result
        },
        bin2String: function (a) {
            var arr = [];
            for (var i = 0, len = a.length; i < len; i++) {
                var temp = a.charCodeAt(i).toString(16);
                if (temp.length == 1) {
                    temp = "0" + temp
                }
                arr.push(temp)
            }
            arr = "0x" + arr.join("");
            arr = parseInt(arr, 16);
            return arr
        },
        utf8ToUincode: function (s) {
            var result = "";
            try {
                var length = s.length;
                var arr = [];
                for (i = 0; i < length; i += 2) {
                    arr.push("%" + s.substr(i, 2))
                }
                result = decodeURIComponent(arr.join(""));
                result = $.str.decodeHtml(result)
            } catch (e) {
                result = ""
            }
            return result
        },
        json2str: function (obj) {
            var result = "";
            if (typeof JSON != "undefined") {
                result = JSON.stringify(obj)
            } else {
                var arr = [];
                for (var i in obj) {
                    arr.push("'" + i + "':'" + obj[i] + "'")
                }
                result = "{" + arr.join(",") + "}"
            }
            return result
        },
        time33: function (str) {
            var hash = 0;
            for (var i = 0, length = str.length; i < length; i++) {
                hash = hash * 33 + str.charCodeAt(i)
            }
            return hash % 4294967296
        }
    }
})();
$.css = function () {
    return {
        getWidth: function (a) {
            return $(a).offsetWidth
        },
        getHeight: function (a) {
            return $(a).offsetHeight
        },
        show: function (a) {
            a.style.display = "block"
        },
        hide: function (a) {
            a.style.display = "none"
        },
        hasClass: function (d, e) {
            if (!d.className) {
                return false
            }
            var b = d.className.split(" ");
            for (var c = 0, a = b.length; c < a; c++) {
                if (e == b[c]) {
                    return true
                }
            }
            return false
        },
        addClass: function (a, b) {
            $.css.updateClass(a, b, false)
        },
        removeClass: function (a, b) {
            $.css.updateClass(a, false, b)
        },
        updateClass: function (d, j, m) {
            var a = d.className.split(" ");
            var g = {},
                e = 0,
                h = a.length;
            for (; e < h; e++) {
                a[e] && (g[a[e]] = true)
            }
            if (j) {
                var f = j.split(" ");
                for (e = 0, h = f.length; e < h; e++) {
                    f[e] && (g[f[e]] = true)
                }
            }
            if (m) {
                var b = m.split(" ");
                for (e = 0, h = b.length; e < h; e++) {
                    b[e] && (delete g[b[e]])
                }
            }
            var l = [];
            for (var c in g) {
                l.push(c)
            }
            d.className = l.join(" ")
        },
        setClass: function (b, a) {
            b.className = a
        }
    }
}();
$.animate = {
    fade: function (d, h, b, e, m) {
        d = $(d);
        if (!d) {
            return
        }
        if (!d.effect) {
            d.effect = {}
        }
        var f = Object.prototype.toString.call(h);
        var c = 100;
        if (!isNaN(h)) {
            c = h
        } else {
            if (f == "[object Object]") {
                if (h) {
                    if (h.to) {
                        if (!isNaN(h.to)) {
                            c = h.to
                        }
                        if (!isNaN(h.from)) {
                            d.style.opacity = h.from / 100;
                            d.style.filter = "alpha(opacity=" + h.from + ")"
                        }
                    }
                }
            }
        } if (typeof (d.effect.fade) == "undefined") {
            d.effect.fade = 0
        }
        window.clearInterval(d.effect.fade);
        var b = b || 1,
            e = e || 20,
            g = window.navigator.userAgent.toLowerCase(),
            l = function (n) {
                var p;
                if (g.indexOf("msie") != -1) {
                    var o = (n.currentStyle || {}).filter || "";
                    p = o.indexOf("opacity") >= 0 ? (parseFloat(o.match(/opacity=([^)]*)/)[1])) + "" : "100"
                } else {
                    var q = n.ownerDocument.defaultView;
                    q = q && q.getComputedStyle;
                    p = 100 * (q && q(n, null)["opacity"] || 1)
                }
                return parseFloat(p)
            },
            a = l(d),
            j = a < c ? 1 : -1;
        if (g.indexOf("msie") != -1) {
            if (e < 15) {
                b = Math.floor((b * 15) / e);
                e = 15
            }
        }
        var k = function () {
            a = a + b * j;
            if ((Math.round(a) - c) * j >= 0) {
                d.style.opacity = c / 100;
                d.style.filter = "alpha(opacity=" + c + ")";
                window.clearInterval(d.effect.fade);
                if (typeof (m) == "function") {
                    m(d)
                }
            } else {
                d.style.opacity = a / 100;
                d.style.filter = "alpha(opacity=" + a + ")"
            }
        };
        d.effect.fade = window.setInterval(k, e)
    },
    animate: function (b, c, h, s, g) {
        b = $(b);
        if (!b) {
            return
        }
        if (!b.effect) {
            b.effect = {}
        }
        if (typeof (b.effect.animate) == "undefined") {
            b.effect.animate = 0
        }
        for (var n in c) {
            c[n] = parseInt(c[n]) || 0
        }
        window.clearInterval(b.effect.animate);
        var h = h || 10,
            s = s || 20,
            j = function (w) {
                var v = {
                    left: w.offsetLeft,
                    top: w.offsetTop
                };
                return v
            },
            u = j(b),
            f = {
                width: b.clientWidth,
                height: b.clientHeight,
                left: u.left,
                top: u.top
            },
            d = [],
            r = window.navigator.userAgent.toLowerCase();
        if (!(r.indexOf("msie") != -1 && document.compatMode == "BackCompat")) {
            var l = document.defaultView ? document.defaultView.getComputedStyle(b, null) : b.currentStyle;
            var e = c.width || c.width == 0 ? parseInt(c.width) : null,
                t = c.height || c.height == 0 ? parseInt(c.height) : null;
            if (typeof (e) == "number") {
                d.push("width");
                c.width = e - l.paddingLeft.replace(/\D/g, "") - l.paddingRight.replace(/\D/g, "")
            }
            if (typeof (t) == "number") {
                d.push("height");
                c.height = t - l.paddingTop.replace(/\D/g, "") - l.paddingBottom.replace(/\D/g, "")
            }
            if (s < 15) {
                h = Math.floor((h * 15) / s);
                s = 15
            }
        }
        var q = c.left || c.left == 0 ? parseInt(c.left) : null,
            m = c.top || c.top == 0 ? parseInt(c.top) : null;
        if (typeof (q) == "number") {
            d.push("left");
            b.style.position = "absolute"
        }
        if (typeof (m) == "number") {
            d.push("top");
            b.style.position = "absolute"
        }
        var k = [],
            p = d.length;
        for (var n = 0; n < p; n++) {
            k[d[n]] = f[d[n]] < c[d[n]] ? 1 : -1
        }
        var o = b.style;
        var a = function () {
            var v = true;
            for (var w = 0; w < p; w++) {
                f[d[w]] = f[d[w]] + k[d[w]] * Math.abs(c[d[w]] - f[d[w]]) * h / 100;
                if ((Math.round(f[d[w]]) - c[d[w]]) * k[d[w]] >= 0) {
                    v = v && true;
                    o[d[w]] = c[d[w]] + "px"
                } else {
                    v = v && false;
                    o[d[w]] = f[d[w]] + "px"
                }
            }
            if (v) {
                window.clearInterval(b.effect.animate);
                if (typeof (g) == "function") {
                    g(b)
                }
            }
        };
        b.effect.animate = window.setInterval(a, s)
    }
};
$.check = {
    isHttps: function () {
        return document.location.protocol == "https:"
    },
    isSsl: function () {
        var a = document.location.host;
        return /^ssl./i.test(a)
    },
    isIpad: function () {
        var a = navigator.userAgent.toLowerCase();
        return /ipad/i.test(a)
    },
    isQQ: function (a) {
        return /^[1-9]{1}\d{4,9}$/.test(a)
    },
    isQQMail: function (a) {
        return /^[1-9]{1}\d{4,9}@qq\.com$/.test(a)
    },
    isNullQQ: function (a) {
        return /^\d{1,4}$/.test(a)
    },
    isNick: function (a) {
        return /^[a-zA-Z]{1}([a-zA-Z0-9]|[-_]){0,19}$/.test(a)
    },
    isName: function (a) {
        if (a == "<请输入帐号>") {
            return false
        }
        return /[\u4E00-\u9FA5]{1,8}/.test(a)
    },
    isPhone: function (a) {
        return /^(?:86|886|)1\d{10}\s*$/.test(a)
    },
    isDXPhone: function (a) {
        return /^(?:86|886|)1(?:33|53|80|81|89)\d{8}$/.test(a)
    },
    isSeaPhone: function (a) {
        return /^(00)?(?:852|853|886(0)?\d{1})\d{8}$/.test(a)
    },
    isMail: function (a) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(a)
    },
    isPassword: function (a) {
        return a && a.length >= 16
    },
    isForeignPhone: function (a) {
        return /^00\d{7,}/.test(a)
    },
    needVip: function (e) {
        var a = ["21001601", "21000110", "21000121", "46000101", "716027609", "716027610", "549000912"];
        var b = true;
        for (var c = 0, d = a.length; c < d; c++) {
            if (a[c] == e) {
                b = false;
                break
            }
        }
        return b
    },
    isPaipai: function () {
        return /paipai.com$/.test(window.location.hostname)
    },
    is_weibo_appid: function (a) {
        if (a == 46000101 || a == 607000101 || a == 558032501) {
            return true
        }
        return false
    }
};
$.report = {
    monitor: function (c, b) {
        if (Math.random() > (b || 1)) {
            return
        }
        var a = location.protocol + "//ui.ptlogin2.qq.com/cgi-bin/report?id=" + c;
        //$.http.preload(a)
    },
    nlog: function (e, b) {
        var a = "http://badjs.qq.com/cgi-bin/js_report?";
        if ($.check.isHttps()) {
            a = "https://ssl.qq.com//badjs/cgi-bin/js_report?"
        }
        var c = location.href;
        var d = encodeURIComponent(e + "|_|" + c + "|_|" + window.navigator.userAgent);
        a += ("bid=110&level=2&mid=" + b + "&msg=" + d + "&v=" + Math.random());
        //$.http.preload(a)
    },
    isdSpeed: function (a, f) {
        var b = false;
        var d = "http://isdspeed.qq.com/cgi-bin/r.cgi?";
        if ($.check.isHttps()) {
            d = "https://login.qq.com/cgi-bin/r.cgi?"
        }
        d += a;
        if (Math.random() < (f || 1)) {
            var c = $.report.getSpeedPoints(a);
            for (var e in c) {
                if (c[e] && c[e] < 30000) {
                    d += ("&" + e + "=" + c[e]);
                    b = true
                }
            }
            d += "&v=" + Math.random();
            if (b) {
                $.http.preload(d)
            }
        }
        $.report.setSpeedPoint(a)
    },
    speedPoints: {},
    basePoint: {},
    setBasePoint: function (a, b) {
        $.report.basePoint[a] = b
    },
    setSpeedPoint: function (a, b, c) {
        if (!b) {
            $.report.speedPoints[a] = {}
        } else {
            if (!$.report.speedPoints[a]) {
                $.report.speedPoints[a] = {}
            }
            $.report.speedPoints[a][b] = c - $.report.basePoint[a]
        }
    },
    setSpeedPoints: function (a, b) {
        $.report.speedPoints[a] = b
    },
    getSpeedPoints: function (a) {
        return $.report.speedPoints[a]
    }
};
$.sso_ver = 0;
$.sso_state = 0;
$.plugin_isd_flag = "";
$.nptxsso = null;
$.sso_loadComplete = true;
$.np_clock = 0;
$.loginQQnum = 0;
$.suportActive = function () {
    var a = true;
    try {
        if (window.ActiveXObject || window.ActiveXObject.prototype) {
            a = true;
            if (window.ActiveXObject.prototype && !window.ActiveXObject) {
                $.report.nlog("activeobject 判断有问题")
            }
        } else {
            a = false
        }
    } catch (b) {
        a = false
    }
    return a
};
$.getLoginQQNum = function () {
    var l = false;
    try {
        var g = 0;
        if ($.suportActive()) {
            $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=20";
            $.report.setBasePoint($.plugin_isd_flag, new Date());
            var n = new ActiveXObject("SSOAxCtrlForPTLogin.SSOForPTLogin2");
            var f = n.CreateTXSSOData();
            n.InitSSOFPTCtrl(0, f);
            var b = n.CreateTXSSOData();
            var a = n.DoOperation(2, b);
            var d = a.GetArray("PTALIST");
            g = d.GetSize();
            try {
                var c = n.QuerySSOInfo(1);
                $.sso_ver = c.GetInt("nSSOVersion")
            } catch (h) {
                $.sso_ver = 0
            }
        } else {
            if (navigator.mimeTypes["application/nptxsso"]) {
                $.plugin_isd_flag = "flag1=7808&flag2=1&flag3=21";
                $.report.setBasePoint($.plugin_isd_flag, (new Date()).getTime());
                if (!$.nptxsso) {
                    $.nptxsso = document.createElement("embed");
                    $.nptxsso.type = "application/nptxsso";
                    $.nptxsso.style.width = "0px";
                    $.nptxsso.style.height = "0px";
                    document.body.appendChild($.nptxsso)
                }
                if (typeof $.nptxsso.InitPVANoST != "function") {
                    $.sso_loadComplete = false;
                    $.report.nlog("没有找到插件的InitPVANoST方法", 269929)
                } else {
                    var k = $.nptxsso.InitPVANoST();
                    if (k) {
                        g = $.nptxsso.GetPVACount();
                        $.sso_loadComplete = true
                    }
                    try {
                        $.sso_ver = $.nptxsso.GetSSOVersion()
                    } catch (h) {
                        $.sso_ver = 0
                    }
                }
            } else {
                $.report.nlog("插件没有注册成功", 263744);
                $.sso_state = 2;
                l = true
            }
        }
    } catch (h) {
        l = true;
        var m = null;
        try {
            m = $.http.getXHR()
        } catch (h) {
            $.report.nlog("获取XHR出错", 361166);
            return 0
        }
        var j = h.message || h;
        if (/^pt_windows_sso/.test(j)) {
            if (/^pt_windows_sso_\d+_3/.test(j)) {
                $.report.nlog("QQ插件不支持该url" + h.message, 326044)
            } else {
                $.report.nlog("QQ插件抛出内部错误" + h.message, 325361)
            }
            $.sso_state = 1
        } else {
            if (m && ($.browser("type") == "msie")) {
                if (window.navigator.platform != "Win64") {
                    $.report.nlog("可能没有安装QQ" + h.message, 322340);
                    $.sso_state = 2
                } else {
                    $.report.nlog("使用64位IE" + h.message, 343958)
                }
            } else {
                $.report.nlog("获取登录QQ号码出错" + h.message, 263745);
                if (window.ActiveXObject && window.navigator.platform == "Win32") {
                    $.sso_state = 1
                }
            }
        }
        return 0
    }
    if (!l && g == 0) {
        $.report.nlog("用户没有登录QQ", 361167)
    }
    $.loginQQnum = g;
    return g
};
$.checkNPPlugin = function () {
    var a = 10;
    window.clearInterval($.np_clock);
    $.np_clock = window.setInterval(function () {
        if (typeof $.nptxsso.InitPVANoST == "function" || a == 0) {
            window.clearInterval($.np_clock);
            if (typeof $.nptxsso.InitPVANoST == "function") {
                pt.preload.auth()
            }
        } else {
            a--;
            if (window.console) {
                console.log(a)
            }
        }
    }, 200)
};
$.guanjiaPlugin = null;
$.initGuanjiaPlugin = function () {
    try {
        if (window.ActiveXObject) {
            $.guanjiaPlugin = new ActiveXObject("npQMExtensionsIE.Basic")
        } else {
            if (navigator.mimeTypes["application/qqpcmgr-extensions-mozilla"]) {
                $.guanjiaPlugin = document.createElement("embed");
                $.guanjiaPlugin.type = "application/qqpcmgr-extensions-mozilla";
                $.guanjiaPlugin.style.width = "0px";
                $.guanjiaPlugin.style.height = "0px";
                document.body.appendChild($.guanjiaPlugin)
            }
        }
        var a = $.guanjiaPlugin.QMGetVersion().split(".");
        if (a.length == 4 && a[2] >= 9319) {} else {
            $.guanjiaPlugin = null
        }
    } catch (b) {
        $.guanjiaPlugin = null
    }
};

function pluginBegin() {
    if (!$.sso_loadComplete) {
        try {
            $.checkNPPlugin()
        } catch (a) {}
    }
    $.sso_loadComplete = true;
    $.report.setSpeedPoint($.plugin_isd_flag, 1, (new Date()).getTime());
    window.setTimeout(function (b) {
        $.report.isdSpeed($.plugin_isd_flag, 0.01)
    }, 2000);
    if (window.console) {}
}(function () {
    var a = "nohost_guid";
    var b = "/nohost_htdocs/js/SwitchHost.js";
    if ($.cookie.get(a) != "") {
        $.http.loadScript(b, function () {
            var c = window.SwitchHost && window.SwitchHost.init;
            c && c()
        })
    }
})();
var g_connectTime = 0;
var g_responseStartTime = 0;
var g_responseEndTime = 0;
(function () {
    try {
        if (performance.timing.connectStart && performance.timing.connectStart != 0) {
            g_connectTime = performance.timing.connectStart
        }
        if (performance.timing.responseStart && performance.timing.responseStart != 0) {
            g_responseStartTime = performance.timing.responseStart
        }
        if (performance.timing.responseEnd && performance.timing.responseEnd != 0) {
            g_responseEndTime = performance.timing.responseEnd
        }
    } catch (a) {
        g_connectTime = 0;
        g_responseStartTime = 0;
        g_responseEndTime = 0
    }
})();
g_time.time0 = g_connectTime;
g_time.time1 = g_responseStartTime;
g_time.time2 = g_responseEndTime;
pt.crossMessage = function (c) {
    if (typeof window.postMessage != "undefined") {
        var b = $.str.json2str(c);
        window.parent.postMessage(b, "*")
    } else {
        if (!pt.ptui.proxy_url) {
            return
        }
        var d = pt.ptui.proxy_url + "#";
        for (var a in c) {
            d += (a + "=" + c[a] + "&")
        }
        $("proxy") && ($("proxy").innerHTML = '<iframe src="' + encodeURI(d) + '"></iframe>')
    }
};
pt.preload = function () {
    var s = "";
    var w = false;
    var r = 0;
    var e = 0;
    var m = 1;
    var k = 0;
    var n = 0;
    var f = false;
    var o = "";
    var b = false;
    var h = "";
    var x = function () {
        if (pt.ptui.jumpname != "") {
            if (pt.ptui.qtarget != -1) {
                pt.ptui.qtarget = parseInt(pt.ptui.qtarget)
            }
        } else {
            switch (pt.ptui.target) {
            case "_self":
                pt.ptui.qtarget = 0;
                break;
            case "_top":
                pt.ptui.qtarget = 1;
                break;
            case "_parent":
                pt.ptui.qtarget = 2;
                break;
            default:
                pt.ptui.qtarget = 1
            }
        }
        pt.ptui.isHttps = $.check.isHttps();
        pt.ptui.enable_qlogin = pt.ptui.enable_qlogin != "0" && ($.cookie.get("pt_qlogincode") != 5);
        pt.ptui.needVip = $.check.needVip(pt.ptui.appid) ? 1 : 0;
        pt.ptui.s_url = document.forms[0].u1.value
    };
    var q = function (y) {
        try {
            document.execCommand("BackgroundImageCache", false, true)
        } catch (z) {}
        $.cookie.del("ptui_qstatus", "ptlogin2." + pt.ptui.domain, "/");
        v("login");
        if (!!y) {
            b = true;
            h = encodeURIComponent(y)
        }
        s = pt.ptui.pt_size;
        if (pt.ptui.enable_qlogin) {
            k = $.getLoginQQNum();
            k += b ? 1 : 0;
            if (pt.ptui.style == 15) {
                if (k == 0) {
                    $("switch_qlogin").innerHTML = pt.str.h_q_login_qr;
                    k = 1
                } else {
                    k++
                }
            } else {}
        }
        if (k > 0) {
            f = true;
            t(k);
            p(false);
            $("login_switcher_box").style.visibility = "visible"
        } else {
            p(true, true);
            v("login");
            if ($("u").value && typeof pt.login.check == "function") {
                pt.login.check()
            }
        }
    };
    var j = function () {
        o = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + pt.ptui.domain + "/pt4_auth?daid=" + pt.ptui.daid + "&appid=" + pt.ptui.appid + "&auth_token=" + $.str.time33($.cookie.get("supertoken"));
        var y = pt.ptui.s_url;
        if (/^https/.test(y)) {
            o += "&pt4_shttps=1"
        }
    };
    var l = function () {
        x();
        j();
        var y = $.cookie.get("superuin");
        if (pt.ptui.daid && pt.ptui.noAuth != "1" && y != "") {
            $.http.loadScript(o)
        } else {
            pt.preload.init()
        }
    };
    var v = function (C) {
        try {
            var B = $(C);
            if (B) {
                width = 1;
                height = 1;
                if (B.offsetWidth > 0) {
                    width = B.offsetWidth
                }
                if (B.offsetHeight > 0) {
                    height = B.offsetHeight
                }
                var z = window.location.hostname.replace(/ui\.ptlogin2\./i, "");
                var y = new Date();
                y.setTime(y.getTime() + 5 * 1000);
                if (s == "1") {
                    document.cookie = "pt_size=" + width + "-" + height + ";domain=" + z + ";path=/;expires=" + y.toGMTString()
                }
                try {
                    if (typeof window.postMessage != "undefined") {
                        window.parent.postMessage("pt_size=" + width + "-" + height, "*")
                    }
                } catch (A) {}
                if (parent.ptlogin2_onResize) {
                    parent.ptlogin2_onResize(width, height);
                    window.scroll(0, 10)
                } else {
                    frameElement.width = width;
                    frameElement.style.width = width + "px";
                    frameElement.height = height;
                    frameElement.style.height = height + "px";
                    frameElement.style.visibility = "hidden";
                    frameElement.style.visibility = "visible"
                }
            }
        } catch (A) {}
    };
    var g = function () {
        r = window.setInterval(z, 200);
        var y = 50;

        function z() {
            var A = $.cookie.get("ptui_qstatus");
            if (y == 0) {
                f = true;
                p(true)
            }
            if (A == 2) {
                u();
                f = true
            }
            if (A == 3) {
                u();
                f = false;
                p(true)
            }
            y--
        }
    };
    var u = function () {
        clearInterval(r)
    };
    var a = function () {
        var C = "qlogin";
        var A = encodeURIComponent(encodeURIComponent(document.forms[0].u1.value));
        var B = (pt.ptui.jumpname == "" || pt.ptui.jumpname == "jump") ? encodeURIComponent("u1=" + encodeURIComponent(document.forms[0].u1.value)) : "";
        var D = $.check.isHttps() && $.check.isSsl();
        var z = D ? "https://ssl." : "https://";
        var y = (pt.ptui.isHttps ? z : "http://") + "xui.ptlogin2." + pt.ptui.domain + "/cgi-bin/" + C + "?domain=" + pt.ptui.domain + "&lang=" + pt.ptui.lang + "&qtarget=" + pt.ptui.qtarget + "&jumpname=" + pt.ptui.jumpname + "&appid=" + pt.ptui.appid + "&param=" + encodeURIComponent((pt.ptui.qlogin_param ? encodeURIComponent(pt.ptui.qlogin_param) : B)) + "&s_url=" + A + "&mibao_css=" + pt.ptui.mibao_css + "&low_login=" + pt.ptui.low_login + (pt.ptui.daid ? "&daid=" + pt.ptui.daid : "") + (pt.ptui.regmaster ? "&regmaster=" + pt.ptui.regmaster : "") + "&style=" + pt.ptui.style + "&authParamUrl=" + h + "&needVip=" + pt.ptui.needVip + "&ptui_version=" + pt.ptui.ptui_version;
        if (pt.ptui.csimc != "0") {
            y += "&csimc=" + pt.ptui.csimc + "&csnum=" + pt.ptui.csnum + "&authid=" + pt.ptui.authid
        }
        if (pt.ptui.pt_qzone_sig == "1") {
            y += "&pt_qzone_sig=1"
        }
        return y
    };
    var t = function (C) {
        if (w) {
            $("qlogin").style.display = "block";
            return
        } else {
            var y = a();
            var A = $("qlogin");
            var z = 210;
            A.innerHTML = '<iframe  id="xui" name="xui" allowtransparency="true" scrolling="no" frameborder="0" width="100%" height="' + z + '"px src="' + y + '">';
            w = true;
            p(false);
            try {
                frames.xui.focus()
            } catch (B) {}
        }
    };
    var d = function (z) {
        try {
            var y = z.u;
            var B = z.p;
            var C = z.verifycode;
            if (y.value == "") {
                y.focus();
                return
            }
            if (B.value == "") {
                B.focus();
                return
            }
            if (C.value == "") {
                C.focus()
            }
        } catch (A) {}
    };
    var p = function (z, A) {
        var C, y;
        if (z) {
            $.css.hide($("qlogin"));
            $.css.show($("plogin"));
            $.css.hide($("qloginTips"));
            $.css.show($("ploginTips"));
            m = 1;
            try {
                $("xui").blur()
            } catch (B) {}
            v("login");
            if (A) {
                $("login_switcher_box").className = "login_switcher_no_qlogin"
            } else {
                $("login_switcher_box").className = "login_switcher_plogin";
                d(document.loginform)
            }
        } else {
            $.css.hide($("plogin"));
            $.css.show($("qlogin"));
            $.css.hide($("ploginTips"));
            $.css.show($("qloginTips"));
            m = 2;
            try {
                frames.xui.focus()
            } catch (B) {}
            $("login_switcher_box").className = "login_switcher_qlogin";
            v("login")
        }
    };
    var c = function () {
        return m
    };
    return {
        init: q,
        auth: l,
        initFocus: d,
        switchpage: p,
        getLoginStatus: c,
        ptui_notifySize: v
    }
}();
pt.preload.auth();

function ptui_auth_CB(d, c) {
    switch (parseInt(d)) {
    case 0:
        pt.preload.init(c);
        break;
    case 1:
        pt.preload.init();
        break;
    case 2:
        var a = encodeURIComponent(document.forms[0].u1.value);
        var b = c + "&regmaster=" + pt.ptui.regmaster + "&aid=" + pt.ptui.appid + "&s_url=" + a;
        switch (pt.ptui.target) {
        case "_self":
            location.href = b;
            break;
        case "_top":
            top.location.href = b;
            break;
        case "_parent":
            parent.location.href = b;
            break;
        default:
            top.location.href = b
        }
        break;
    default:
        pt.preload.init()
    }
}
$.RSA = function () {
    function g(z, t) {
        return new at(z, t)
    }

    function ai(aB, aC) {
        var t = "";
        var z = 0;
        while (z + aC < aB.length) {
            t += aB.substring(z, z + aC) + "\n";
            z += aC
        }
        return t + aB.substring(z, aB.length)
    }

    function s(t) {
        if (t < 16) {
            return "0" + t.toString(16)
        } else {
            return t.toString(16)
        }
    }

    function ag(aC, aF) {
        if (aF < aC.length + 11) {
            uv_alert("Message too long for RSA");
            return null
        }
        var aE = new Array();
        var aB = aC.length - 1;
        while (aB >= 0 && aF > 0) {
            var aD = aC.charCodeAt(aB--);
            if (aD < 128) {
                aE[--aF] = aD
            } else {
                if ((aD > 127) && (aD < 2048)) {
                    aE[--aF] = (aD & 63) | 128;
                    aE[--aF] = (aD >> 6) | 192
                } else {
                    aE[--aF] = (aD & 63) | 128;
                    aE[--aF] = ((aD >> 6) & 63) | 128;
                    aE[--aF] = (aD >> 12) | 224
                }
            }
        }
        aE[--aF] = 0;
        var z = new ae();
        var t = new Array();
        while (aF > 2) {
            t[0] = 0;
            while (t[0] == 0) {
                z.nextBytes(t)
            }
            aE[--aF] = t[0]
        }
        aE[--aF] = 2;
        aE[--aF] = 0;
        return new at(aE)
    }

    function M() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null
    }

    function p(z, t) {
        if (z != null && t != null && z.length > 0 && t.length > 0) {
            this.n = g(z, 16);
            this.e = parseInt(t, 16)
        } else {
            uv_alert("Invalid RSA public key")
        }
    }

    function X(t) {
        return t.modPowInt(this.e, this.n)
    }

    function q(aB) {
        var t = ag(aB, (this.n.bitLength() + 7) >> 3);
        if (t == null) {
            return null
        }
        var aC = this.doPublic(t);
        if (aC == null) {
            return null
        }
        var z = aC.toString(16);
        if ((z.length & 1) == 0) {
            return z
        } else {
            return "0" + z
        }
    }
    M.prototype.doPublic = X;
    M.prototype.setPublic = p;
    M.prototype.encrypt = q;
    var ax;
    var aj = 244837814094590;
    var aa = ((aj & 16777215) == 15715070);

    function at(z, t, aB) {
        if (z != null) {
            if ("number" == typeof z) {
                this.fromNumber(z, t, aB)
            } else {
                if (t == null && "string" != typeof z) {
                    this.fromString(z, 256)
                } else {
                    this.fromString(z, t)
                }
            }
        }
    }

    function h() {
        return new at(null)
    }

    function b(aD, t, z, aC, aF, aE) {
        while (--aE >= 0) {
            var aB = t * this[aD++] + z[aC] + aF;
            aF = Math.floor(aB / 67108864);
            z[aC++] = aB & 67108863
        }
        return aF
    }

    function az(aD, aI, aJ, aC, aG, t) {
        var aF = aI & 32767,
            aH = aI >> 15;
        while (--t >= 0) {
            var aB = this[aD] & 32767;
            var aE = this[aD++] >> 15;
            var z = aH * aB + aE * aF;
            aB = aF * aB + ((z & 32767) << 15) + aJ[aC] + (aG & 1073741823);
            aG = (aB >>> 30) + (z >>> 15) + aH * aE + (aG >>> 30);
            aJ[aC++] = aB & 1073741823
        }
        return aG
    }

    function ay(aD, aI, aJ, aC, aG, t) {
        var aF = aI & 16383,
            aH = aI >> 14;
        while (--t >= 0) {
            var aB = this[aD] & 16383;
            var aE = this[aD++] >> 14;
            var z = aH * aB + aE * aF;
            aB = aF * aB + ((z & 16383) << 14) + aJ[aC] + aG;
            aG = (aB >> 28) + (z >> 14) + aH * aE;
            aJ[aC++] = aB & 268435455
        }
        return aG
    }
    if (aa && (navigator.appName == "Microsoft Internet Explorer")) {
        at.prototype.am = az;
        ax = 30
    } else {
        if (aa && (navigator.appName != "Netscape")) {
            at.prototype.am = b;
            ax = 26
        } else {
            at.prototype.am = ay;
            ax = 28
        }
    }
    at.prototype.DB = ax;
    at.prototype.DM = ((1 << ax) - 1);
    at.prototype.DV = (1 << ax);
    var ab = 52;
    at.prototype.FV = Math.pow(2, ab);
    at.prototype.F1 = ab - ax;
    at.prototype.F2 = 2 * ax - ab;
    var af = "0123456789abcdefghijklmnopqrstuvwxyz";
    var ah = new Array();
    var aq, w;
    aq = "0".charCodeAt(0);
    for (w = 0; w <= 9; ++w) {
        ah[aq++] = w
    }
    aq = "a".charCodeAt(0);
    for (w = 10; w < 36; ++w) {
        ah[aq++] = w
    }
    aq = "A".charCodeAt(0);
    for (w = 10; w < 36; ++w) {
        ah[aq++] = w
    }

    function aA(t) {
        return af.charAt(t)
    }

    function B(z, t) {
        var aB = ah[z.charCodeAt(t)];
        return (aB == null) ? -1 : aB
    }

    function Z(z) {
        for (var t = this.t - 1; t >= 0; --t) {
            z[t] = this[t]
        }
        z.t = this.t;
        z.s = this.s
    }

    function o(t) {
        this.t = 1;
        this.s = (t < 0) ? -1 : 0;
        if (t > 0) {
            this[0] = t
        } else {
            if (t < -1) {
                this[0] = t + DV
            } else {
                this.t = 0
            }
        }
    }

    function c(t) {
        var z = h();
        z.fromInt(t);
        return z
    }

    function x(aF, z) {
        var aC;
        if (z == 16) {
            aC = 4
        } else {
            if (z == 8) {
                aC = 3
            } else {
                if (z == 256) {
                    aC = 8
                } else {
                    if (z == 2) {
                        aC = 1
                    } else {
                        if (z == 32) {
                            aC = 5
                        } else {
                            if (z == 4) {
                                aC = 2
                            } else {
                                this.fromRadix(aF, z);
                                return
                            }
                        }
                    }
                }
            }
        }
        this.t = 0;
        this.s = 0;
        var aE = aF.length,
            aB = false,
            aD = 0;
        while (--aE >= 0) {
            var t = (aC == 8) ? aF[aE] & 255 : B(aF, aE);
            if (t < 0) {
                if (aF.charAt(aE) == "-") {
                    aB = true
                }
                continue
            }
            aB = false;
            if (aD == 0) {
                this[this.t++] = t
            } else {
                if (aD + aC > this.DB) {
                    this[this.t - 1] |= (t & ((1 << (this.DB - aD)) - 1)) << aD;
                    this[this.t++] = (t >> (this.DB - aD))
                } else {
                    this[this.t - 1] |= t << aD
                }
            }
            aD += aC;
            if (aD >= this.DB) {
                aD -= this.DB
            }
        }
        if (aC == 8 && (aF[0] & 128) != 0) {
            this.s = -1;
            if (aD > 0) {
                this[this.t - 1] |= ((1 << (this.DB - aD)) - 1) << aD
            }
        }
        this.clamp();
        if (aB) {
            at.ZERO.subTo(this, this)
        }
    }

    function P() {
        var t = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == t) {
            --this.t
        }
    }

    function r(z) {
        if (this.s < 0) {
            return "-" + this.negate().toString(z)
        }
        var aB;
        if (z == 16) {
            aB = 4
        } else {
            if (z == 8) {
                aB = 3
            } else {
                if (z == 2) {
                    aB = 1
                } else {
                    if (z == 32) {
                        aB = 5
                    } else {
                        if (z == 4) {
                            aB = 2
                        } else {
                            return this.toRadix(z)
                        }
                    }
                }
            }
        }
        var aD = (1 << aB) - 1,
            aG, t = false,
            aE = "",
            aC = this.t;
        var aF = this.DB - (aC * this.DB) % aB;
        if (aC-- > 0) {
            if (aF < this.DB && (aG = this[aC] >> aF) > 0) {
                t = true;
                aE = aA(aG)
            }
            while (aC >= 0) {
                if (aF < aB) {
                    aG = (this[aC] & ((1 << aF) - 1)) << (aB - aF);
                    aG |= this[--aC] >> (aF += this.DB - aB)
                } else {
                    aG = (this[aC] >> (aF -= aB)) & aD;
                    if (aF <= 0) {
                        aF += this.DB;
                        --aC
                    }
                } if (aG > 0) {
                    t = true
                }
                if (t) {
                    aE += aA(aG)
                }
            }
        }
        return t ? aE : "0"
    }

    function S() {
        var t = h();
        at.ZERO.subTo(this, t);
        return t
    }

    function am() {
        return (this.s < 0) ? this.negate() : this
    }

    function H(t) {
        var aB = this.s - t.s;
        if (aB != 0) {
            return aB
        }
        var z = this.t;
        aB = z - t.t;
        if (aB != 0) {
            return aB
        }
        while (--z >= 0) {
            if ((aB = this[z] - t[z]) != 0) {
                return aB
            }
        }
        return 0
    }

    function k(z) {
        var aC = 1,
            aB;
        if ((aB = z >>> 16) != 0) {
            z = aB;
            aC += 16
        }
        if ((aB = z >> 8) != 0) {
            z = aB;
            aC += 8
        }
        if ((aB = z >> 4) != 0) {
            z = aB;
            aC += 4
        }
        if ((aB = z >> 2) != 0) {
            z = aB;
            aC += 2
        }
        if ((aB = z >> 1) != 0) {
            z = aB;
            aC += 1
        }
        return aC
    }

    function v() {
        if (this.t <= 0) {
            return 0
        }
        return this.DB * (this.t - 1) + k(this[this.t - 1] ^ (this.s & this.DM))
    }

    function ar(aB, z) {
        var t;
        for (t = this.t - 1; t >= 0; --t) {
            z[t + aB] = this[t]
        }
        for (t = aB - 1; t >= 0; --t) {
            z[t] = 0
        }
        z.t = this.t + aB;
        z.s = this.s
    }

    function Y(aB, z) {
        for (var t = aB; t < this.t; ++t) {
            z[t - aB] = this[t]
        }
        z.t = Math.max(this.t - aB, 0);
        z.s = this.s
    }

    function u(aG, aC) {
        var z = aG % this.DB;
        var t = this.DB - z;
        var aE = (1 << t) - 1;
        var aD = Math.floor(aG / this.DB),
            aF = (this.s << z) & this.DM,
            aB;
        for (aB = this.t - 1; aB >= 0; --aB) {
            aC[aB + aD + 1] = (this[aB] >> t) | aF;
            aF = (this[aB] & aE) << z
        }
        for (aB = aD - 1; aB >= 0; --aB) {
            aC[aB] = 0
        }
        aC[aD] = aF;
        aC.t = this.t + aD + 1;
        aC.s = this.s;
        aC.clamp()
    }

    function m(aF, aC) {
        aC.s = this.s;
        var aD = Math.floor(aF / this.DB);
        if (aD >= this.t) {
            aC.t = 0;
            return
        }
        var z = aF % this.DB;
        var t = this.DB - z;
        var aE = (1 << z) - 1;
        aC[0] = this[aD] >> z;
        for (var aB = aD + 1; aB < this.t; ++aB) {
            aC[aB - aD - 1] |= (this[aB] & aE) << t;
            aC[aB - aD] = this[aB] >> z
        }
        if (z > 0) {
            aC[this.t - aD - 1] |= (this.s & aE) << t
        }
        aC.t = this.t - aD;
        aC.clamp()
    }

    function ac(z, aC) {
        var aB = 0,
            aD = 0,
            t = Math.min(z.t, this.t);
        while (aB < t) {
            aD += this[aB] - z[aB];
            aC[aB++] = aD & this.DM;
            aD >>= this.DB
        }
        if (z.t < this.t) {
            aD -= z.s;
            while (aB < this.t) {
                aD += this[aB];
                aC[aB++] = aD & this.DM;
                aD >>= this.DB
            }
            aD += this.s
        } else {
            aD += this.s;
            while (aB < z.t) {
                aD -= z[aB];
                aC[aB++] = aD & this.DM;
                aD >>= this.DB
            }
            aD -= z.s
        }
        aC.s = (aD < 0) ? -1 : 0;
        if (aD < -1) {
            aC[aB++] = this.DV + aD
        } else {
            if (aD > 0) {
                aC[aB++] = aD
            }
        }
        aC.t = aB;
        aC.clamp()
    }

    function E(z, aC) {
        var t = this.abs(),
            aD = z.abs();
        var aB = t.t;
        aC.t = aB + aD.t;
        while (--aB >= 0) {
            aC[aB] = 0
        }
        for (aB = 0; aB < aD.t; ++aB) {
            aC[aB + t.t] = t.am(0, aD[aB], aC, aB, 0, t.t)
        }
        aC.s = 0;
        aC.clamp();
        if (this.s != z.s) {
            at.ZERO.subTo(aC, aC)
        }
    }

    function R(aB) {
        var t = this.abs();
        var z = aB.t = 2 * t.t;
        while (--z >= 0) {
            aB[z] = 0
        }
        for (z = 0; z < t.t - 1; ++z) {
            var aC = t.am(z, t[z], aB, 2 * z, 0, 1);
            if ((aB[z + t.t] += t.am(z + 1, 2 * t[z], aB, 2 * z + 1, aC, t.t - z - 1)) >= t.DV) {
                aB[z + t.t] -= t.DV;
                aB[z + t.t + 1] = 1
            }
        }
        if (aB.t > 0) {
            aB[aB.t - 1] += t.am(z, t[z], aB, 2 * z, 0, 1)
        }
        aB.s = 0;
        aB.clamp()
    }

    function F(aJ, aG, aF) {
        var aP = aJ.abs();
        if (aP.t <= 0) {
            return
        }
        var aH = this.abs();
        if (aH.t < aP.t) {
            if (aG != null) {
                aG.fromInt(0)
            }
            if (aF != null) {
                this.copyTo(aF)
            }
            return
        }
        if (aF == null) {
            aF = h()
        }
        var aD = h(),
            z = this.s,
            aI = aJ.s;
        var aO = this.DB - k(aP[aP.t - 1]);
        if (aO > 0) {
            aP.lShiftTo(aO, aD);
            aH.lShiftTo(aO, aF)
        } else {
            aP.copyTo(aD);
            aH.copyTo(aF)
        }
        var aL = aD.t;
        var aB = aD[aL - 1];
        if (aB == 0) {
            return
        }
        var aK = aB * (1 << this.F1) + ((aL > 1) ? aD[aL - 2] >> this.F2 : 0);
        var aS = this.FV / aK,
            aR = (1 << this.F1) / aK,
            aQ = 1 << this.F2;
        var aN = aF.t,
            aM = aN - aL,
            aE = (aG == null) ? h() : aG;
        aD.dlShiftTo(aM, aE);
        if (aF.compareTo(aE) >= 0) {
            aF[aF.t++] = 1;
            aF.subTo(aE, aF)
        }
        at.ONE.dlShiftTo(aL, aE);
        aE.subTo(aD, aD);
        while (aD.t < aL) {
            aD[aD.t++] = 0
        }
        while (--aM >= 0) {
            var aC = (aF[--aN] == aB) ? this.DM : Math.floor(aF[aN] * aS + (aF[aN - 1] + aQ) * aR);
            if ((aF[aN] += aD.am(0, aC, aF, aM, 0, aL)) < aC) {
                aD.dlShiftTo(aM, aE);
                aF.subTo(aE, aF);
                while (aF[aN] < --aC) {
                    aF.subTo(aE, aF)
                }
            }
        }
        if (aG != null) {
            aF.drShiftTo(aL, aG);
            if (z != aI) {
                at.ZERO.subTo(aG, aG)
            }
        }
        aF.t = aL;
        aF.clamp();
        if (aO > 0) {
            aF.rShiftTo(aO, aF)
        }
        if (z < 0) {
            at.ZERO.subTo(aF, aF)
        }
    }

    function O(t) {
        var z = h();
        this.abs().divRemTo(t, null, z);
        if (this.s < 0 && z.compareTo(at.ZERO) > 0) {
            t.subTo(z, z)
        }
        return z
    }

    function L(t) {
        this.m = t
    }

    function W(t) {
        if (t.s < 0 || t.compareTo(this.m) >= 0) {
            return t.mod(this.m)
        } else {
            return t
        }
    }

    function al(t) {
        return t
    }

    function K(t) {
        t.divRemTo(this.m, null, t)
    }

    function I(t, aB, z) {
        t.multiplyTo(aB, z);
        this.reduce(z)
    }

    function av(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    L.prototype.convert = W;
    L.prototype.revert = al;
    L.prototype.reduce = K;
    L.prototype.mulTo = I;
    L.prototype.sqrTo = av;

    function C() {
        if (this.t < 1) {
            return 0
        }
        var t = this[0];
        if ((t & 1) == 0) {
            return 0
        }
        var z = t & 3;
        z = (z * (2 - (t & 15) * z)) & 15;
        z = (z * (2 - (t & 255) * z)) & 255;
        z = (z * (2 - (((t & 65535) * z) & 65535))) & 65535;
        z = (z * (2 - t * z % this.DV)) % this.DV;
        return (z > 0) ? this.DV - z : -z
    }

    function f(t) {
        this.m = t;
        this.mp = t.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << (t.DB - 15)) - 1;
        this.mt2 = 2 * t.t
    }

    function ak(t) {
        var z = h();
        t.abs().dlShiftTo(this.m.t, z);
        z.divRemTo(this.m, null, z);
        if (t.s < 0 && z.compareTo(at.ZERO) > 0) {
            this.m.subTo(z, z)
        }
        return z
    }

    function au(t) {
        var z = h();
        t.copyTo(z);
        this.reduce(z);
        return z
    }

    function Q(t) {
        while (t.t <= this.mt2) {
            t[t.t++] = 0
        }
        for (var aB = 0; aB < this.m.t; ++aB) {
            var z = t[aB] & 32767;
            var aC = (z * this.mpl + (((z * this.mph + (t[aB] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
            z = aB + this.m.t;
            t[z] += this.m.am(0, aC, t, aB, 0, this.m.t);
            while (t[z] >= t.DV) {
                t[z] -= t.DV;
                t[++z]++
            }
        }
        t.clamp();
        t.drShiftTo(this.m.t, t);
        if (t.compareTo(this.m) >= 0) {
            t.subTo(this.m, t)
        }
    }

    function an(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }

    function A(t, aB, z) {
        t.multiplyTo(aB, z);
        this.reduce(z)
    }
    f.prototype.convert = ak;
    f.prototype.revert = au;
    f.prototype.reduce = Q;
    f.prototype.mulTo = A;
    f.prototype.sqrTo = an;

    function j() {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
    }

    function y(aG, aH) {
        if (aG > 4294967295 || aG < 1) {
            return at.ONE
        }
        var aF = h(),
            aB = h(),
            aE = aH.convert(this),
            aD = k(aG) - 1;
        aE.copyTo(aF);
        while (--aD >= 0) {
            aH.sqrTo(aF, aB);
            if ((aG & (1 << aD)) > 0) {
                aH.mulTo(aB, aE, aF)
            } else {
                var aC = aF;
                aF = aB;
                aB = aC
            }
        }
        return aH.revert(aF)
    }

    function ao(aB, t) {
        var aC;
        if (aB < 256 || t.isEven()) {
            aC = new L(t)
        } else {
            aC = new f(t)
        }
        return this.exp(aB, aC)
    }
    at.prototype.copyTo = Z;
    at.prototype.fromInt = o;
    at.prototype.fromString = x;
    at.prototype.clamp = P;
    at.prototype.dlShiftTo = ar;
    at.prototype.drShiftTo = Y;
    at.prototype.lShiftTo = u;
    at.prototype.rShiftTo = m;
    at.prototype.subTo = ac;
    at.prototype.multiplyTo = E;
    at.prototype.squareTo = R;
    at.prototype.divRemTo = F;
    at.prototype.invDigit = C;
    at.prototype.isEven = j;
    at.prototype.exp = y;
    at.prototype.toString = r;
    at.prototype.negate = S;
    at.prototype.abs = am;
    at.prototype.compareTo = H;
    at.prototype.bitLength = v;
    at.prototype.mod = O;
    at.prototype.modPowInt = ao;
    at.ZERO = c(0);
    at.ONE = c(1);
    var n;
    var V;
    var ad;

    function d(t) {
        V[ad++] ^= t & 255;
        V[ad++] ^= (t >> 8) & 255;
        V[ad++] ^= (t >> 16) & 255;
        V[ad++] ^= (t >> 24) & 255;
        if (ad >= N) {
            ad -= N
        }
    }

    function U() {
        d(new Date().getTime())
    }
    if (V == null) {
        V = new Array();
        ad = 0;
        var J;
        if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && window.crypto.random) {
            var G = window.crypto.random(32);
            for (J = 0; J < G.length; ++J) {
                V[ad++] = G.charCodeAt(J) & 255
            }
        }
        while (ad < N) {
            J = Math.floor(65536 * Math.random());
            V[ad++] = J >>> 8;
            V[ad++] = J & 255
        }
        ad = 0;
        U()
    }

    function D() {
        if (n == null) {
            U();
            n = ap();
            n.init(V);
            for (ad = 0; ad < V.length; ++ad) {
                V[ad] = 0
            }
            ad = 0
        }
        return n.next()
    }

    function aw(z) {
        var t;
        for (t = 0; t < z.length; ++t) {
            z[t] = D()
        }
    }

    function ae() {}
    ae.prototype.nextBytes = aw;

    function l() {
        this.i = 0;
        this.j = 0;
        this.S = new Array()
    }

    function e(aD) {
        var aC, z, aB;
        for (aC = 0; aC < 256; ++aC) {
            this.S[aC] = aC
        }
        z = 0;
        for (aC = 0; aC < 256; ++aC) {
            z = (z + this.S[aC] + aD[aC % aD.length]) & 255;
            aB = this.S[aC];
            this.S[aC] = this.S[z];
            this.S[z] = aB
        }
        this.i = 0;
        this.j = 0
    }

    function a() {
        var z;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        z = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = z;
        return this.S[(z + this.S[this.i]) & 255]
    }
    l.prototype.init = e;
    l.prototype.next = a;

    function ap() {
        return new l()
    }
    var N = 256;

    function T(aC, aB, z) {
        aB = "DF29C573C20C0B3D46F7C214B6ADB6DF55326ABFD6B4C182462446A2F6C103B80568B50019F0998D4680B0ADCA51FF916DBA64ED1004FCAE5B05A1D2EA8E986A6E0E4A153D4E0F231D9672407DC859AF8C403B938077AA736E115C2D5D7282FBC2D15CA6CE2EBE2B20EA44B45BCDA05B37D0A41EE590C0F17936E02235B8DB31";
        z = "3";
        var t = new M();
        t.setPublic(aB, z);
        return t.encrypt(aC)
    }
    return {
        rsa_encrypt: T
    }
}();
$.Encryption = function () {
    var hexcase = 1;
    var b64pad = "";
    var chrsz = 8;
    var mode = 32;

    function md5(s) {
        return hex_md5(s)
    }

    function hex_md5(s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz))
    }

    function str_md5(s) {
        return binl2str(core_md5(str2binl(s), s.length * chrsz))
    }

    function hex_hmac_md5(key, data) {
        return binl2hex(core_hmac_md5(key, data))
    }

    function b64_hmac_md5(key, data) {
        return binl2b64(core_hmac_md5(key, data))
    }

    function str_hmac_md5(key, data) {
        return binl2str(core_hmac_md5(key, data))
    }

    function core_md5(x, len) {
        x[len >> 5] |= 128 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd)
        }
        if (mode == 16) {
            return Array(b, c)
        } else {
            return Array(a, b, c, d)
        }
    }

    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t)
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
    }

    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) {
            bkey = core_md5(bkey, key.length * chrsz)
        }
        var ipad = Array(16),
            opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828
        }
        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128)
    }

    function safe_add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 65535)
    }

    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
        }
        return bin
    }

    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz) {
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
        }
        return str
    }

    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
        }
        return str
    }

    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) {
                    str += b64pad
                } else {
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
                }
            }
        }
        return str
    }

    function hexchar2bin(str) {
        var arr = [];
        for (var i = 0; i < str.length; i = i + 2) {
            arr.push("\\x" + str.substr(i, 2))
        }
        arr = arr.join("");
        eval("var temp = '" + arr + "'");
        return temp
    }

    function getEncryption(password, uin, vcode) {
        var str1 = hexchar2bin(md5(password));
        var str2 = md5(str1 + uin);
        var str3 = md5(str2 + vcode.toUpperCase());
        return str3
    }

    function getRSAEncryption(password, vcode) {
        var str1 = md5(password);
        var str2 = str1 + vcode.toUpperCase();
        var str3 = $.RSA.rsa_encrypt(str2);
        return str3
    }
    return {
        getEncryption: getEncryption,
        getRSAEncryption: getRSAEncryption
    }
}();
pt.login = {
    accout: "",
    at_accout: "",
    uin: "",
    saltUin: "",
    hasCheck: false,
    lastCheckAccout: "",
    needVc: false,
    vcFlag: false,
    ckNum: {},
    action: [0, 0],
    passwordErrorNum: 1,
    isIpad: false,
    t_appid: 46000101,
    seller_id: 703010802,
    checkUrl: "",
    loginUrl: "",
    verifycodeUrl: "",
    checkClock: 0,
    isCheckTimeout: false,
    errclock: 0,
    loginClock: 0,
    login_param: pt.ptui.href.substring(pt.ptui.href.indexOf("?") + 1),
    err_m: $("err_m"),
    low_login_enable: true,
    low_login_isshow: false,
    list_index: [-1, 2],
    keyCode: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13,
        TAB: 9,
        BACK: 8,
        DEL: 46,
        F5: 116
    },
    knownEmail: ["qq.com", "foxmail.com", "gmail.com", "hotmail.com", "yahoo.com", "sina.com", "163.com", "126.com", "vip.qq.com", "vip.sina.com", "sina.cn", "sohu.com", "yahoo.cn", "yahoo.com.cn", "139.com", "wo.com.cn", "189.cn", "live.com", "msn.com", "live.hk", "live.cn", "hotmail.com.cn", "hinet.net", "msa.hinet.net", "cm1.hinet.net", "umail.hinet.net", "xuite.net", "yam.com", "pchome.com.tw", "netvigator.com", "seed.net.tw", "anet.net.tw"],
    qrlogin_clock: 0,
    qrlogin_timeout: 0,
    qrlogin_timeout_time: 100000,
    qr_uin: "",
    qr_nick: "",
    dftImg: "",
    need_hide_operate_tips: true,
    js_type: 1,
    xuiState: 1,
    delayTime: 5000,
    delayMonitorId: "294059",
    hasSubmit: false,
    RSAKey: false,
    checkRet: -1,
    cap_cd: 0,
    checkErr: {
        "2052": "网络繁忙，请稍后重试。",
        "1028": "網絡繁忙，請稍後重試。",
        "1033": "The network is busy, please try again later."
    },
    domFocus: function (b) {
        try {
            b.focus()
        } catch (a) {}
    },
    detectCapsLock: function (c) {
        var b = c.keyCode || c.which;
        var a = c.shiftKey || (b == 16) || false;
        if (((b >= 65 && b <= 90) && !a) || ((b >= 97 && b <= 122) && a)) {
            return true
        } else {
            return false
        }
    },
    generateEmailTips: function (e) {
        var h = e.indexOf("@");
        var g = "";
        if (h == -1) {
            g = e
        } else {
            g = e.substring(0, h)
        }
        var b = [];
        for (var d = 0, a = pt.login.knownEmail.length; d < a; d++) {
            b.push(g + "@" + pt.login.knownEmail[d])
        }
        var f = [];
        for (var c = 0, a = b.length; c < a; c++) {
            if (b[c].indexOf(e) > -1) {
                f.push($.str.encodeHtml(b[c]))
            }
        }
        return f
    },
    createEmailTips: function (e) {
        var a = pt.login.generateEmailTips(e);
        var g = a.length;
        var f = [];
        var d = "";
        var c = 4;
        g = Math.min(g, c);
        if (g == 0) {
            pt.login.list_index[0] = -1;
            pt.login.hideEmailTips();
            return
        }
        for (var b = 0; b < g; b++) {
            if (e == a[b]) {
                pt.login.hideEmailTips();
                return
            }
            d = "emailTips_" + b;
            if (0 == b) {
                f.push("<li id=" + d + " class='hover' >" + a[b] + "</li>")
            } else {
                f.push("<li id=" + d + ">" + a[b] + "</li>")
            }
        }
        $("email_list").innerHTML = f.join(" ");
        pt.login.list_index[0] = 0
    },
    showEmailTips: function () {
        $.css.show($("email_list"))
    },
    hideEmailTips: function () {
        $.css.hide($("email_list"))
    },
    setUrl: function () {
        var a = pt.ptui.domain;
        var b = $.check.isHttps() && $.check.isSsl();
        pt.login.checkUrl = (pt.ptui.isHttps ? "https://ssl." : "http://check.") + "ptlogin2." + a + "/check";
        pt.login.loginUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + a + "/";
        pt.login.verifycodeUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "captcha." + a + "/getimage";
        if (b && a != "qq.com" && a != "tenpay.com") {
            pt.login.verifycodeUrl = "https://ssl.ptlogin2." + a + "/ptgetimage"
        }
        if (pt.ptui.regmaster == 2) {
            pt.login.checkUrl = "http://check.ptlogin2.function.qq.com/check?regmaster=2&";
            pt.login.loginUrl = "http://ptlogin2.function.qq.com/"
        } else {
            if (pt.ptui.regmaster == 3) {
                pt.login.checkUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "check.ptlogin2.crm2.qq.com/check?regmaster=3&";
                pt.login.loginUrl = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2.crm2.qq.com/"
            }
        }
    },
    init: function () {
        $.cookie.set("ptui_version", pt.ptui.ptui_version);
        if (pt.login.isJiechi()) {
            pt.login.antiProcess()
        }
        pt.ptui.new_qrcode = 0;
        pt.login.setUrl();
        pt.login.bindEvent();
        $("login_button") && ($("login_button").disabled = false);
        pt.login.set_default_uin(pt.ptui.defaultUin);
        if ($.check.is_weibo_appid(pt.ptui.appid)) {
            $("u") && ($("u").style.imeMode = "auto")
        }
        pt.login.changeBottom();
        pt.login.dftImg = pt.ptui.isHttps ? "https://ui.ptlogin2.qq.com/style/0/images/1.gif" : "http://imgcache.qq.com/ptlogin/v4/style/0/images/1.gif";
        if (pt.ptui.isHttps) {
            pt.login.delayTime = 7000;
            pt.login.delayMonitorId = "294060"
        }
        window.setTimeout(function () {
            $.report.monitor("366447&union=256042", 0.05);
            var a = "flag1=7808&flag2=1&flag3=9";
            $.report.setBasePoint(a, 0);
            if (typeof window.postMessage != "undefined") {
                $.report.setSpeedPoint(a, 1, 2000)
            } else {
                $.report.setSpeedPoint(a, 1, 1000)
            }
            $.report.isdSpeed(a, 0.01);
            if (!pt.ptui.login_sig) {
                $.report.nlog("新版登录框login_sig为空|_|" + pt.ptui.ptui_version, "291552")
            }
        }, 1000);
        if (window.g_cdn_js_fail && $.browser("type") == "msie") {
            pt.login.domLoad()
        } else {
            $.e.add(window, "load", pt.login.domLoad)
        }
    },
    isJiechi: function () {
        if ((location.href.indexOf(pt.ptui.href) == -1) && (pt.ptui.jumpname == "aqjump") && !$.check.isHttps()) {
            return true
        } else {
            return false
        }
    },
    antiProcess: function () {
        document.body.innerHTML = "";
        var g = document.createElement("div");
        g.setAttribute("id", "login");
        g.style.cssText = "margin: 0 auto;padding: 0 0 5px; width: 370px;background:#fff";
        var f = document.createElement("div");
        f.innerHTML = '<input type="button" style="background:url(http://imgcache.qq.com/ptlogin/v4/style/0/images/icons.gif) no-repeat 0 -284px;margin:-4px 4px 0 0;float:right;width:20px;height:20px;cursor:pointer;" id="close" name="close" onclick="javascript:onPageClose();" title="关闭" /><u id="label_login_title">用户登录</u>';
        var l = $.bom.query("hide_title_bar") == 1;
        if (l) {
            g.style.border = "0px"
        } else {
            g.appendChild(f);
            f.style.cssText = "background:url(http://imgcache.qq.com/ptlogin/v4/style/0/images/icons.gif) no-repeat 0 0;height:21px;font-weight:bold;font-size:12px;padding:7px 0 0 30px;border-bottom:1px solid #438ece;";
            g.style.border = "1px solid #99c2ee"
        }
        var n = document.createElement("div");
        n.style.textAlign = "center";
        n.innerHTML = '<div style="position:relative;">              <br/>              <p style="line-height:20px;text-align:left;width:220px;margin:0 auto;">您当前的网络存在链路层劫持，为了确保您的帐号安全，请使用安全登录。</p></div>              <br/>              <input id="safe_login" value="安全登录"" type="button"  style="border:0;background:url(http://imgcache.qq.com/ptlogin/v4/style/0/images/icons.gif) no-repeat -102px -130px;color:#2473A2;width:103px;height:28px;cursor:pointer;font-weight:bold;font-size:14px;"/>              </div>              <div style="margin-top:10px;margin-left:10px; height:20px;">              <span style="float:left;height:15px;width:14px; background: url(https://ui.ptlogin2.qq.com/style/14/images/help.png) no-repeat scroll right center transparent;"></span>              <a style="float:left; margin-left:5px;" href="http://kf.qq.com/info/80861.html" target="_blank" >什么是链路层劫持</a>              </div>';
        g.appendChild(n);
        document.body.appendChild(g);
        pt.preload.ptui_notifySize("login");
        var d = $.bom.query("s_url");
        var a = $.bom.query("appid");
        var m = $.bom.query("regmaster");
        var c = $.bom.query("enable_qlogin");
        var h = $.bom.query("jumpname");
        var j = $.bom.query("target");
        var b = $.bom.query("qtarget");
        var e = $.bom.query("daid");
        switch (b) {
        case "self":
            b = 0;
            break;
        case "top":
            b = 1;
            break;
        case "parent":
            b = 2;
            break;
        default:
            b = 1
        }
        var k = 1;
        if (h != "") {
            if (b != -1) {
                k = b
            }
        } else {
            switch (j) {
            case "self":
                k = 0;
                break;
            case "top":
                k = 1;
                break;
            case "parent":
                k = 2;
                break;
            default:
                k = 1
            }
        }
        $("safe_login").onclick = function () {
            $.report.monitor(247563);
            if (k != 1) {
                try {
                    d = top.location.href
                } catch (p) {}
            }
            d = encodeURIComponent(d);
            var o = "https://ui.ptlogin2.qq.com/cgi-bin/login";
            window.open(o + "?style=14&pt_safe=1&appid=" + a + "&s_url=" + d + "&regmaster=" + m + "&enable_qlogin=" + c + "&daid=" + e, "_top")
        };
        $.report.monitor(248671)
    },
    aq_patch: function () {
        if (Math.random() < 0.05 && !pt.ptui.isHttps) {
            $.http.loadScript("http://mat1.gtimg.com/www/js/common_v2.js", function () {
                if (typeof checkNonTxDomain == "function") {
                    checkNonTxDomain(1, 5)
                }
            })
        }
    },
    set_default_uin: function (a) {
        if (a) {} else {
            a = unescape($.cookie.getOrigin("ptui_loginuin"));
            if (pt.ptui.appid != pt.login.t_appid && ($.check.isNick(a) || $.check.isName(a))) {
                a = $.cookie.get("pt2gguin").replace(/^o/, "") - 0;
                a = a == 0 ? "" : a
            }
        }
        $("u").value = a;
        if (a) {
            $.css.hide($("uin_tips"));
            $.css.show($("uin_del"));
            pt.login.set_accout()
        }
    },
    set_accout: function () {
        var a = $.str.trim($("u").value);
        var b = pt.ptui.appid;
        pt.login.accout = a;
        pt.login.at_accout = a;
        if ($.check.is_weibo_appid(b)) {
            if ($.check.isQQ(a) || $.check.isMail(a)) {
                return true
            } else {
                if ($.check.isNick(a) || $.check.isName(a)) {
                    pt.login.at_accout = "@" + a;
                    return true
                } else {
                    if ($.check.isPhone(a)) {
                        pt.login.at_accout = "@" + a.replace(/^(86|886)/, "");
                        return true
                    } else {
                        if ($.check.isSeaPhone(a)) {
                            pt.login.at_accout = "@00" + a.replace(/^(00)/, "");
                            if (/^(@0088609)/.test(pt.login.at_accout)) {
                                pt.login.at_accout = pt.login.at_accout.replace(/^(@0088609)/, "@008869")
                            }
                            return true
                        }
                    }
                }
            }
        } else {
            if ($.check.isQQ(a) || $.check.isMail(a)) {
                return true
            }
            if ($.check.isPhone(a)) {
                pt.login.at_accout = "@" + a.replace(/^(86|886)/, "");
                return true
            }
            if ($.check.isNick(a)) {
                $("u").value = a + "@qq.com";
                pt.login.accout = a + "@qq.com";
                pt.login.at_accout = a + "@qq.com";
                return true
            }
        } if ($.check.isForeignPhone(a)) {
            pt.login.at_accout = "@" + a
        }
        return true
    },
    show_err: function (b, a) {
        pt.login.hideLoading();
        $.css.show($("error_tips"));
        pt.login.err_m.innerHTML = b;
        clearTimeout(pt.login.errclock);
        if (!a) {
            pt.login.errclock = setTimeout("pt.login.hide_err()", 5000)
        }
    },
    hide_err: function () {
        $.css.hide($("error_tips"));
        pt.login.err_m.innerHTML = ""
    },
    showAssistant: function (a) {
        if (pt.ptui.lang != "2052") {
            return
        }
        pt.login.hideLoading();
        $.css.show($("error_tips"));
        switch (a) {
        case 0:
            pt.login.err_m.innerHTML = "快速登录异常，试试<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>登录助手</a>修复";
            $.report.monitor("315785");
            break;
        case 1:
            pt.login.err_m.innerHTML = "快速登录异常，试试<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>登录助手</a>修复";
            $.report.monitor("315786");
            break;
        case 2:
            pt.login.err_m.innerHTML = "登录异常，试试<a class='tips_link' style='color: #29B1F1' href='/assistant/troubleshooter.html' target='_blank'>登录助手</a>修复";
            $.report.monitor("315787");
            break
        }
    },
    showGuanjiaTips: function () {
        $.initGuanjiaPlugin();
        if ($.guanjiaPlugin) {
            $.guanjiaPlugin.QMStartUp(16, '/traytip=3 /tipProblemid=1401 /tipSource=18 /tipType=0 /tipIdParam=0 /tipIconUrl="http://dldir2.qq.com/invc/xfspeed/qqpcmgr/clinic/image/tipsicon_qq.png" /tipTitle="QQ快速登录异常?" /tipDesc="不能用已登录的QQ号快速登录，只能手动输入账号密码，建议用电脑诊所一键修复。"');
            $.report.monitor("316548")
        } else {
            $.report.monitor("316549")
        }
    },
    showLoading: function (a) {
        pt.login.hide_err();
        $.css.show($("loading_tips"));
        $("loading_wording").innerHTML = a
    },
    hideLoading: function () {
        $.css.hide($("loading_tips"))
    },
    u_focus: function () {
        if ($("u").value == "") {
            $.css.show($("uin_tips"));
            $("uin_tips").className = "input_tips_focus"
        }
        $("u").parentNode.className = "inputOuter_focus"
    },
    u_blur: function () {
        if ($("u").value == "") {
            $.css.show($("uin_tips"));
            $("uin_tips").className = "input_tips"
        } else {
            pt.login.set_accout();
            pt.login.check()
        }
        $("u").parentNode.className = "inputOuter"
    },
    u_mouseover: function () {
        var a = $("u").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("u").parentNode.className = "inputOuter_hover"
        }
    },
    u_mouseout: function () {
        var a = $("u").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("u").parentNode.className = "inputOuter"
        }
    },
    window_blur: function () {
        pt.login.lastCheckAccout = ""
    },
    u_change: function () {
        pt.login.set_accout();
        pt.login.passwordErrorNum = 1;
        pt.login.hasCheck = false;
        pt.login.hasSubmit = false
    },
    list_keydown: function (j, g) {
        var f = $("email_list");
        var d = $("u");
        if (g == 1) {
            var f = $("combox_list")
        }
        var h = f.getElementsByTagName("li");
        var b = h.length;
        var a = j.keyCode;
        switch (a) {
        case pt.login.keyCode.UP:
            h[pt.login.list_index[g]].className = "";
            pt.login.list_index[g] = (pt.login.list_index[g] - 1 + b) % b;
            h[pt.login.list_index[g]].className = "hover";
            break;
        case pt.login.keyCode.DOWN:
            h[pt.login.list_index[g]].className = "";
            pt.login.list_index[g] = (pt.login.list_index[g] + 1) % b;
            h[pt.login.list_index[g]].className = "hover";
            break;
        case pt.login.keyCode.ENTER:
            var c = h[pt.login.list_index[g]].innerHTML;
            if (g == 0) {
                $("u").value = $.str.decodeHtml(c)
            }
            pt.login.hideEmailTips();
            j.preventDefault();
            break;
        case pt.login.keyCode.TAB:
            pt.login.hideEmailTips();
            break;
        default:
            break
        }
        if (g == 1) {
            $("combox_box").innerHTML = h[pt.login.list_index[g]].innerHTML;
            $("low_login_hour").value = h[pt.login.list_index[g]].getAttribute("value")
        }
    },
    u_keydown: function (a) {
        $.css.hide($("uin_tips"));
        if (pt.login.list_index[0] == -1) {
            return
        }
        pt.login.list_keydown(a, 0)
    },
    u_keyup: function (b) {
        var c = this.value;
        if (c == "") {
            $.css.show($("uin_tips"));
            $.css.hide($("uin_del"))
        } else {
            $.css.show($("uin_del"))
        }
        var a = b.keyCode;
        if (a != pt.login.keyCode.UP && a != pt.login.keyCode.DOWN && a != pt.login.keyCode.ENTER && a != pt.login.keyCode.TAB && a != pt.login.keyCode.F5) {
            if ($("u").value.indexOf("@") > -1) {
                pt.login.showEmailTips();
                pt.login.createEmailTips($("u").value)
            } else {
                pt.login.hideEmailTips()
            }
        }
    },
    email_mousemove: function (c) {
        var b = c.target;
        if (b.tagName.toLowerCase() != "li") {
            return
        }
        var a = $("emailTips_" + pt.login.list_index[0]);
        if (a) {
            a.className = ""
        }
        b.className = "hover";
        pt.login.list_index[0] = parseInt(b.getAttribute("id").substring(10));
        c.stopPropagation()
    },
    email_click: function (c) {
        var b = c.target;
        if (b.tagName.toLowerCase() != "li") {
            return
        }
        var a = $("emailTips_" + pt.login.list_index[0]);
        if (a) {
            $("u").value = $.str.decodeHtml(a.innerHTML);
            pt.login.set_accout();
            pt.login.check()
        }
        pt.login.hideEmailTips();
        c.stopPropagation()
    },
    p_focus: function () {
        if (this.value == "") {
            $.css.show($("pwd_tips"));
            $("pwd_tips").className = "input_tips_focus"
        }
        this.parentNode.className = "inputOuter_focus";
        pt.login.check()
    },
    p_blur: function () {
        if (this.value == "") {
            $.css.show($("pwd_tips"));
            $("pwd_tips").className = "input_tips"
        }
        $.css.hide($("caps_lock_tips"));
        this.parentNode.className = "inputOuter"
    },
    p_mouseover: function () {
        var a = $("p").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("p").parentNode.className = "inputOuter_hover"
        }
    },
    p_mouseout: function () {
        var a = $("p").parentNode;
        if (a.className == "inputOuter_focus") {} else {
            $("p").parentNode.className = "inputOuter"
        }
    },
    p_keydown: function (a) {
        $.css.hide($("pwd_tips"))
    },
    p_keyup: function () {
        if (this.value == "") {
            $.css.show($("pwd_tips"))
        }
    },
    p_keypress: function (a) {
        if (pt.login.detectCapsLock(a)) {
            $.css.show($("caps_lock_tips"))
        } else {
            $.css.hide($("caps_lock_tips"))
        }
    },
    vc_focus: function () {
        if (this.value == "") {
            $.css.show($("vc_tips"));
            $("vc_tips").className = "input_tips_focus"
        }
        this.parentNode.className = "inputOuter_focus"
    },
    vc_blur: function () {
        if (this.value == "") {
            $.css.show($("vc_tips"));
            $("vc_tips").className = "input_tips"
        }
        this.parentNode.className = "inputOuter"
    },
    vc_keydown: function () {
        $.css.hide($("vc_tips"))
    },
    vc_keyup: function () {
        if (this.value == "") {
            $.css.show($("vc_tips"))
        }
    },
    document_click: function () {
        pt.login.action[0]++;
        pt.login.hideEmailTips()
    },
    document_keydown: function () {
        pt.login.action[1]++
    },
    checkbox_click: function () {
        if (pt.login.low_login_enable) {
            $("p_low_login_enable").className = "uncheck"
        } else {
            $("p_low_login_enable").className = "checked"
        }
        pt.login.low_login_enable = !pt.login.low_login_enable
    },
    feedback: function (d) {
        var c = d ? d.target : null;
        var a = c ? c.id + "-" : "";
        var b = "http://support.qq.com/write.shtml?guest=1&fid=713&SSTAG=hailunna-" + a + $.str.encodeHtml(pt.login.accout);
        window.open(b)
    },
    bind_account: function () {
        $.css.hide($("operate_tips"));
        pt.login.need_hide_operate_tips = true;
        window.open("http://id.qq.com/index.html#account");
        $.report.monitor("234964")
    },
    checkQloginState: function () {
        var a = 2000;
        if ($.check.isSsl()) {
            a = 4000
        } else {
            if (window.g_cdn_js_fail && $.browser("type") == "msie") {
                a = 5000
            }
        }
        window.setTimeout(function () {
            if ($.loginQQnum > 0) {
                var b = pt.login.getQloginState();
                var c = $.cookie.get("ptui_qstatus");
                if (b != "2" && c != "2") {
                    pt.preload.switchpage(true);
                    if (b == "1" && Math.random() < 0.1) {
                        if (!c) {
                            $.report.nlog("没有收到xui跨域消息(2)", 282482)
                        } else {
                            $.report.nlog("没有收到xui跨域消息(3)", 282313)
                        }
                    }
                }
                if (b == 3) {
                    pt.login.showAssistant(1);
                    pt.login.showGuanjiaTips()
                }
            } else {
                if ($.sso_state == 1 && /windows/.test(navigator.userAgent.toLowerCase())) {
                    pt.login.showAssistant(0)
                }
            }
        }, a);
        if ($("u").value) {
            pt.login.check()
        }
        if ($.cookie.get("pt_qlogincode") == 5) {
            $.report.monitor("300967")
        }
    },
    delUin: function (a) {
        a && $.css.hide(a.target);
        $("u").value = "";
        pt.login.domFocus($("u"))
    },
    check_cdn_img: function () {
        if (!window.g_cdn_js_fail || pt.ptui.isHttps) {
            return
        }
        var a = new Image();
        a.onload = function () {
            a.onload = a.onerror = null
        };
        a.onerror = function () {
            a.onload = a.onerror = null;
            var d = $("main_css").innerHTML;
            var b = "http://imgcache.qq.com/ptlogin/v4/style/20/images/";
            var c = "http://ui.ptlogin2.qq.com/style/20/images/";
            d = d.replace(new RegExp(b, "g"), c);
            pt.login.insertInlineCss(d);
            $.report.monitor(312520)
        };
        a.src = "http://imgcache.qq.com/ptlogin/v4/style/11/images/c_icon_1.png"
    },
    insertInlineCss: function (a) {
        if (document.createStyleSheet) {
            var c = document.createStyleSheet("");
            c.cssText = a
        } else {
            var b = document.createElement("style");
            b.type = "text/css";
            b.textContent = a;
            document.getElementsByTagName("head")[0].appendChild(b)
        }
    },
    checkInputLable: function () {
        try {
            if ($("u").value) {
                $.css.hide($("uin_tips"))
            }
            window.setTimeout(function () {
                if ($("p").value) {
                    $.css.hide($("pwd_tips"))
                }
            }, 1000)
        } catch (a) {}
    },
    domLoad: function (b) {
        pt.login.checkInputLable();
        //pt.login.begin_qrlogin();
        // var a = $("loading_img");
        // if (a) {
        //     a.setAttribute("src", a.getAttribute("place_src"))
        // }
        pt.login.loadQrTipsPic(pt.ptui.lang);
        pt.login.check_cdn_img();
        window.setTimeout(function () {
            pt.preload.ptui_notifySize("login");
            pt.preload.initFocus(document.loginform)
        }, 0);
        pt.login.webLoginReport();
        pt.login.checkQloginState();
        pt.login.aq_patch()
    },
    noscript_err: function () {
        $.report.nlog("noscript_err", 316648);
        $("noscript_area").style.display = "none"
    },
    switchpage: function (c) {
        var a = c.origin;
        var b = new RegExp("http(s){0,1}://(ssl.){0,1}xui.ptlogin2." + pt.ptui.domain);
        if (b.test(a)) {
            pt.login.setQloginState(c.data);
            if (pt.login.getQloginState() == "3") {
                pt.preload.switchpage(true)
            }
        } else {
            if (c.data == "hidePtui") {}
        }
    },
    setQloginState: function (a) {
        pt.login.xuiState = a
    },
    getQloginState: function () {
        return pt.login.xuiState
    },
    bindEvent: function () {
        var l = $("u");
        var m = $("p");
        var p = $("verifycode");
        var d = $("verifyimgArea");
        var k = $("login_button");
        var t = $("p_low_login_box");
        var x = $("email_list");
        var j = $("feedback_web");
        var q = $("feedback_qr");
        var v = $("feedback_qlogin");
        var h = $("low_login_wording");
        var f = $("close");
        var w = $("uin_del");
        var c = $("bind_account");
        var r = $("qr_img_box");
        var e = $("qr_invalid");
        var o = $("qr_img");
        var b = $("gjLink");
        var g = $("goBack");
        var n = $("switcher_qlogin");
        var a = $("switcher_plogin");
        if (g) {
            $.e.add(g, "click", function (y) {
                pt.login.switch_qrlogin()
            })
        }
        if (b) {
            $.e.add(b, "click", function (y) {
                $.report.monitor(325120)
            })
        }
        if (o) {
            $.e.add(o, "load", pt.login.qr_load);
            $.e.add(o, "error", pt.login.qr_error)
        }
        if (e) {
            $.e.add(e, "click", pt.login.begin_qrlogin)
        }
        if (r) {
            $.e.add(r, "mouseover", pt.login.showQrTips);
            $.e.add(r, "mouseout", pt.login.hideQrTips)
        }
        if (n) {
            $.e.add(n, "click", function () {
                pt.preload.switchpage(false, false);
                $.report.monitor("331284", 0.05)
            })
        }
        if (a) {
            $.e.add(a, "click", function (y) {
                y.preventDefault();
                pt.preload.switchpage(true, false);
                $.report.monitor("331285", 0.05)
            })
        }
        if (c) {
            $.e.add(c, "click", pt.login.bind_account);
            $.e.add(c, "mouseover", function (y) {
                pt.login.need_hide_operate_tips = false
            });
            $.e.add(c, "mouseout", function (y) {
                pt.login.need_hide_operate_tips = true
            })
        }
        if (f) {
            $.e.add(f, "click", pt.login.ptui_notifyClose)
        }
        if (pt.ptui.low_login == 1 && t) {
            $.e.add(t, "click", pt.login.checkbox_click)
        }
        $.e.add(l, "focus", pt.login.u_focus);
        $.e.add(l, "blur", pt.login.u_blur);
        $.e.add(l, "change", pt.login.u_change);
        $.e.add(l, "keydown", pt.login.u_keydown);
        $.e.add(l, "keyup", pt.login.u_keyup);
        $.e.add(l.parentNode, "mouseover", pt.login.u_mouseover);
        $.e.add(l.parentNode, "mouseout", pt.login.u_mouseout);
        $.e.add(w, "click", pt.login.delUin);
        $.e.add(m, "focus", pt.login.p_focus);
        $.e.add(m, "blur", pt.login.p_blur);
        $.e.add(m, "keydown", pt.login.p_keydown);
        $.e.add(m, "keyup", pt.login.p_keyup);
        $.e.add(m, "keypress", pt.login.p_keypress);
        $.e.add(m.parentNode, "mouseover", pt.login.p_mouseover);
        $.e.add(m.parentNode, "mouseout", pt.login.p_mouseout);
        $.e.add(k, "click", pt.login.submit);
        $.e.add(d, "click", pt.login.changeVC);
        $.e.add(x, "mousemove", pt.login.email_mousemove);
        $.e.add(x, "click", pt.login.email_click);
        $.e.add(document, "click", pt.login.document_click);
        $.e.add(document, "keydown", pt.login.document_keydown);
        $.e.add(p, "focus", pt.login.vc_focus);
        $.e.add(p, "blur", pt.login.vc_blur);
        $.e.add(p, "keydown", pt.login.vc_keydown);
        $.e.add(p, "keyup", pt.login.vc_keyup);
        $.e.add(window, "message", pt.login.switchpage);
        var s = $("vip_link2");
        if (s) {
            $.e.add(s, "click", function (y) {
                window.open("http://pay.qq.com/qqvip/index.shtml?aid=vip.gongneng.other.red.dengluweb_wording2_open");
                y.preventDefault();
                $.report.monitor("263482")
            })
        }
        var u = $("noscript_img");
        if (u) {
            $.e.add(u, "load", pt.login.noscript_err);
            $.e.add(u, "error", pt.login.noscript_err)
        }
    },
    showVC: function () {
        pt.login.vcFlag = true;
        $.css.show($("verifyArea"));
        $("verifycode").value = "";
        pt.preload.ptui_notifySize("login");
        var a = $("verifyimg");
        var b = pt.login.getVCUrl();
        a.src = b
    },
    hideVC: function () {
        pt.login.vcflag = false;
        $.css.hide($("verifyArea"));
        pt.preload.ptui_notifySize("login")
    },
    changeVC: function (b) {
        var a = $("verifyimg");
        var c = pt.login.getVCUrl();
        a.src = c;
        b && b.preventDefault()
    },
    getVCUrl: function () {
        var d = pt.login.at_accout;
        var c = pt.ptui.domain;
        var b = pt.ptui.appid;
        var a = pt.login.verifycodeUrl + "?uin=" + d + "&aid=" + b + "&cap_cd=" + pt.login.cap_cd + "&" + Math.random();
        return a
    },
    checkValidate: function (b) {
        try {
            var a = b.u;
            var d = b.p;
            var f = b.verifycode;
            if ($.str.trim(a.value) == "") {
                pt.login.show_err(pt.str.no_uin);
                pt.login.domFocus(a);
                return false
            }
            if ($.check.isNullQQ(a.value)) {
                pt.login.show_err(pt.str.inv_uin);
                pt.login.domFocus(a);
                return false
            }
            if (d.value == "") {
                pt.login.show_err(pt.str.no_pwd);
                pt.login.domFocus(d);
                return false
            }
            if (f.value == "") {
                if (!pt.login.needVc && !pt.login.vcFlag) {
                    pt.login.checkResultReport(14);
                    clearTimeout(pt.login.checkClock);
                    pt.login.showVC()
                } else {
                    pt.login.show_err(pt.str.no_vcode);
                    pt.login.domFocus(f)
                }
                return false
            }
            if (f.value.length < 4) {
                pt.login.show_err(pt.str.inv_vcode);
                pt.login.domFocus(f);
                f.select();
                return false
            }
        } catch (c) {}
        return true
    },
    checkTimeout: function () {
        var a = $.str.trim($("u").value);
        if ($.check.isQQ(a) || $.check.isQQMail(a)) {
            pt.login.saltUin = $.str.uin2hex(a.replace("@qq.com", ""));
            pt.login.showVC();
            pt.login.isCheckTimeout = true;
            pt.login.checkRet = 1;
            pt.login.cap_cd = 0
        }
    },
    loginTimeout: function () {
        pt.login.loginResultReport(13);
        pt.login.showAssistant(2)
    },
    check: function () {
        if (!pt.login.accout) {
            pt.login.set_accout()
        }
        if ($.check.isNullQQ(pt.login.accout)) {
            pt.login.show_err(pt.str.inv_uin);
            return false
        }
        if (pt.login.accout == pt.login.lastCheckAccout || pt.login.accout == "") {
            return
        }
        pt.login.ptui_uin(pt.login.accout);
        pt.login.lastCheckAccout = pt.login.accout;
        var b = pt.ptui.appid;
        var a = pt.login.getCheckUrl(pt.login.at_accout, b);
        pt.login.isCheckTimeout = false;
        g_time.time6 = new Date();
        clearTimeout(pt.login.checkClock);
        pt.login.checkClock = setTimeout("pt.login.checkTimeout();", 5000);
        $.http.loadScript(a)
    },
    getCheckUrl: function (b, c) {
        var a = pt.login.checkUrl + "?regmaster=" + pt.ptui.regmaster + "&";
        a += "uin=" + b + "&appid=" + c + "&js_ver=" + pt.ptui.ptui_version + "&js_type=" + pt.login.js_type + "&login_sig=" + pt.ptui.login_sig + "&u1=" + encodeURIComponent(pt.ptui.s_url) + "&r=" + Math.random();
        return a
    },
    getSubmitUrl: function (h) {
        var b = document.forms[0];
        var j = pt.login.loginUrl + h + "?";
        var a = document.getElementById("login2qq");
        for (var e = 0; e < b.length; e++) {
            if (h == "ptqrlogin" && (b[e].name == "u" || b[e].name == "p" || b[e].name == "verifycode" || b[e].name == "h")) {
                continue
            }
            if (b[e].name == "ipFlag" && !b[e].checked) {
                j += b[e].name + "=-1&";
                continue
            }
            if (b[e].name == "fp" || b[e].type == "submit") {
                continue
            }
            if (b[e].name == "ptredirect") {
                g_ptredirect = b[e].value
            }
            if (b[e].name == "low_login_hour" && (!pt.login.low_login_enable)) {
                continue
            }
            if (b[e].name == "webqq_type" && !a && (!b[e].checked)) {
                continue
            }
            j += b[e].name;
            j += "=";
            if (b[e].name == "u") {
                j += encodeURIComponent(pt.login.at_accout) + "&";
                continue
            }
            if (b[e].name == "p") {
                var l = b.p.value;
                var g = b.verifycode.value.toUpperCase();
                var f = "";
                if (pt.login.RSAKey) {
                    f = $.Encryption.getRSAEncryption(l, g)
                } else {
                    f = $.Encryption.getEncryption(l, pt.login.saltUin, g)
                }
                j += f
            } else {
                if (b[e].name == "u1" || b[e].name == "ep") {
                    var c = b[e].value;
                    var k = "";
                    if (pt.ptui.appid == "1003903" && a) {
                        k = /\?/g.test(c) ? "&" : "?";
                        var d = document.getElementById("webqq_type").value;
                        k += "login2qq=" + a.value + "&webqq_type=" + d
                    }
                    j += encodeURIComponent(c + k)
                } else {
                    j += b[e].value
                }
            }
            j += "&"
        }
        j += "low_login_enable=" + (pt.ptui.low_login == 1 && pt.login.low_login_enable ? ("1&low_login_hour=720") : 0) + "&regmaster=" + pt.ptui.regmaster + "&fp=loginerroralert&action=" + pt.login.action.join("-") + "-" + (new Date() - 0) + "&mibao_css=" + pt.ptui.mibao_css + "&t=" + pt.login.passwordErrorNum + "&g=1";
        j += "&js_ver=" + pt.ptui.ptui_version + "&js_type=" + pt.login.js_type + "&login_sig=" + pt.ptui.login_sig;
        j += "&pt_uistyle=" + pt.ptui.style;
        if (pt.ptui.csimc != "0") {
            j += "&csimc=" + pt.ptui.csimc + "&csnum=" + pt.ptui.csnum + "&authid=" + pt.ptui.authid
        }
        if ($.bom.query("pt_safe") == 1) {
            j += "&ptmbproto=1"
        }
        if (pt.login.RSAKey) {
            j += "&pt_rsa=1"
        } else {
            j += "&pt_rsa=0"
        } if (pt.ptui.pt_qzone_sig == "1") {
            j += "&pt_qzone_sig=1"
        }
        return j
    },
    submit: function (a) {
        a.preventDefault();
        if (!pt.login.ptui_onLogin(document.loginform)) {
            return false
        } else {
            $.cookie.set("ptui_loginuin", escape(document.loginform.u.value), pt.ptui.domain, "/", 24 * 30)
        } if (pt.login.checkRet == -1 || pt.login.checkRet == 3) {
            pt.login.show_err(pt.login.checkErr[pt.ptui.lang]);
            pt.login.lastCheckAccout = "";
            pt.login.domFocus($("p"));
            return
        }
        if (pt.login.isCheckTimeout) {
            pt.login.checkResultReport(14)
        }
        g_time.time12 = new Date();
        clearTimeout(pt.login.loginClock);
        pt.login.loginClock = setTimeout("pt.login.loginTimeout();", 5000);
        var b = pt.login.getSubmitUrl("login");
        $.winName.set("login_param", encodeURIComponent(pt.login.login_param));
        pt.login.showLoading(pt.str.h_loading_wording);
        $.http.loadScript(b);
        return false
    },
    webLoginReport: function () {
        window.setTimeout(function () {
            try {
                var d = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
                var g = {};
                var c = window.performance ? window.performance.timing : null;
                if (c) {
                    for (var b = 1, a = d.length; b < a; b++) {
                        if (c[d[b]]) {
                            g[b] = c[d[b]] - c[d[0]]
                        }
                    }
                    if (c.domainLookupEnd > 0 && c.domainLookupStart) {
                        if (c.domainLookupEnd == c.domainLookupStart) {
                            g["21"] = 2000
                        } else {
                            g["21"] = 1000
                        }
                    }
                    if (c.connectEnd > 0 && c.connectStart) {
                        if (c.connectEnd == c.connectStart) {
                            g["22"] = 2000
                        } else {
                            g["22"] = 1000
                        }
                    }
                    if ((c.domContentLoadedEventEnd - c.navigationStart > pt.login.delayTime) && c.navigationStart > 0) {
                        $.report.nlog("访问ui延时超过" + pt.login.delayTime / 1000 + "s:delay=" + (c.domContentLoadedEventEnd - c.navigationStart) + ";domContentLoadedEventEnd=" + c.domContentLoadedEventEnd + ";navigationStart=" + c.navigationStart + ";clientip=" + pt.ptui.clientip + ";serverip=" + pt.ptui.serverip, pt.login.delayMonitorId, 1)
                    }
                    if (c.connectStart <= c.connectEnd && c.responseStart <= c.responseEnd) {
                        pt.login.ptui_speedReport(g)
                    }
                }
            } catch (f) {}
        }, 1000)
    },
    ptui_speedReport: function (d) {
        if ($.browser("type") != "msie" && $.browser("type") != "webkit") {
            return
        }
        var b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=3";
        if (pt.ptui.isHttps) {
            if (Math.random() > 1) {
                return
            }
            if ($.browser("type") == "msie") {
                if ($.check.isSsl()) {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=4";
                    if ($.check.isPaipai()) {
                        b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=10"
                    }
                } else {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=5"
                }
            } else {
                if ($.check.isSsl()) {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=25";
                    if ($.check.isPaipai()) {
                        b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=24"
                    }
                } else {
                    b = "https://login.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=23"
                }
            }
        } else {
            if (Math.random() > 0.05) {
                return
            }
            if ($.browser("type") == "msie") {
                b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=3"
            } else {
                b = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7808&flag2=1&flag3=22"
            }
        }
        for (var c in d) {
            if (d[c] > 300000 || d[c] < 0) {
                continue
            }
            b += "&" + c + "=" + d[c]
        }
        var a = new Image();
        a.src = b
    },
    resultReport: function (b, a, e) {
        var d = "http://isdspeed.qq.com/cgi-bin/v.cgi?flag1=" + b + "&flag2=" + a + "&flag3=" + e;
        var c = new Image();
        c.src = d
    },
    checkResultReport: function (c) {
        if (pt.ptui.isHttps || Math.random() > 0.1) {
            return
        }
        var b = 170025;
        var a = 0;
        var d = c;
        switch (c) {
        case 11:
        case 12:
        case 13:
            a = 1;
            break;
        case 14:
        case 15:
            a = 2;
            break;
        default:
            break
        }
        if (a != 0) {
            pt.login.resultReport(b, a, d)
        }
    },
    loginResultReport: function (c) {
        if (pt.ptui.isHttps || Math.random() > 0.1) {
            return
        }
        var b = 170026;
        var a = 0;
        var d = c;
        switch (c) {
        case 11:
        case 12:
            a = 1;
            break;
        case 13:
            a = 2;
            break;
        default:
            break
        }
        if (a != 0) {
            pt.login.resultReport(b, a, d)
        }
    },
    ptui_notifyClose: function () {
        try {
            window.clearInterval(pt.login.qrlogin_clock);
            if (parent.ptlogin2_onClose) {
                parent.ptlogin2_onClose()
            } else {
                if (top == this) {
                    window.close()
                }
            }
        } catch (a) {
            window.close()
        }
    },
    ptui_onLogin: function (b) {
        var a = true;
        a = pt.login.checkValidate(b);
        try {
            if (typeof parent.ptlogin2_onLogin == "function") {
                if (!parent.ptlogin2_onLogin()) {
                    return false
                }
            }
            if (typeof parent.ptlogin2_onLoginEx == "function") {
                var f = b.u.value;
                var c = b.verifycode.value;
                if (!parent.ptlogin2_onLoginEx(f, c)) {
                    return false
                }
            }
        } catch (d) {}
        return a
    },
    ptui_uin: function (a) {
        try {
            if (typeof parent.ptui_uin == "function") {
                parent.ptui_uin(a)
            }
        } catch (b) {}
    },
    is_mibao: function (a) {
        return /^http(s)?:\/\/ui.ptlogin2.(\S)+\/cgi-bin\/mibao_vry/.test(a)
    },
    get_qrlogin_pic: function () {
        var b = "ptqrshow";
        var a = (pt.ptui.isHttps ? "https://ssl." : "http://") + "ptlogin2." + pt.ptui.domain + "/" + b + "?";
        if (pt.ptui.regmaster == 2) {
            a = "http://ptlogin2.function.qq.com/" + b + "?regmaster=2&"
        } else {
            if (pt.ptui.regmaster == 3) {
                a = "http://ptlogin2.crm2.qq.com/" + b + "?regmaster=3&"
            }
        }
        a += "appid=" + pt.ptui.appid + "&e=2&l=M&s=3&d=72&v=4&t=" + Math.random();
        return a
    },
    go_qrlogin_step: function (a) {
        switch (a) {
        case 1:
            $("qrlogin_step2").style.display = "none";
            pt.login.cancle_qrlogin();
            pt.login.begin_qrlogin();
            break;
        case 2:
            $("qrlogin_step2").style.height = ($("login").offsetHeight - 10) + "px";
            $("qrlogin_step2").style.display = "block";
            break;
        case 3:
            break;
        default:
            break
        }
    },
    adjustLoginsize: function () {
        var a = $("web_login").offsetHeight - 0;
        $("web_qr_login").style.height = a + "px"
    },
    changeBottom: function () {
        return;
        if (pt.preload.getLoginStatus() == 2 || 1) {
            $("bottom_qlogin") && $.css.show($("bottom_qlogin"))
        } else {
            $("bottom_qlogin") && $.css.hide($("bottom_qlogin"))
        }
    },
    begin_qrlogin: function () {
        pt.login.cancle_qrlogin();
        $.css.hide($("qr_invalid"));
        $.css.hide($("qr_img"));
        $("qr_img").src = pt.login.get_qrlogin_pic();
        pt.login.qrlogin_clock = window.setInterval(function () {
            pt.login.qrlogin_submit()
        }, 3000);
        pt.login.qrlogin_timeout = window.setTimeout(function () {
            pt.login.switch_qrlogin()
        }, pt.login.qrlogin_timeout_time)
    },
    cancle_qrlogin: function () {
        window.clearInterval(pt.login.qrlogin_clock);
        window.clearTimeout(pt.login.qrlogin_timeout)
    },
    set_qrlogin_invalid: function () {
        pt.login.cancle_qrlogin();
        $.css.show($("qr_invalid"))
    },
    loadQrTipsPic: function (b) {
        var a = $("qr_tips_pic");
        var d = "chs";
        switch (b + "") {
        case "2052":
            d = "chs";
            break;
        case "1033":
            d = "en";
            break;
        case "1028":
            d = "cht";
            break
        }
        $.css.addClass(a, "qr_tips_pic_" + d)
    },
    showQrTips: function () {
        $.css.show($("qr_tips"));
        $("qr_tips_pic").style.opacity = 0;
        $("qr_tips_pic").style.filter = "alpha(opacity=0)";
        $("qr_tips_menban").className = "qr_tips_menban";
        $.animate.fade("qr_tips_pic", 100, 2, 20);
        pt.login.hideQrTipsClock = window.setTimeout("pt.login.hideQrTips()", 5000);
        $.report.monitor("331286", 0.05)
    },
    hideQrTips: function () {
        window.clearTimeout(pt.login.hideQrTipsClock);
        $("qr_tips_menban").className = "";
        $.animate.fade("qr_tips_pic", 0, 5, 20, function () {
            $.css.hide($("qr_tips"))
        })
    },
    qr_load: function (a) {
        $.css.show($("qr_img"))
    },
    qr_error: function (a) {
        pt.login.set_qrlogin_invalid()
    },
    switch_qrlogin: function (a) {
        $("qrlogin_step2").style.display = "none";
        if (a == 65) {
            window.clearInterval(pt.login.qrlogin_clock)
        } else {
            pt.login.cancle_qrlogin()
        }
        $.report.monitor("273368", 0.05);
        $("qr_invalid").style.display = "block"
    },
    force_qrlogin: function () {
        $("login_button").disabled = true;
        $.css.addClass($("login_button"), "grayscale")
    },
    no_force_qrlogin: function () {
        $("login_button").disabled = false;
        $.css.removeClass($("login_button"), "grayscale")
    },
    qrlogin_submit: function () {
        var a = pt.login.getSubmitUrl("ptqrlogin");
        $.winName.set("login_param", encodeURIComponent(pt.login.login_param));
        $.http.loadScript(a);
        return
    }
};
pt.setHeader = function (a) {
    for (var b in a) {
        if (b != "") {
            if ($("qr_head")) {
                if (a[b] && a[b].indexOf("sys.getface.qq.com") > -1) {
                    $("qr_head").src = pt.login.dftImg
                } else {
                    $("qr_head").src = a[b]
                }
            }
        }
    }
};
pt.login.init();

function ptuiCB(j, m, b, g, c, a) {
    var k = pt.login.at_accout && $("p").value;
    if (k) {
        pt.login.lastCheckAccout = ""
    }
    clearTimeout(pt.login.loginClock);
    g_time.time13 = new Date();
    var n = g_time.time13 - g_time.time12;
    var l = 0;
    if (n < 0) {} else {
        if (n <= 3000) {
            l = 11
        } else {
            if (n <= 5000) {
                l = 12
            }
        }
    } if (l > 0) {
        pt.login.loginResultReport(l)
    }
    pt.login.hideLoading();

    function f() {
        try {
            var p = $.cookie.get("uin");
            var o = $.localData.get("nocookieTime") ? $.localData.get("nocookieTime") : 0;
            o = parseInt(o);
            if (!p) {
                if (navigator.cookieEnabled) {
                    o += 1;
                    $.localData.set("nocookieTime", o);
                    switch (o) {
                    case 1:
                        $.report.monitor("269923");
                        break;
                    case 2:
                        $.report.monitor("269924");
                        break;
                    default:
                        $.report.monitor("269925");
                        break
                    }
                } else {
                    $.report.monitor("273080")
                }
            } else {
                $.localData.set("nocookieTime", 0);
                $.report.monitor("269926", 0.05)
            }
        } catch (q) {}
    }

    function d() {
        switch (g) {
        case "0":
            window.location.href = b;
            break;
        case "1":
            f();
            top.location.href = b;
            break;
        case "2":
            parent.location.href = b;
            break;
        default:
            top.location.href = b
        }
    }
    pt.login.hasSubmit = true;
    switch (j) {
    case "0":
        if (!k && !pt.login.is_mibao(b)) {
            window.clearInterval(pt.login.qrlogin_clock);
            d()
        } else {
            d()
        }
        break;
    case "3":
        $("p").value = "";
        pt.login.domFocus($("p"));
        pt.login.passwordErrorNum++;
        if (m == "101" || m == "102" || m == "103") {
            pt.login.showVC()
        }
        pt.login.check();
        break;
    case "4":
        if (pt.login.vcFlag) {
            pt.login.changeVC()
        } else {
            pt.login.showVC()
        }
        try {
            $("verifycode").focus();
            $("verifycode").select()
        } catch (h) {}
        break;
    case "65":
        pt.login.switch_qrlogin();
        return;
    case "66":
        return;
    case "67":
        pt.login.go_qrlogin_step(2);
        return;
    case "10005":
        pt.login.force_qrlogin();
        break;
    default:
        if (pt.login.needVc) {
            pt.login.changeVC()
        } else {
            pt.login.check()
        }
        break
    }
    if (j == "10005" || j == "12" || j == "51") {
        pt.login.show_err(c, true)
    } else {
        if (k && j != 0) {
            pt.login.show_err(c)
        }
    } if (!pt.login.hasCheck && k) {
        pt.login.showVC();
        $("verifycode").focus();
        $("verifycode").select()
    }
}

function ptui_checkVC(b, e, d) {
    clearTimeout(pt.login.checkClock);
    pt.login.saltUin = d;
    pt.login.checkRet = b;
    if (!d) {
        pt.login.RSAKey = true
    } else {
        pt.login.RSAKey = false
    } if (b == "2") {
        pt.login.show_err(pt.str.inv_uin)
    } else {
        if (b == "3") {} else {
            if (!pt.login.hasSubmit) {
                pt.login.hide_err()
            }
        }
    }
    switch (b + "") {
    case "0":
    case "2":
    case "3":
        pt.login.hideVC();
        $("verifycode").value = e || "abcd";
        pt.login.needVc = false;
        $.report.monitor("330321", 0.05);
        break;
    case "1":
        pt.login.cap_cd = e;
        pt.login.showVC();
        $.css.show($("vc_tips"));
        pt.login.needVc = true;
        $.report.monitor("330320", 0.05);
        break;
    default:
        break
    }
    pt.login.domFocus($("p"));
    pt.login.hasCheck = true;
    g_time.time7 = new Date();
    var a = g_time.time7 - g_time.time6;
    var c = 0;
    if (a < 0) {
        return
    } else {
        if (a <= 3000) {
            c = 11
        } else {
            if (a <= 5000) {
                c = 12
            } else {
                c = 13
            }
        }
    }
    pt.login.checkResultReport(c)
};