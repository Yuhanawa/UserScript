// ==UserScript==
// @name         Yuhan User Script 搜索引擎/百度必应谷歌F搜/哔哩哔哩/CSDN/Github/开发/更多 优化/美化/净化/增强
// @name:zh      Yuhan 自用 搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 CSDN极简化 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @name:zh-CN   Yuhan 自用 搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 CSDN极简化 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @name:en      Yuhan User Script
// @name:en-US   Yuhan User Script
// @namespace    http://github.com/yuhanawa/UserScript
// @version      0.3.5
// @description  搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 移除评论区关键字搜索蓝字 CSDN极简化 CSDN沉浸式阅读 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @description:zh-CN  搜索引擎(百度 必应 谷歌 f搜)优化美化 搜索引擎快速切换 哔哩哔哩(bilibili B站)细节优化 视频快捷分享复制 移除评论区关键字搜索蓝字 CSDN极简化 CSDN沉浸式阅读 CSDN免登录复制 去除部分网站复制小尾巴 持续更新中
// @description:en Search engine (Baidu Bing, Google f search) optimization and beautification of search engines, quick switching, Bilibili (bilibili B station), details, optimization, video, quick sharing, copying, removing comment area, keyword search, blue word CSDN, extremely simplified CSDN, immersive reading, CSDN free login Copy and remove some websites, copy the small tail, and continue to update
// @description:en_US Search engine (Baidu Bing, Google f search) optimization and beautification of search engines, quick switching, Bilibili (bilibili B station), details, optimization, video, quick sharing, copying, removing comment area, keyword search, blue word CSDN, extremely simplified CSDN, immersive reading, CSDN free login Copy and remove some websites, copy the small tail, and continue to update
// @node         8-24 0.3.5 紧急修复两个样式问题(百度和360)
// @node         8-24 0.3.4 轻度美化搜狗360的样式
// @node         8-24 0.3.3 添加一个谷歌镜像 修复一个谷歌镜像链接
// @node         8-24 0.3.2 修复在必应加载时 画面扭曲
// @node         8-24 0.3.1 修复在必应加载缓慢时 出现错误
// @node         8-24 0.3.0 搜索引擎快速切换大量改动 搜索引擎列表修改功能预计今晚完成
// @node         完整更新日志请见 https://github.com/yuhanawa/UserScript/blob/master/CHANGELOG.md
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
// @match        *.xn--flw351e.ml/*
// @match        *search.njau.cf/*
// @match        *search.aust.cf/*
// @match        *.yahoo.com/*
// @match        *.yandex.com/*
// @icon         none
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==
// noinspection HtmlUnknownAttribute

(function () {
    'use strict';

    let css = "";
    let searchList = `
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

    /* config */
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
            if (index + 1 >= ValueList.length) cset(key, 0);
            else cset(key, index + 1);
            location.reload()
        });
        return index;
    }

    let isRunning = false;
    /* utils */
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

    const onload = (f) => document.addEventListener("DOMContentLoaded", () => f());
    const load_then_delay = (f, t) => onload(() => setTimeout(() => f(), t));


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

    /* search */
    else if (match("bing.com/search") || match("baidu.com/s") ||
        match("bing.com/search") || match("baidu.com/s") ||
        match("fsoufsou.com/search") || match("google.com/search") ||
        match("so.com/s") || match("sogou.com/web?query") ||
        match("search.yahoo.com/search") || match("yandex.com/search") ||
        match("xn--flw351e.ml/search") || match("search.aust.cf/search") || match("search.njau.cf/search") /*谷歌镜像*/
    ) {
        menu("搜索引擎优化美化净化", 'search', true);
        menu("搜索引擎快速切换工具", 'search_engine_switch_tool', true);

        /* 移除多余的input */
        onload(() => {
            if (match("sogou.com/web?query"))
                document.getElementById("bottom_form_querytext").className += " search-input-awa ";
            else {
                document.querySelectorAll("input").forEach(i => {
                    if (i.type === 'text' || i.type === 'search') i.className += " search-input-awa ";
                });
            }
        })


        if (cget("search", true)) {
            css += `
        body, .body-awa {
            background-color: #f5f5f5 !important;
              animation-name: ani_topTobuttom;
              animation-duration: 1s;
              animation-timing-function: ease;
        }
        header, .header, #header, .header-awa
        {
            background-color: transparent !important;
            padding-top: 18px !important;
            position: static !important;
        }
        input, .inputbox-awa
        {
            background-color: #fff;
        }
        .results > div, .results > li, .result, .item-awa{
            word-wrap: break-word;
            word-break: break-word;
            color: #333;
            line-height: 1.65;
            background: #fff;
            box-sizing: border-box;
            border-radius: 4px;
            padding: 12px 20px;
            transition: all 450ms cubic-bezier(.23,1,.32,1) 0s;
            box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);
            border-collapse: collapse;
            margin-bottom: 18px;
            margin-top: 0px;
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .item-awa div{
            background: transparent;
            padding: revert !important;
            box-shadow: unset;
            margin-bottom: revert;
            border:unset
        }
        p,span,.item-awa p, .item-awa span, .item-text-awa{
            line-height: 20px;
            color: #444;
            font: 13px,'Microsoft YaHei',Arial,Helvetica,Sans-Serif;
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
        `;
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

            const addClass = (y, add) => {
                css = css
                    .replaceAll(`${y},`, `${add},${y},`)
                    .replaceAll(`${y}{`, `${add},${y}{`);
            };

            /* bing */
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
                addClass(".item-title-awa", "h2")
                addClass(".item-text-awa", "p")


                load_then_delay(() => {
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
                }, 10)

                if (cget("remove_favicon_icon", true)) {
                    css += `.sh_favicon{ display:none !important; }`
                }

            }
            /* baidu */
            else if (match("baidu.com/s")) {
                css += `        
*{font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif}
::-webkit-scrollbar{width:6px;height:10px;background-color:rgba(0,0,0,0)}
::-webkit-scrollbar-track{background-color:rgba(0,0,0,.1)}
::-webkit-scrollbar-thumb{border-radius:3px;background-color:rgba(0,0,0,.2);transition:all .4s ease;-moz-transition:all .4s ease;-webkit-transition:all .4s ease;-o-transition:all .4s ease}
::-webkit-scrollbar-thumb:hover{border-radius:3px;background-color:rgba(0,0,0,.4);transition:all .4s ease;-moz-transition:all .4s ease;-webkit-transition:all .4s ease;-o-transition:all .4s ease}
.animated{-webkit-animation-duration:1s;animation-duration:1s;animation-fill-mode:both}
@-webkit-keyframes fadeInUp{from{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:none;transform:none}}
@keyframes fadeInUp{from{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:none;transform:none}}
.fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}
@-webkit-keyframes bounceInRight{60%,75%,90%,from,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}to{-webkit-transform:none;transform:none}}
@keyframes bounceInRight{60%,75%,90%,from,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(3000px,0,0);transform:translate3d(3000px,0,0)}60%{opacity:1;-webkit-transform:translate3d(-25px,0,0);transform:translate3d(-25px,0,0)}75%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}90%{-webkit-transform:translate3d(-5px,0,0);transform:translate3d(-5px,0,0)}to{-webkit-transform:none;transform:none}}
.bounceInRight{-webkit-animation-name:bounceInRight;animation-name:bounceInRight}
@-webkit-keyframes bounceInUp{60%,75%,90%,from,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,3000px,0);transform:translate3d(0,3000px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}
a{text-decoration:none;margin-bottom:2px}
.c-showurl:hover{text-decoration:none;border:none;opacity:.8;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.res-gap-right16:hover{border-bottom:#3476d2 1.2px solid}
.c-showurl{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.c-tip-arrow:hover{text-decoration:none;border:none}
.c-default a{text-decoration:none;border:none}
.c-gap-bottom a:hover{text-decoration:underline}
.op_dict3_morelink a:hover{text-decoration:underline}
.c-btn:hover{text-decoration:none!important}
td a:hover{text-decoration:underline}
em{text-decoration:none!important}
#s_wrap{display:none}
.s-top-nav{display:none}
#s_ctner_menus{display:none}
#s_menu_gurd{display:none}
#s_strpx_span1{display:none}
#ftCon{display:none}
#bottom_container{display:none}
#lg{background-repeat:no-repeat;background-position:center;height:70px;padding-top:150px}
#lg img{display:none}
#lg a{display:none}
#head_wrapper{padding-bottom:0}
.s_form_wrapper{margin-top:auto;display: flex;}
#s_lg_img,#s_lg_img_new{display:none!important}
#form .s_ipt_wr{border:none;border-radius:3px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;background-position:100%!important;height:39px;font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif;padding-top:4px}
.s_ipt{font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif}
#form .s_ipt_wr:hover{border:none;border-radius:2px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.ipthover{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.iptfocus{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)}
body #form .s_btn{width:32px;height:32px;border-radius:50%;font-size:0;border:none;box-shadow:none;margin-left:0;z-index:100;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;margin-top:0;opacity:0}
body #form .s_btn:hover{opacity:.5;background:rgba(0,0,0,0);border:none;box-shadow:none;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
body #form .s_btn_wr{width:32px;height:32px;border-radius:50%;font-size:0;background-color:rgba(0,0,0,0);background-position:50%;border:none;box-shadow:none;margin-left:5px;z-index:100;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;margin-top:6px}
body #form .s_btn_wr:hover{opacity:.5;background:rgba(0,0,0,0);border:none;box-shadow:none;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.btnhover{opacity:.5;background-color:rgba(0,0,0,0)!important;border:none!important;box-shadow:none;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.hint_toprq_tips{margin-bottom:12px}
.s_form{height:75px;padding-top:10px}
#s_tab{padding:87px 0 0 121px;}
#head.s_down{box-shadow:0 0 5px #666;padding-bottom: 8px;}
.bdsug{top:42px;box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);border:none;border-radius:0 0 2px 2px;font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif;}
.bgsug li{font-family:Helvetica,"Microsoft Yahei UI"!important;width:100%!important;line-height:36px!important}
.bgsug ul li{line-height:32px!important}
.bdsug-overflow{font-family:Helvetica,"Microsoft Yahei UI"!important;width:583px!important}
#quickdelete{top:5px!important;opacity:.5}
#kw_tip{font-family:Helvetica,"Microsoft Yahei UI Light"}
#result_logo{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAxIDMzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDEgMzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNDg3OUJEO30KCS5zdDF7ZmlsbDojREQ0NDM2O30KCS5zdDJ7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwLjQsMTUuM2MtMy44LDAuMy00LDIuNi01LjcsNC43Yy0xLjgsMi4yLTUuNSw0LjEtNiw2LjdjLTAuNiwzLjMsMS4zLDUuMSwzLDUuN2MxLjksMC42LDYuMi0wLjUsOC40LTAuNWgwLjIKCWgwLjJjMi4yLDAsNi40LDEuMSw4LjQsMC41YzEuOC0wLjYsMy41LTMuMiwzLTUuN2MtMC40LTIuMS00LjQtNC41LTYuMi02LjdDNTQuMiwxOCw1NC4zLDE1LjYsNTAuNCwxNS4zeiBNMzcsMTQuOAoJYzAsMi40LDEuNiw0LjMsMy40LDQuM2MxLjksMCwzLjQtMS45LDMuNC00LjNjMC0yLjQtMS42LTQuMy0zLjQtNC4zUzM3LDEyLjUsMzcsMTQuOHogTTQzLjksOC42YzAsMi41LDEuNSw0LjUsMy4zLDQuNQoJYzEuOCwwLDMuMy0yLjEsMy4zLTQuNVM0OSw0LjEsNDcuMSw0LjFDNDUuMyw0LDQzLjksNiw0My45LDguNnogTTUyLjIsOC41YzAsMi4zLDEuNCw0LjMsMy4yLDQuM3MzLjItMS45LDMuMi00LjNzLTEuNC00LjMtMy4yLTQuMwoJUzUyLjIsNi4yLDUyLjIsOC41eiBNNTcuNSwxNS45YzAsMi4zLDEuNSw0LjMsMy4zLDQuM2MxLjgsMCwzLjMtMS45LDMuMy00LjNzLTEuNS00LjMtMy4zLTQuM0M1OC45LDExLjYsNTcuNSwxMy42LDU3LjUsMTUuOXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTQsMzAuNHYtNS4xaDYuNGMxLjYsMCwxLjYsMC4zLDEuNiwydjEuNGMwLDEuNi0yLjMsMS44LTMuOSwxLjhMNCwzMC40TDQsMzAuNHogTTQsMjN2LTQuOGg0LjEKCWMxLjYsMCwzLjksMCwzLjksMi4xdjAuMWMwLDEuNC0wLjUsMi42LTEuOCwyLjZDMTAuMywyMyw0LDIzLDQsMjN6IE0xLjcsMTZ2MTYuM2g2LjRjMywwLDYuMiwwLDYuMi0zLjZ2LTEuMWMwLTEuNi0wLjEtMi43LTEuMS0zLjUKCWMxLTAuOCwxLjEtMi4zLDEuMS0zLjZsMCwwYzAtNC41LTMuMi00LjUtNi4yLTQuNUwxLjcsMTZMMS43LDE2eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUsMjguOWMtMS4xLDEuMS0zLjMsMS4zLTMuNSwxLjNjLTEuMywwLTIuNy0wLjUtMi43LTIuMWMwLTEuNCwwLjUtMi4zLDIuMS0yLjNjMS4zLDAsMi44LDAuMSw0LjEsMC42VjI4Ljl6CgkgTTIxLjQsMzIuM2MwLjQsMCwyLjMtMC4xLDMuNy0wLjlsMC4yLDAuN2gyLjF2LTguOWMwLTMuNi0yLjMtNS01LjctNWMtMS44LDAtNC4zLDAuNy00LjcsMC45bDAuNCwyLjNjMS42LTAuNiwzLTAuNiw0LjItMC42CgljMS44LDAsMy4zLDAuNiwzLjMsMi42VjI0Yy0xLTAuNC0yLjQtMC42LTQuMS0wLjZjLTMsMC00LjUsMS42LTQuNSw0LjdDMTYuNCwzMS44LDE5LjYsMzIuMywyMS40LDMyLjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMC4yLDE2LjFjMCwwLjYsMC42LDEuMiwxLjMsMS4yYzAuOCwwLDEuMy0wLjYsMS4zLTEuMmMwLTAuNy0wLjYtMS4zLTEuMy0xLjNDMzAuOCwxNC44LDMwLjIsMTUuMywzMC4yLDE2LjF6CgkgTTMwLjMsMzIuMWgyLjRWMTguNWgtMi40VjMyLjF6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MS4yLDIyLjFoOC40YzAuNCwwLjEsMC42LDAuMywwLjYsMC43djIuNmgtOS43di0yLjZDNzAuNiwyMi40LDcwLjgsMjIuMiw3MS4yLDIyLjF6IE03MS4yLDMwLjUKCWMtMC40LDAtMC42LTAuMy0wLjctMC44di0yLjZoOS43djIuNmMwLDAuNC0wLjIsMC43LTAuNiwwLjdINzEuMnogTTczLjYsMThjLTAuMSwwLjQtMC4xLDAuOS0wLjQsMS43Yy0wLjEsMC4zLTAuMSwwLjUtMC4xLDAuNwoJaC0yLjZjLTEuMywwLjEtMS45LDAuOC0yLDJ2Ny45YzAuMSwxLjEsMC44LDEuOCwyLDEuOWgxMGMxLjItMC4xLDEuOC0wLjcsMS45LTEuOHYtNy45Yy0wLjEtMS4zLTAuNy0xLjktMS45LTIuMWgtNQoJYzAuMS0wLjMsMC4xLTAuOCwwLjMtMS40YzAuMS0wLjQsMC4xLTAuNywwLjEtMC45aDcuMnYtMS44SDY3LjRWMThMNzMuNiwxOEw3My42LDE4eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTMuNywyMi43Yy0wLjQtMC4xLTAuNS0wLjItMC41LTAuNXYtMC42aDMuMnYwLjZjLTAuMSwwLjMtMC4yLDAuNC0wLjUsMC41SDkzLjd6IE05Ni42LDI0LjEKCWMxLjEtMC4xLDEuNi0wLjUsMS42LTEuNHYtMWgyLjN2LTEuNWgtMi4zdi0xLjFoLTEuOHYxLjFoLTMuMnYtMS4xaC0xLjh2MS4xaC0yLjN2MS41aDIuM3YxYzAuMSwwLjksMC42LDEuNCwxLjYsMS40SDk2LjZ6CgkgTTk0LjgsMzAuNGMxLjYsMC44LDMuNCwxLjMsNS40LDEuOGwwLjktMS43Yy0xLjQtMC4yLTIuOS0wLjYtNC40LTEuMWMxLjEtMC44LDItMS42LDIuNy0yLjVjMC4zLTAuNCwwLjQtMC45LDAuMi0xLjMKCWMtMC4zLTAuNi0wLjgtMC45LTEuNC0wLjloLTl2MS41aDcuN2MwLjIsMCwwLjQsMC4xLDAuNCwwLjFzMCwwLjEtMC4xLDAuM2MtMC42LDAuNi0xLjQsMS4zLTIuMywxLjhjLTEuMi0wLjctMi4xLTEuMy0yLjQtMS44aC0yLjIKCWMwLjksMSwxLjgsMS45LDIuOSwyLjdjLTEuNiwwLjYtMy4zLDEuMS00LjksMS4zbDAuOSwxLjZDOTEuMywzMS44LDkzLjIsMzEuMSw5NC44LDMwLjR6IE04OC4zLDI1LjJ2LTZjMC4xLTAuNiwwLjMtMC45LDAuOC0wLjkKCWgxMS44di0xLjZIOTVjLTAuMS0wLjEtMi4yLTAuMS0yLjIsMGgtNC43Yy0xLjEsMC4xLTEuNywwLjktMS44LDIuMlYyNWMwLjEsMi4xLTAuNCw0LjQtMS4xLDYuN2wxLjksMC42CglDODcuOSwyOS45LDg4LjMsMjcuNiw4OC4zLDI1LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00Ni4zLDI0LjJjMC42LDAsMS4yLDAuMSwxLjcsMC40djMuNGMwLDAuMy0wLjYsMS0xLjksMWMtMS41LDAtMS44LTAuNi0xLjgtMi4xdi0wLjYKCUM0NC4yLDI0LjgsNDQuNywyNC4yLDQ2LjMsMjQuMnogTTQ5LjIsMjAuN0g0OHYyLjVDNDcuNiwyMy4xLDQ3LDIzLDQ2LjMsMjNjLTIuNywwLTMuMywxLTMuMywzLjV2MC4zYzAsMi40LDAuOSwzLjMsMy4yLDMuMwoJYzAuOCwwLDEuMy0wLjEsMS44LTAuNWwwLjEsMC42aDEuMUw0OS4yLDIwLjdMNDkuMiwyMC43eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTYuNywyM2gtMS4ydjUuMmMtMC42LDAuNC0xLjcsMC42LTIuNCwwLjZjLTAuOCwwLTEtMC40LTEtMS4zdi00LjZoLTEuMXY0LjhjMCwxLjYsMC41LDIuMywyLjEsMi4zCgljMSwwLDIuMS0wLjMsMi42LTAuNmwwLjEsMC42aDEuMVYyM3oiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTkyLjcsMTUuN2MwLTAuNywwLjYtMS4zLDEuMi0xLjNjMC42LDAsMS4yLDAuNiwxLjIsMS4zUzk0LjUsMTcsOTMuOSwxN0M5My4zLDE2LjksOTIuNywxNi4zLDkyLjcsMTUuN3oiLz4KPC9zdmc+Cg==");background-repeat:no-repeat;background-position:center;width:101px;height:33px;margin-top:9px}
#result_logo img{display:none;visibility:hidden}
#result_logo a img{display:none;visibility:hidden}
.result.c-container{line-height:1.65}
#rs{background-color:rgba(0,0,0,0)!important}
.c-border{-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);border-radius:2px;border:none;padding:20px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.c-border:hover{box-shadow:0 3px 10px rgba(0,0,0,.16),0 3px 10px rgba(0,0,0,.23);transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
.c-tabs-nav{border:none;border-radius:2px 2px 0 0;transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
.c-tabs-nav-movetop{margin-left:-20px;margin-right:-20px;margin-top:-20px;transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
.c-tabs-nav-selected{border-top:none!important;border-left:none!important;border-right:none!important;transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
.c-tabs-nav-sep{display:none!important}
#page a{height:34px;border-radius:2px;border:none!important;background-color:rgba(0,0,0,0);transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
#page a:hover{transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
#page a .pc:hover{transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
#page strong{height:34px;border-radius:2px;position:relative;top:-2px;transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
#page strong .pc{line-height:34px;transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
.fk{display:none!important}
.pc{border:none!important;height:35px;transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
.pc:hover{transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:background-color 450ms cubic-bezier(.23,1,.32,1) 0s}
#s_tab a{width:59px;line-height:44px}
#s_tab b{width:59px;line-height:44px}
#s_tab{padding-bottom:8px;padding-top:89px}
.c-icon-tieba{background-repeat:no-repeat;background-position:center}
.toindex{display:none}
.wrapper_new .s_tab_inner{padding-top: 10px;}
.wrapper_new .s_ipt_wr{background: #ffffff;}
.wrapper_new.wrapper_s #form .bdsug-new{width: 93%;}
#u .pf{background-repeat:no-repeat;background-position:center;font-size:0;padding:14px;opacity:.8;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease;padding-top:18px;padding-bottom:10px;}
#u .pf:hover{opacity:1; -moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease}
.wrapper_new #u>a.pf{color:rgba(0,0,0,0); margin: 4px 0 0 24px;}
.wrapper_new #u>a.pf:hover{color:rgba(0,0,0,0)}
.pf .c-icon{display:none!important}
.c-icon-triangle-down{display:none}
.bdpfmenu{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);border-radius:2px!important;border:none;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;margin-left:-10px;margin-top:30px;z-index:8888!important}
.bdpfmenu a:hover{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.bdnuarrow{display:none!important}
.setpref{border-radius:2px 2px 0 0;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.setpref:hover{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
#u .lb{padding:23px;border-radius:50px;font-size:0;position:absolute;right:50px;top:3800%;background-repeat:no-repeat;background-position:center;box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
#u .lb:hover{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
#u .lb:active{box-shadow:0 10px 30px rgba(0,0,0,.19),0 6px 10px rgba(0,0,0,.23);transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.tang-foreground{border-radius:2px;box-shadow:0 19px 60px rgba(0,0,0,.3),0 15px 20px rgba(0,0,0,.22)}
#s_upfunc_menus{display:none}
#bg{background-color:#FFFFFF!important;border:none;border-radius:3px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;background-position:100%!important;z-index:-1;width:600px;height:39px;font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif;padding-top:5px!important}
#head_wrapper .s_ipt{border:0!important;height:20px!important;border-radius:2px;width:586px!important}
#head_wrapper .nobg_s_fm_hover{border:0!important}
#head_wrapper .nobg_s_fm_focus{border:0!important;border-top:0 solid #fff!important;border-bottom:0 solid #fff!important;border-left:0 solid #fff!important;border-right:1px solid #38f}
.s-title-image{border:none!important;border-top:0 solid #fff!important;border-bottom:0 solid #fff!important;border-left:0 solid #fff!important;border-right:0 solid #fff!important}
#s_lg_img{display:none}
#form{-webkit-animation-duration:0.2s;animation-duration:0.2s;-webkit-animation-fill-mode:both;animation-fill-mode:both;animation-name:fadeInUp;-webkit-animation-name:fadeInUp;animation-delay:.3s;-webkit-animation-delay:.3s}
body:not([news]) #head_wrapper #form.fm{min-width: 50%;width: 110%;}
.s-p-top{transform:scale(.8);bottom:9px!important}
.mnav{display:none}
#u_sp .mnav{display:none}
#u1 a.lb{padding:23px;border-radius:50%;font-size:0;position:absolute;right:44px;top:1040%;background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDYgNDYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ2IDQ2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMywyM2MyLjksMCw1LjItMi4zLDUuMi01LjJzLTIuMy01LjItNS4yLTUuMnMtNS4yLDIuMy01LjIsNS4yUzIwLjEsMjMsMjMsMjN6IE0yMywyNS42CgljLTMuNSwwLTEwLjQsMS43LTEwLjQsNS4ydjIuNmgyMC43di0yLjZDMzMuNCwyNy4zLDI2LjUsMjUuNiwyMywyNS42eiIvPgo8L3N2Zz4K");background-repeat:no-repeat;background-position:center;box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;line-height:0;z-index:100}
#u1 a.lb:hover{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
#u1 a.lb:active{box-shadow:0 10px 30px rgba(0,0,0,.19),0 6px 10px rgba(0,0,0,.23);transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
#u1 a.pf{background-repeat:no-repeat;background-position:center;font-size:0;padding:14px;opacity:.8;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease;z-index:0}
#u1 a.bri{background-color:rgba(0,0,0,0);background-repeat:no-repeat;background-position:center;font-size:0;padding:2px;opacity:.8;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease;border:none;margin-top:12px}
#wrapper .bdbriimgtitle{padding-top:23px}
#wrapper .bdbri.bdbriimg .bdmainlink a{border:none}
#wrapper .bdbri{z-index:2}
#wrapper #u_sp .s_bri{padding:5px;border-radius:50%;font-size:0;width:32px;height:32px;background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMTNoM3YtM2gtM1YxM3ogTTE0LjUsMjJoM3YtM2gtM0MxNC41LDE5LDE0LjUsMjIsMTQuNSwyMnogTTEwLDIyaDN2LTNoLTNWMjJ6IE0xMCwxNy41aDN2LTNoLTNWMTcuNXoNCgkgTTE0LjUsMTcuNWgzdi0zaC0zQzE0LjUsMTQuNSwxNC41LDE3LjUsMTQuNSwxNy41eiBNMTksMTB2M2gzdi0zSDE5eiBNMTQuNSwxM2gzdi0zaC0zQzE0LjUsMTAsMTQuNSwxMywxNC41LDEzeiBNMTksMTcuNWgzdi0zaC0zDQoJVjE3LjV6IE0xOSwyMmgzdi0zaC0zVjIyeiIvPg0KPC9zdmc+DQo=");background-repeat:no-repeat;background-position:center;box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-moz-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-webkit-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;-o-transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;line-height:0;z-index:100;margin-right:22px;margin-top:1px}
#u_sp .s_bdbriimgtitle{padding-top:73px}
#s_usersetting_top{background-repeat:no-repeat;background-position:center;font-size:0;padding:14px;opacity:.8;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease;margin-top:12px;margin-right:4px;z-index:-100}
#s_top_wrap{z-index:-10;border-bottom:unset;}
#u .toindex{display:none!important}
#s_username_top{text-decoration:none;margin-top:26px;margin-left:5px;border:none;padding-left:10px;padding-right:10px;border-radius:16px;margin-right:-3px}
.user-name{text-decoration:none!important}
.menu-arrow{display:none!important}
.s_user_name_menu{text-align:center!important}
.s-user-set-menu.menu-top{width:100px}
.s-user-set-menu div{border:none!important;box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px}
.s-user-set-menu{padding-top:0;margin-top:36px;border-radius:2px!important}
.s-user-set-menu a{padding-left:25px;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease}
.s-user-set-menu a:hover{-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease}
#user{text-decoration:none!important;margin-top:30px;margin-left:5px;border:none;padding-left:10px;padding-right:10px;border-radius:16px;margin-right:-3px;height:23px;padding-top:8px;-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both;animation-name:bounceInRight;-webkit-animation-name:bounceInRight}
.usermenu{border:none!important;box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;-webkit-box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;width:83px;border-radius:2px!important;top:35px!important;margin: 0 auto;}
.username a{-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease;border-radius:2px}
.username a:hover{background:#3476d2!important;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease}
.username a:active{background:#3476d2!important;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease}
#user .c-icon{display:none}
#imsg{background-repeat:no-repeat;background-position:center;font-size:0;padding:14px;opacity:.8;-moz-transition:all .3s ease;-webkit-transition:all .3s ease;-o-transition:all .3s ease;z-index:0;padding-top:25px;padding-bottom:21px}
#imsg:hover{opacity:1}
.head_wrapper #bds-message-wrapper{top:64px}
.s-mod-msg{box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;-webkit-box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;border-radius:3px}
.msg-btn{border-radius:2px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.msg-btn:hover{border-radius:2px;box-shadow:0 1px 6px rgba(0,0,0,.12),0 1px 4px rgba(0,0,0,.12);transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.msg-btn:active{border-radius:2px;box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;-webkit-box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.no-use:hover{box-shadow:none!important}
.top-logo img{display:none}
.top-logo{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAxIDMzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDEgMzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNDg3OUJEO30KCS5zdDF7ZmlsbDojREQ0NDM2O30KCS5zdDJ7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwLjQsMTUuM2MtMy44LDAuMy00LDIuNi01LjcsNC43Yy0xLjgsMi4yLTUuNSw0LjEtNiw2LjdjLTAuNiwzLjMsMS4zLDUuMSwzLDUuN2MxLjksMC42LDYuMi0wLjUsOC40LTAuNWgwLjIKCWgwLjJjMi4yLDAsNi40LDEuMSw4LjQsMC41YzEuOC0wLjYsMy41LTMuMiwzLTUuN2MtMC40LTIuMS00LjQtNC41LTYuMi02LjdDNTQuMiwxOCw1NC4zLDE1LjYsNTAuNCwxNS4zeiBNMzcsMTQuOAoJYzAsMi40LDEuNiw0LjMsMy40LDQuM2MxLjksMCwzLjQtMS45LDMuNC00LjNjMC0yLjQtMS42LTQuMy0zLjQtNC4zUzM3LDEyLjUsMzcsMTQuOHogTTQzLjksOC42YzAsMi41LDEuNSw0LjUsMy4zLDQuNQoJYzEuOCwwLDMuMy0yLjEsMy4zLTQuNVM0OSw0LjEsNDcuMSw0LjFDNDUuMyw0LDQzLjksNiw0My45LDguNnogTTUyLjIsOC41YzAsMi4zLDEuNCw0LjMsMy4yLDQuM3MzLjItMS45LDMuMi00LjNzLTEuNC00LjMtMy4yLTQuMwoJUzUyLjIsNi4yLDUyLjIsOC41eiBNNTcuNSwxNS45YzAsMi4zLDEuNSw0LjMsMy4zLDQuM2MxLjgsMCwzLjMtMS45LDMuMy00LjNzLTEuNS00LjMtMy4zLTQuM0M1OC45LDExLjYsNTcuNSwxMy42LDU3LjUsMTUuOXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTQsMzAuNHYtNS4xaDYuNGMxLjYsMCwxLjYsMC4zLDEuNiwydjEuNGMwLDEuNi0yLjMsMS44LTMuOSwxLjhMNCwzMC40TDQsMzAuNHogTTQsMjN2LTQuOGg0LjEKCWMxLjYsMCwzLjksMCwzLjksMi4xdjAuMWMwLDEuNC0wLjUsMi42LTEuOCwyLjZDMTAuMywyMyw0LDIzLDQsMjN6IE0xLjcsMTZ2MTYuM2g2LjRjMywwLDYuMiwwLDYuMi0zLjZ2LTEuMWMwLTEuNi0wLjEtMi43LTEuMS0zLjUKCWMxLTAuOCwxLjEtMi4zLDEuMS0zLjZsMCwwYzAtNC41LTMuMi00LjUtNi4yLTQuNUwxLjcsMTZMMS43LDE2eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUsMjguOWMtMS4xLDEuMS0zLjMsMS4zLTMuNSwxLjNjLTEuMywwLTIuNy0wLjUtMi43LTIuMWMwLTEuNCwwLjUtMi4zLDIuMS0yLjNjMS4zLDAsMi44LDAuMSw0LjEsMC42VjI4Ljl6CgkgTTIxLjQsMzIuM2MwLjQsMCwyLjMtMC4xLDMuNy0wLjlsMC4yLDAuN2gyLjF2LTguOWMwLTMuNi0yLjMtNS01LjctNWMtMS44LDAtNC4zLDAuNy00LjcsMC45bDAuNCwyLjNjMS42LTAuNiwzLTAuNiw0LjItMC42CgljMS44LDAsMy4zLDAuNiwzLjMsMi42VjI0Yy0xLTAuNC0yLjQtMC42LTQuMS0wLjZjLTMsMC00LjUsMS42LTQuNSw0LjdDMTYuNCwzMS44LDE5LjYsMzIuMywyMS40LDMyLjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMC4yLDE2LjFjMCwwLjYsMC42LDEuMiwxLjMsMS4yYzAuOCwwLDEuMy0wLjYsMS4zLTEuMmMwLTAuNy0wLjYtMS4zLTEuMy0xLjNDMzAuOCwxNC44LDMwLjIsMTUuMywzMC4yLDE2LjF6CgkgTTMwLjMsMzIuMWgyLjRWMTguNWgtMi40VjMyLjF6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MS4yLDIyLjFoOC40YzAuNCwwLjEsMC42LDAuMywwLjYsMC43djIuNmgtOS43di0yLjZDNzAuNiwyMi40LDcwLjgsMjIuMiw3MS4yLDIyLjF6IE03MS4yLDMwLjUKCWMtMC40LDAtMC42LTAuMy0wLjctMC44di0yLjZoOS43djIuNmMwLDAuNC0wLjIsMC43LTAuNiwwLjdINzEuMnogTTczLjYsMThjLTAuMSwwLjQtMC4xLDAuOS0wLjQsMS43Yy0wLjEsMC4zLTAuMSwwLjUtMC4xLDAuNwoJaC0yLjZjLTEuMywwLjEtMS45LDAuOC0yLDJ2Ny45YzAuMSwxLjEsMC44LDEuOCwyLDEuOWgxMGMxLjItMC4xLDEuOC0wLjcsMS45LTEuOHYtNy45Yy0wLjEtMS4zLTAuNy0xLjktMS45LTIuMWgtNQoJYzAuMS0wLjMsMC4xLTAuOCwwLjMtMS40YzAuMS0wLjQsMC4xLTAuNywwLjEtMC45aDcuMnYtMS44SDY3LjRWMThMNzMuNiwxOEw3My42LDE4eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTMuNywyMi43Yy0wLjQtMC4xLTAuNS0wLjItMC41LTAuNXYtMC42aDMuMnYwLjZjLTAuMSwwLjMtMC4yLDAuNC0wLjUsMC41SDkzLjd6IE05Ni42LDI0LjEKCWMxLjEtMC4xLDEuNi0wLjUsMS42LTEuNHYtMWgyLjN2LTEuNWgtMi4zdi0xLjFoLTEuOHYxLjFoLTMuMnYtMS4xaC0xLjh2MS4xaC0yLjN2MS41aDIuM3YxYzAuMSwwLjksMC42LDEuNCwxLjYsMS40SDk2LjZ6CgkgTTk0LjgsMzAuNGMxLjYsMC44LDMuNCwxLjMsNS40LDEuOGwwLjktMS43Yy0xLjQtMC4yLTIuOS0wLjYtNC40LTEuMWMxLjEtMC44LDItMS42LDIuNy0yLjVjMC4zLTAuNCwwLjQtMC45LDAuMi0xLjMKCWMtMC4zLTAuNi0wLjgtMC45LTEuNC0wLjloLTl2MS41aDcuN2MwLjIsMCwwLjQsMC4xLDAuNCwwLjFzMCwwLjEtMC4xLDAuM2MtMC42LDAuNi0xLjQsMS4zLTIuMywxLjhjLTEuMi0wLjctMi4xLTEuMy0yLjQtMS44aC0yLjIKCWMwLjksMSwxLjgsMS45LDIuOSwyLjdjLTEuNiwwLjYtMy4zLDEuMS00LjksMS4zbDAuOSwxLjZDOTEuMywzMS44LDkzLjIsMzEuMSw5NC44LDMwLjR6IE04OC4zLDI1LjJ2LTZjMC4xLTAuNiwwLjMtMC45LDAuOC0wLjkKCWgxMS44di0xLjZIOTVjLTAuMS0wLjEtMi4yLTAuMS0yLjIsMGgtNC43Yy0xLjEsMC4xLTEuNywwLjktMS44LDIuMlYyNWMwLjEsMi4xLTAuNCw0LjQtMS4xLDYuN2wxLjksMC42CglDODcuOSwyOS45LDg4LjMsMjcuNiw4OC4zLDI1LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00Ni4zLDI0LjJjMC42LDAsMS4yLDAuMSwxLjcsMC40djMuNGMwLDAuMy0wLjYsMS0xLjksMWMtMS41LDAtMS44LTAuNi0xLjgtMi4xdi0wLjYKCUM0NC4yLDI0LjgsNDQuNywyNC4yLDQ2LjMsMjQuMnogTTQ5LjIsMjAuN0g0OHYyLjVDNDcuNiwyMy4xLDQ3LDIzLDQ2LjMsMjNjLTIuNywwLTMuMywxLTMuMywzLjV2MC4zYzAsMi40LDAuOSwzLjMsMy4yLDMuMwoJYzAuOCwwLDEuMy0wLjEsMS44LTAuNWwwLjEsMC42aDEuMUw0OS4yLDIwLjdMNDkuMiwyMC43eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTYuNywyM2gtMS4ydjUuMmMtMC42LDAuNC0xLjcsMC42LTIuNCwwLjZjLTAuOCwwLTEtMC40LTEtMS4zdi00LjZoLTEuMXY0LjhjMCwxLjYsMC41LDIuMywyLjEsMi4zCgljMSwwLDIuMS0wLjMsMi42LTAuNmwwLjEsMC42aDEuMVYyM3oiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTkyLjcsMTUuN2MwLTAuNywwLjYtMS4zLDEuMi0xLjNjMC42LDAsMS4yLDAuNiwxLjIsMS4zUzk0LjUsMTcsOTMuOSwxN0M5My4zLDE2LjksOTIuNywxNi4zLDkyLjcsMTUuN3oiLz4KPC9zdmc+Cg==");background-repeat:no-repeat;background-position:center;height:100px;width:200px}
#u_sp .s_bri{border:0!important}
.pass-text-input{background-image:none!important}
.pass-text-input-focus{background-image:none!important}
#passport-login-pop{font-family:-apple-system,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif;border-radius:2px}
#TANGRAM__PSP_2__titleText{font-family:Helvetica,"Microsoft Yahei UI Light"}
.pass-fgtpwd{font-family:Helvetica,"Microsoft Yahei UI"!important}
.pass-sms-btn{font-family:Helvetica,"Microsoft Yahei UI"!important}
.pass-reglink{font-family:Helvetica,"Microsoft Yahei UI"!important}
.tang-foreground{border-radius:2px!important;border:0!important}
.tang-title{border-radius:2px 2px 0 0!important}
.tang-pass-pop-login div.tang-title{border-radius:2px 2px 0 0!important}
.pass-checkbox-input{width:17px;height:17px;border:#e0e0e0 3px solid!important;background-color:#fff!important;box-shadow:none}
.tang-pass-pop-login-color-blue .pass-button:focus{box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important;-webkit-box-shadow:rgba(0,0,0,.156863) 0 3px 10px,rgba(0,0,0,.227451) 0 3px 10px!important}
.rrecom-btn-parent{display:none!important}
.s-p-top{bottom:-8px!important}
input[type=text]:focus{border:none!important;border-top:0 solid #fff!important;border-bottom:0 solid #fff!important;border-left:0 solid #fff!important;border-right:0 solid #fff!important}
a[soft_id]{display:none}
.op-soft-btnbox .c-gap-left-small{margin-left:0!important;color:#fff;background-color:#3476d2;padding:7px 15px;border-radius:2px;font-size:14px;transition:all .3s ease}
.op-soft-btnbox .c-gap-left-small:hover{background-color:#7098D0;transition:all .3s ease;box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)}
.soutu-input-image{top:6px;left:5px}
#kw{background-color:transparent}
.s-skin-hasbg #kw{box-shadow:0 0 0 rgba(0,0,0,.2)}
.s-skin-hasbg .btn_wr{width:35px}
#s_usersetting_top{margin-top:-7px}
#s_username_top{margin-top:7px}
#u_sp{padding-top:16px}
.ipt_rec{background:0 0;background-image:none}
.ipt_rec:hover{background:0 0;background-image:none}
.ipt_rec:after{display:none;margin-top:50px}
.bdpfmenu,.usermenu{border:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none;-o-box-shadow:none}
.qrcodeCon{visibility:hidden}
#head .headBlock{margin:12px 0 6px 121px}
a{color:#3476d2}
h3 a:hover{border-bottom:#3476d2 1.2px solid}
.c-showurl{color:#4CAF50}
.op-se-listen-recommend:hover{border-bottom:#3476d2 1.2px solid}
.c-gap-bottom-small a:hover{border-bottom:#3476d2 1.2px solid}
.c-row a:hover{border-bottom:#3476d2 1.2px solid}
#rs a:hover{border-bottom:#3476d2 1.2px solid}
.hint_toprq_tips_items a:hover{border-bottom:#3476d2 1.2px solid}
.c:hover{border-bottom:#3476d2 1.2px solid}
em{color:#EA4335}
.op-video-vast-ul li a{margin-bottom: unset;}
body{background-color:#F7F7F7}
#form .s_btn{background-color:rgba(0,0,0,0)}
#wrapper #head {
    background-color: rgba(248, 248, 248, 0.4);
    border-bottom: none;
    backdrop-filter: blur(10px)
}
.c-tabs-nav{background-color:#EEE}
.c-tabs-nav-selected{border-bottom:#F44336 2px solid!important;background-color:#2196F3!important;color:#fff!important}
#page a{background:#fff;color:#424242}
#page a:hover{background-color:#e0e0e0!important}
#page a .pc:hover{background-color:#e0e0e0}
#page strong{background-color:#4285F4!important;color:#fff}
#page strong .pc{background-color:#4285F4!important}
.pc:hover{background-color:#e0e0e0}
#s_tab b{border-bottom:3px #3476d2 solid;color:#3476d2}
#s_tab{border-bottom:#e0e0e0 1px solid}
.bdpfmenu a:hover{background-color:#3476d2!important}
.setpref:hover{background-color:#3476d2!important}
#u .lb{background-color:#3476d2}
#u .lb:hover{background-color:#618CC7}
#u .lb:active{background-color:#7DA0D0}
#bg{background-color:#FFF!important;background:#FFF}
#u1 a.lb{background-color:#3476d2}
#u1 a.lb:hover{background-color:#618CC7}
#u1 a.lb:active{background-color:#7DA0D0}
#u_sp .s_bri{background-color:#F44336}
#s_username_top{background-color:#e0e0e0}
.s-user-set-menu a:hover{background-color:#3476d2!important}
#user{background-color:#e0e0e0}
.msg-setting-btn{background-color:#3476d2!important}
.no-use{background-color:#E5E5E5!important}
.pass-text-input{border-bottom:#e0e0e0 2px solid!important;border-left:#fff 0 solid!important;border-right:#fff 0 solid!important;border-top:#fff 0 solid!important}
.pass-text-input-focus{border-bottom:#3476d2 2px solid!important;border-left:#fff 0 solid!important;border-right:#fff 0 solid!important;border-top:#fff 0 solid!important}
.tang-pass-pop-login-color-blue .pass-button{background-color:#3476d2}
.tang-pass-pop-login-color-blue .pass-button:hover{background-color:#618CC7}
#lg{margin-left:-3rem;background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjU5IDExNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjU5IDExNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzQyODVGNDt9DQoJLnN0MXtmaWxsOiNFQTQzMzU7fQ0KCS5zdDJ7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI4LjIsNzdjLTUuNCwwLjQtNS42LDMuNy04LjEsNi43Yy0yLjUsMy4xLTcuNyw1LjgtOC40LDkuNWMtMC44LDQuNywxLjgsNy4yLDQuMyw4YzIuNywwLjksOC44LTAuNywxMS45LTAuNw0KCWgwLjNoMC4zYzMuMSwwLDkuMSwxLjYsMTEuOSwwLjdjMi41LTAuOSw0LjktNC41LDQuMy04Yy0wLjUtMy02LjItNi40LTguNy05LjVDMTMzLjYsODAuNywxMzMuNyw3Ny40LDEyOC4yLDc3eiBNMTA5LjMsNzYuMw0KCWMwLDMuNCwyLjIsNi4xLDQuOCw2LjFjMi43LDAsNC44LTIuNyw0LjgtNi4xcy0yLjItNi4xLTQuOC02LjFTMTA5LjMsNzMsMTA5LjMsNzYuM3ogTTExOSw2Ny41YzAsMy41LDIuMSw2LjQsNC42LDYuNA0KCWMyLjYsMCw0LjctMi45LDQuNy02LjRzLTIuMS02LjQtNC43LTYuNEMxMjEsNjEsMTE5LDYzLjksMTE5LDY3LjV6IE0xMzAuNyw2Ny40YzAsMy4zLDIsNiw0LjUsNnM0LjUtMi43LDQuNS02YzAtMy4zLTItNi00LjUtNg0KCVMxMzAuNyw2NC4xLDEzMC43LDY3LjR6IE0xMzguMiw3Ny44YzAsMy4zLDIuMSw2LDQuNiw2YzIuNiwwLDQuNy0yLjcsNC43LTZjMC0zLjMtMi4xLTYtNC43LTZDMTQwLjIsNzEuOCwxMzguMiw3NC41LDEzOC4yLDc3Ljh6Ig0KCS8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjIuOCw5OC4yVjkxaDljMi4yLDAsMi4zLDAuNCwyLjMsMi44djJjMCwyLjMtMy4yLDIuNS01LjUsMi41aC01LjhWOTguMnogTTYyLjgsODcuOFY4MWg1LjgNCgljMi4zLDAsNS41LDAsNS41LDN2MC4xYzAsMi0wLjcsMy43LTIuNSwzLjdDNzEuNiw4Ny44LDYyLjgsODcuOCw2Mi44LDg3Ljh6IE01OS41LDc3Ljl2MjNoOS4xYzQuMywwLDguNywwLDguNy01LjF2LTEuNQ0KCWMwLTIuMy0wLjItMy44LTEuNS00LjljMS40LTEuMSwxLjUtMy4yLDEuNS01LjFsMCwwYzAtNi4zLTQuNS02LjMtOC43LTYuM0w1OS41LDc3LjlMNTkuNSw3Ny45eiIvPg0KPHBhdGggY2xhc3M9InN0MSIgZD0iTTkyLjQsOTYuMWMtMS41LDEuNi00LjYsMS44LTQuOSwxLjhjLTEuOSwwLTMuOC0wLjctMy44LTIuOWMwLTIsMC43LTMuMywyLjktMy4zYzEuOCwwLDQsMC4yLDUuOCwwLjhWOTYuMXoNCgkgTTg3LjMsMTAwLjljMC41LDAsMy4zLTAuMiw1LjItMS4zbDAuMywxaDIuOVY4OGMwLTUuMS0zLjItNy4xLTgtNy4xYy0yLjUsMC02LjEsMS02LjYsMS4ybDAuNiwzLjJjMi4yLTAuOCw0LjItMC45LDUuOS0wLjkNCgljMi42LDAsNC42LDAuOSw0LjYsMy43djEuMWMtMS40LTAuNS0zLjQtMC45LTUuOC0wLjljLTQuMiwwLTYuMywyLjMtNi4zLDYuNkM4MC4zLDEwMC4zLDg0LjcsMTAwLjksODcuMywxMDAuOXoiLz4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05OS43LDc4LjFjMCwwLjksMC45LDEuNywxLjgsMS43YzEuMSwwLDEuOS0wLjgsMS45LTEuN2MwLTEtMC44LTEuOC0xLjktMS44QzEwMC42LDc2LjMsOTkuNyw3Nyw5OS43LDc4LjF6DQoJIE05OS45LDEwMC42aDMuNFY4MS41aC0zLjRWMTAwLjZ6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTU3LjYsODYuNmgxMS44YzAuNSwwLjEsMC44LDAuNCwwLjksMXYzLjZoLTEzLjd2LTMuNkMxNTYuNyw4NywxNTcsODYuNywxNTcuNiw4Ni42eiBNMTU3LjYsOTguNA0KCWMtMC42LDAtMC45LTAuNC0xLTEuMXYtMy42aDEzLjd2My43YzAsMC42LTAuMywxLTAuOSwxSDE1Ny42eiBNMTYwLjksODAuN2MtMC4xLDAuNS0wLjIsMS4zLTAuNSwyLjRjLTAuMSwwLjQtMC4xLDAuNy0wLjIsMWgtMy43DQoJYy0xLjgsMC4xLTIuNywxLjEtMi44LDIuOFY5OGMwLjEsMS42LDEuMSwyLjUsMi44LDIuN2gxNC4xYzEuNy0wLjEsMi42LTEsMi43LTIuNVY4N2MtMC4xLTEuOC0xLTIuNy0yLjctMi45aC03DQoJYzAuMS0wLjQsMC4yLTEuMSwwLjQtMmMwLjEtMC42LDAuMS0xLDAuMi0xLjNoMTAuMnYtMi42aC0yMi4ydjIuNkwxNjAuOSw4MC43TDE2MC45LDgwLjd6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTg5LjQsODcuNGMtMC41LTAuMS0wLjctMC4zLTAuNy0wLjd2LTAuOWg0LjV2MC45Yy0wLjEsMC40LTAuMywwLjYtMC43LDAuN0gxODkuNHogTTE5My40LDg5LjQNCgljMS41LTAuMSwyLjItMC43LDIuMy0yVjg2aDMuMnYtMi4xaC0zLjJ2LTEuNmgtMi41djEuNmgtNC41di0xLjZoLTIuNnYxLjZoLTMuMlY4NmgzLjJ2MS40YzAuMSwxLjMsMC44LDIsMi4yLDJIMTkzLjR6IE0xOTAuOSw5OC4zDQoJYzIuMywxLjEsNC44LDEuOSw3LjYsMi42bDEuMi0yLjRjLTItMC4zLTQuMS0wLjgtNi4yLTEuNmMxLjUtMS4xLDIuOC0yLjIsMy44LTMuNWMwLjQtMC42LDAuNS0xLjIsMC4zLTEuOWMtMC40LTAuOC0xLjEtMS4yLTItMS4yDQoJaC0xMi43djIuMWgxMC44YzAuMywwLDAuNSwwLjEsMC42LDAuMnMwLDAuMi0wLjIsMC40Yy0wLjksMC45LTIsMS44LTMuMywyLjZjLTEuNy0xLTIuOS0xLjktMy40LTIuNmgtMy4xYzEuMiwxLjQsMi42LDIuNyw0LjEsMy44DQoJYy0yLjMsMC45LTQuNiwxLjUtNi45LDEuOGwxLjMsMi4yQzE4NS45LDEwMC4yLDE4OC42LDk5LjMsMTkwLjksOTguM3ogTTE4MS43LDkwLjl2LTguNWMwLjEtMC44LDAuNC0xLjIsMS4xLTEuM2gxNi43di0yLjNoLTguMw0KCWMtMC4xLTAuMi0zLjEtMC4xLTMuMSwwaC02LjdjLTEuNSwwLjItMi40LDEuMy0yLjUsMy4xdjguN2MwLjEsMy0wLjUsNi4yLTEuNiw5LjRsMi43LDAuOEMxODEuMSw5Ny42LDE4MS43LDk0LjMsMTgxLjcsOTAuOXoiLz4NCjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMjIuNSw4OS41YzAuOCwwLDEuNywwLjIsMi40LDAuNXY0LjhjMCwwLjQtMC45LDEuNC0yLjcsMS40Yy0yLjEsMC0yLjYtMC45LTIuNi0yLjl2LTAuOA0KCUMxMTkuNSw5MC40LDEyMC4yLDg5LjUsMTIyLjUsODkuNXogTTEyNi42LDg0LjZoLTEuN3YzLjVjLTAuNi0wLjItMS41LTAuMy0yLjQtMC4zYy0zLjgsMC00LjYsMS40LTQuNiw0Ljl2MC40DQoJYzAsMy40LDEuMyw0LjYsNC41LDQuNmMxLjEsMCwxLjktMC4yLDIuNi0wLjdsMC4yLDAuOGgxLjVMMTI2LjYsODQuNkwxMjYuNiw4NC42eiIvPg0KPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzNy4xLDg3LjhoLTEuN3Y3LjRjLTAuOSwwLjUtMi40LDAuOC0zLjQsMC44Yy0xLjEsMC0xLjQtMC42LTEuNC0xLjl2LTYuNUgxMjl2Ni44YzAsMi4zLDAuNywzLjIsMi45LDMuMg0KCWMxLjQsMCwyLjktMC40LDMuNi0wLjhsMC4xLDAuOGgxLjVWODcuOHoiLz4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODcuOSw3Ny41YzAtMSwwLjgtMS44LDEuNy0xLjhzMS43LDAuOCwxLjcsMS44cy0wLjgsMS44LTEuNywxLjhDMTg4LjcsNzkuMiwxODcuOSw3OC40LDE4Ny45LDc3LjV6Ii8+DQo8L3N2Zz4NCg==")}
#form .s_btn{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzQ3NzlCRDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNC44LDIxLjVjLTAuNCwwLTAuNywwLTEuMS0wLjFjLTIuMS0wLjMtMy45LTEuNC01LjItM2MtMS4zLTEuNy0xLjgtMy43LTEuNi01LjhjMC4zLTIuMSwxLjQtMy45LDMtNS4yCgljMS43LTEuMywzLjgtMS44LDUuOC0xLjZjMi4xLDAuMywzLjksMS40LDUuMiwzYzEuMywxLjcsMS44LDMuOCwxLjYsNS44Yy0wLjMsMi4xLTEuNCwzLjktMyw1LjJDMTguMiwyMSwxNi41LDIxLjUsMTQuOCwyMS41egoJIE0xNC44LDguMWMtMS4yLDAtMi40LDAuNC0zLjMsMS4xYy0yLjQsMS44LTIuOSw1LjMtMSw3LjdjMS44LDIuNCw1LjMsMi45LDcuNywxYzEuMi0wLjksMS45LTIuMiwyLjEtMy42YzAuMi0xLjUtMC4yLTIuOS0xLjEtNC4xCglTMTcsOC40LDE1LjUsOC4yQzE1LjMsOC4yLDE1LDguMSwxNC44LDguMXoiLz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUuMywyNy41TDI1LjMsMjcuNWMtMC42LDAuNC0xLjQsMC4zLTEuOC0wLjJsLTUuMS02LjdjLTAuNC0wLjYtMC4zLTEuNCwwLjItMS44bDAsMAoJCQljMC42LTAuNCwxLjQtMC4zLDEuOCwwLjJsNS4xLDYuN0MyNiwyNi4zLDI1LjksMjcuMSwyNS4zLDI3LjV6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==")!important}
#form .s_btn_wr{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzQ3NzlCRDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNC44LDIxLjVjLTAuNCwwLTAuNywwLTEuMS0wLjFjLTIuMS0wLjMtMy45LTEuNC01LjItM2MtMS4zLTEuNy0xLjgtMy43LTEuNi01LjhjMC4zLTIuMSwxLjQtMy45LDMtNS4yCgljMS43LTEuMywzLjgtMS44LDUuOC0xLjZjMi4xLDAuMywzLjksMS40LDUuMiwzYzEuMywxLjcsMS44LDMuOCwxLjYsNS44Yy0wLjMsMi4xLTEuNCwzLjktMyw1LjJDMTguMiwyMSwxNi41LDIxLjUsMTQuOCwyMS41egoJIE0xNC44LDguMWMtMS4yLDAtMi40LDAuNC0zLjMsMS4xYy0yLjQsMS44LTIuOSw1LjMtMSw3LjdjMS44LDIuNCw1LjMsMi45LDcuNywxYzEuMi0wLjksMS45LTIuMiwyLjEtMy42YzAuMi0xLjUtMC4yLTIuOS0xLjEtNC4xCglTMTcsOC40LDE1LjUsOC4yQzE1LjMsOC4yLDE1LDguMSwxNC44LDguMXoiLz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUuMywyNy41TDI1LjMsMjcuNWMtMC42LDAuNC0xLjQsMC4zLTEuOC0wLjJsLTUuMS02LjdjLTAuNC0wLjYtMC4zLTEuNCwwLjItMS44bDAsMAoJCQljMC42LTAuNCwxLjQtMC4zLDEuOCwwLjJsNS4xLDYuN0MyNiwyNi4zLDI1LjksMjcuMSwyNS4zLDI3LjV6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==")!important}
.c-icon-tieba{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzM3QUJFMzt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMC45LDIzLjNIMy4xYy0xLjEsMC0yLTAuOS0yLTJWMi44YzAtMS4xLDAuOS0yLDItMmgxNy44YzEuMSwwLDIsMC45LDIsMnYxOC41QzIyLjksMjIuNCwyMiwyMy4zLDIwLjksMjMuM3oiCgkvPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjIsMTkuOUw0LDE5LjJjMS41LTEuOSwyLjMtMy45LDIuNC01LjhjMC0xLDAuMS0zLjEsMC4xLTYuM0g4YzAsMi4yLDAsNC4zLTAuMSw2LjRjMCwwLjYtMC4xLDEuMi0wLjMsMS44CgkJaDEuMWMwLjUsMC44LDEuMiwyLjQsMi4yLDQuNkg5Yy0wLjYtMS41LTEuMi0yLjgtMS42LTMuOUM3LDE3LjIsNi4zLDE4LjYsNS4yLDE5Ljl6IE00LjEsMTQuOFY2LjFjMC0xLjIsMC41LTEuOCwxLjYtMS44aDMKCQljMSwwLDEuNiwwLjcsMS42LDEuOHY4LjZIOC45VjYuM2MwLTAuNC0wLjMtMC42LTAuNi0wLjZoLTJjLTAuNCwwLTAuNiwwLjItMC42LDAuNnY4LjVINC4xeiBNMTIuOSwxOS41Yy0xLjEsMC0xLjctMC42LTEuOC0xLjZWMTMKCQljMC0xLjEsMC43LTEuNywxLjgtMS44aDFWNC4xaDEuN3YyLjVIMjBWOGgtNC4zdjMuMmgxLjhjMS4xLDAsMS43LDAuNywxLjgsMS44djQuOGMwLDEuMS0wLjYsMS42LTEuOCwxLjdIMTIuOXogTTEyLjgsMTMuM3Y0LjMKCQljMCwwLjQsMC4zLDAuNywwLjcsMC43aDMuMmMwLjUsMCwwLjctMC4zLDAuOC0wLjd2LTQuNGMwLTAuNC0wLjMtMC43LTAuNy0wLjdoLTMuM0MxMy4xLDEyLjYsMTIuOSwxMi44LDEyLjgsMTMuM3oiLz4KPC9nPgo8L3N2Zz4K")}
#u .pf{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzZENkQ2RDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNS4yLDE3LjJjMC0wLjQsMC4xLTAuOCwwLjEtMS4yYzAtMC40LDAtMC44LTAuMS0xLjJsMi42LTJjMC4yLTAuMiwwLjMtMC41LDAuMS0wLjhsLTIuNS00LjMKCWMtMC4xLTAuMy0wLjUtMC40LTAuOC0wLjNsLTMuMSwxLjJjLTAuNi0wLjUtMS4zLTAuOS0yLjEtMS4ybC0wLjUtMy4zYzAtMC4zLTAuMy0wLjUtMC42LTAuNWgtNWMtMC4zLDAtMC42LDAuMi0wLjYsMC41bC0wLjUsMy4zCgljLTAuOCwwLjMtMS40LDAuNy0yLjEsMS4yTDcuMyw3LjRDNyw3LjMsNi43LDcuNCw2LjUsNy43TDQsMTEuOWMtMC4yLDAuMy0wLjEsMC42LDAuMSwwLjhsMi42LDJjMCwwLjQtMC4xLDAuOC0wLjEsMS4yCgljMCwwLjQsMCwwLjgsMC4xLDEuMmwtMi42LDJjLTAuMiwwLjItMC4zLDAuNS0wLjEsMC44bDIuNSw0LjNjMC4xLDAuMywwLjUsMC40LDAuOCwwLjNsMy4xLTEuMmMwLjYsMC41LDEuMywwLjksMi4xLDEuMmwwLjUsMy4zCgljMCwwLjMsMC4zLDAuNSwwLjYsMC41aDVjMC4zLDAsMC42LTAuMiwwLjYtMC41bDAuNS0zLjNjMC44LTAuMywxLjQtMC43LDIuMS0xLjJsMy4xLDEuMmMwLjMsMC4xLDAuNiwwLDAuOC0wLjNsMi41LTQuMwoJYzAuMS0wLjMsMC4xLTAuNi0wLjEtMC44TDI1LjIsMTcuMnogTTE2LDIwLjNjLTIuNCwwLTQuMy0xLjktNC4zLTQuM3MxLjktNC4zLDQuMy00LjNzNC4zLDEuOSw0LjMsNC4zUzE4LjQsMjAuMywxNiwyMC4zeiIvPgo8L3N2Zz4K")}
#u .lb{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDYgNDYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ2IDQ2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMywyM2MyLjksMCw1LjItMi4zLDUuMi01LjJzLTIuMy01LjItNS4yLTUuMnMtNS4yLDIuMy01LjIsNS4yUzIwLjEsMjMsMjMsMjN6IE0yMywyNS42CgljLTMuNSwwLTEwLjQsMS43LTEwLjQsNS4ydjIuNmgyMC43di0yLjZDMzMuNCwyNy4zLDI2LjUsMjUuNiwyMywyNS42eiIvPgo8L3N2Zz4K")}
#u1 a.pf{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzZENkQ2RDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNS4yLDE3LjJjMC0wLjQsMC4xLTAuOCwwLjEtMS4yYzAtMC40LDAtMC44LTAuMS0xLjJsMi42LTJjMC4yLTAuMiwwLjMtMC41LDAuMS0wLjhsLTIuNS00LjMKCWMtMC4xLTAuMy0wLjUtMC40LTAuOC0wLjNsLTMuMSwxLjJjLTAuNi0wLjUtMS4zLTAuOS0yLjEtMS4ybC0wLjUtMy4zYzAtMC4zLTAuMy0wLjUtMC42LTAuNWgtNWMtMC4zLDAtMC42LDAuMi0wLjYsMC41bC0wLjUsMy4zCgljLTAuOCwwLjMtMS40LDAuNy0yLjEsMS4yTDcuMyw3LjRDNyw3LjMsNi43LDcuNCw2LjUsNy43TDQsMTEuOWMtMC4yLDAuMy0wLjEsMC42LDAuMSwwLjhsMi42LDJjMCwwLjQtMC4xLDAuOC0wLjEsMS4yCgljMCwwLjQsMCwwLjgsMC4xLDEuMmwtMi42LDJjLTAuMiwwLjItMC4zLDAuNS0wLjEsMC44bDIuNSw0LjNjMC4xLDAuMywwLjUsMC40LDAuOCwwLjNsMy4xLTEuMmMwLjYsMC41LDEuMywwLjksMi4xLDEuMmwwLjUsMy4zCgljMCwwLjMsMC4zLDAuNSwwLjYsMC41aDVjMC4zLDAsMC42LTAuMiwwLjYtMC41bDAuNS0zLjNjMC44LTAuMywxLjQtMC43LDIuMS0xLjJsMy4xLDEuMmMwLjMsMC4xLDAuNiwwLDAuOC0wLjNsMi41LTQuMwoJYzAuMS0wLjMsMC4xLTAuNi0wLjEtMC44TDI1LjIsMTcuMnogTTE2LDIwLjNjLTIuNCwwLTQuMy0xLjktNC4zLTQuM3MxLjktNC4zLDQuMy00LjNzNC4zLDEuOSw0LjMsNC4zUzE4LjQsMjAuMywxNiwyMC4zeiIvPgo8L3N2Zz4K")}
#u1 a.pf, #u1 a.lb{color: rgba(0,0,0,0)!important;}
#u1 a.bri{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzZENkQ2RDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zLjcsOS44aDYuMlYzLjdIMy43VjkuOHogTTEyLjksMjguM2g2LjJ2LTYuMmgtNi4yVjI4LjN6IE0zLjcsMjguM2g2LjJ2LTYuMkgzLjdWMjguM3ogTTMuNywxOS4xaDYuMnYtNi4yCglIMy43VjE5LjF6IE0xMi45LDE5LjFoNi4ydi02LjJoLTYuMlYxOS4xeiBNMjIuMiwzLjd2Ni4yaDYuMlYzLjdIMjIuMnogTTEyLjksOS44aDYuMlYzLjdoLTYuMlY5Ljh6IE0yMi4yLDE5LjFoNi4ydi02LjJoLTYuMlYxOS4xCgl6IE0yMi4yLDI4LjNoNi4ydi02LjJoLTYuMlYyOC4zeiIvPgo8L3N2Zz4K")}
#s_usersetting_top{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzZENkQ2RDt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNS4yLDE3LjJjMC0wLjQsMC4xLTAuOCwwLjEtMS4yYzAtMC40LDAtMC44LTAuMS0xLjJsMi42LTJjMC4yLTAuMiwwLjMtMC41LDAuMS0wLjhsLTIuNS00LjMKCWMtMC4xLTAuMy0wLjUtMC40LTAuOC0wLjNsLTMuMSwxLjJjLTAuNi0wLjUtMS4zLTAuOS0yLjEtMS4ybC0wLjUtMy4zYzAtMC4zLTAuMy0wLjUtMC42LTAuNWgtNWMtMC4zLDAtMC42LDAuMi0wLjYsMC41bC0wLjUsMy4zCgljLTAuOCwwLjMtMS40LDAuNy0yLjEsMS4yTDcuMyw3LjRDNyw3LjMsNi43LDcuNCw2LjUsNy43TDQsMTEuOWMtMC4yLDAuMy0wLjEsMC42LDAuMSwwLjhsMi42LDJjMCwwLjQtMC4xLDAuOC0wLjEsMS4yCgljMCwwLjQsMCwwLjgsMC4xLDEuMmwtMi42LDJjLTAuMiwwLjItMC4zLDAuNS0wLjEsMC44bDIuNSw0LjNjMC4xLDAuMywwLjUsMC40LDAuOCwwLjNsMy4xLTEuMmMwLjYsMC41LDEuMywwLjksMi4xLDEuMmwwLjUsMy4zCgljMCwwLjMsMC4zLDAuNSwwLjYsMC41aDVjMC4zLDAsMC42LTAuMiwwLjYtMC41bDAuNS0zLjNjMC44LTAuMywxLjQtMC43LDIuMS0xLjJsMy4xLDEuMmMwLjMsMC4xLDAuNiwwLDAuOC0wLjNsMi41LTQuMwoJYzAuMS0wLjMsMC4xLTAuNi0wLjEtMC44TDI1LjIsMTcuMnogTTE2LDIwLjNjLTIuNCwwLTQuMy0xLjktNC4zLTQuM3MxLjktNC4zLDQuMy00LjNzNC4zLDEuOSw0LjMsNC4zUzE4LjQsMjAuMywxNiwyMC4zeiIvPgo8L3N2Zz4K")}
#imsg{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNkQ2RDZEO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUuMyw0LjZoLTE5QzUsNC42LDMuOSw1LjcsMy45LDdsMCwyMS40bDQuOC00LjhoMTYuNmMxLjMsMCwyLjQtMS4xLDIuNC0yLjRWN0MyNy43LDUuNywyNi42LDQuNiwyNS4zLDQuNnoNCgkgTTIyLjksMTguOUg4LjZ2LTIuNGgxNC4zVjE4Ljl6IE0yMi45LDE1LjNIOC42di0yLjRoMTQuM1YxNS4zeiBNMjIuOSwxMS43SDguNlY5LjRoMTQuM1YxMS43eiIvPg0KPC9zdmc+DQo=")}
.result.c-container,.result-op{background:#fff;border-radius:2px;padding:25px;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;box-shadow:0 1px 4px 0 rgba(0,0,0,.14);width:549px}
h3 a:visited{opacity:.4!important;color:#bbb!important}
.result.c-container:hover{transition:all .5s cubic-bezier(.23,1,.32,1) 0s;box-shadow:rgba(0,0,0,.117647) 0 1px 6px,rgba(0,0,0,.117647) 0 1px 4px}
.result.c-container:active{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s;box-shadow:rgba(0,0,0,.188235) 0 10px 30px,rgba(0,0,0,.227451) 0 6px 10px}
.t{padding-bottom:10px}
.c-border{width:559px;box-shadow:none!important;margin-top:17px;margin-bottom:23px;border-top:#EEE 1px solid;border-bottom:#EEE 1px solid}
#help{padding-left:107px!important}
.c-tools a{border:0!important}
.f13 a:hover{border:none!important}
.f13 .m:hover{border-bottom:solid 1px #666!important}
.g .m:hover{border-bottom:solid 1px #666!important}
.c-row a:hover{border-bottom:#3476d2 1px solid}
.c-span6 a:hover{border-bottom:none}
.op_vd_mininewest_link:hover{opacity:.8}
.op-tieba-offical-lookmore a:hover{border-bottom:#3476d2 1px solid}
op-tieba-general-lookmore a:hover{border-bottom:#3476d2 1px solid}
.c-tip-menu ul li a{color:#3476d2!important}
h3 a:hover{border:none!important;opacity:.7;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
h3 a{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.sitelink_summary a:hover{border-bottom:#3476d2 1px solid}
.c-gray:hover{border-bottom:#666 1px solid}
.op_kefutable_committel:hover{border-bottom:#666 1px solid}
.op-soft-btnbox a:hover{border:none!important}
.op-soft-as-pc-downbtn{margin-left:0!important;color:#fff;background-color:#3476d2;padding:3px 15px;border-radius:2px;font-size:14px;transition:all .3s ease;border:none;margin-top:-3px}
.op-soft-as-pc-downbtn:hover{background-color:#7098D0;transition:all .3s ease;box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);background-image:none}
.c-btn-primary{margin-left:0!important;color:#fff;background-color:#3476d2;padding:3px 15px;border-radius:2px;font-size:14px;transition:all .3s ease;border:none;margin-top:-3px}
.c-btn-primary:hover{background-color:#7098D0;transition:all .3s ease;box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);background-image:none}
.op-soft-title a:hover{border:none!important;opacity:.7;transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.op-soft-title a{transition:all 450ms cubic-bezier(.23,1,.32,1) 0s}
.nums{width:598px}
.search_tool_conter{width:598px}
.op_offical_weibo_other a:hover{text-decoration:none!important}
.op_offical_weibo_info a:hover{text-decoration:none!important}
.op_offical_weibo_content a:hover{text-decoration:none!important}
.c-btn{border:none!important}
.op-zx-new-mvideo-info:hover{border-bottom:none}
.op-zx-new-mvideo-rlt a:hover{border-bottom:#3476d2 1px solid}
.op-zx-new-mvideo-oneline a:hover{border-bottom:#3476d2 1px solid}
.hint_common_restop{color:#EA4335;font-size:medium;font-weight:700}
.op-tieba-general-main-col p:hover{border:none!important}
.c-text{background:#3476d2;color:#fff;border:#3476d2 1px solid;padding-top:3px;border-radius:2px}
.c-text:hover{background:0 0;color:#3476d2;border:#3476d2 1px solid!important;padding-top:3px;border-radius:2px}

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
            /* fsou */
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
            /* google */
            else if (match("google.com/search")) {
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
                document.addEventListener("click", () => {
                    document.getElementById("switch_google").href = 'https://www.google.com/search?q=' + document.querySelector('input').value.replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D');
                    document.getElementById("switch_bing").href = 'https://www.bing.com/search?q=' + document.querySelector('input').value.replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D');
                    document.getElementById("switch_baidu").href = 'https://www.baidu.com/s?wd=' + document.querySelector('input').value.replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D');
                    document.getElementById("switch_fsou").href = 'https://www.fsoufsou.com/search?q=' + document.querySelector('input').value.replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D');
                }, true);
            } else if (match("sogou.com")) {
                css += `
                /* 矫正搜索栏下方tag */
                .searchnav {
                    position: absolute;
                    top: 55px;
                 }
                `
            } else if (match("so.com")) {
                addClass(".item-awa", ".result > li")
                css += `
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
        }
        /* search tools */
        if (cget("search_engine_switch_tool", true)) {
            document.addEventListener("DOMContentLoaded", () => {
                let html = "";
                searchList.trim().split("\n").forEach((s) => {
                    s = s.replaceAll(/\s/g, "");
                    if (s === "" || s.startsWith('#') || s.startsWith('-')) return;
                    html += `
                        <a class="${cget("switch_tool_style", "switch_tool switch_tool_button switch_tool_show")}" href = "${s.split(',')[1]}" key = "${s.split(',')[1]}"
                         onclick="this.href=this.getAttribute('key').replace('$',document.getElementsByClassName('search-input-awa')[0].getAttribute('value').replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D'))">${s.split(',')[0]}</a>
                   `
                });

                document.body.innerHTML = document.body.innerHTML + `
                <div id="engine_switch_tool" title="如何关闭该区域:  点击你的油猴插件，找的此脚本(Yuhan User Script), 在菜单中即可找到关闭按钮"> 
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
            })

            let tool_top = 96;
            load_then_delay(() => {
                const tool = document.getElementById("engine_switch_tool");

                document.getElementById("switch_tool_style").addEventListener("click", () => {
                    cset("switch_tool_style", document.getElementsByClassName('switch_tool')[0].className);
                });

                if (document.getElementsByClassName("switch_tool")[0].onclick === null) {
                    tool.addEventListener("click", () => {
                        Array.from(document.getElementsByClassName("switch_tool")).forEach((i) => {
                            i.href = i.getAttribute('key').replace('$', document.getElementsByClassName('search-input-awa')[0].getAttribute('value').replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D'))
                        })
                    });
                }

                window.onscroll = () => {
                    console.log(tool_top);
                    tool.style.top = (window.scrollY > tool_top ? 0 : tool_top - window.scrollY).toString() + "px";
                }

            }, 800)

        }

        const index = options("搜索引擎快速聚焦模式(Ctrl+[K|Q|S])", 'search_engine_quick_focus', ["清空", "关闭", "选中", "聚焦",])
        if (index !== 1) {
            document.onkeydown = (e) => {
                if (e.ctrlKey && (e.key === "q" || e.key === "s" || e.key === "k")) {
                    if (index === 0) document.getElementsByClassName("search-input-awa")[0].value = "";
                    else if (index === 2) document.querySelector("input").select();
                    document.getElementsByClassName("search-input-awa")[0].focus();
                    e.preventDefault();
                }
            }
        }
    } else if (match("bing.com")) {
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

    window.addEventListener("copy", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, true);


    // add css
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

})();
