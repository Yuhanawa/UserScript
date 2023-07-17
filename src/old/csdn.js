// ==UserScript==
// @name         CSDN-Optimize-Beautify-Simplify-By-Yuhan
// @name:zh      CSDN-优化美化极简化-沉浸式阅读-免登录复制-去广告等
// @name:zh-CN   CSDN-优化美化极简化-沉浸式阅读-免登录复制-去广告等
// @name:zh-TW   CSDN-優化美化極簡化-沉浸式閱讀-免登入複製-去廣告等
// @name:en      Streamline and Beautify CSDN Browsing Experience - Immersive Reading,Ad-free,etc.
// @name:ja      CSDNブラウジング体験の合理化と美化 - 沈浸的読書、広告なしなど
// @name:fr      Rationaliser et embellir l'expérience de navigation CSDN - Lecture immersive, sans publicité, etc. 
// @name:es      Simplificar y embellecer la experiencia de navegación de CSDN - Lectura inmersiva, sin anuncios, etc.  
// @name:de      Optimieren und verschönern Sie das CSDN-Browsen - immersives Lesen, werbefrei, etc. 
// @name:it      Semplificare e abbellire l'esperienza di navigazione CSDN - Lettura immersiva, senza pubblicità, ecc.
// @namespace    http://github.com/yuhanawa/UserScript
// @version      0.0.1.0
// @description:        优化和美化CSDN浏览体验 - 沉浸式阅读、免登录复制、去广告等 
// @description:zh      优化和美化CSDN浏览体验 - 沉浸式阅读、免登录复制、去广告等 
// @description:zh-CN   优化和美化CSDN浏览体验 - 沉浸式阅读、免登录复制、去广告等 
// @description:zh-TW   優化和美化CSDN瀏覽體驗 - 沉浸式閱讀、免登录复制、去廣告等
// @description:en      Streamline and Beautify CSDN Browsing Experience -  Immersive Reading,Ad-free,etc.  
// @description:ja     CSDNブラウジング体験の合理化と美化 - 沈浸的読書、広告なしなど
// @description:fr     Script utilisateur: Rationaliser et embellir l'expérience de navigation CSDN - Lecture immersive, sans publicité, etc.
// @description:es     Script de usuario: Simplificar y embellecer la experiencia de navegación de CSDN - Lectura inmersiva, sin anuncios, etc.
// @description:de     Benutzer-Skript: Optimieren und verschönern Sie das CSDN-Browsen - immersives Lesen, werbefrei, etc.
// @description:it      Script utente: Semplificare e abbellire l'esperienza di navigazione CSDN - Lettura immersiva, senza pubblicità, ecc.
// @node         更新日志请见 https://github.com/yuhanawa/UserScript/blob/master/CHANGELOG.md
// @author       Yuhanawa
// @supportURL   https://greasyfork.org/zh-CN/scripts/449705/feedback
// @license      GPL-3.0
// @match        *://*.csdn.net//*
// @icon         none
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==


/*#import src/utils.js#*/

untils.addFeature('CSDN极简化', 'csdn_opt', /blog\.csdn\.net\/.*\/article\/details/,
    {
        '开启': () => {
            setTimeoutBeforeLoad(() => {
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
            }, 100)

            return `/*#import src/css/csdn.css#*/`
        }, '关闭': null

    })

untils.addFeature('CSDN底部不跟随', 'csdn_toolbox', /blog\.csdn\.net\/.*\/article\/details/, {
    '开启': () => `
    .left-toolbox{
        z-index: 996!important;
        left: 0px!important;
        bottom: 0px!important;
        width: 900px!important;
        position: relative!important;
    }`
    , '关闭': null
})

untils.addFeature('CSDN移除顶部', 'csdn_remove_header', /blog\.csdn\.net\/.*\/article\/details/, {
    '开启': () => `
    #csdn-toolbar{
        display: none!important;
    }
    `, '关闭': null
})

untils.addFeature('CSDN免登录复制', 'csdn_copy', /blog\.csdn\.net\/.*\/article\/details/, {
    '开启': () => {
        setTimeoutBeforeLoad(() => {
            // 将代码块改为可修改
            document.querySelectorAll("code").forEach(c => {
                c.contentEditable = "true";
            });
            // 修改复制按钮
            document.querySelectorAll(".hljs-button").forEach((e) => {
                e.setAttribute("data-title", "点击复制");
                e.classList.remove('signin');
                e.removeAttribute("onclick");
                e.addEventListener("click", () => {
                    e.setAttribute("data-title", " ");
                    // noinspection JSUnresolvedVariable
                    navigator.clipboard.writeText(e.parentNode.innerText);
                    e.setAttribute("data-title", "复制成功");
                    setTimeout(() => e.setAttribute("data-title", "点击复制"), 1200);
                })
            }, 250)
            console.log(1);
        })
    }, '关闭': nulls
})