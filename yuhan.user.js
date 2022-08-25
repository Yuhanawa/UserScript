// ==UserScript==
// @name         Yuhan User Script 搜索引擎/百度必应谷歌F搜/哔哩哔哩/CSDN/Github/开发/更多 优化/美化/净化/增强
// @name:zh      Yuhan 自用 搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 CSDN极简化 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @name:zh-CN   Yuhan 自用 搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 CSDN极简化 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @name:en      Yuhan User Script
// @name:en-US   Yuhan User Script
// @namespace    http://github.com/yuhanawa/UserScript
// @version      0.4.0
// @description  搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 移除评论区关键字搜索蓝字 CSDN极简化 CSDN沉浸式阅读 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @description:zh  搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 移除评论区关键字搜索蓝字 CSDN极简化 CSDN沉浸式阅读 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @description:en Search engine (Baidu Bing, Google f search) optimization and beautification of search engines, quick switching, Bilibili (bilibili B station), details, optimization, video, quick sharing, copying, removing comment area, keyword search, blue word CSDN, extremely simplified CSDN, immersive reading, CSDN free login Copy and remove some websites, copy the small tail, and continue to update
// @node         8-25 0.4.0 自定义面板完成 支持自定义背景 自定义字体 自定义搜索引擎
// @node         8-25 0.3.8 修复搜狗搜索下的2个bug 个性化开发中
// @node         8-24 0.3.7(2) 个性化界面增加关闭按钮
// @node         8-24 0.3.7 细节修改 添加个性化界面为下个版本做准备
// @node         8-24 0.3.6 缩减近300行代码 添加类谷歌(镜像)的支持
// @node         8-24 0.3.5 紧急修复两个样式问题(百度和360)
// @node         8-24 0.3.4 轻度美化搜狗360的样式
// @node         完整更新日志请见 https://github.com/yuhanawa/UserScript/blob/master/CHANGELOG.md
// @note         快开学了 开学后可能更新缓慢 但会持续更新的 反馈可能一时半会看不到 请稍安勿躁
// @note         虽是自用但如果你无意发现了这个脚本 欢迎提出建议
// @author       Yuhanawa
// @supportURL   https://greasyfork.org/zh-CN/scripts/449705/feedback
// @license      GPL-3.0
// @match        *.bing.com/*
// @match        *.baidu.com/*
// @match        *.fsoufsou.com/*
// @match        *.google.com/*
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/read/*
// @match        *://blog.csdn.net/*
// @match        *.zhihu.com/*
// @match        *.so.com/*
// @match        *.sogou.com/*
// @match        *.duckduckgo.com/*
// @match        *.xn--flw351e.ml/*
// @match        *search.njau.cf/*
// @match        *search.aust.cf/*
// @match        *.yahoo.com/*
// @match        *.yandex.com/*
// @match        *searx.tiekoetter.com/*
// @match        *.petalsearch.com/*
// @icon         none
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==


(function () {
    'use strict';

    let css = "";
    let isRunning = false;
    let isLoaded = false;
    let defaultSearchList = `
        谷歌搜索,https://www.google.com/search?q=$
        百度搜索,https://www.baidu.com/s?wd=$
        Bing搜索,https://cn.bing.com/search?q=$
        鸭鸭搜索,https://duckduckgo.com/?q=$
        搜狗搜索,https://www.sogou.com/web?query=$
        360搜索,https://www.so.com/s?q=$
        谷歌镜像ml,https://xn--flw351e.ml/search?q=$
        # 谷歌镜像njau,https://search.njau.cf/search?q=$
        # 谷歌镜像aust,https://search.aust.cf/search?q=$
        # 雅虎,https://search.yahoo.com/search?p=$
        # Yandex,https://yandex.com/search/?text=$
        维基百科,https://zh.wikipedia.org/wiki/$
        # 以下内容不支持
        -百度翻译,https://fanyi.baidu.com/#en/zh/$
        -谷歌翻译,https://translate.google.com/?hl=zh-CN&tab=wT0#view=home&op=translate&sl=auto&tl=zh-CN&text=$
        -搜狗翻译,https://fanyi.sogou.com/?keyword=$
        -百度图片,https://image.baidu.com/search/index?tn=baiduimage&word=$
        -Google图片,https://www.google.com/search?q=$&tbm=isch
        -Bing图片,https://cn.bing.com/images/search?q=$&scenario=ImageBasicHover
        -有道词典,https://dict.youdao.com/w/$
        -必应词典,https://cn.bing.com/dict/search?q=$
        -Vocabulary,https://www.vocabulary.com/dictionary/$
        -格林斯高阶,https://www.collinsdictionary.com/dictionary/english/$
        -剑桥词典,https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%AE%80%E4%BD%93/$
        -韦氏词典,https://www.learnersdictionary.com/definition/$
    `;
    const updateMap = new Map()

    // ---------------------------------------------------------------------------- //

    const cget = (key, d) => GM_getValue(key, d)
    const cset = (key, v) => GM_setValue(key, v)
    const menu = (name, key, defaultValue) => {
        const value = cget(key, defaultValue)
        name += value ? ':开启' : ':关闭';
        GM_registerMenuCommand(name, () => {
            cset(key, !value);
            location.reload()
        });
        return value;
    }
    const options = (name, key, ValueList) => {
        const index = cget(key, 0)
        name += `:${ValueList[index]}[${index + 1}/${ValueList.length}]<点击切换模式`;
        GM_registerMenuCommand(name, () => {
            if (index + 1 >= ValueList.length) cset(key, 0); else cset(key, index + 1);
            location.reload()
        });
        return index;
    }
    const match = (s) => {
        if (location.href.indexOf(s) !== -1) {
            if (!isRunning) {
                isRunning = true;
                console.info("Yuhan 自用 优化美化净化脚本 运行中... 求star https://github.com/yuhanawa/UserScript")
            }
            return true;
        }
        return false;
    }
    const matchList = (l) => {
        for (let i = 0; i < l.length; i++) {
            if (match(l[i])) return true;
        }
        return false;
    }
    const addcss = (css) => {
        css = css.replaceAll(/\s{2,}/g, " ")
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
            addStyle(css);
        } else {
            const node = document.createElement("style");
            node.appendChild(document.createTextNode(css));
            document.body.appendChild(node);
        }
    }
    const onload = (f) => {
        if (isLoaded) f();
        else document.addEventListener("DOMContentLoaded", () => f())
    };
    const load_then_delay = (f, t) => onload(() => setTimeout(() => f(), t));
    const updateawa = (key) => {
        if (!updateMap.has(key)) return;
        const value = cget(key, "").trim();
        // if (value !== "")
        updateMap.get(key)(key, value)
    }
    const setupdateawa = (key, value, then) => {
        updateMap.set(key, value);
        if (then !== undefined) then();
        updateawa(key);
    }
    // search-block-website

    onload(() => isLoaded = true);

    // ---------------------------------------------------------------------------- //

    /* bilibili */
    if (match("://www.bilibili.com/video/")) {
        if (menu("移除评论关键字搜索图标", 'bilibili_remove_search_icon', true)) {
            setInterval(() => {
                // remove with class " icon search-word "
                let icons = document.getElementsByClassName("icon search-word")
                for (let i = 0; i < icons.length; i++) {
                    icons[i].remove()
                }
                if (icons.length > 0) console.log(`remove ${icons.length} search icon`)
            }, 10000);
        }
        if (menu("移除评论关键字搜索跳转", 'bilibili_remove_search', true)) {
            setInterval(() => {
                let as = document.getElementsByClassName("jump-link search-word")
                for (let i = 0; i < as.length; i++) {
                    as[i].parentElement.outerHTML = as[i].parentElement.outerHTML.replace(as[i].outerHTML, as[i].outerText)
                }
                if (as.length > 0) console.log(`remove ${as.length} search icon`)
            }, 8000);
        }
        if (menu("修改UP觉得很赞标签位置", 'bilibili_compact_reply_tag', true)) {
            setInterval(() => {
                let es = document.getElementsByClassName("reply-tag-list")
                for (let i = 0; i < es.length; i++) {
                    if (es[i].style.marginTop !== "0px") {
                        es[i].style.marginTop = "0px";
                        es[i].style.marginLeft = "18px";
                        let html = `</span>${es[i].outerHTML}<div class="reply-operation-warp`;
                        let s = es[i].previousElementSibling;
                        es[i].remove();
                        s.outerHTML = s.outerHTML.replace(`</span><div class="reply-operation-warp`, html);
                    }
                }
            }, 8000);
        }
        if (menu("移除右侧新版反馈等按钮", 'bilibili_remove_nav_menu', true)) {
            load_then_delay(() => {
                document.getElementsByClassName("fixed-nav")[0].remove()
                setTimeout(() => {
                    if (document.getElementsByClassName("fixed-nav").length > 0) document.getElementsByClassName("fixed-nav")[0].remove()
                }, 1200)
            }, 1200)
        }

        // 灵感来自 https://greasyfork.org/zh-CN/scripts/449865
        const index = options("视频快捷分享复制模式", 'bilibili_copy', ["【标题】链接", "BV", "链接", "标题"])

        load_then_delay(() => {
            let text;
            if (index === 0) { // All
                text = `【${document.querySelector('h1.video-title').innerText}】\n${location.origin}${location.pathname}`
            } else if (index === 1) { // BV
                text = location.pathname.split("/")[2]
            } else if (index === 2) { // Link
                text = `${location.origin}${location.pathname}`
            } else if (index === 2) { // Title
                text = `${document.querySelector('h1.video-title').innerText}`
            }

            const $btn = document.createElement('span')
            $btn.title = `复制当前视频的${["【标题】链接", "BV", "链接", "标题"][index]}`
            $btn.style.cursor = 'pointer'
            $btn.innerText = '🏷️'
            $btn.addEventListener('click', () => navigator.clipboard.writeText(text))

            document.querySelector('h1.video-title').append($btn);
        }, 800);
    }

        // ---------------------------------------------------------------------------- //

    /* search */
    else if (matchList([
        "bing.com/search", "baidu.com/s", "fsoufsou.com/search", "google.com/search",
        "so.com/s", "sogou.com/web?query",
        "search.yahoo.com/search", "yandex.com/search",
        "searx.tiekoetter.com", "petalsearch.com",
        "xn--flw351e.ml/search", "search.aust.cf/search", "search.njau.cf/search" /*谷歌镜像*/
    ]) || match("/search?")) {
        menu("搜索引擎优化美化净化", 'search', true);
        menu("搜索引擎快速切换工具", 'search_engine_switch_tool', true);

        onload(() => {
            setupdateawa("search-font-family", (key, value) => addcss(`*{font-family:'${value}';}`));
            setupdateawa("search-background-img", (key, value) => document.body.style.backgroundImage = `url(${value})`);
            /* 移除多余的input */
            if (match("sogou.com/web?query")) document.getElementById("bottom_form_querytext").className += " search-input-awa "; else {
                document.querySelectorAll("input").forEach(i => {
                    if (i.type === 'text' || i.type === 'search') i.className += " search-input-awa ";
                });
            }
        })

        /* search */
        if (cget("search", true)) {
            css += `
        *{font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif}
        body, .body-awa {
            background-color: #f5f5f5 !important;
              animation-name: ani_topTobuttom;
              animation-duration: 1s;
              animation-timing-function: ease;
              {body-awa}
        }
        .head, #head, header, .header, #header, .header-awa
        {
            background-color: transparent !important;
            padding-top: 18px !important;
            position: static !important;
            {header-awa}
        }
        input, .inputbox-awa
        {
            background-color: rgba(255, 255, 255,0.3);
            {inputbox-awa}
        }
        .results > div, .results > li, .result, .item-awa{
            word-wrap: break-word;
            word-break: break-word;
            color: #333;
            line-height: 1.65;
            background-color: rgba(255, 255, 255,1);
            backdrop-filter: blur(8px);
            box-sizing: border-box;
            border-radius: 6px;
            padding: 12px 20px;
            transition: all 450ms cubic-bezier(.23,1,.32,1) 0s;
            box-shadow: 0 2px 6px 0 rgb(0 0 0 / 14%);
            border-collapse: collapse;
            margin-bottom: 18px;
            margin-top: 0px;
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
            {item-awa}
        }
        .item-awa div{
            background: transparent;
            padding: revert !important;
            box-shadow: unset;
            margin-bottom: revert;
            border:unset
        }
        span, p, .item-awa p, .item-awa span, .item-text-awa{
            line-height: 20px;
            color: #444;
            font-size: 13px;
        } 
        h2,h3,.item-awa h2, .item-awa a, .item-title-awa{
            /*color: #555;*/
            color: #3476dd;
            font: 18px 'Microsoft YaHei UI','Microsoft YaHei',Arial,Helvetica,Sans-Serif;
            line-height: 24px;
            font-weight: 400;
        }         
        .auto{
            margin:auto !important;
            padding:auto !important;
        }
        `.replaceAll(/\s*,/g, ",").replaceAll(/\s*{/g, "{");
            /* engine_switch_tool */
            css += `
        #engine_switch_tool{
            all: initial;
            
            z-index: 1024 !important;
            position: fixed !important;
            top: 96px ;
            left: 5px !important;
            display: flex;
            flex-direction: column;
        }
        #engine_switch_tool a:visited {
            color: #333 !important;
        }
        #engine_switch_tool > div{
            opacity:.05;
            cursor: pointer;
        }
        #engine_switch_tool > div:hover{
            opacity:1;
        }
        .switch_tool_compact {
            all: initial;
            
            margin: 10px,2px;
            text-align: center;
            cursor: pointer;
            font-size: 20px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-weight: lighter;
            color: #333;
            background-color: rgba(2555,255,255,124);
            touch-action: manipulation;
            box-shadow: 0px 0px 1px #ccc;
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            font-family: 'Open Sans', sans-serif;
            font-weight: normal;
        }
        .switch_tool_link {
            all: initial;
            
            margin: 10px,3px;
            text-align: center;
            cursor: pointer;
            font-size: 20px;
            font-weight: lighter;
            color: #333;
            touch-action: manipulation;
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            font-family: 'Open Sans', sans-serif;
            font-weight: normal;
        }
        .switch_tool_button {
            all: initial;
            
            margin: 10px;
            text-align: center;
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 5px;
            font-size: 20px;
            font-weight: lighter;
            color: #333;
            background-color: #fff;
            width: 120px;
            height: 28px;
            touch-action: manipulation;
            box-shadow: 0px 0px 1px #ccc;
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            font-family: 'Open Sans', sans-serif;
            font-weight: normal;
        }
        
        .switch_tool_show {
            opacity:1 !important;
        }
        .switch_tool_invisible {
            opacity:0.2 !important;
        }        
        .switch_tool_auto {
            opacity:0.2 !important;
        }       
        .switch_tool_auto:hover {
            opacity:1 !important;
        }           
        
        `.replaceAll(/\s*,/g, ",").replaceAll(/\s*{/g, "{");
            const addClass = (y, add) => css = css.replaceAll(`${y},`, `${add},${y},`).replaceAll(`${y}{`, `${add},${y}{`);

            if (match("bing.com/search")) {
                css += `
                .sh_favicon{
                    margin-left: 16px;
                }
                #b_content{
                    padding-top: 25px;
                }
        
                .b_hPanel, /* bing词典手机app广告 */
                #b-scopeListItem-video,
                #b-scopeListItem-academic,
                #b-scopeListItem-dictionary{
                    display: none;
                }
                
                #id_sc,#id_h #id_l {   /* 设置按钮 */
                    margin-top: -46px;
                }
                body #b_header #est_switch {    /* 国际版切换按钮 */
                    position: relative;
                    right: 128px;
                    top: 5px;
                }
                #est_switch { 
                    display:none;  /*防止页面闪烁 先隐藏等会显示*/
                }
                
                #mfa_root{      /* 重置右下搜索按钮样式 */
                    background: transparent!important;
                    box-shadow: unset!important;
                    margin-bottom: revert!important;
                    border:unset!important;
                }
                
                /* 国际版切换按钮 */
                #est_cn, 
                #est_en{
                    height: 12px;
                    border: 1px solid #ddd;
                    padding: 10px;
                    margin: 8px;
                }
                #est_cn::after,
                #est_en::after{
                    border-radius: 5px;
                }
                `;
                addClass(".item-awa", "#b_results > li")

                onload(() => {
                    /* 移动 切换按钮 位置 */
                    const est_switch_html = `>${document.getElementById("est_switch").outerHTML}<a id="id_l"`;
                    document.getElementById("est_switch").remove();
                    document.getElementById("id_h").outerHTML = document.getElementById("id_h").outerHTML
                        .replace(`><a id="id_l"`, est_switch_html)
                    document.getElementById("est_switch").style.display = "block";
                    /* 移除空白的div */
                    const bc = document.getElementById("b_context");
                    if (bc.outerText.length < 20) {
                        bc.remove();
                    }
                    const ba = document.getElementsByClassName("b_ans");
                    for (let i = 0; i < ba.length; i++) {
                        const b = ba[i];
                        if (b.outerText === "" || b.outerText == null || b.outerText.length < 20) {
                            b.remove();
                        }
                    }
                })

                if (cget("remove_favicon_icon", true)) {
                    css += `.sh_favicon{ display:none !important; }`
                }
            }
            // --------------------------------------- //
            else if (match("baidu.com/s")) {
                addClass(".item-awa", ".result-op, .result-op")

                css += `
                #s_tab{
                    padding-top: 0px !important;
                }
                #result_logo img{display:none}
                #result_logo{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAxIDMzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDEgMzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNDg3OUJEO30KCS5zdDF7ZmlsbDojREQ0NDM2O30KCS5zdDJ7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwLjQsMTUuM2MtMy44LDAuMy00LDIuNi01LjcsNC43Yy0xLjgsMi4yLTUuNSw0LjEtNiw2LjdjLTAuNiwzLjMsMS4zLDUuMSwzLDUuN2MxLjksMC42LDYuMi0wLjUsOC40LTAuNWgwLjIKCWgwLjJjMi4yLDAsNi40LDEuMSw4LjQsMC41YzEuOC0wLjYsMy41LTMuMiwzLTUuN2MtMC40LTIuMS00LjQtNC41LTYuMi02LjdDNTQuMiwxOCw1NC4zLDE1LjYsNTAuNCwxNS4zeiBNMzcsMTQuOAoJYzAsMi40LDEuNiw0LjMsMy40LDQuM2MxLjksMCwzLjQtMS45LDMuNC00LjNjMC0yLjQtMS42LTQuMy0zLjQtNC4zUzM3LDEyLjUsMzcsMTQuOHogTTQzLjksOC42YzAsMi41LDEuNSw0LjUsMy4zLDQuNQoJYzEuOCwwLDMuMy0yLjEsMy4zLTQuNVM0OSw0LjEsNDcuMSw0LjFDNDUuMyw0LDQzLjksNiw0My45LDguNnogTTUyLjIsOC41YzAsMi4zLDEuNCw0LjMsMy4yLDQuM3MzLjItMS45LDMuMi00LjNzLTEuNC00LjMtMy4yLTQuMwoJUzUyLjIsNi4yLDUyLjIsOC41eiBNNTcuNSwxNS45YzAsMi4zLDEuNSw0LjMsMy4zLDQuM2MxLjgsMCwzLjMtMS45LDMuMy00LjNzLTEuNS00LjMtMy4zLTQuM0M1OC45LDExLjYsNTcuNSwxMy42LDU3LjUsMTUuOXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTQsMzAuNHYtNS4xaDYuNGMxLjYsMCwxLjYsMC4zLDEuNiwydjEuNGMwLDEuNi0yLjMsMS44LTMuOSwxLjhMNCwzMC40TDQsMzAuNHogTTQsMjN2LTQuOGg0LjEKCWMxLjYsMCwzLjksMCwzLjksMi4xdjAuMWMwLDEuNC0wLjUsMi42LTEuOCwyLjZDMTAuMywyMyw0LDIzLDQsMjN6IE0xLjcsMTZ2MTYuM2g2LjRjMywwLDYuMiwwLDYuMi0zLjZ2LTEuMWMwLTEuNi0wLjEtMi43LTEuMS0zLjUKCWMxLTAuOCwxLjEtMi4zLDEuMS0zLjZsMCwwYzAtNC41LTMuMi00LjUtNi4yLTQuNUwxLjcsMTZMMS43LDE2eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUsMjguOWMtMS4xLDEuMS0zLjMsMS4zLTMuNSwxLjNjLTEuMywwLTIuNy0wLjUtMi43LTIuMWMwLTEuNCwwLjUtMi4zLDIuMS0yLjNjMS4zLDAsMi44LDAuMSw0LjEsMC42VjI4Ljl6CgkgTTIxLjQsMzIuM2MwLjQsMCwyLjMtMC4xLDMuNy0wLjlsMC4yLDAuN2gyLjF2LTguOWMwLTMuNi0yLjMtNS01LjctNWMtMS44LDAtNC4zLDAuNy00LjcsMC45bDAuNCwyLjNjMS42LTAuNiwzLTAuNiw0LjItMC42CgljMS44LDAsMy4zLDAuNiwzLjMsMi42VjI0Yy0xLTAuNC0yLjQtMC42LTQuMS0wLjZjLTMsMC00LjUsMS42LTQuNSw0LjdDMTYuNCwzMS44LDE5LjYsMzIuMywyMS40LDMyLjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMC4yLDE2LjFjMCwwLjYsMC42LDEuMiwxLjMsMS4yYzAuOCwwLDEuMy0wLjYsMS4zLTEuMmMwLTAuNy0wLjYtMS4zLTEuMy0xLjNDMzAuOCwxNC44LDMwLjIsMTUuMywzMC4yLDE2LjF6CgkgTTMwLjMsMzIuMWgyLjRWMTguNWgtMi40VjMyLjF6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MS4yLDIyLjFoOC40YzAuNCwwLjEsMC42LDAuMywwLjYsMC43djIuNmgtOS43di0yLjZDNzAuNiwyMi40LDcwLjgsMjIuMiw3MS4yLDIyLjF6IE03MS4yLDMwLjUKCWMtMC40LDAtMC42LTAuMy0wLjctMC44di0yLjZoOS43djIuNmMwLDAuNC0wLjIsMC43LTAuNiwwLjdINzEuMnogTTczLjYsMThjLTAuMSwwLjQtMC4xLDAuOS0wLjQsMS43Yy0wLjEsMC4zLTAuMSwwLjUtMC4xLDAuNwoJaC0yLjZjLTEuMywwLjEtMS45LDAuOC0yLDJ2Ny45YzAuMSwxLjEsMC44LDEuOCwyLDEuOWgxMGMxLjItMC4xLDEuOC0wLjcsMS45LTEuOHYtNy45Yy0wLjEtMS4zLTAuNy0xLjktMS45LTIuMWgtNQoJYzAuMS0wLjMsMC4xLTAuOCwwLjMtMS40YzAuMS0wLjQsMC4xLTAuNywwLjEtMC45aDcuMnYtMS44SDY3LjRWMThMNzMuNiwxOEw3My42LDE4eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTMuNywyMi43Yy0wLjQtMC4xLTAuNS0wLjItMC41LTAuNXYtMC42aDMuMnYwLjZjLTAuMSwwLjMtMC4yLDAuNC0wLjUsMC41SDkzLjd6IE05Ni42LDI0LjEKCWMxLjEtMC4xLDEuNi0wLjUsMS42LTEuNHYtMWgyLjN2LTEuNWgtMi4zdi0xLjFoLTEuOHYxLjFoLTMuMnYtMS4xaC0xLjh2MS4xaC0yLjN2MS41aDIuM3YxYzAuMSwwLjksMC42LDEuNCwxLjYsMS40SDk2LjZ6CgkgTTk0LjgsMzAuNGMxLjYsMC44LDMuNCwxLjMsNS40LDEuOGwwLjktMS43Yy0xLjQtMC4yLTIuOS0wLjYtNC40LTEuMWMxLjEtMC44LDItMS42LDIuNy0yLjVjMC4zLTAuNCwwLjQtMC45LDAuMi0xLjMKCWMtMC4zLTAuNi0wLjgtMC45LTEuNC0wLjloLTl2MS41aDcuN2MwLjIsMCwwLjQsMC4xLDAuNCwwLjFzMCwwLjEtMC4xLDAuM2MtMC42LDAuNi0xLjQsMS4zLTIuMywxLjhjLTEuMi0wLjctMi4xLTEuMy0yLjQtMS44aC0yLjIKCWMwLjksMSwxLjgsMS45LDIuOSwyLjdjLTEuNiwwLjYtMy4zLDEuMS00LjksMS4zbDAuOSwxLjZDOTEuMywzMS44LDkzLjIsMzEuMSw5NC44LDMwLjR6IE04OC4zLDI1LjJ2LTZjMC4xLTAuNiwwLjMtMC45LDAuOC0wLjkKCWgxMS44di0xLjZIOTVjLTAuMS0wLjEtMi4yLTAuMS0yLjIsMGgtNC43Yy0xLjEsMC4xLTEuNywwLjktMS44LDIuMlYyNWMwLjEsMi4xLTAuNCw0LjQtMS4xLDYuN2wxLjksMC42CglDODcuOSwyOS45LDg4LjMsMjcuNiw4OC4zLDI1LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00Ni4zLDI0LjJjMC42LDAsMS4yLDAuMSwxLjcsMC40djMuNGMwLDAuMy0wLjYsMS0xLjksMWMtMS41LDAtMS44LTAuNi0xLjgtMi4xdi0wLjYKCUM0NC4yLDI0LjgsNDQuNywyNC4yLDQ2LjMsMjQuMnogTTQ5LjIsMjAuN0g0OHYyLjVDNDcuNiwyMy4xLDQ3LDIzLDQ2LjMsMjNjLTIuNywwLTMuMywxLTMuMywzLjV2MC4zYzAsMi40LDAuOSwzLjMsMy4yLDMuMwoJYzAuOCwwLDEuMy0wLjEsMS44LTAuNWwwLjEsMC42aDEuMUw0OS4yLDIwLjdMNDkuMiwyMC43eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTYuNywyM2gtMS4ydjUuMmMtMC42LDAuNC0xLjcsMC42LTIuNCwwLjZjLTAuOCwwLTEtMC40LTEtMS4zdi00LjZoLTEuMXY0LjhjMCwxLjYsMC41LDIuMywyLjEsMi4zCgljMSwwLDIuMS0wLjMsMi42LTAuNmwwLjEsMC42aDEuMVYyM3oiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTkyLjcsMTUuN2MwLTAuNywwLjYtMS4zLDEuMi0xLjNjMC42LDAsMS4yLDAuNiwxLjIsMS4zUzk0LjUsMTcsOTMuOSwxN0M5My4zLDE2LjksOTIuNywxNi4zLDkyLjcsMTUuN3oiLz4KPC9zdmc+Cg==");background-repeat:no-repeat;background-position:center;width:112px;height: 36px;margin:10px 0 0 0!important;}
                #content_right{display:none}
                .wrapper_new #s_tab .cur-tab:before,
                .wrapper_new #s_tab .s-tab-news:before,
                .wrapper_new #s_tab .s-tab-video:before,
                .wrapper_new #s_tab .s-tab-pic:before,
                .wrapper_new #s_tab .s-tab-tieba:before,
                .wrapper_new #s_tab .s-tab-zhidao:before,
                .wrapper_new #s_tab .s-tab-wenku:before,
                .wrapper_new #s_tab .s-tab-map:before,
                .wrapper_new #s_tab .s-tab-b2b:before{
                    content: none;
                }       
                .s-tab-more
                .wrapper_new #s_tab .s-tab-news,
                .wrapper_new #s_tab .s-tab-video,
                .wrapper_new #s_tab .s-tab-tieba,
                .wrapper_new #s_tab .s-tab-zhidao,
                .wrapper_new #s_tab .s-tab-wenku,
                .wrapper_new #s_tab .s-tab-b2b{
                    display:none;
                }       
                .wrapper_new #u{
                    margin: 21px 9px 5px 0;
                }
                
                #container.sam_newgrid #content_left{
                    padding-top: 8px;
                }`;
            }
            // --------------------------------------- //
            else if (match("fsoufsou.com/search")) {
                addClass(".header-awa", "._search-sticky-bar")
                addClass(".inputbox-awa", ".input-group-container")
                addClass(".item-awa", ".organic-results div")
                addClass(".item-awa div", ".organic-results div div")
                addClass(".item-title-awa", ".organic-results div a")
                addClass(".item-text-awa", ".organic-results div span")
                addClass(".auto", ".mobile-wiki-container")

                load_then_delay(() => {
                    const i = document.querySelector("#app > div > .false > .flex-column > div > .flex-row > .flex-column > div")
                    if (i == null || i.innerText.length < 20) {
                        i.remove()
                    } else {
                        i.className += "item-awa"
                        i.querySelectorAll(".flex-row-center").forEach((x) => x.remove())
                    }
                }, 1000)


                css += `
                    #app div .false {
                        padding-top: 0px !important;
                    } 
                    
                    .organic-results {
                        padding-top: 16px;
                    }
                `
            }
            // --------------------------------------- //
            else if (match("sogou.com") || match("so.com")) {
                addClass(".item-awa", ".result > li")

                css += `
                /* 矫正搜索栏下方tag */
                .searchnav {
                    position: absolute;
                    top: 55px;
                 }
                .result{
                    all: unset;
                }
                /* 去除头部白色 */
                #header .inner {
                    background:transparent;
                 }
                #tabs-wrap {
                    padding: 0 0 0 135px !important;
                }
                .biz_sponsor, /* AD */
                .right /* 搜狗右侧 */
                #side,
                .menu,  /* 移除多余 */
                .double-eleven{
                    display:none !important;
                }
                /* 太胖了 */
                .res-comm-con{
                    width: 360px !important;
                }
                `
            }
            // --------------------------------------- //
            else {
                onload(() => {
                    if (document.querySelector("title").innerText.indexOf("Google") !== -1) {
                        addClass(".header-awa", ".CvDJxb")
                        addClass(".item-awa", ".MjjYud")
                        addClass(".item-awa div", ".MjjYud div")
                        addClass(".item-title-awa", "h3.LC20lb")
                        addClass(".item-text-awa", ".MjjYud span")

                        css += `
                .yg51vc, /*头部白色区域*/
                .appbar /*获得约 * 条结果，以下是第 * 页*/
                {
                    background-color: transparent !important;
                }
                
                .sfbg, /*令人疑惑的留白*/
                .dodTBe/*同上*/
                {
                    display:none !important;
                    height:0px !important;
                    weight:0px !important;
                }
                `
                    }
                })
            }
        }

        // ---------------------------------------------------------------------------- //

        /* search tools */
        if (cget("search_engine_switch_tool", true)) {
            setupdateawa("engine_switch_tool_list", (key, value) => {
                onload(() => {
                    try {
                        document.getElementById("engine_switch_tool").remove()
                    } catch {
                    }

                    let html = "";
                    if (value.trim() === "") value = defaultSearchList;
                    value.trim().split("\n").forEach((s) => {
                        s = s.replaceAll(/\s/g, "");
                        if (s === "" || s.startsWith('#') || s.startsWith('-')) return;
                        html += ` <!--suppress HtmlUnknownAttribute -->
<a class="${cget("switch_tool_style", "switch_tool switch_tool_button switch_tool_show")}" href = "${s.split(',')[1]}" key = "${s.split(',')[1]}"
                         onclick="this.href=this.getAttribute('key').replace('$',document.getElementsByClassName('search-input-awa')[0].getAttribute('value').replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D'))">${s.split(',')[0]}</a>
                   `
                    });

                    const div = document.createElement("div");
                    div.innerHTML = `<div id="engine_switch_tool" title="如何关闭该区域:  点击你的油猴插件，找的此脚本(Yuhan User Script), 在菜单中即可找到关闭按钮"> 
                <div id ="switch_tool_style" style="margin: auto;">
                    <div>
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_auto','switch_tool_invisible').replace('switch_tool_show','switch_tool_invisible')}); ">隐形</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_auto','switch_tool_show').replace('switch_tool_invisible','switch_tool_show')}); ">显示</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_invisible','switch_tool_auto').replace('switch_tool_show','switch_tool_auto')}); ">自动</a>
                    </div>                
                    <div>
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_compact','switch_tool_link').replace('switch_tool_button','switch_tool_link')}); ">链接</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_button','switch_tool_compact').replace('switch_tool_link','switch_tool_compact')}); ">紧凑</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_compact','switch_tool_button').replace('switch_tool_link','switch_tool_button')}); ">按钮</a>
                    </div>
                </div>
                    ${html}
                </div>`;
                    document.body.appendChild(div);
                })

                load_then_delay(() => {
                    const tool = document.getElementById("engine_switch_tool");

                    document.getElementById("switch_tool_style").addEventListener("click", () => {
                        cset("switch_tool_style", document.getElementsByClassName('switch_tool')[0].className);
                    });

                    try {
                        if (document.getElementsByClassName("switch_tool")[0].onclick === null) {
                            tool.addEventListener("click", () => {
                                Array.from(document.getElementsByClassName("switch_tool")).forEach((i) => {
                                    i.href = i.getAttribute('key').replace('$', document.getElementsByClassName('search-input-awa')[0].getAttribute('value').replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D'))
                                })
                            });
                        }
                    } catch {
                    }


                    window.onscroll = () => {
                        tool.style.top = (window.scrollY > 96 ? 0 : 96 - window.scrollY).toString() + "px";
                    }

                }, 800)
            }, () => {
                if (cget("engine_switch_tool_list", "").trim() === "") cset("engine_switch_tool_list", defaultSearchList);
            });
        }

        const index = options("搜索引擎快速聚焦模式(Ctrl+[K|Q|S])", 'search_engine_quick_focus', ["清空", "关闭", "选中", "聚焦",])
        if (index !== 1) {
            document.onkeydown = (e) => {
                if (e.ctrlKey && (e.key === "q" || e.key === "s" || e.key === "k")) {
                    if (index === 0) document.getElementsByClassName("search-input-awa")[0].value = ""; else if (index === 2) document.querySelector("input").select();
                    document.getElementsByClassName("search-input-awa")[0].focus();
                    e.preventDefault();
                }
            }
        }

        onload(() => {
            /* search setting */
            const div = document.createElement("div");
            div.innerHTML = `
    <style>
        #search-setting-btn-awa{
            z-index: 114514;
            position: fixed;
            left: 40px;
            bottom: 30px;
            background: transparent;
            border: 0 transparent !important;
            width: 50px;
            height: 50px;
            font-size: xx-large;
        }
        #search-setting-close-awa{
            z-index: 114514;
            position: absolute;
            right: 32px;
            top: 24px;
            background: transparent;
            border: 0 transparent !important;
            font-size: xxx-large;
        }        
        #search-setting-awa {
            z-index: 114514;
            position: fixed;
            margin: auto;
            width: 70vw;
            height: 70vh;
            top: 10vh;
            left: 10vw;
            background-color: lightpink;
            background-image: url(https://w.wallhaven.cc/full/o3/wallhaven-o3z7d7.jpg);
            background-size: cover;
            background-repeat: no-repeat;
            background-position-y: bottom;
            opacity: 0.88;
            border: 1px solid rgba(0,0,0,0.5);
            box-shadow: 6px 10px 24px 6px rgba(0,0,0,0.65);
            border-radius: 24px;
            padding: 5vh 5vw;
            overflow: hidden;
            overflow-y:auto
        }
        #search-setting-awa * {
            color: black;
            font-size: x-large;
            overflow: hidden;
        }

        #search-setting-awa pre{
            height: 60px;
            width: 60vw;
            background-color: black;
            opacity: 0.4;
            color: white;
            border: gray 1px;
            box-shadow: 2px 4px 8px 2px rgba(0,0,0,0.65);
        }
        #search-setting-awa > li > button{
                position: relative;
                right: 5px;
                top: 5px;
        }
        
    </style>
    <div>   
       <button id="search-setting-btn-awa" onclick='let e = document.getElementById("search-setting-awa");e.style.display=e.style.display==="block"?"none":"block"'>🎨</button>
       <div id="search-setting-awa" style="display: none">
            <button id="search-setting-close-awa" onclick="this.parentElement.style.display='none'">[X]</button>
            <p>该页面的修改会实时生效，留空使用默认值</p><br>
            <li title="留空使用脚本自带样式,需要系统安装此字体"> 
            font-family: <input id="search-font-family" value="${cget("search-font-family", "")}"/>
            </li>
            
            <li title="请输入指向图片一个链接"> 
            background-img: <input id="search-background-img" value="${cget("search-background-img", "")}"/>
            </li>
            
            <li title="#开头表示忽略"> 
            屏蔽网站(暂不支持 因需要手动适配各个网站 工作量巨大):<button contenteditable="false" onclick="this.nextElementSibling.style.height=this.nextElementSibling.style.height==='auto'?'60px':'auto'">展开/关闭</button>
               <pre id="search-block-website" contenteditable="true">${cget("search-block-website", "")}</pre>
            </li>
               
            <li title="留空使用默认，#开头表示忽略"> 
            搜索引擎:<button contenteditable="false" onclick="this.nextElementSibling.style.height=this.nextElementSibling.style.height==='auto'?'60px':'auto'">展开/关闭</button>
               <pre id="engine_switch_tool_list" contenteditable="true">${cget("engine_switch_tool_list", "")}</pre>
            </li>
       </div>
    </div>
        `;
            document.body.appendChild(div);

            const addListener = (key) => {
                const e = document.getElementById(key);
                if (e.tagName === "INPUT") {
                    e.addEventListener("change", () => {
                        cset(key, document.getElementById(key).value)
                        updateawa(key);
                    })
                } else if (e.tagName === "PRE") {
                    document.getElementById("search-setting-awa").addEventListener("keyup", () => {
                        cset(key, document.getElementById(key).innerText)
                        updateawa(key);
                    }, true)
                }
            }
            addListener("search-font-family");
            addListener("search-background-img");
            addListener("search-block-website");
            addListener("engine_switch_tool_list");
        });
    }

    // ---------------------------------------------------------------------------- //

    else if (match("bing.com")) {
        css += (`
                #footer { /*首页下方黑条*/
                    display:none;
                }
                .img_cont{ /*修改背景图片不透明度*/
                    opacity: 0.9 !important;
                }
        `);
    }

    /* csdn */
    else if (match("blog.csdn.net") && match("/article/details/")) {
        if (menu("CSDN极简化", 'csdn_opt', true)) {
            css += `
            .hide-article-box,
            #recommendNps, .template-box, .blog-footer-bottom, #blogColumnPayAdvert, .article-type-img,
            .recommend-item-box, .recommend-right, #dmp_ad_58, aside{
                display: none!important;
            } 
            .article-info-box, .article-bar-top, #article_content, #csdn-toolbar,
            main div.blog-content-box .article-header-box .article-header div.article-info-box div.blog-tags-box,
            header div.article-info-box div.blog-tags-box .tags-box.artic-tag-box a.tag-link,
            main div.blog-content-box .article-header-box .article-header div.article-info-box div.blog-tags-box .tags-box,
            #mainBox{
                margin: auto;
                width: auto!important;
                height: auto!important;
                padding: 0!important;
                padding-left: 0!important;
                overflow: hidden;
            }
            
            .tag-link{
                margin: 5px 0 0 0!important;
                overflow: hidden;
            }
            
            main div.blog-content-box article {
                padding-top: 10px;
            }
            
            main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top span
            {
                margin-right: 4px;
            }
            
            main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .follow-nickName {
                margin-right: 2px;
            }
            
            main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .bar-conten{
                padding-left: 0;
                margin-left: 10px;            
            }
            
            .copybtn{
                position: absolute;
                right: 4px;
                top: 4px;
                font-size: 12px;
                color: #ffffff;
                background-color: #666666;
                padding: 4px 12px;
                margin: 8px;
                border-radius: 4px;
                cursor: pointer;
                box-shadow: 0 2px 4px rgb(0 0 0 / 5%), 0 2px 4px rgb(0 0 0 / 5%);
            }
            
        `;
        }

        if (menu("CSDN移除顶部", 'csdn_remove_header', true)) {
            css += `
            #csdn-toolbar{
                display: none!important;
            }
            `
        }

        load_then_delay(() => {
            // 将代码块改为可修改
            document.querySelectorAll("code").forEach(c => {
                c.contentEditable = "true";
            });

            if (cget("csdn_opt", true)) {
                // 移除右侧多余悬浮按钮 仅保留回到顶部按钮
                document.getElementsByClassName("option-box")[0].remove();
                document.getElementsByClassName("option-box")[0].remove();
                document.getElementsByClassName("option-box")[0].remove();
                // 移动文字标签位置
                const taghtml = document.getElementsByClassName("blog-tags-box")[0].outerHTML + "";
                document.getElementsByClassName("blog-tags-box")[0].remove();
                document.getElementsByClassName("article-bar-top")[0].innerHTML = document.getElementsByClassName("article-bar-top")[0].innerHTML + taghtml;
                // 简介时间格式
                document.getElementsByClassName("time")[0].innerHTML = document.getElementsByClassName("time")[0].innerHTML
                    .replace("于&nbsp;", "").replace("&nbsp;发布", "");
                // 刷新底部工具栏位置 使其居中
                document.getElementsByClassName("left-toolbox")[0].style.left = "auto";
                // 删除不美观的冒号
                document.getElementsByClassName("blog-tags-box")[0].innerHTML = document.getElementsByClassName("blog-tags-box")[0].innerHTML.replaceAll("：", "");
            }

            // 免登录复制
            if (menu("CSDN免登录复制", 'csdn_copy', true)) {
                const copy_without_sgin = () => {
                    const btns = document.getElementsByClassName("hljs-button");
                    for (let i = 0; i < btns.length; i++) {
                        btns[i].outerHTML = `
                <button class="copybtn" onclick="
                this.innerText = '';
                navigator.clipboard.writeText(this.parentNode.innerText);
                this.innerText = '复制成功';
                setTimeout(() => {this.innerText = '点击复制'},1000);"
                >点击复制</button>
                `
                    }
                }
                copy_without_sgin();
                // 二次免登录复制 反正顽固分子 可恶可恶可恶可恶可恶可恶可恶可恶可恶可恶可恶
                setTimeout(() => copy_without_sgin(), 400);
                setTimeout(() => copy_without_sgin(), 850);
                setTimeout(() => copy_without_sgin(), 1600);
                setTimeout(() => copy_without_sgin(), 3200);
            }
        }, 350);
    }

    // -------------------------------------------------------------------------- //

    // 去除复制限制
    window.addEventListener("copy", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, true);

    addcss(css);
})();
