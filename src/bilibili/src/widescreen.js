视频页宽屏, ["www.bilibili.com/video"], {
    '已开启$on': () => {
        function setSize() {
            if (window.__INITIAL_STATE__) {
                var i = window.__INITIAL_STATE__.pageVersion,
                    e = window.__INITIAL_STATE__.isPrVideo;
                "new_video" === i ? part1SetSize() : e && window.__INITIAL_STATE__.premiereInfo ? part1SetSize() : originSetSize()
            } else originSetSize(),
                part1SetSize()
        }
        function constructStyleString(i, e) {
            for (var t = i + " {",
                n = Object.keys(e), o = 0; o < n.length; o++) t += n[o] + ": " + e[n[o]] + ";";
            return t + "}\n"
        }
        function part1SetSize() {
            // 是否宽屏
            var isWide = window.isWide;

            // 浏览器窗口高度
            var innerHeight = window.innerHeight;

            // 浏览器窗口宽度
            var innerWidth = Math.max(document.body && document.body.clientWidth || window.innerWidth, 1100);

            // 右侧栏宽度
            var rightWidth = innerWidth > 1680 ? 411 : 350;

            // 计算主区域宽度
            var maxWidth = parseInt(16 * (innerHeight - (innerWidth > 1690 ? 318 : 308)) / 9);
            var mainWidth = innerWidth - 112 - rightWidth;
            var width = mainWidth < maxWidth ? mainWidth : maxWidth;

            width = Math.round(width * $get('bilibili_widescreen-width-times', 1.22))

            // 设置最小和最大宽度
            if (width < 668) {
                width = 668;
            }
            if (width > 1694) {
                width = 1694;
            }

            // 总宽度
            var totalWidth = width + rightWidth;

            // 计算高度
            var height;
            if (isWide) {
                totalWidth -= 125;
                width -= 100;
            }
            if (window.hasBlackSide && !isWide) {
                height = Math.round((width - 14 + (isWide ? rightWidth : 0)) * (9 / 16) + (innerWidth > 1680 ? 56 : 46)) + 96;
            } else {
                height = Math.round((width + (isWide ? rightWidth : 0)) * (9 / 16)) + (innerWidth > 1680 ? 56 : 46);
            }

            // 主区域宽度
            var mainBoxWidth = totalWidth - rightWidth;

            // 生成设置样式的CSS
            var css = constructStyleString('.video-container-v1', {
                width: 'auto',
                padding: '0 10px'
            }) + constructStyleString('.left-container', {
                width: mainBoxWidth + 'px'
            }) + constructStyleString('#bilibili-player', {
                width: totalWidth - (isWide ? -30 : rightWidth) + 'px',
                height: height + 'px',
                position: isWide ? 'relative' : 'static'
            }) + constructStyleString('#oldfanfollowEntry', {
                position: 'relative',
                top: isWide ? height + 28 - 18 + 'px' : '0'
            }) + constructStyleString('#danmukuBox', {
                'margin-top': isWide ? height + 28 + 'px' : '0'
            }) + constructStyleString('#playerWrap', {
                height: height + 'px'
            }) + constructStyleString('.video-discover', {
                'margin-left': (totalWidth - rightWidth) / 2 + 'px'
            });
            setSizeStyle.innerHTML = css
        }
        function originSetSize() {
            var i = window.isWide,
                e = 350,
                t = window.innerHeight;
            w = window.innerWidth,
                w1 = parseInt(16 * (.743 * t - 108.7) / 9),
                w2 = w - 152 - e,
                min = w1 > w2 ? w2 : w1,
                min < 638 && (min = 638),
                1630 < min && (min = 1630);
            var n, o = min + e;
            n = window.hasBlackSide && !window.isWide ? Math.round((min - 14 + (i ? e : 0)) * (9 / 16) + 46) + 96 : Math.round((min + (i ? e : 0)) * (9 / 16)) + 46;
            var r = constructStyleString(".v-wrap", {
                width: o + "px",
                padding: "0 68px"
            }) + constructStyleString(".l-con", {
                width: o - e + "px"
            }) + constructStyleString("#bilibili-player", {
                width: o - (i ? 0 : e) + "px",
                height: n + "px",
                position: i ? "relative" : "static"
            }) + constructStyleString("#oldfanfollowEntry", {
                position: "relative",
                top: i ? n + 28 - 18 + "px" : "0"
            }) + constructStyleString("#danmukuBox", {
                "margin-top": i ? n + 28 + "px" : "0"
            }) + constructStyleString("#playerWrap", {
                height: i ? n - 0 + "px" : "auto"
            });
            setSizeStyle.innerHTML = r
        }


        const set = () => {
            if (!unsafeWindow.setSizeStyle) { setTimeout(() => set(), 120); return }

            unsafeWindow.setSize = setSize;

            setSize();
            unsafeWindow.addEventListener("resize",
                function () {
                    setSize()
                });
            unsafeWindow.PlayerAgent = {
                changed: true,
                player_widewin: function () {
                    "new_video" === window.__INITIAL_STATE__.pageVersion && window.scrollTo(0, 60),
                        window.isWide = !0,
                        setSize()
                },
                player_fullwin: function (i) {
                    window.scrollTo(0, 0),
                        window.isWide = !1,
                        setSize()
                },
                toggleBlackSide: function (i) {
                    window.hasBlackSide = i,
                        setSize()
                }
            }
        }
        set();

    },
    '已关闭$off': null,
}
