/**
 * Created by vaik on 8/22/16.
 */
(function (C, p) {
    "object" === typeof exports ? p(exports) : "function" === typeof define && define.amd ? define(["exports"], p) : p(C)
})(this, function (C) {
    function p(a) {
        this._targetElement = a;
        this._introItems = [];
        this._options = {
            nextLabel: "Next &rarr;",
            prevLabel: "&larr; Back",
            skipLabel: "Skip",
            doneLabel: "Done",
            tooltipPosition: "bottom",
            tooltipClass: "",
            highlightClass: "",
            exitOnEsc: !0,
            exitOnOverlayClick: !0,
            showStepNumbers: !0,
            keyboardNavigation: !0,
            showButtons: !0,
            showBullets: !0,
            showProgress: !1,
            scrollToElement: !0,
            overlayOpacity: 0.8,
            scrollPadding: 30,
            positionPrecedence: ["bottom", "top", "right", "left"],
            disableInteraction: !1,
            hintPosition: "top-middle",
            hintButtonLabel: "Got it",
            hintAnimation: !0
        }
    }

    function R(a) {
        var b = [], c = this;
        if (this._options.steps)for (var d = 0, f = this._options.steps.length; d < f; d++) {
            var e = y(this._options.steps[d]);
            e.step = b.length + 1;
            "string" === typeof e.element && (e.element = document.querySelector(e.element));
            if ("undefined" === typeof e.element || null == e.element) {
                var g = document.querySelector(".introjsFloatingElement");
                null ==
                g && (g = document.createElement("div"), g.className = "introjsFloatingElement", document.body.appendChild(g));
                e.element = g;
                e.position = "floating"
            }
            null != e.element && b.push(e)
        } else {
            f = a.querySelectorAll("*[data-intro]");
            if (1 > f.length)return !1;
            d = 0;
            for (e = f.length; d < e; d++)if (g = f[d], "none" != g.style.display) {
                var k = parseInt(g.getAttribute("data-step"), 10);
                0 < k && (b[k - 1] = {
                    element: g,
                    intro: g.getAttribute("data-intro"),
                    step: parseInt(g.getAttribute("data-step"), 10),
                    tooltipClass: g.getAttribute("data-tooltipClass"),
                    highlightClass: g.getAttribute("data-highlightClass"),
                    position: g.getAttribute("data-position") || this._options.tooltipPosition
                })
            }
            d = k = 0;
            for (e = f.length; d < e; d++)if (g = f[d], null == g.getAttribute("data-step")) {
                for (; "undefined" != typeof b[k];)k++;
                b[k] = {
                    element: g,
                    intro: g.getAttribute("data-intro"),
                    step: k + 1,
                    tooltipClass: g.getAttribute("data-tooltipClass"),
                    highlightClass: g.getAttribute("data-highlightClass"),
                    position: g.getAttribute("data-position") || this._options.tooltipPosition
                }
            }
        }
        d = [];
        for (f = 0; f < b.length; f++)b[f] && d.push(b[f]);
        b = d;
        b.sort(function (a, c) {
            return a.step -
                c.step
        });
        c._introItems = b;
        S.call(c, a) && (z.call(c), a.querySelector(".introjs-skipbutton"), a.querySelector(".introjs-nextbutton"), c._onKeyDown = function (b) {
            if (27 === b.keyCode && !0 == c._options.exitOnEsc)void 0 != c._introExitCallback && c._introExitCallback.call(c), A.call(c, a); else if (37 === b.keyCode)E.call(c); else if (39 === b.keyCode)z.call(c); else if (13 === b.keyCode) {
                var d = b.target || b.srcElement;
                d && 0 < d.className.indexOf("introjs-prevbutton") ? E.call(c) : d && 0 < d.className.indexOf("introjs-skipbutton") ? (c._introItems.length -
                1 == c._currentStep && "function" === typeof c._introCompleteCallback && c._introCompleteCallback.call(c), void 0 != c._introExitCallback && c._introExitCallback.call(c), A.call(c, a)) : z.call(c);
                b.preventDefault ? b.preventDefault() : b.returnValue = !1
            }
        }, c._onResize = function (a) {
            r.call(c, document.querySelector(".introjs-helperLayer"));
            r.call(c, document.querySelector(".introjs-tooltipReferenceLayer"))
        }, window.addEventListener ? (this._options.keyboardNavigation && window.addEventListener("keydown", c._onKeyDown, !0), window.addEventListener("resize",
            c._onResize, !0)) : document.attachEvent && (this._options.keyboardNavigation && document.attachEvent("onkeydown", c._onKeyDown), document.attachEvent("onresize", c._onResize)));
        return !1
    }

    function y(a) {
        if (null == a || "object" != typeof a || "undefined" != typeof a.nodeType)return a;
        var b = {}, c;
        for (c in a)b[c] = "undefined" != typeof jQuery && a[c] instanceof jQuery ? a[c] : y(a[c]);
        return b
    }

    function z() {
        this._direction = "forward";
        "undefined" === typeof this._currentStep ? this._currentStep = 0 : ++this._currentStep;
        if (this._introItems.length <=
            this._currentStep)"function" === typeof this._introCompleteCallback && this._introCompleteCallback.call(this), A.call(this, this._targetElement); else {
            var a = this._introItems[this._currentStep];
            "undefined" !== typeof this._introBeforeChangeCallback && this._introBeforeChangeCallback.call(this, a.element);
            N.call(this, a)
        }
    }

    function E() {
        this._direction = "backward";
        if (0 === this._currentStep)return !1;
        var a = this._introItems[--this._currentStep];
        "undefined" !== typeof this._introBeforeChangeCallback && this._introBeforeChangeCallback.call(this,
            a.element);
        N.call(this, a)
    }

    function A(a) {
        var b = a.querySelector(".introjs-overlay");
        if (null != b) {
            b.style.opacity = 0;
            setTimeout(function () {
                b.parentNode && b.parentNode.removeChild(b)
            }, 500);
            var c = a.querySelector(".introjs-helperLayer");
            c && c.parentNode.removeChild(c);
            (c = a.querySelector(".introjs-tooltipReferenceLayer")) && c.parentNode.removeChild(c);
            (a = a.querySelector(".introjs-disableInteraction")) && a.parentNode.removeChild(a);
            (a = document.querySelector(".introjsFloatingElement")) && a.parentNode.removeChild(a);
            if (a = document.querySelector(".introjs-showElement"))a.className = a.className.replace(/introjs-[a-zA-Z]+/g, "").replace(/^\s+|\s+$/g, "");
            if ((a = document.querySelectorAll(".introjs-fixParent")) && 0 < a.length)for (c = a.length - 1; 0 <= c; c--)a[c].className = a[c].className.replace(/introjs-fixParent/g, "").replace(/^\s+|\s+$/g, "");
            window.removeEventListener ? window.removeEventListener("keydown", this._onKeyDown, !0) : document.detachEvent && document.detachEvent("onkeydown", this._onKeyDown);
            this._currentStep = void 0
        }
    }

    function G(a,
               b, c, d, f) {
        var e = "", g, k;
        f = f || !1;
        b.style.top = null;
        b.style.right = null;
        b.style.bottom = null;
        b.style.left = null;
        b.style.marginLeft = null;
        b.style.marginTop = null;
        c.style.display = "inherit";
        "undefined" != typeof d && null != d && (d.style.top = null, d.style.left = null);
        if (this._introItems[this._currentStep]) {
            e = this._introItems[this._currentStep];
            e = "string" === typeof e.tooltipClass ? e.tooltipClass : this._options.tooltipClass;
            b.className = ("introjs-tooltip " + e).replace(/^\s+|\s+$/g, "");
            k = this._introItems[this._currentStep].position;
            if (("auto" == k || "auto" == this._options.tooltipPosition) && "floating" != k) {
                e = k;
                g = this._options.positionPrecedence.slice();
                k = H();
                var x = t(b).height + 10, q = t(b).width + 20, l = t(a), m = "floating";
                l.left + q > k.width || 0 > l.left + l.width / 2 - q ? (s(g, "bottom"), s(g, "top")) : (l.height + l.top + x > k.height && s(g, "bottom"), 0 > l.top - x && s(g, "top"));
                l.width + l.left + q > k.width && s(g, "right");
                0 > l.left - q && s(g, "left");
                0 < g.length && (m = g[0]);
                e && "auto" != e && -1 < g.indexOf(e) && (m = e);
                k = m
            }
            e = t(a);
            a = t(b);
            g = H();
            switch (k) {
                case "top":
                    c.className = "introjs-arrow bottom";
                    I(e, f ? 0 : 15, a, g, b);
                    b.style.bottom = e.height + 20 + "px";
                    break;
                case "right":
                    b.style.left = e.width + 20 + "px";
                    e.top + a.height > g.height ? (c.className = "introjs-arrow left-bottom", b.style.top = "-" + (a.height - e.height - 20) + "px") : c.className = "introjs-arrow left";
                    break;
                case "left":
                    f || !0 != this._options.showStepNumbers || (b.style.top = "15px");
                    e.top + a.height > g.height ? (b.style.top = "-" + (a.height - e.height - 20) + "px", c.className = "introjs-arrow right-bottom") : c.className = "introjs-arrow right";
                    b.style.right = e.width + 20 + "px";
                    break;
                case "floating":
                    c.style.display =
                        "none";
                    b.style.left = "50%";
                    b.style.top = "50%";
                    b.style.marginLeft = "-" + a.width / 2 + "px";
                    b.style.marginTop = "-" + a.height / 2 + "px";
                    "undefined" != typeof d && null != d && (d.style.left = "-" + (a.width / 2 + 18) + "px", d.style.top = "-" + (a.height / 2 + 18) + "px");
                    break;
                case "bottom-right-aligned":
                    c.className = "introjs-arrow top-right";
                    O(e, 0, a, b);
                    b.style.top = e.height + 20 + "px";
                    break;
                case "bottom-middle-aligned":
                    c.className = "introjs-arrow top-middle";
                    c = e.width / 2 - a.width / 2;
                    f && (c += 5);
                    O(e, c, a, b) && (b.style.right = null, I(e, c, a, g, b));
                    b.style.top =
                        e.height + 20 + "px";
                    break;
                default:
                    c.className = "introjs-arrow top", I(e, 0, a, g, b), b.style.top = e.height + 20 + "px"
            }
        }
    }

    function I(a, b, c, d, f) {
        if (a.left + b + c.width > d.width)return f.style.left = d.width - c.width - a.left + "px", !1;
        f.style.left = b + "px";
        return !0
    }

    function O(a, b, c, d) {
        if (0 > a.left + a.width - b - c.width)return d.style.left = -a.left + "px", !1;
        d.style.right = b + "px";
        return !0
    }

    function s(a, b) {
        -1 < a.indexOf(b) && a.splice(a.indexOf(b), 1)
    }

    function r(a) {
        if (a && this._introItems[this._currentStep]) {
            var b = this._introItems[this._currentStep],
                c = t(b.element), d = 10;
            J(b.element) ? a.className += " introjs-fixedTooltip" : a.className = a.className.replace(" introjs-fixedTooltip", "");
            "floating" == b.position && (d = 0);
            a.setAttribute("style", "width: " + (c.width + d) + "px; height:" + (c.height + d) + "px; top:" + (c.top - 5) + "px;left: " + (c.left - 5) + "px;")
        }
    }

    function T() {
        var a = document.querySelector(".introjs-disableInteraction");
        null === a && (a = document.createElement("div"), a.className = "introjs-disableInteraction", this._targetElement.appendChild(a));
        r.call(this, a)
    }

    function D(a) {
        a.setAttribute("role",
            "button");
        a.tabIndex = 0
    }

    function N(a) {
        "undefined" !== typeof this._introChangeCallback && this._introChangeCallback.call(this, a.element);
        var b = this, c = document.querySelector(".introjs-helperLayer"), d = document.querySelector(".introjs-tooltipReferenceLayer"), f = "introjs-helperLayer";
        t(a.element);
        "string" === typeof a.highlightClass && (f += " " + a.highlightClass);
        "string" === typeof this._options.highlightClass && (f += " " + this._options.highlightClass);
        if (null != c) {
            var e = d.querySelector(".introjs-helperNumberLayer"), g =
                d.querySelector(".introjs-tooltiptext"), k = d.querySelector(".introjs-arrow"), x = d.querySelector(".introjs-tooltip"), q = d.querySelector(".introjs-skipbutton"), l = d.querySelector(".introjs-prevbutton"), m = d.querySelector(".introjs-nextbutton");
            c.className = f;
            x.style.opacity = 0;
            x.style.display = "none";
            if (null != e) {
                var h = this._introItems[0 <= a.step - 2 ? a.step - 2 : 0];
                if (null != h && "forward" == this._direction && "floating" == h.position || "backward" == this._direction && "floating" == a.position)e.style.opacity = 0
            }
            r.call(b, c);
            r.call(b,
                d);
            if ((h = document.querySelectorAll(".introjs-fixParent")) && 0 < h.length)for (f = h.length - 1; 0 <= f; f--)h[f].className = h[f].className.replace(/introjs-fixParent/g, "").replace(/^\s+|\s+$/g, "");
            if (h = document.querySelector(".introjs-showElement"))h.className = h.className.replace(/introjs-[a-zA-Z]+/g, "").replace(/^\s+|\s+$/g, "");
            b._lastShowElementTimer && clearTimeout(b._lastShowElementTimer);
            b._lastShowElementTimer = setTimeout(function () {
                null != e && (e.innerHTML = a.step);
                g.innerHTML = a.intro;
                x.style.display = "block";
                G.call(b, a.element, x, k, e);
                d.querySelector(".introjs-bullets li > a.active").className = "";
                d.querySelector('.introjs-bullets li > a[data-stepnumber="' + a.step + '"]').className = "active";
                d.querySelector(".introjs-progress .introjs-progressbar").setAttribute("style", "width:" + P.call(b) + "%;");
                x.style.opacity = 1;
                e && (e.style.opacity = 1);
                -1 === m.tabIndex ? q.focus() : m.focus()
            }, 350)
        } else {
            var p = document.createElement("div"), l = document.createElement("div"), c = document.createElement("div"), n = document.createElement("div"),
                s = document.createElement("div"), w = document.createElement("div"), F = document.createElement("div"), u = document.createElement("div");
            p.className = f;
            l.className = "introjs-tooltipReferenceLayer";
            r.call(b, p);
            r.call(b, l);
            this._targetElement.appendChild(p);
            this._targetElement.appendChild(l);
            c.className = "introjs-arrow";
            s.className = "introjs-tooltiptext";
            s.innerHTML = a.intro;
            w.className = "introjs-bullets";
            !1 === this._options.showBullets && (w.style.display = "none");
            for (var p = document.createElement("ul"), f = 0, C = this._introItems.length; f <
            C; f++) {
                var y = document.createElement("li"), B = document.createElement("a");
                B.onclick = function () {
                    b.goToStep(this.getAttribute("data-stepnumber"))
                };
                f === a.step - 1 && (B.className = "active");
                D(B);
                B.innerHTML = "&nbsp;";
                B.setAttribute("data-stepnumber", this._introItems[f].step);
                y.appendChild(B);
                p.appendChild(y)
            }
            w.appendChild(p);
            F.className = "introjs-progress";
            !1 === this._options.showProgress && (F.style.display = "none");
            f = document.createElement("div");
            f.className = "introjs-progressbar";
            f.setAttribute("style", "width:" +
                P.call(this) + "%;");
            F.appendChild(f);
            u.className = "introjs-tooltipbuttons";
            !1 === this._options.showButtons && (u.style.display = "none");
            n.className = "introjs-tooltip";
            n.appendChild(s);
            n.appendChild(w);
            n.appendChild(F);
            !0 == this._options.showStepNumbers && (h = document.createElement("span"), h.className = "introjs-helperNumberLayer", h.innerHTML = a.step, l.appendChild(h));
            n.appendChild(c);
            l.appendChild(n);
            m = document.createElement("a");
            m.onclick = function () {
                b._introItems.length - 1 != b._currentStep && z.call(b)
            };
            D(m);
            m.innerHTML =
                this._options.nextLabel;
            l = document.createElement("a");
            l.onclick = function () {
                0 != b._currentStep && E.call(b)
            };
            D(l);
            l.innerHTML = this._options.prevLabel;
            q = document.createElement("a");
            q.className = "introjs-button introjs-skipbutton";
            D(q);
            q.innerHTML = this._options.skipLabel;
            q.onclick = function () {
                b._introItems.length - 1 == b._currentStep && "function" === typeof b._introCompleteCallback && b._introCompleteCallback.call(b);
                b._introItems.length - 1 != b._currentStep && "function" === typeof b._introExitCallback && b._introExitCallback.call(b);
                A.call(b, b._targetElement)
            };
            u.appendChild(q);
            1 < this._introItems.length && (u.appendChild(l), u.appendChild(m));
            n.appendChild(u);
            G.call(b, a.element, n, c, h)
        }
        !0 === this._options.disableInteraction && T.call(b);
        l.removeAttribute("tabIndex");
        m.removeAttribute("tabIndex");
        0 == this._currentStep && 1 < this._introItems.length ? (l.className = "introjs-button introjs-prevbutton introjs-disabled", l.tabIndex = "-1", m.className = "introjs-button introjs-nextbutton", q.innerHTML = this._options.skipLabel) : this._introItems.length - 1 ==
        this._currentStep || 1 == this._introItems.length ? (q.innerHTML = this._options.doneLabel, l.className = "introjs-button introjs-prevbutton", m.className = "introjs-button introjs-nextbutton introjs-disabled", m.tabIndex = "-1") : (l.className = "introjs-button introjs-prevbutton", m.className = "introjs-button introjs-nextbutton", q.innerHTML = this._options.skipLabel);
        m.focus();
        a.element.className += " introjs-showElement";
        h = v(a.element, "position");
        "absolute" !== h && ("relative" !== h && "fixed" !== h) && (a.element.className += " introjs-relativePosition");
        for (h = a.element.parentNode; null != h && "body" !== h.tagName.toLowerCase();) {
            c = v(h, "z-index");
            n = parseFloat(v(h, "opacity"));
            u = v(h, "transform") || v(h, "-webkit-transform") || v(h, "-moz-transform") || v(h, "-ms-transform") || v(h, "-o-transform");
            if (/[0-9]+/.test(c) || 1 > n || "none" !== u && void 0 !== u)h.className += " introjs-fixParent";
            h = h.parentNode
        }
        U(a.element) || !0 !== this._options.scrollToElement || (n = a.element.getBoundingClientRect(), h = H().height, c = n.bottom - (n.bottom - n.top), n = n.bottom - h, 0 > c || a.element.clientHeight > h ? window.scrollBy(0,
            c - this._options.scrollPadding) : window.scrollBy(0, n + 70 + this._options.scrollPadding));
        "undefined" !== typeof this._introAfterChangeCallback && this._introAfterChangeCallback.call(this, a.element)
    }

    function v(a, b) {
        var c = "";
        a.currentStyle ? c = a.currentStyle[b] : document.defaultView && document.defaultView.getComputedStyle && (c = document.defaultView.getComputedStyle(a, null).getPropertyValue(b));
        return c && c.toLowerCase ? c.toLowerCase() : c
    }

    function J(a) {
        var b = a.parentNode;
        return "HTML" === b.nodeName ? !1 : "fixed" == v(a, "position") ?
            !0 : J(b)
    }

    function H() {
        if (void 0 != window.innerWidth)return {width: window.innerWidth, height: window.innerHeight};
        var a = document.documentElement;
        return {width: a.clientWidth, height: a.clientHeight}
    }

    function U(a) {
        a = a.getBoundingClientRect();
        return 0 <= a.top && 0 <= a.left && a.bottom + 80 <= window.innerHeight && a.right <= window.innerWidth
    }

    function S(a) {
        var b = document.createElement("div"), c = "", d = this;
        b.className = "introjs-overlay";
        if ("body" === a.tagName.toLowerCase())c += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;",
            b.setAttribute("style", c); else {
            var f = t(a);
            f && (c += "width: " + f.width + "px; height:" + f.height + "px; top:" + f.top + "px;left: " + f.left + "px;", b.setAttribute("style", c))
        }
        a.appendChild(b);
        b.onclick = function () {
            !0 == d._options.exitOnOverlayClick && (void 0 != d._introExitCallback && d._introExitCallback.call(d), A.call(d, a))
        };
        setTimeout(function () {
            c += "opacity: " + d._options.overlayOpacity.toString() + ";";
            b.setAttribute("style", c)
        }, 10);
        return !0
    }

    function w() {
        var a = this._targetElement.querySelector(".introjs-hintReference");
        if (a) {
            var b = a.getAttribute("data-step");
            a.parentNode.removeChild(a);
            return b
        }
    }

    function K() {
        for (var a = 0, b = this._introItems.length; a < b; a++) {
            var c = this._introItems[a];
            "undefined" != typeof c.targetElement && Q.call(this, c.hintPosition, c.element, c.targetElement)
        }
    }

    function L(a) {
        w.call(this);
        var b = this._targetElement.querySelector('.introjs-hint[data-step="' + a + '"]');
        b && (b.className += " introjs-hidehint");
        "undefined" !== typeof this._hintCloseCallback && this._hintCloseCallback.call(this, a)
    }

    function V() {
        var a = this,
            b = document.querySelector(".introjs-hints");
        null == b && (b = document.createElement("div"), b.className = "introjs-hints");
        for (var c = 0, d = this._introItems.length; c < d; c++) {
            var f = this._introItems[c];
            if (!document.querySelector('.introjs-hint[data-step="' + c + '"]')) {
                var e = document.createElement("a");
                D(e);
                (function (b, c, d) {
                    b.onclick = function (e) {
                        e = e ? e : window.event;
                        e.stopPropagation && e.stopPropagation();
                        null != e.cancelBubble && (e.cancelBubble = !0);
                        W.call(a, b, c, d)
                    }
                })(e, f, c);
                e.className = "introjs-hint";
                f.hintAnimation || (e.className +=
                    " introjs-hint-no-anim");
                J(f.element) && (e.className += " introjs-fixedhint");
                var g = document.createElement("div");
                g.className = "introjs-hint-dot";
                var k = document.createElement("div");
                k.className = "introjs-hint-pulse";
                e.appendChild(g);
                e.appendChild(k);
                e.setAttribute("data-step", c);
                f.targetElement = f.element;
                f.element = e;
                Q.call(this, f.hintPosition, e, f.targetElement);
                b.appendChild(e)
            }
        }
        document.body.appendChild(b);
        "undefined" !== typeof this._hintsAddedCallback && this._hintsAddedCallback.call(this)
    }

    function Q(a,
               b, c) {
        c = t.call(this, c);
        switch (a) {
            default:
            case "top-left":
                b.style.left = c.left + "px";
                b.style.top = c.top + "px";
                break;
            case "top-right":
                b.style.left = c.left + c.width + "px";
                b.style.top = c.top + "px";
                break;
            case "bottom-left":
                b.style.left = c.left + "px";
                b.style.top = c.top + c.height + "px";
                break;
            case "bottom-right":
                b.style.left = c.left + c.width + "px";
                b.style.top = c.top + c.height + "px";
                break;
            case "bottom-middle":
                b.style.left = c.left + c.width / 2 + "px";
                b.style.top = c.top + c.height + "px";
                break;
            case "top-middle":
                b.style.left = c.left + c.width /
                    2 + "px", b.style.top = c.top + "px"
        }
    }

    function W(a, b, c) {
        "undefined" !== typeof this._hintClickCallback && this._hintClickCallback.call(this, a, b, c);
        var d = w.call(this);
        if (parseInt(d, 10) != c) {
            var d = document.createElement("div"), f = document.createElement("div"), e = document.createElement("div"), g = document.createElement("div");
            d.className = "introjs-tooltip";
            d.onclick = function (a) {
                a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
            };
            f.className = "introjs-tooltiptext";
            var k = document.createElement("p");
            k.innerHTML = b.hint;
            b = document.createElement("a");
            b.className = "introjs-button";
            b.innerHTML = this._options.hintButtonLabel;
            b.onclick = L.bind(this, c);
            f.appendChild(k);
            f.appendChild(b);
            e.className = "introjs-arrow";
            d.appendChild(e);
            d.appendChild(f);
            this._currentStep = a.getAttribute("data-step");
            g.className = "introjs-tooltipReferenceLayer introjs-hintReference";
            g.setAttribute("data-step", a.getAttribute("data-step"));
            r.call(this, g);
            g.appendChild(d);
            document.body.appendChild(g);
            G.call(this, a, d, e, null, !0)
        }
    }

    function t(a) {
        var b = {};
        b.width = a.offsetWidth;
        b.height = a.offsetHeight;
        for (var c = 0, d = 0; a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop);)c += a.offsetLeft, d += a.offsetTop, a = a.offsetParent;
        b.top = d;
        b.left = c;
        return b
    }

    function P() {
        return 100 * (parseInt(this._currentStep + 1, 10) / this._introItems.length)
    }

    var M = function (a) {
        if ("object" === typeof a)return new p(a);
        if ("string" === typeof a) {
            if (a = document.querySelector(a))return new p(a);
            throw Error("There is no element with given selector.");
        }
        return new p(document.body)
    };
    M.version = "2.2.0";
    M.fn =
        p.prototype = {
            clone: function () {
                return new p(this)
            }, setOption: function (a, b) {
                this._options[a] = b;
                return this
            }, setOptions: function (a) {
                var b = this._options, c = {}, d;
                for (d in b)c[d] = b[d];
                for (d in a)c[d] = a[d];
                this._options = c;
                return this
            }, start: function () {
                R.call(this, this._targetElement);
                return this
            }, goToStep: function (a) {
                this._currentStep = a - 2;
                "undefined" !== typeof this._introItems && z.call(this);
                return this
            }, nextStep: function () {
                z.call(this);
                return this
            }, previousStep: function () {
                E.call(this);
                return this
            }, exit: function () {
                A.call(this,
                    this._targetElement);
                return this
            }, refresh: function () {
                r.call(this, document.querySelector(".introjs-helperLayer"));
                r.call(this, document.querySelector(".introjs-tooltipReferenceLayer"));
                K.call(this);
                return this
            }, onbeforechange: function (a) {
                if ("function" === typeof a)this._introBeforeChangeCallback = a; else throw Error("Provided callback for onbeforechange was not a function");
                return this
            }, onchange: function (a) {
                if ("function" === typeof a)this._introChangeCallback = a; else throw Error("Provided callback for onchange was not a function.");
                return this
            }, onafterchange: function (a) {
                if ("function" === typeof a)this._introAfterChangeCallback = a; else throw Error("Provided callback for onafterchange was not a function");
                return this
            }, oncomplete: function (a) {
                if ("function" === typeof a)this._introCompleteCallback = a; else throw Error("Provided callback for oncomplete was not a function.");
                return this
            }, onhintsadded: function (a) {
                if ("function" === typeof a)this._hintsAddedCallback = a; else throw Error("Provided callback for onhintsadded was not a function.");
                return this
            }, onhintclick: function (a) {
                if ("function" === typeof a)this._hintClickCallback = a; else throw Error("Provided callback for onhintclick was not a function.");
                return this
            }, onhintclose: function (a) {
                if ("function" === typeof a)this._hintCloseCallback = a; else throw Error("Provided callback for onhintclose was not a function.");
                return this
            }, onexit: function (a) {
                if ("function" === typeof a)this._introExitCallback = a; else throw Error("Provided callback for onexit was not a function.");
                return this
            }, addHints: function () {
                a:{
                    var a =
                        this._targetElement;
                    this._introItems = [];
                    if (this._options.hints)for (var a = 0, b = this._options.hints.length; a < b; a++) {
                        var c = y(this._options.hints[a]);
                        "string" === typeof c.element && (c.element = document.querySelector(c.element));
                        c.hintPosition = c.hintPosition || this._options.hintPosition;
                        c.hintAnimation = c.hintAnimation || this._options.hintAnimation;
                        null != c.element && this._introItems.push(c)
                    } else {
                        c = a.querySelectorAll("*[data-hint]");
                        if (1 > c.length)break a;
                        a = 0;
                        for (b = c.length; a < b; a++) {
                            var d = c[a], f = d.getAttribute("data-hintAnimation"),
                                f = f ? "true" == f : this._options.hintAnimation;
                            this._introItems.push({
                                element: d,
                                hint: d.getAttribute("data-hint"),
                                hintPosition: d.getAttribute("data-hintPosition") || this._options.hintPosition,
                                hintAnimation: f,
                                tooltipClass: d.getAttribute("data-tooltipClass"),
                                position: d.getAttribute("data-position") || this._options.tooltipPosition
                            })
                        }
                    }
                    V.call(this);
                    document.addEventListener ? (document.addEventListener("click", w.bind(this), !1), window.addEventListener("resize", K.bind(this), !0)) : document.attachEvent && (document.attachEvent("onclick",
                        w.bind(this)), document.attachEvent("onresize", K.bind(this)))
                }
                return this
            }, hideHint: function (a) {
                L.call(this, a);
                return this
            }, hideHints: function () {
                var a = this._targetElement.querySelectorAll(".introjs-hint");
                if (a && 0 < a.length)for (var b = 0; b < a.length; b++)L.call(this, a[b].getAttribute("data-step"));
                return this
            }
        };
    return C.introJs = M
});